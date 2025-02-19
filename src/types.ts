export interface DateSelectorOptions {
    el: string;
    canSelectRange?: boolean;
    closeOnSelect?: boolean;
    onChange?: (selectedDate: Date, rangeSelected: RangeSelected, selectedTime: { hours: number, minutes: number, seconds: number }) => void;
    minDate?: Date;
    maxDate?: Date;
    theme?: 'light' | 'dark';
    colors?: {
      hover?: string;
      active?: string;
      range?: string;
      rangeColor?: string;
    };
    weekdays?: string[];
    months?: string[];
    currentDate?: Date;
    enableTimeSelection?: boolean;
    timeFormat?: '12h' | '24h';
    defaultTime?: {
      hours?: number;
      minutes?: number;
      seconds?: number;
    };
}

export interface RangeSelected {
    start: Date | null;
    end: Date | null;
}
