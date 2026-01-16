import { useState } from "react";

const TaskForm = ({ addTodo,setToggleForm }) => {
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");
  const [reminder, setReminder] = useState(true);

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!newTask.trim()) {
      alert("Please enter a task!");
      return;
    }

    addTodo({
      text: newTask.trim(),
      priority,
      date,
      time,
      reminder,
      completed: false,
    });

    // Reset form
    setNewTask("");
    setPriority("medium");
    setDate(new Date().toISOString().split("T")[0]);
    setTime("09:00");
    setReminder(true);
    setToggleForm(false);
  };

  return (
    <>
      <div className="container-form-main">
        <div class="container-form ">
          <div class="heading">Add Todo</div>
          <form class="form" onSubmit={handleAddTask}>
            <input
              required=""
              class="input"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
            />
            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input"
            />

            <label className="reminder-checkbox" style={{ marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={reminder}
                onChange={(e) => setReminder(e.target.checked)}
              />
              <span>Reminder</span>
            </label>

            <input class="login-button" type="submit" value="Add Todo" />
            <h2 className="cancel-btn" onClick={()=> setToggleForm(false)}>Cancel</h2>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
