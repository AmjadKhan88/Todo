import { Bell, Check, Clock, Timer, X } from "lucide-react";
import { useTodo } from "../context/TodoContext";

function ReminderNotifications({setToggleNotification}) {
  const { activeReminders, clearReminder, clearAllReminders } = useTodo();

  if (activeReminders.length === 0) return null;

  return (
    <div className="container-form-main">
    <div className="reminder-notifications">
      <div className="reminder-header">
        <h3>
          <Bell/> Task Reminders
          <span className="reminder-count">{activeReminders.length}</span>
        </h3>
        <button 
          className="clear-all-btn" 
          onClick={clearAllReminders}
          title="Clear all reminders"
        >
          <Timer/>
        </button>
        <X style={{color:'gray',cursor:'pointer'}} onClick={()=>setToggleNotification(false)}/>
      </div>
      
      <div className="reminder-list">
        {activeReminders.map(reminder => (
          <div key={reminder.id} className="reminder-item">
            <div className="reminder-content">
              <div className="reminder-text" >
                <Clock style={{color:'gray'}} strokeWidth={0.75}/>
                <strong>{reminder.text}</strong>
              </div>
              <div className="reminder-time">
                Due: {reminder.date} at {reminder.time}
              </div>
              <div className={`reminder-priority ${reminder.priority}`}>
                {reminder.priority} Priority
              </div>
            </div>
            <button 
              className="dismiss-btn"
              onClick={() => clearReminder(reminder.id)}
              title="Dismiss reminder"
            >
              <Check />
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default ReminderNotifications;