export interface SmartDateTimeProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | boolean;
  isDate?: boolean;
  isTime?: boolean;
  disabled?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
  rangeMessage?: string;
  placeholder?: string;
  isBanner?: boolean;
}
