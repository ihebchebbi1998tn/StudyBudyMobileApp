import React from 'react';
import type { DateType, DatePickerBaseProps, CalendarThemeProps, HeaderProps, SingleChange, RangeChange, MultiChange } from './types';
export interface DatePickerSingleProps extends CalendarThemeProps, HeaderProps, DatePickerBaseProps {
    mode: 'single';
    date?: DateType;
    onChange?: SingleChange;
}
export interface DatePickerRangeProps extends CalendarThemeProps, HeaderProps, DatePickerBaseProps {
    mode: 'range';
    startDate?: DateType;
    endDate?: DateType;
    onChange?: RangeChange;
}
export interface DatePickeMultipleProps extends CalendarThemeProps, HeaderProps, DatePickerBaseProps {
    mode: 'multiple';
    dates?: DateType[];
    onChange?: MultiChange;
}
declare const _default: React.MemoExoticComponent<(props: DatePickerSingleProps | DatePickerRangeProps | DatePickeMultipleProps) => React.JSX.Element>;
export default _default;
//# sourceMappingURL=DateTimePicker.d.ts.map