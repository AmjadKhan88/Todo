/* eslint-disable no-unused-vars */
import { Bell, BellOff, Timer, Trash2 } from "lucide-react";
import { useTodo } from "../context/TodoContext";

function TodoTasks({ task }) {
    const { toggleComplete, removeTodo, editTodo, toggleReminder } = useTodo();

    const taskDate = task.date instanceof Date ? task.date : new Date(task.date);

    // const handleEdit = () => {
    //     const newText = prompt("Edit task:", task.text);
    //     if (newText && newText.trim() !== "") {
    //         const newTime = prompt("Edit time (HH:MM):", task.time || "09:00");
    //         editTodo(task.id, newText, newTime);
    //     }
    // };

    return (
        <div className="task-item">
            <label class="container-checkbox">
              <input type="checkbox" checked={task.completed}  onChange={() => toggleComplete(task.id)}/>
              <div class="checkmark"></div>
            </label>

            <div className="task-content">
                <div className={`task-title ${task.completed ? "completed" : ""}`}>
                    {task.text}
                    {task.reminder && !task.completed && (
                        <i className="fas fa-bell reminder-icon" 
                           title="Reminder enabled"
                           style={{ color: '#ff9800', marginLeft: '8px' }}
                        ></i>
                    )}
                </div>
                <div className="task-meta">
                    <div className="task-priority">
                        <span  className={`priority-indicator ${task.priority.toLowerCase()}`}></span>
                        {task.priority} Priority
                    </div>
                    <div className="task-date">
                        <i className="far fa-calendar"></i> {taskDate.toLocaleDateString()}
                        {task.time && (
                            <span className="task-time" style={{display:'flex',gap:'3px',alignItems:'center'}}>
                                <Timer width={15}/> {task.time}
                            </span>
                        )}
                    </div>
                    <div className="task-status">
                        {task.completed ? (
                            <>
                                <i className="fas fa-check-circle" style={{ color: "var(--success-color)" }}></i> 
                                Completed
                            </>
                        ) : (
                            <>
                                <i className="fas fa-clock" style={{ color: "var(--warning-color)" }}></i> 
                                Pending
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="task-actions">
                <button
                    className={`task-action-btn ${task.reminder ? 'reminder-active' : ''}`}
                    onClick={() => toggleReminder(task.id)}
                    title={task.reminder ? "Disable reminder" : "Enable reminder"}
                >
                    {task.reminder ? <Bell style={{color:'green'}}/> : <BellOff/>}
                </button>
                
                <button
                    className="task-action-btn delete-btn"
                    onClick={() => removeTodo(task.id)}
                >
                    <Trash2/>
                </button>
            </div>
        </div>
    );
}

export default TodoTasks;