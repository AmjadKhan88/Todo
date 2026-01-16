import { useState } from 'react';
import { useTodo } from '../context/TodoContext';

function Sidebar() {
    const { statistics, filterTodos } = useTodo();
    const [activeFilter, setActiveFilter] = useState('all');
    
    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        filterTodos(filter);
    };
    
    const getButtonClass = (filter) => {
        return `filter-btn ${activeFilter === filter ? 'active' : ''}`;
    };
    
    return (
        <aside className="sidebar">
            <div className="stats-container">
                <h3 className="stats-title"><i className="fas fa-chart-bar"></i> Task Statistics</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">{statistics.totalTasks}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{statistics.completedTasks}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{statistics.pendingTasks}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{statistics.highPriorityTasks}</div>
                        <div className="stat-label">High Priority</div>
                    </div>
                </div>
            </div>
            
            <div className="filter-container">
                <h3 className="filter-title"><i className="fas fa-filter"></i> Filter Tasks</h3>
                <div className="filter-options">
                    <button 
                        className={getButtonClass('all')}
                        onClick={() => handleFilterClick('all')}
                    >
                        <i className="fas fa-tasks"></i> All Tasks
                    </button>
                    <button 
                        className={getButtonClass('pending')}
                        onClick={() => handleFilterClick('pending')}
                    >
                        <i className="fas fa-clock"></i> Pending
                    </button>
                    <button 
                        className={getButtonClass('completed')}
                        onClick={() => handleFilterClick('completed')}
                    >
                        <i className="fas fa-check-circle"></i> Completed
                    </button>
                    <button 
                        className={getButtonClass('high')}
                        onClick={() => handleFilterClick('high')}
                    >
                        <span className="priority-indicator priority-high"></span> High Priority
                    </button>
                    <button 
                        className={getButtonClass('medium')}
                        onClick={() => handleFilterClick('medium')}
                    >
                        <span className="priority-indicator priority-medium"></span> Medium Priority
                    </button>
                    <button 
                        className={getButtonClass('low')}
                        onClick={() => handleFilterClick('low')}
                    >
                        <span className="priority-indicator priority-low"></span> Low Priority
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;