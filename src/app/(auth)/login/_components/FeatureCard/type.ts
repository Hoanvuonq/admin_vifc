export interface FeatureCardProps {
    icon?: React.ElementType;
    imageIcon?: string;
    iconColor: string;
    gradientFrom: string;
    gradientTo: string;
    title: string;
    description: string;
    index?: number;
    className?: string;
    isMobile?: boolean;
}