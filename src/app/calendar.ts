import {Input, Component} from 'angular2/core';

@Component({
  selector: 'calendar',
  templateUrl: 'app/calendar.html',
  styles: [`
    header { background: black; color: white; padding:20px 50px; }
    header h2 { margin:0; padding:0; }
    .calendar-grid { border:1px solid black; width:100%; display:inline-block; }
    .calendar-grid .cell { width:14.28%; border:1px solid black; height:100px; display:inline-block; vertical-align:top; }
    .calendar-grid .cell.type-post,
    .calendar-grid .cell.type-pre { background:#abc4f4; }
    .calendar-grid .cell.type-day { padding:10px; text-align:right; background:white; }
    .calendar-grid .number { display:inline-block; padding:5px; }
    .calendar-grid .cell.today .number { background:red; color:white; border-radius:50px; }
  `]
})
export class Calendar {
  @Input('month') _month;
  @Input('day') _day;
  @Input('year') _year;

  date: Date;
  _cache = {};

  constructor() {
  }

  cache(key, valueFn) {
    var value = this._cache[key];
    if (value == undefined) {
      value = this._cache[key] = valueFn();
    }
    return value;
  }

  get cells() {
    return this.cache('cells', () => {
      var cells = [];
      for (var i = 0; i < this.startDayIndex; i++) {
        cells.push({
          index: i,
          day: i,
          type: 'pre',
          today: false
        });
      }

      var today = new Date();
      var todayDay = today.getDate();
      var inThisMonth = this.date.getFullYear() == today.getFullYear() && this.date.getMonth() == today.getMonth();
      for (var j = 1; j <= this.totalDays; j++, i++) {
        cells.push({
          index: i,
          day: j,
          type: 'day',
          today: inThisMonth && j == todayDay
        });
      }

      var DAYS_IN_WEEK = 7;
      var start = i % DAYS_IN_WEEK;
      for (var x = start; x < DAYS_IN_WEEK; x++, i++) {
        cells.push({
          index: i,
          day: x,
          type: 'post',
          today: false
        });
      }

      return cells;
    });
  }

  get nextMonth() {
    return this.cache('nextMonth', () => {
      var next = new Date(this.date.valueOf());
      var y = this.date.getFullYear();
      var m = this.date.getMonth();
      if (m == 11) {
        m = 0;
        next.setMonth(0);
        next.setFullYear(++y);
      } else {
        next.setMonth(++m);
      }
      next.setDate(1);
      return next;
    });
  }

  get totalDays() {
    return this.cache('totalDays', () => {
      var next = this.nextMonth;
      var lastDay = new Date(next.getTime() - ( 86400 * 1000 ));
      return lastDay.getDate();
    });
  }

  get startDayIndex() {
    return this.cache('startDay', () => {
      var current = new Date(this.date.valueOf());
      current.setDate(1);
      return current.getDay();
    });
  }

  ngOnInit() {
    this.date = new Date();
    if (this._month) {
      this.date.setMonth(this._month);
    }
    if (this._day) {
      this.date.setDate(this._day);
    }
    if (this._year) {
      this.date.setFullYear(this._year);
    }
  }

  get year() {
    return this.date.getFullYear();
  }

  get monthName() {
    var month = this.date.getMonth();
    var MONTHS = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
    return MONTHS[month];
  }

  generateCssClass(entry) {
    var css = 'cell type-' + entry.type;
    if (entry.today) {
      css += ' today';
    }
    return css;
  }
}
