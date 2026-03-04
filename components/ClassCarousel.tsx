import { db } from "@/firebaseConfig";
import { getTimeRemaining } from '@/utils/time';
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, FlatList, Text, View } from "react-native";
import ClassCard, { ClassCardRole } from "./ClassCard";
import PaginationDots from "./PaginationDots";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;

export interface Session {
  id: string;
  courseTitle: string;
  timePeriod: string;
  lecturerName?: string;
  classLocation?: string;
  isOnline?: boolean;
  startsIn?: string;
  status?: string;
  meet_link?: string;
  onJoinOnline?: () => void;
  onPresent?: () => void;
  onCancel?: () => void;
  onLate?: () => void;
}

interface ClassCarouselProps {
  sessions: Session[];
  role?: ClassCardRole;
}

const ClassCarousel: React.FC<ClassCarouselProps> = ({ sessions, role = "student" }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [localSessions, setLocalSessions] = React.useState<Session[]>(sessions);

  // auto-scroll to highest priority active class
  React.useEffect(() => {
    if (!localSessions.length) return;

    const priorityOrder = ["ONGOING", "ONLINE", "LATE", "NEXT"];

    let idx = -1;

    for (const status of priorityOrder) {
      idx = localSessions.findIndex(s => s.status === status);
      if (idx !== -1) break;
    }

    if (idx !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: idx,
          animated: true,
        });
      }, 300);
    }
  }, [localSessions]);


  // watch for realtime status updates in Firestore
  useEffect(() => {
    setLocalSessions(sessions);
    const unsubscribers = sessions.map((s) =>
      onSnapshot(doc(db, "Class_Status", s.id), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLocalSessions(prev =>
            prev.map(p =>
              p.id === s.id
                ? {
                  ...p,
                  status: data.status,
                  eta_min: data.eta_min || 0,
                  meet_link: data.meet_link || null,
                }
                : p)
          );
        }
      })
    );
    return () => unsubscribers.forEach(u => u());
  }, [sessions]);

  useEffect(() => {
    // only lecturers should write status updates automatically
    if (role !== "lecturer") return;

    const interval = setInterval(() => {
      setLocalSessions(prev =>
        prev.map(session => {
          const [start, end] = session.timePeriod.split(" – ");
          const timeState = getTimeRemaining(start, end);

          //  If class just ended → update Firestore
          if (timeState === "Ended" && session.status !== "ENDED") {
            setDoc(
              doc(db, "Class_Status", session.id),
              {
                status: "ENDED",
                eta_min: 0,
                meet_link: null,
                updatedAt: new Date(),
              },
              { merge: true }
            );
          }

          return {
            ...session,
            status:
              session.status === "ONLINE" || session.status === "LATE"
                ? session.status
                : timeState === "Ongoing"
                  ? "ONGOING"
                  : timeState === "Ended"
                    ? "ENDED"
                    : session.status,
          };
        })
      );
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [role]);

  return (
    <View>
      {localSessions.every(s => s.status === "ENDED") ? (
        <View className="items-center py-6">
          <Text className="text-gray-500">Todays schedule completed 🎉</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={localSessions}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ref={flatListRef}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => {
              const [start, end] = item.timePeriod.split(" – ");
              const updatedItem = {
                ...item,
                classstatus: item.status,
                meetlink: item.meet_link,
                startsIn: getTimeRemaining(start, end),
              };

              return (
                <Animated.View
                  style={{ width: CARD_WIDTH }}
                >
                  <ClassCard {...updatedItem} role={role as ClassCardRole} />
                </Animated.View>
              );
            }}
          />
          <PaginationDots scrollX={scrollX} length={localSessions.length} />
        </>
      )}
    </View>
  );
};

export default ClassCarousel;
