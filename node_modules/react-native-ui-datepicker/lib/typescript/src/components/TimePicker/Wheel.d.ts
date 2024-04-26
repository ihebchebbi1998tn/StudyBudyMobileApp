import { TextStyle, ViewStyle } from 'react-native';
import React from 'react';
export interface WheelStyleProps {
    containerStyle?: ViewStyle;
    itemHeight?: number;
    selectedColor?: string;
    disabledColor?: string;
    textStyle?: TextStyle;
    wheelHeight?: number;
    displayCount?: number;
}
export interface WheelProps extends WheelStyleProps {
    value: number;
    setValue?: (value: number) => void;
    items: number[];
}
declare const _default: React.MemoExoticComponent<({ value, setValue, items, containerStyle, textStyle, itemHeight, selectedColor, disabledColor, wheelHeight, displayCount, }: WheelProps) => React.JSX.Element>;
export default _default;
//# sourceMappingURL=Wheel.d.ts.map