import AppDropdown from '@/components/AppDropDown';
import { useAuth } from '@/context/authContext';
import { API_BASE_URL, apiFetch } from '@/utils/api';
import { darkTheme, lightTheme } from '@/utils/colors';
import { useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GradientButton from './GradientButton';



type Course = {
  id: string;
  name: string;
  programme?: string;
};

type Unit = {
  id: string;
  name: string;
};
type Lecturer = {
  id: string;
  name: string;
};

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function AddClassSchedule({ isVisible, children, onClose }: Props) {
  const { profile } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  const [courseValue, setCourseValue] = useState<string | null>(null);
  const [unitValue, setUnitValue] = useState<string | null>(null);
  const [lecturerValue, setLecturerValue] = useState<string | null>(null);

  const [venue, setVenue] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // load courses for admin's department
  useEffect(() => {
    if (!profile?.department_id) return;
    (async () => {
      try {
        const res = await apiFetch(
          `${API_BASE_URL}/api/courses/by-department/${profile.department_id}`,
        );
        if (res.ok) {
          const data: Course[] = await res.json();
          // add label combining programme and name for dropdown display
          const labeled = data.map(c => ({
            ...c,
            label: c.programme ? `${c.programme} - ${c.name}` : c.name,
          } as any));
          setCourses(labeled as any);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [profile?.department_id]);

  // when course changes, fetch matching units
  useEffect(() => {
    if (!courseValue) {
      setUnits([]);
      setUnitValue(null);
      return;
    }

    (async () => {
      try {
        const res = await apiFetch(
          `${API_BASE_URL}/api/units/by-course/${courseValue}`,
        );
        if (res.ok) {
          const data: Unit[] = await res.json();
          setUnits(data);
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const res = await apiFetch(
          `${API_BASE_URL}/api/profiles/by-department/${profile?.department_id}`,
        );
        if (res.ok) {
          const data: Lecturer[] = await res.json();
          // filter to get only lecturers (where L_Id is not null)
          const lecturersData = data.filter((p: any) => p.L_Id);
          setLecturers(lecturersData);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [courseValue, profile?.department_id]);

  const handleAddSession = async () => {
    if (
      !courseValue ||
      !unitValue ||
      !lecturerValue ||
      !venue ||
      !dayOfWeek ||
      !startTime ||
      !endTime
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: unitValue,
          courseId: courseValue,
          lecturerId: lecturerValue,
          venue,
          dayOfWeek,
          startTime,
          endTime,
        }),
      });

      if (res.ok) {
        Alert.alert('Success', 'Class session added');
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
        // clear fields
        setCourseValue(null);
        setUnitValue(null);
        setLecturerValue(null);
        setVenue('');
        setDayOfWeek('');
        setStartTime('');
        setEndTime('');
        if (onClose) onClose();
      } else {
        const errData = await res.json();
        Alert.alert('Error', errData?.error || 'Failed to add session');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <Text style={styles.header}>Add Class Session</Text>

        <AppDropdown
          data={courses}
          labelField="label"
          valueField="id"
          placeholder="Select Course"
          value={courseValue}
          onChange={(item) => setCourseValue(item.id)}
          theme={theme}
        />
        <AppDropdown
          data={units}
          labelField="name"
          valueField="id"
          placeholder="Select Unit"
          value={unitValue}
          onChange={(item) => setUnitValue(item.id)}
          theme={theme}
          disable={!courseValue}
        />
        <AppDropdown
          data={lecturers}
          labelField="name"
          valueField="id"
          placeholder="Select Lecturer"
          value={lecturerValue}
          onChange={(item) => setLecturerValue(item.id)}
          theme={theme}
          disable={!unitValue}
        />

        <TextInput
          style={styles.input}
          placeholder="Venue e.g. Lab A"
          value={venue}
          onChangeText={setVenue}
        />
        <TextInput
          style={styles.input}
          placeholder="Day of Week e.g. Monday"
          value={dayOfWeek}
          onChangeText={setDayOfWeek}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Time e.g. 08:00"
          value={startTime}
          onChangeText={setStartTime}
        />
        <TextInput
          style={styles.input}
          placeholder="End Time e.g. 10:00"
          value={endTime}
          onChangeText={setEndTime}
        />

        <GradientButton
          title={loading ? 'Adding...' : 'Add Session'}
          onPress={handleAddSession}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    paddingBottom: hp(1),
    paddingHorizontal: wp(1.5),
    borderRadius: 30,
    marginTop: hp(10),
    marginHorizontal: wp(2),
    maxHeight: hp(80),
  },
  header: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    marginTop: hp(1.5),
  },
  dropdown: {
    height: hp(6),
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: wp(3),
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: wp(0.3),
    borderColor: '#ccc',
    borderRadius: 8,
    padding: hp(1),
    marginBottom: hp(1),
    backgroundColor: '#fff',
  },
});
