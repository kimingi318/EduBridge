import { db } from "@/firebaseConfig";
import { getTimeRemaining } from '@/utils/time';
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";
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
  onJoinOnline?: () => void;
  onPresent?: () => void;
  onCancel?: () => void;
  onLate?: () => void;
}

interface ClassCarouselProps {
  sessions: Session[];
  role?: ClassCardRole;
}

const ClassCarousel: React.FC<ClassCarouselProps> = ({sessions,role = "student"}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [localSessions, setLocalSessions] = React.useState<Session[]>(sessions);

  // auto-scroll to first "NEXT" item
  React.useEffect(() => {
    const idx = localSessions.findIndex((s) => s.status === "ONGOING");
    if (idx !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: idx, animated: true });
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
              p.id === s.id ? { ...p, status: data.status } : p
            )
          );
        }
      })
    );
    return () => unsubscribers.forEach(u => u());
  }, [sessions]);

  return (
    <View>
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
      <PaginationDots scrollX={scrollX} length={sessions.length} />
    </View>
  );
};

export default ClassCarousel;
