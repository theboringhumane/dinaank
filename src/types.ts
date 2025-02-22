export interface DateSelectorOptions {
    el: string;
    canSelectRange?: boolean;
    closeOnSelect?: boolean;
    onChange?: (selectedDate: Date | undefined, rangeSelected: RangeSelected, selectedTime: { hours: number, minutes: number, seconds: number }) => void;
    minDate?: Date;
    maxDate?: Date;
    theme?: 'light' | 'dark';
    colors?: {
      hover?: string;
      active?: string;
      range?: string;
      rangeColor?: string;
      background?: string;
    };
    weekdays?: string[]; // eg. ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    months?: string[]; // eg. ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    currentDate?: Date | string; // eg. new Date()
    enableTimeSelection?: boolean; // eg. true
    timeFormat?: '12h' | '24h'; // eg. '12h'
    defaultTime?: {
      hours?: number; // eg. 12
      minutes?: number; // eg. 30
      seconds?: number; // eg. 0
    };
}

export interface RangeSelected {
    start: Date | undefined;
    end: Date | undefined;
}
