const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function ymdFromParts(year, monthIndex, day) {
  const d = new Date(year, monthIndex, day);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function Calendar({
  currentMonth,
  onMonthChange,
  selectedDate,
  onSelectDate,
  todosByDate,
}) {
  const today = new Date();
  const todayStr = ymdFromParts(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="day empty"></div>);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateStr = ymdFromParts(year, month, d);

    const list = todosByDate[dateStr] || [];
    const hasTodo = list.length > 0;
    const allDone = hasTodo && list.every((t) => t.done);
    const hasIncomplete = hasTodo && list.some((t) => !t.done);

    let dotClass = "";
    if (hasIncomplete) dotClass = "dotOrange";
    else if (allDone) dotClass = "dotGreen";

    const isSelected = selectedDate === dateStr;
    const isToday = todayStr === dateStr;

    cells.push(
      <div
        key={dateStr}
        className={`day 
          ${isSelected ? "selectedDay" : ""} 
          ${isToday ? "today" : ""}
        `}
        onClick={() => onSelectDate(dateStr)}
      >
        <div className="dayNumber">{d}</div>
        {dotClass && <div className={`dot ${dotClass}`} />}
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="calendarHeader">
        <button onClick={() => onMonthChange(new Date(year, month - 1, 1))}>
          {"<"}
        </button>
        <h3>{year}년 {month + 1}월</h3>
        <button onClick={() => onMonthChange(new Date(year, month + 1, 1))}>
          {">"}
        </button>
      </div>

      <div className="weekRow">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="weekDay">
            {d}
          </div>
        ))}
      </div>

      <div className="grid">{cells}</div>
    </div>
  );
}