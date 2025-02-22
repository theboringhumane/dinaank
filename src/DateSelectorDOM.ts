import { DateSelector } from "./DateSelector";
import { RangeSelected } from "./types";
import { toIntDate } from "./utils";

const TIME_SELECTOR_CLASS = "dinaank-time-selector";
const TIME_INPUT_CLASS = "dinaank-time-input";
const TIME_PERIOD_CLASS = "dinaank-time-period";

export class DateSelectorDOM {
  private dateSelector: DateSelector;
  private inputElement: HTMLInputElement;
  private parentElement: HTMLElement;
  public calendarDialog: HTMLDivElement;
  private yearsListView: HTMLDivElement;
  private timeContainer: HTMLElement | null = null;

  constructor(dateSelector: DateSelector) {
    this.dateSelector = dateSelector;
    this.inputElement = document.querySelector(
      `${dateSelector.options.el}`
    ) as HTMLInputElement;

    if (!this.inputElement) {
      throw new Error(
        `Element with class "${dateSelector.options.el}" not found`
      );
    }

    this.parentElement = this.inputElement.parentElement as HTMLElement;
    this.calendarDialog = null as unknown as HTMLDivElement;
    this.yearsListView = null as unknown as HTMLDivElement;
    this._setTimeStyles();
  }

  public createCalendarDialog(): void {
    console.log(
      "📅 src/DateSelectorDOM.ts, line 28, createCalendarDialog; this.dateSelector.id:",
      this.dateSelector.id
    );
    this.calendarDialog = document.createElement("div");
    this.calendarDialog.className = `_calender_wrapper ${this.dateSelector.id} _calender_display_hidden _${this.dateSelector.options.theme}_theme`;
    const calendarContent = this._generateCalendarHTML();
    this.yearsListView = this._generateYearsListView();

    this.calendarDialog.appendChild(calendarContent);
    this.calendarDialog.appendChild(this.yearsListView);
    this.parentElement.appendChild(this.calendarDialog);

    if (this.dateSelector.options.enableTimeSelection) {
      this.timeContainer = this.createTimeSelector();
      this.calendarDialog?.appendChild(this.timeContainer);
    }
  }

  public updateCalendar(
    dates: Record<number, Date[]>,
    selectedDate: Date | null,
    rangeSelected: RangeSelected,
    selectedTime?: { hours: number; minutes: number; seconds: number }
  ): void {
    const monthYearElem = this.calendarDialog.querySelector(
      "._current_month_year"
    ) as HTMLElement;
    monthYearElem.textContent = `${this._getMonthName(
      selectedDate?.getMonth() || 0
    )} ${selectedDate?.getFullYear() || 0}`;

    const datesContainer = this.calendarDialog.querySelector(
      "._date_selectors"
    ) as HTMLElement;
    datesContainer.innerHTML = "";

    Object.values(dates).forEach((weekDates: any[]) => {
      weekDates.forEach((date) => {
        const dateElem = document.createElement("span");
        dateElem.className = "_date_child";
        dateElem.textContent = date.getDate().toString();
        dateElem.dataset.date = date.toISOString();

        if (this._isDateSelected(date, selectedDate, rangeSelected)) {
          dateElem.classList.add("active");
        }

        if (this._isDateInRange(date, rangeSelected)) {
          dateElem.classList.add("in--range");
        }

        if (this.dateSelector?.options?.minDate) {
          if (date < this.dateSelector?.options?.minDate) {
            dateElem.classList.add("disabled");
          }
          if (this.dateSelector?.options?.maxDate) {
            if (date > this.dateSelector?.options?.maxDate) {
              dateElem.classList.add("disabled");
            }
          }
        }

        datesContainer.appendChild(dateElem);
      });
    });

    this._updateInputValue(selectedDate, rangeSelected, selectedTime);
  }

  public attachEventListeners(handlers: {
    onDateClick: (date: Date) => void;
    onMonthChange: (change: number) => void;
    onYearChange: (year: number) => void;
    onOutsideClick: (event: MouseEvent) => void;
  }): void {
    this.inputElement.addEventListener("click", this.toggleCalendar.bind(this));

    this.calendarDialog.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.classList.contains("_date_child") &&
        !target.classList.contains("disabled")
      ) {
        handlers.onDateClick(new Date(target.dataset.date as string));
      } else if (target.classList.contains("_previous_month_change_icon")) {
        handlers.onMonthChange(-1);
      } else if (target.classList.contains("_next_month_change_icon")) {
        handlers.onMonthChange(1);
      }
    });

    document.addEventListener("click", handlers.onOutsideClick);

    const currentMonthYear = this.calendarDialog.querySelector(
      "._current_month_year"
    ) as HTMLElement;
    currentMonthYear.addEventListener(
      "click",
      this._toggleYearsListView.bind(this)
    );

    const yearsListView = this.calendarDialog.querySelector(
      "._years_list_view"
    ) as HTMLElement;
    yearsListView.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("_year_child")) {
        const year = parseInt(target.textContent || "", 10);
        handlers.onYearChange(year);
        this._toggleYearsListView();
      }
    });
  }

  public toggleCalendar(): void {
    this.calendarDialog.classList.toggle("_calender_display_hidden");
  }

  public hideCalendar(): void {
    this.calendarDialog.classList.add("_calender_display_hidden");
  }

  public isPartOfCalendar(element: HTMLElement): boolean {
    return (
      this.calendarDialog.contains(element) ||
      element === this.inputElement ||
      element.classList.contains("_date_child")
    );
  }

  public destroy(): void {
    this.calendarDialog.remove();
    this.removeEventListeners();
  }

  private removeEventListeners(): void {
    this.inputElement.removeEventListener(
      "click",
      this.toggleCalendar.bind(this)
    );
  }

  private _generateCalendarHTML(): HTMLElement {
    const calendarContent = document.createElement("div");
    calendarContent.className = "_calendar_content";

    const header = document.createElement("div");
    header.className = "_calender_header";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className =
      "_change_month _previous_month _previous_month_change_icon";
    prevButton.innerHTML =
      '<svg class="rotate-180 _previous_month_change_icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>';

    const monthYearSpan = document.createElement("span");
    monthYearSpan.className = "_current_month_year";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "_change_month _next_month _next_month_change_icon";
    nextButton.innerHTML =
      '<svg class="_next_month_change_icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>';

    header.appendChild(prevButton);
    header.appendChild(monthYearSpan);
    header.appendChild(nextButton);

    const weekDays = document.createElement("div");
    weekDays.className = "_week_Days";
    weekDays.appendChild(this._generateWeekDaysHTML());

    const dateSelectors = document.createElement("div");
    dateSelectors.className = "_date_selectors";

    const yearsListView = this._generateYearsListView();
    yearsListView.style.display = "none";

    calendarContent.appendChild(header);
    calendarContent.appendChild(weekDays);
    calendarContent.appendChild(dateSelectors);
    calendarContent.appendChild(yearsListView);

    return calendarContent;
  }

  private _generateWeekDaysHTML(): DocumentFragment {
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const fragment = document.createDocumentFragment();

    weekDays.forEach((day) => {
      const span = document.createElement("span");
      span.textContent = day;
      fragment.appendChild(span);
    });

    return fragment;
  }

  private _getMonthName(month: number): string {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }

  private _isDateSelected(
    date: Date,
    selectedDate: Date | null,
    rangeSelected: RangeSelected
  ): boolean {
    if (this.dateSelector.options.canSelectRange) {
      return Boolean(
        (rangeSelected.start &&
          date.getTime() === rangeSelected.start.getTime()) ||
          (rangeSelected.end && date.getTime() === rangeSelected.end.getTime())
      );
    } else {
      return date.getTime() === selectedDate?.getTime();
    }
  }

  private _isDateInRange(date: Date, rangeSelected: RangeSelected): boolean {
    if (
      this.dateSelector.options.canSelectRange &&
      rangeSelected.start &&
      rangeSelected.end
    ) {
      return date > rangeSelected.start && date < rangeSelected.end;
    }
    return false;
  }

  private _updateInputValue(
    selectedDate: Date | null,
    rangeSelected: RangeSelected,
    selectedTime?: { hours: number; minutes: number; seconds: number }
  ): void {
    if (this.dateSelector.options.canSelectRange) {
      const startDate = rangeSelected.start
        ? toIntDate(rangeSelected.start)
        : "NA";
      const endDate = rangeSelected.end ? toIntDate(rangeSelected.end) : "NA";
      this.inputElement.value = `${startDate} - ${endDate}`;
    } else if (selectedDate) {
      this.inputElement.value = selectedDate
        ? `${toIntDate(selectedDate)} ${
            selectedTime?.hours ? selectedTime?.hours : "00"
          }:${selectedTime?.minutes ? selectedTime?.minutes : "00"}:${
            selectedTime?.seconds ? selectedTime?.seconds : "00"
          }`
        : `${toIntDate(selectedDate)}`;
    } else {
      this.inputElement.value = "N/A";
    }
  }

  private _generateYearsListView(): HTMLDivElement {
    const yearsListView = document.createElement("div");
    yearsListView.className = "_years_list_view";

    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 50; year <= currentYear + 50; year++) {
      const yearElem = document.createElement("div");
      yearElem.className = "_year_child";
      yearElem.textContent = year.toString();
      yearsListView.appendChild(yearElem);
    }

    return yearsListView;
  }

  private _toggleYearsListView(): void {
    const dateSelectors = this.calendarDialog.querySelector(
      "._date_selectors"
    ) as HTMLElement;
    const yearsListView = this.calendarDialog.querySelector(
      "._years_list_view"
    ) as HTMLElement;
    const weekDays = this.calendarDialog.querySelector(
      "._week_Days"
    ) as HTMLElement;

    if (yearsListView.style.display === "none") {
      yearsListView.style.display = "grid";
      dateSelectors.style.display = "none";
      weekDays.style.display = "none";
    } else {
      yearsListView.style.display = "none";
      dateSelectors.style.display = "grid";
      weekDays.style.display = "grid";
    }
  }

  private createTimeSelector(): HTMLElement {
    const container = document.createElement("div");
    container.className = TIME_SELECTOR_CLASS;

    const timeInputs = document.createElement("div");
    timeInputs.className = `${TIME_SELECTOR_CLASS}-inputs`;

    // Hours input
    const hoursInput = this.createTimeInput("hours", "00", "0", "23");
    timeInputs.appendChild(hoursInput);
    timeInputs.appendChild(document.createTextNode(":"));

    // Minutes input
    const minutesInput = this.createTimeInput("minutes", "00", "0", "59");
    timeInputs.appendChild(minutesInput);
    timeInputs.appendChild(document.createTextNode(":"));

    // Seconds input
    const secondsInput = this.createTimeInput("seconds", "00", "0", "59");
    timeInputs.appendChild(secondsInput);

    container.appendChild(timeInputs);

    // Add AM/PM selector if using 12-hour format
    if (this.dateSelector.options.timeFormat === "12h") {
      const periodSelector = this.createPeriodSelector();
      container.appendChild(periodSelector);
    }

    return container;
  }

  private createTimeInput(
    type: string,
    placeholder: string,
    min: string,
    max: string
  ): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "number";
    input.className = TIME_INPUT_CLASS;
    input.placeholder = placeholder;
    input.min = min;
    input.max = max;
    input.addEventListener("change", (e) => {
      const value = parseInt((e.target as HTMLInputElement).value, 10);
      if (!isNaN(value)) {
        this.dateSelector["_handleTimeChange"](type as any, value);
      }
    });
    return input;
  }

  private createPeriodSelector(): HTMLSelectElement {
    const select = document.createElement("select");
    select.className = TIME_PERIOD_CLASS;

    const amOption = document.createElement("option");
    amOption.value = "AM";
    amOption.textContent = "AM";

    const pmOption = document.createElement("option");
    pmOption.value = "PM";
    pmOption.textContent = "PM";

    select.appendChild(amOption);
    select.appendChild(pmOption);

    select.addEventListener("change", (e) => {
      const isPM = (e.target as HTMLSelectElement).value === "PM";
      const currentHours = this.dateSelector["_selectedTime"].hours;
      let newHours = currentHours;

      if (isPM && currentHours < 12) {
        newHours = currentHours + 12;
      } else if (!isPM && currentHours >= 12) {
        newHours = currentHours - 12;
      }

      this.dateSelector["_handleTimeChange"]("hours", newHours);
    });

    return select;
  }

  private _setTimeStyles(): void {
    const root = document.documentElement;

    // Time selector container styles
    root.style.setProperty("--time-selector-padding", "10px");
    root.style.setProperty("--time-selector-margin-top", "10px");
    root.style.setProperty(
      "--time-selector-border-top",
      "1px solid var(--_dis_bg)"
    );

    // Time input styles
    root.style.setProperty("--time-input-width", "50px");
    root.style.setProperty("--time-input-padding", "5px");
    root.style.setProperty("--time-input-margin", "0 5px");
    root.style.setProperty("--time-input-border", "1px solid var(--_dis_bg)");
    root.style.setProperty("--time-input-border-radius", "4px");
    root.style.setProperty("--time-input-background", "var(--_calender_bg)");
    root.style.setProperty("--time-input-color", "var(--_font_color)");

    // Period selector styles
    root.style.setProperty("--time-period-width", "60px");
    root.style.setProperty("--time-period-margin-left", "10px");
    root.style.setProperty("--time-period-padding", "5px");
    root.style.setProperty("--time-period-border", "1px solid var(--_dis_bg)");
    root.style.setProperty("--time-period-border-radius", "4px");
    root.style.setProperty("--time-period-background", "var(--_calender_bg)");
    root.style.setProperty("--time-period-color", "var(--_font_color)");

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .${TIME_SELECTOR_CLASS} {
        padding: var(--time-selector-padding);
        margin-top: var(--time-selector-margin-top);
        border-top: var(--time-selector-border-top);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .${TIME_INPUT_CLASS} {
        width: var(--time-input-width);
        padding: var(--time-input-padding);
        margin: var(--time-input-margin);
        border: var(--time-input-border);
        border-radius: var(--time-input-border-radius);
        background: var(--time-input-background);
        color: var(--time-input-color);
        text-align: center;
      }

      .${TIME_INPUT_CLASS}::-webkit-inner-spin-button,
      .${TIME_INPUT_CLASS}::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .${TIME_PERIOD_CLASS} {
        width: var(--time-period-width);
        margin-left: var(--time-period-margin-left);
        padding: var(--time-period-padding);
        border: var(--time-period-border);
        border-radius: var(--time-period-border-radius);
        background: var(--time-period-background);
        color: var(--time-period-color);
      }
    `;
    document.head.appendChild(styleSheet);
  }
}
