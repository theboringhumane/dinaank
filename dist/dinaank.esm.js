/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var e=function(){return e=Object.assign||function(e){for(var t,a=1,n=arguments.length;a<n;a++)for(var i in t=arguments[a])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},e.apply(this,arguments)};function t(e){return e.toISOString().split("T")[0]}var a,n=function(){function e(e){if(this.dateSelector=e,this.inputElement=document.querySelector("".concat(e.options.el)),!this.inputElement)throw new Error('Element with class "'.concat(e.options.el,'" not found'));this.parentElement=this.inputElement.parentElement,this.calendarDialog=null,this.yearsListView=null}return e.prototype.createCalendarDialog=function(){this.calendarDialog=document.createElement("div"),this.calendarDialog.className="_calender_wrapper ".concat(this.dateSelector.id," _calender_display_hidden _").concat(this.dateSelector.options.theme,"_theme");var e=this._generateCalendarHTML();this.yearsListView=this._generateYearsListView(),this.calendarDialog.appendChild(e),this.calendarDialog.appendChild(this.yearsListView),this.parentElement.appendChild(this.calendarDialog)},e.prototype.updateCalendar=function(e,t,a){var n=this;this.calendarDialog.querySelector("._current_month_year").textContent="".concat(this._getMonthName(t.getMonth())," ").concat(t.getFullYear());var i=this.calendarDialog.querySelector("._date_selectors");i.innerHTML="",Object.values(e).forEach((function(e){e.forEach((function(e){var o,r,s,l,d,c,h,p,g=document.createElement("span");g.className="_date_child",g.textContent=e.getDate().toString(),g.dataset.date=e.toISOString(),n._isDateSelected(e,t,a)&&g.classList.add("active"),n._isDateInRange(e,a)&&g.classList.add("in--range"),(null===(r=null===(o=n.dateSelector)||void 0===o?void 0:o.options)||void 0===r?void 0:r.minDate)&&(e<(null===(l=null===(s=n.dateSelector)||void 0===s?void 0:s.options)||void 0===l?void 0:l.minDate)&&g.classList.add("disabled"),(null===(c=null===(d=n.dateSelector)||void 0===d?void 0:d.options)||void 0===c?void 0:c.maxDate)&&e>(null===(p=null===(h=n.dateSelector)||void 0===h?void 0:h.options)||void 0===p?void 0:p.maxDate)&&g.classList.add("disabled")),i.appendChild(g)}))})),this._updateInputValue(t,a)},e.prototype.attachEventListeners=function(e){var t=this;this.inputElement.addEventListener("click",this.toggleCalendar.bind(this)),this.calendarDialog.addEventListener("click",(function(t){var a=t.target;a.classList.contains("_date_child")&&!a.classList.contains("disabled")?e.onDateClick(new Date(a.dataset.date)):a.classList.contains("_previous_month_change_icon")?e.onMonthChange(-1):a.classList.contains("_next_month_change_icon")&&e.onMonthChange(1)})),document.addEventListener("click",e.onOutsideClick),this.calendarDialog.querySelector("._current_month_year").addEventListener("click",this._toggleYearsListView.bind(this)),this.calendarDialog.querySelector("._years_list_view").addEventListener("click",(function(a){var n=a.target;if(n.classList.contains("_year_child")){var i=parseInt(n.textContent||"",10);e.onYearChange(i),t._toggleYearsListView()}}))},e.prototype.toggleCalendar=function(){this.calendarDialog.classList.toggle("_calender_display_hidden")},e.prototype.hideCalendar=function(){this.calendarDialog.classList.add("_calender_display_hidden")},e.prototype.isPartOfCalendar=function(e){return this.calendarDialog.contains(e)||e===this.inputElement||e.classList.contains("_date_child")},e.prototype.destroy=function(){this.calendarDialog.remove(),this.removeEventListeners()},e.prototype.removeEventListeners=function(){this.inputElement.removeEventListener("click",this.toggleCalendar.bind(this))},e.prototype._generateCalendarHTML=function(){var e=document.createElement("div");e.className="_calendar_content";var t=document.createElement("div");t.className="_calender_header";var a=document.createElement("button");a.className="_change_month _previous_month _previous_month_change_icon",a.innerHTML='<svg class="rotate-180 _previous_month_change_icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>';var n=document.createElement("span");n.className="_current_month_year";var i=document.createElement("button");i.className="_change_month _next_month _next_month_change_icon",i.innerHTML='<svg class="_next_month_change_icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>',t.appendChild(a),t.appendChild(n),t.appendChild(i);var o=document.createElement("div");o.className="_week_Days",o.appendChild(this._generateWeekDaysHTML());var r=document.createElement("div");r.className="_date_selectors";var s=this._generateYearsListView();return s.style.display="none",e.appendChild(t),e.appendChild(o),e.appendChild(r),e.appendChild(s),e},e.prototype._generateWeekDaysHTML=function(){var e=document.createDocumentFragment();return["Su","Mo","Tu","We","Th","Fr","Sa"].forEach((function(t){var a=document.createElement("span");a.textContent=t,e.appendChild(a)})),e},e.prototype._getMonthName=function(e){return["January","February","March","April","May","June","July","August","September","October","November","December"][e]},e.prototype._isDateSelected=function(e,t,a){return this.dateSelector.options.canSelectRange?Boolean(a.start&&e.getTime()===a.start.getTime()||a.end&&e.getTime()===a.end.getTime()):e.getTime()===t.getTime()},e.prototype._isDateInRange=function(e,t){return!!(this.dateSelector.options.canSelectRange&&t.start&&t.end)&&(e>t.start&&e<t.end)},e.prototype._updateInputValue=function(e,a){if(this.dateSelector.options.canSelectRange){var n=a.start?t(a.start):"NA",i=a.end?t(a.end):"NA";this.inputElement.value="".concat(n," - ").concat(i)}else this.inputElement.value=t(e)},e.prototype._generateYearsListView=function(){var e=document.createElement("div");e.className="_years_list_view";for(var t=(new Date).getFullYear(),a=t-50;a<=t+50;a++){var n=document.createElement("div");n.className="_year_child",n.textContent=a.toString(),e.appendChild(n)}return e},e.prototype._toggleYearsListView=function(){var e=this.calendarDialog.querySelector("._date_selectors"),t=this.calendarDialog.querySelector("._years_list_view"),a=this.calendarDialog.querySelector("._week_Days");"none"===t.style.display?(t.style.display="grid",e.style.display="none",a.style.display="none"):(t.style.display="none",e.style.display="grid",a.style.display="grid")},e}();!function(e){e[e.Single=0]="Single",e[e.Range=1]="Range"}(a||(a={}));var i=function(){function t(t){this.id="date-selector-".concat(Math.random().toString(36).substr(2,9)),this.options=e(e({},{el:"",canSelectRange:!1,closeOnSelect:!0,weekdays:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],theme:"light"}),t),this.dom=new n(this),this.selectionMode=this.options.canSelectRange?a.Range:a.Single,this._initializeState(),this._initializeDOM(),this._setColorTheme(),this._attachEventListeners()}return t.prototype.setMinMaxDate=function(e,t){this.options.minDate=e,this.options.maxDate=t,this._updateCalendar()},t.prototype.setTheme=function(e){this.options.theme=e,this._setColorTheme()},t.prototype._initializeState=function(){this._daySelected=new Date,this.rangeSelected={start:null,end:null},this.dates=this._generateWeeksDaysDates()},t.prototype._initializeDOM=function(){this.dom.createCalendarDialog(),this.dom.updateCalendar(this.dates,this._daySelected,this.rangeSelected)},t.prototype._attachEventListeners=function(){this.dom.attachEventListeners({onDateClick:this._handleDateClick.bind(this),onMonthChange:this._handleMonthChange.bind(this),onYearChange:this._handleYearChange.bind(this),onOutsideClick:this._handleOutsideClick.bind(this)})},t.prototype._handleDateClick=function(e){this.selectionMode===a.Range?this._handleRangeSelection(e):this.selectionMode===a.Single&&(this._daySelected=e,this.options.closeOnSelect&&this.dom.hideCalendar()),this._updateCalendar(),this._triggerOnChange()},t.prototype._handleRangeSelection=function(e){var t;this.rangeSelected.start?this.rangeSelected.end?this.rangeSelected={start:e,end:null}:(this.rangeSelected.end=e,this.rangeSelected.start>this.rangeSelected.end&&(t=[this.rangeSelected.end,this.rangeSelected.start],this.rangeSelected.start=t[0],this.rangeSelected.end=t[1])):this.rangeSelected.start=e},t.prototype._handleMonthChange=function(e){var t=new Date(this._daySelected);t.setMonth(t.getMonth()+e),this._daySelected=t,this._updateCalendar()},t.prototype._handleYearChange=function(e){this._daySelected.setFullYear(e),this._updateCalendar()},t.prototype._handleOutsideClick=function(e){this.dom.isPartOfCalendar(e.target)||this.dom.hideCalendar()},t.prototype._updateCalendar=function(){this.dates=this._generateWeeksDaysDates(),this.dom.updateCalendar(this.dates,this._daySelected,this.rangeSelected)},t.prototype._triggerOnChange=function(){"function"==typeof this.options.onChange&&this.options.onChange(this._daySelected,this.rangeSelected)},t.prototype._generateWeeksDaysDates=function(){var e={},t=this._daySelected.getFullYear(),a=this._daySelected.getMonth(),n=new Date(t,a,1),i=new Date(t,a+1,0),o=new Date(n);o.setDate(o.getDate()-o.getDay());var r=new Date(i);r.setDate(r.getDate()+(6-r.getDay()));for(var s=new Date(o),l=0;s<=r;)e[l]||(e[l]=[]),e[l].push(new Date(s)),s.setDate(s.getDate()+1),0===s.getDay()&&s<=r&&l++;return e},t.prototype.destroy=function(){this.dom.destroy()},t.prototype._setColorTheme=function(){var e=document.documentElement,t=this.options,a=t.theme,n=t.colors;e.style.setProperty("--_bg_color","dark"===a?"#3c414a":"rgb(245, 245, 245)"),e.style.setProperty("--_calender_bg","dark"===a?"#323741":"rgb(245, 245, 245)"),e.style.setProperty("--_hover_bg",(null==n?void 0:n.hover)||("dark"===a?"#2c437a":"#ffab91")),e.style.setProperty("--_active_bg",(null==n?void 0:n.active)||("dark"===a?"#1f5eff":"#f4511e")),e.style.setProperty("--in_range",(null==n?void 0:n.range)||("dark"===a?"rgba(31,94,255,0.35)":"rgba(244,81,30,0.35)")),(null==n?void 0:n.rangeColor)?e.style.setProperty("--range_color",n.rangeColor):e.style.setProperty("--range_color","#fff"),e.style.setProperty("--_font_color","dark"===a?"#767c8c":"#333333"),e.style.setProperty("--_dis_bg","dark"===a?"#343942":"#e0e0e0"),e.style.setProperty("--_dis_color","dark"===a?"rgba(204, 204, 204, 0.418)":"rgba(0, 0, 0, 0.38)")},t}();export{i as default};
