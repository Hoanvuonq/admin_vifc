export interface BaseProps {
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  isTextArea?: boolean;
  isCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  maxLengthNumber?: number;
  minLengthNumber?: number;
  showCount?: boolean;
}
