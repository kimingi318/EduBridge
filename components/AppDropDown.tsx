import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

type Props = {
  data: any[];
  value: any;
  onChange: (item: any) => void;
  labelField: string;
  valueField: string;
  placeholder: string;
  theme: any;
  disable?: boolean;
};

export default function AppDropdown({
  data,
  value,
  onChange,
  labelField,
  valueField,
  placeholder,
  theme,
  disable = false,
}: Props) {
  const styles = createStyles(theme);

  return (
    <Dropdown
      style={styles.dropdown}
      data={data}
      labelField={labelField}
      valueField={valueField}
      placeholder={placeholder}
      placeholderStyle={styles.placeholderStyle}
      containerStyle={styles.dropdownContainer}
      selectedTextStyle={styles.selectedTextStyle}
      itemTextStyle={styles.itemTextStyle}
      search
      searchPlaceholder="Search..."
      value={value}
      disable={disable}
      onChange={onChange}
    />
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    dropdown: {
      height: hp(6),
      backgroundColor: theme.surface,
      borderRadius: 10,
      paddingHorizontal: wp(3),
      marginBottom: hp(1),
      borderWidth: 1,
      borderColor: "#ddd",
    },
    placeholderStyle: {
      color: theme.subText,
      fontSize: hp(1.5),
    },
    dropdownContainer: {
      borderRadius: 8,
      backgroundColor: theme.card,
      elevation: 3,
    },
    selectedTextStyle: {
      fontSize: 14,
      color: theme.text,
    },
    itemTextStyle: {
      fontSize: 14,
      color: theme.text,
    },
  });