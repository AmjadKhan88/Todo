/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";

// create context
const TodoContext = createContext();

// Load todos from localStorage
const loadTodosFromStorage = () => {
  try {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      return JSON.parse(storedTodos);
    }
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
  }
  return null;
};

// Save todos to localStorage
const saveTodosToStorage = (todos) => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos to localStorage:", error);
  }
};

// Play notification sound
const playNotificationSound = () => {
  try {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log("Could not play sound:", error);
  }
};

// Send browser notification
const sendBrowserNotification = (title, body) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
};

// Initial todos (fallback if no localStorage data)
const initialTodosData = [
  { 
    id: 1, 
    text: "Complete project proposal", 
    completed: false, 
    priority: "high", 
    date: "2023-10-14",
    time: "09:00", // Added time field
    reminder: true // Added reminder flag
  },
  { 
    id: 2, 
    text: "Buy groceries for the week", 
    completed: true, 
    priority: "medium", 
    date: "2023-10-16",
    time: "18:00",
    reminder: true
  },
  { 
    id: 3, 
    text: "Schedule dentist appointment", 
    completed: false, 
    priority: "low", 
    date: "2023-10-17",
    time: "14:30",
    reminder: true
  },
  { 
    id: 4, 
    text: "Prepare presentation for meeting", 
    completed: false, 
    priority: "high", 
    date: "2023-10-18",
    time: "10:00",
    reminder: true
  },
  { 
    id: 5, 
    text: "Read 30 pages of book", 
    completed: false, 
    priority: "low", 
    date: "2023-10-11",
    time: "20:00",
    reminder: true
  },
  { 
    id: 6, 
    text: "Call insurance company", 
    completed: true, 
    priority: "medium", 
    date: "2023-10-15",
    time: "11:00",
    reminder: true
  }
];

// provider use this in Main.tsx
export const TodoProvider = ({ children }) => {
  // Load initial data from localStorage or use default
  const [todos, setTodos] = useState(() => {
    const storedTodos = loadTodosFromStorage();
    return storedTodos || initialTodosData;
  });
  
  // Keep a separate state for the original todos
  const [originalTodos, setOriginalTodos] = useState(() => {
    const storedTodos = loadTodosFromStorage();
    return storedTodos || initialTodosData;
  });

  // State for showing reminders
  const [activeReminders, setActiveReminders] = useState([]);
  const remindersRef = useRef(new Set()); // Track shown reminders to avoid duplicates

  // Save to localStorage whenever originalTodos changes
  useEffect(() => {
    saveTodosToStorage(originalTodos);
  }, [originalTodos]);

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0');

      // Find pending todos with reminders set for current time
      const dueReminders = originalTodos.filter(todo => {
        if (todo.completed || !todo.reminder || !todo.time) return false;
        
        // Check if date matches (or is past) and time matches
        const todoDate = todo.date;
        const todoTime = todo.time;
        
        // For past dates, don't show reminders
        if (todoDate < currentDate) return false;
        
        // For today's date, check time
        if (todoDate === currentDate) {
          return todoTime <= currentTime;
        }
        
        return false;
      }).filter(todo => !remindersRef.current.has(todo.id));

      if (dueReminders.length > 0) {
        // Add to shown reminders
        dueReminders.forEach(todo => remindersRef.current.add(todo.id));
        
        // Update active reminders state
        setActiveReminders(prev => [...prev, ...dueReminders]);
        
        // Play sound for first reminder
        playNotificationSound();
        
        // Send browser notification for each due task
        dueReminders.forEach(todo => {
          sendBrowserNotification(
            "Task Reminder",
            `${todo.text} is due now!`
          );
        });
      }
    };

    // Check immediately on mount
    checkReminders();

    // Set up interval to check every minute
    const intervalId = setInterval(checkReminders, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [originalTodos]);

  // Clear a specific reminder
  const clearReminder = (id) => {
    setActiveReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  // Clear all reminders
  const clearAllReminders = () => {
    setActiveReminders([]);
    remindersRef.current.clear();
  };

  // Toggle reminder for a task
  const toggleReminder = (id) => {
    const updatedTodos = originalTodos.map(todo =>
      todo.id === id ? { ...todo, reminder: !todo.reminder } : todo
    );
    updateTodos(updatedTodos);
  };

  // Update task time
  const updateTaskTime = (id, time) => {
    const updatedTodos = originalTodos.map(todo =>
      todo.id === id ? { ...todo, time } : todo
    );
    updateTodos(updatedTodos);
  };

  // Calculate statistics based on originalTodos
  const statistics = useMemo(() => {
    const totalTasks = originalTodos.length;
    const completedTasks = originalTodos.filter(todo => todo.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = originalTodos.filter(todo => todo.priority === 'high').length;
    const mediumPriorityTasks = originalTodos.filter(todo => todo.priority === 'medium').length;
    const lowPriorityTasks = originalTodos.filter(todo => todo.priority === 'low').length;
    const tasksWithReminders = originalTodos.filter(todo => todo.reminder && !todo.completed).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      tasksWithReminders
    };
  }, [originalTodos]);

  // Helper function to update both states and trigger save
  const updateTodos = (newTodos) => {
    setTodos(newTodos);
    setOriginalTodos(newTodos);
  };

  // addTodo to list
  const addTodo = (todo) => {
    if (todos.some(t => t.text.toLowerCase() === todo.text.toLowerCase())) {
      alert("Task already exists!");
      return;
    }
    // Add to both current todos and original todos
    const newTodo = { 
      ...todo, 
      id: Date.now(),
      date: todo.date || new Date().toISOString().split('T')[0],
      time: todo.time || "09:00", // Default time
      reminder: todo.reminder !== undefined ? todo.reminder : true // Default to true
    };
    const updatedTodos = [...originalTodos, newTodo];
    updateTodos(updatedTodos);
  };

  // removeTodo from list
  const removeTodo = (id) => {
    const updatedTodos = originalTodos.filter(todo => todo.id !== id);
    updateTodos(updatedTodos);
    // Also remove from active reminders
    setActiveReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  // todo toggleComplete 
  const toggleComplete = (id) => {
    const updatedTodos = originalTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    updateTodos(updatedTodos);
    // Remove from active reminders if completed
    if (updatedTodos.find(t => t.id === id)?.completed) {
      setActiveReminders(prev => prev.filter(reminder => reminder.id !== id));
    }
  };

  // todo editTodo
  const editTodo = (id, newText, time) => {
    if (!newText || newText.trim() === "") {
      alert("Task text cannot be empty!");
      return;
    }
    const updatedTodos = originalTodos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        text: newText.trim(),
        time: time || todo.time
      } : todo
    );
    updateTodos(updatedTodos);
  };

  // todo sortTodos
  const sortTodos = (sortBy) => {
    setTodos(prevTodos => {
      const sortedTodos = [...prevTodos];
      if (sortBy === 'date') {
        sortedTodos.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
          return dateA - dateB;
        });
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sortedTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      }
      return sortedTodos;
    });
  };

  // todo filterTodos
  const filterTodos = (filter) => {
    if (filter === 'all') {
      setTodos([...originalTodos]);
    } 
    else if (filter === 'completed') {
      const completed = originalTodos.filter(todo => todo.completed);
      setTodos(completed);
    } 
    else if (filter === 'pending') {
      const pending = originalTodos.filter(todo => !todo.completed);
      setTodos(pending);
    }
    else if (filter === 'high') {
      const highPriority = originalTodos.filter(todo => todo.priority === 'high');
      setTodos(highPriority);
    }
    else if (filter === 'medium') {
      const mediumPriority = originalTodos.filter(todo => todo.priority === 'medium');
      setTodos(mediumPriority);
    }
    else if (filter === 'low') {
      const lowPriority = originalTodos.filter(todo => todo.priority === 'low');
      setTodos(lowPriority);
    }
    else if (filter === 'with-reminders') {
      const withReminders = originalTodos.filter(todo => todo.reminder && !todo.completed);
      setTodos(withReminders);
    }
  };

  // todo searchTodos
  const searchTodos = (query) => {
    if (query.trim() === '') {
      setTodos([...originalTodos]);
    } else {
      const filtered = originalTodos.filter(todo =>
        todo.text.toLowerCase().includes(query.toLowerCase())
      );
      setTodos(filtered);
    }
  };

  // Reset to show all todos
  const resetTodos = () => {
    setTodos([...originalTodos]);
  };

  // Clear all todos from localStorage
  const clearAllTodos = () => {
    if (window.confirm("Are you sure you want to delete ALL todos? This action cannot be undone.")) {
      updateTodos([]);
      setActiveReminders([]);
      remindersRef.current.clear();
    }
  };

  // Reset to initial todos
  const resetToInitial = () => {
    if (window.confirm("Are you sure you want to reset to initial todos? This will replace all current todos.")) {
      updateTodos(initialTodosData);
      setActiveReminders([]);
      remindersRef.current.clear();
    }
  };

  const value = {
    todos,
    originalTodos,
    activeReminders,
    statistics,
    addTodo,
    removeTodo,
    toggleComplete,
    editTodo,
    toggleReminder,
    updateTaskTime,
    sortTodos,
    filterTodos,
    searchTodos,
    resetTodos,
    clearAllTodos,
    resetToInitial,
    clearReminder,
    clearAllReminders,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

// custom hook for todos
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};