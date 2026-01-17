import { useTodo } from '../context/TodoContext'
import TodoTasks from './TodoTasks';
import TaskForm from './TaskForm';
import { useState } from 'react';
import ReminderNotifications from './ReminderNotifications';

function TaskInput() {
    const { todos, addTodo, activeReminders } = useTodo();
    const [toggleForm, setToggleForm] = useState(false);
    const [toggleNotification, setToggleNotification] = useState(false);

    return (
        <main className="main-content container-model right-column">
           
           {toggleForm &&<TaskForm addTodo={addTodo} setToggleForm={setToggleForm}/>}
           {toggleNotification && <ReminderNotifications setToggleNotification={setToggleNotification}/>}

            <div style={{display:'flex',gap:'10px',justifyContent:'end'}}>
                <button class="button-nofication" onClick={()=>setToggleNotification(true)}>
                <svg class="bell" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
                Notifications {activeReminders.length > 0 && <span style={{color:'white',backgroundColor:'red',padding:'0 5px',borderRadius:'50%',fontSize:'12px'}}>{activeReminders.length}</span>}
                <div class="arrow">›</div>
                </button>
                <button class="btn-donate" onClick={()=>setToggleForm(true)}>Add Tasks</button>
            </div>

             <div className="tasks-container" id="tasksContainer">
                {/* Show empty state only when there are no todos */}
                {todos.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-clipboard-list"></i>
                        <p>No tasks yet. Add a task to get started!</p>
                    </div>
                ) : (
                    // Render todos when they exist
                    todos?.map((task) => (
                        <TodoTasks key={task.id} task={task} />
                    ))
                )}
            </div>
        </main>
    );
}

export default TaskInput;



