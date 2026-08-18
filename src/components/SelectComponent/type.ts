export interface Option {
  label: string;
  value: string | boolean;
  image?: string;
  icon?: any;
  disabled?: boolean;
  color?: string;
}

export interface SelectProps {
  options: Option[];
  value?: string | string[] | boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  isMulti?: boolean;
  onSearchChange?: (val: string) => void;
  color?: string;
}
