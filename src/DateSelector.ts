import { DateSelectorOptions, RangeSelected } from "./types";
import { DateSelectorDOM } from "./DateSelectorDOM";
import { generateUniqueId, defaults } from "./utils";

enum SelectionMode {
  Single,
  Range,
}

export class DateSelector {
  id: string;
  options: DateSelectorOptions;
  private dom: DateSelectorDOM;
  private _daySelected: Date | undefined = undefined;
  private rangeSelected: RangeSelected = { start: undefined, end: undefined };
  private dates!: Record<number, Date[]>;
  private selectionMode: SelectionMode;
  private _selectedTime: { hours: number; minutes: number; seconds: number };
  private _calendarDate: Date = new Date();

  constructor(options: Partial<DateSelectorOptions>) {
    this.id = generateUniqueId();
    this.options = { ...defaults(), ...options };
    this._selectedTime = {
      hours: this.options.defaultTime?.hours || 0,
      minutes: this.options.defaultTime?.minutes || 0,
      seconds: this.options.defaultTime?.seconds || 0,
    };
    this.selectionMode = this.options.canSelectRange
      ? SelectionMode.Range
      : SelectionMode.Single;
    this._initializeState();
    this.dom = new DateSelectorDOM(this);
    console.log(
      "📅 src/DateSelector.ts, constructor; this.options:",
      this.options
    );
    this._initializeDOM();
    this._setColorTheme();
    this._attachEventListeners();
  }

  public setMinMaxDate(minDate: Date, maxDate: Date): void {
    this.options.minDate = minDate;
    this.options.maxDate = maxDate;
    this._updateCalendar();
  }

  public setTheme(theme: "dark" | "light"): void {
    this.options.theme = theme;
    this._setColorTheme();
  }

  private _initializeState(): void {
    const today = new Date();
    this._calendarDate = today;

    if (
      this.options.currentDate &&
      this.options.currentDate !== "" &&
      this.options.currentDate !== " "
    ) {
      this._daySelected =
        typeof this.options.currentDate === "string"
          ? new Date(this.options.currentDate)
          : this.options.currentDate;
      this._calendarDate = new Date(this._daySelected);
    }

    if (this.options.enableTimeSelection) {
      this._selectedTime = {
        hours: this._daySelected?.getHours() || 0,
        minutes: this._daySelected?.getMinutes() || 0,
        seconds: this._daySelected?.getSeconds() || 0,
      };
    }

    this.rangeSelected = { start: undefined, end: undefined };
    this.dates = this._generateWeeksDaysDates();
  }

  private _initializeDOM(): void {
    this.dom.createCalendarDialog();
    this.dom.updateCalendar(
      this.dates,
      this._daySelected,
      this.rangeSelected,
      this.options.enableTimeSelection ? this._selectedTime : undefined
    );
  }

  private _attachEventListeners(): void {
    this.dom.attachEventListeners({
      onDateClick: this._handleDateClick.bind(this),
      onMonthChange: this._handleMonthChange.bind(this),
      onYearChange: this._handleYearChange.bind(this),
      onOutsideClick: this._handleOutsideClick.bind(this),
    });
  }

  private _handleDateClick(date: Date): void {
    if (this.selectionMode === SelectionMode.Range) {
      this._handleRangeSelection(date);
    } else if (this.selectionMode === SelectionMode.Single) {
      this._daySelected = date;
      if (this.options.closeOnSelect) {
        this.dom.hideCalendar();
      }
    }
    this._updateCalendar();
    this._triggerOnChange();
  }

  private _handleRangeSelection(date: Date): void {
    if (!this.rangeSelected.start) {
      this.rangeSelected.start = date;
      this._calendarDate = new Date(date);
    } else if (!this.rangeSelected.end) {
      this.rangeSelected.end = date;
      if (this.rangeSelected.start > this.rangeSelected.end) {
        [this.rangeSelected.start, this.rangeSelected.end] = [
          this.rangeSelected.end,
          this.rangeSelected.start,
        ];
      }
      this._calendarDate = new Date(date);
    } else {
      this.rangeSelected = { start: date, end: undefined };
      this._calendarDate = new Date(date);
    }
    this._updateCalendar();
  }

  private _handleMonthChange(change: number): void {
    const newDate = new Date(this._calendarDate);
    newDate.setMonth(newDate.getMonth() + change);
    this._calendarDate = newDate;
    this._updateCalendar();
  }

  private _handleYearChange(year: number): void {
    this._calendarDate.setFullYear(year);
    this._updateCalendar();
  }

  private _handleOutsideClick(event: MouseEvent): void {
    console.log(
      "📅 src/DateSelector.ts, line 98, _handleOutsideClick; event:",
      event.target
    );
    console.log(
      "📅 src/DateSelector.ts, line 99, _handleOutsideClick; this.dom.isPartOfCalendar(event.target as HTMLElement):",
      this.dom.isPartOfCalendar(event.target as HTMLElement)
    );
    if (!this.dom.isPartOfCalendar(event.target as HTMLElement)) {
      this.dom.hideCalendar();
    }
  }

  private _updateCalendar(): void {
    this.dates = this._generateWeeksDaysDates();
    this.dom.updateCalendar(
      this.dates,
      this._daySelected,
      this.rangeSelected,
      this.options.enableTimeSelection ? this._selectedTime : undefined
    );
  }

  private _triggerOnChange(): void {
    if (typeof this.options.onChange === "function") {
      this.options.onChange(
        this._daySelected,
        this.rangeSelected,
        this._selectedTime
      );
    }
  }

  private _generateWeeksDaysDates(): Record<number, Date[]> {
    const weekDates: Record<number, Date[]> = {};
    const year = this._calendarDate.getFullYear();
    const month = this._calendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Start from the last Monday of the previous month
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // End on the first Sunday of the next month
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    let currentDate = new Date(startDate);
    let weekNumber = 0;

    while (currentDate <= endDate) {
      // Initialize the week array if it doesn't exist
      if (!weekDates[weekNumber]) {
        weekDates[weekNumber] = [];
      }

      // Add the current date to the current week
      weekDates[weekNumber].push(new Date(currentDate));

      // Move to the next date
      currentDate.setDate(currentDate.getDate() + 1);

      // If we've reached Sunday (end of week), move to next week
      if (currentDate.getDay() === 0 && currentDate <= endDate) {
        weekNumber++;
      }
    }

    return weekDates;
  }

  public destroy(): void {
    this.dom.destroy();
  }

  private _setColorTheme(): void {
    const root = document.documentElement;
    const { theme, colors } = this.options;

    // Set calendar widget bg color
    root.style.setProperty(
      "--_bg_color",
      colors?.background ||
        (theme === "dark" ? "#3c414a" : "rgb(255, 255, 255)")
    );

    // Set _calender_bg color
    root.style.setProperty(
      "--_calender_bg",
      colors?.background ||
        (theme === "dark" ? "#323741" : "rgb(255, 255, 255)")
    );

    // Set hover elems bg color
    root.style.setProperty(
      "--_hover_bg",
      colors?.hover || (theme === "dark" ? "#2c437a" : "#ffab91")
    );

    // Set active items bg color
    root.style.setProperty(
      "--_active_bg",
      colors?.active || (theme === "dark" ? "#1f5eff" : "#f4511e")
    );

    // Set range dates bg color
    root.style.setProperty(
      "--in_range",
      colors?.range ||
        (theme === "dark" ? "rgba(31,94,255,0.35)" : "rgba(244,81,30,0.35)")
    );

    // Set range dates text color
    if (colors?.rangeColor) {
      root.style.setProperty("--range_color", colors.rangeColor);
    } else {
      root.style.setProperty("--range_color", "#fff");
    }

    // Set font color
    root.style.setProperty(
      "--_font_color",
      theme === "dark" ? "#767c8c" : "#333333"
    );

    // Set disabled background color
    root.style.setProperty(
      "--_dis_bg",
      theme === "dark" ? "#343942" : "#e0e0e0"
    );

    // Set disabled text color
    root.style.setProperty(
      "--_dis_color",
      theme === "dark" ? "rgba(204, 204, 204, 0.418)" : "rgba(0, 0, 0, 0.38)"
    );

    console.log(
      "🎨 src/DateSelector.ts, line 80, _setColorTheme; Applied colors:",
      {
        bg: root.style.getPropertyValue("--_bg_color"),
        calendarBg: root.style.getPropertyValue("--_calender_bg"),
        hover: root.style.getPropertyValue("--_hover_bg"),
        active: root.style.getPropertyValue("--_active_bg"),
        range: root.style.getPropertyValue("--in_range"),
        rangeColor: root.style.getPropertyValue("--range_color"),
        font: root.style.getPropertyValue("--_font_color"),
        disabledBg: root.style.getPropertyValue("--_dis_bg"),
        disabledColor: root.style.getPropertyValue("--_dis_color"),
      }
    );
  }

  public setTime(hours: number, minutes: number, seconds: number = 0): void {
    this._selectedTime = { hours, minutes, seconds };
    this._updateSelectedDateTime();
    this._triggerOnChange();
    this._updateCalendar();
  }

  private _updateSelectedDateTime(): void {
    if (!this._daySelected) return;
    const newDate = new Date(this._daySelected);
    newDate.setHours(this._selectedTime.hours);
    newDate.setMinutes(this._selectedTime.minutes);
    newDate.setSeconds(this._selectedTime.seconds);
    this._daySelected = newDate;
  }

  private _handleTimeChange(
    type: "hours" | "minutes" | "seconds",
    value: number
  ): void {
    this._selectedTime[type] = value;
    this._updateSelectedDateTime();
    this._triggerOnChange();
    this._updateCalendar();
  }

  public getDateTime(): Date {
    if (!this._daySelected) return new Date();
    return new Date(
      this._daySelected.setHours(
        this._selectedTime.hours,
        this._selectedTime.minutes,
        this._selectedTime.seconds
      )
    );
  }
}
