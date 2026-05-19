export interface SmartKPICardProps {
  title: string;
  value: number | string;
  growth?: number;
  format?: "currency" | "number" | "percentage";
  icon?: React.ReactNode;
  suffix?: string;
  loading?: boolean;
  colorTheme?: "blue" | "green" | "purple" | "orange" | "red";
}
