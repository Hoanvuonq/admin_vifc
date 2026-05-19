export interface MediaLightboxProps {
  mediaList: any[];
  currentIndex: number | null;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}
