import React, { useState, useEffect } from 'react';
import '../styles/TaskManagerDemo.css';

interface Task {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  hours: number;
  progress: number;
  createdDate: string;
  dueDate: string | null;
}

const TaskManagerDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      name: "Complete JavaScript course", 
      category: "Learning", 
      completed: false, 
      priority: "high", 
      hours: 10, 
      progress: 60,
      createdDate: "2023-04-01",
      dueDate: "2023-04-15"
    },
    { 
      id: 2, 
      name: "Exercise", 
      category: "Health", 
      completed: true, 
      priority: "medium", 
      hours: 1, 
      progress: 100,
      createdDate: "2023-04-01",
      dueDate: null
    },
    { 
      id: 3, 
      name: "Prepare presentation", 
      category: "Work", 
      completed: false, 
      priority: "high", 
      hours: 4, 
      progress: 25,
      createdDate: "2023-04-01",
      dueDate: "2023-04-12"
    }
  ]);
  
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [hours, setHours] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });
  
  const categories = ["Work", "Personal", "Learning", "Health"];
  
  useEffect(() => {
    calculateStats();
  }, [tasks]);
  
  const calculateStats = () => {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats({
      total,
      completed,
      rate
    });
  };
  
  const addTask = () => {
    if (!taskName.trim()) return;
    
    const newTask: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      name: taskName,
      category,
      completed: false,
      priority,
      hours,
      progress: 0,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: null
    };
    
    setTasks([...tasks, newTask]);
    setTaskName('');
    setCategory('Work');
    setPriority('medium');
    setHours(1);
  };
  
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : task.progress } 
        : task
    ));
  };
  
  const updateProgress = (id: number, progress: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            progress, 
            completed: progress >= 100 ? true : task.completed
          } 
        : task
    ));
  };
  
  const filteredTasks = filter === 'all' 
    ? tasks 
    : filter === 'completed' 
      ? tasks.filter(task => task.completed) 
      : tasks.filter(task => !task.completed);
  
  return (
    <div className="task-manager-demo">
      <header className="demo-header">
        <h1>Task Manager</h1>
        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{stats.rate}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>
      </header>
      
      <div className="demo-content">
        <div className="task-form">
          <h2>Add New Task</h2>
          <div className="form-group">
            <label>Task Name</label>
            <input 
              type="text" 
              value={taskName} 
              onChange={e => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Hours</label>
              <input 
                type="number" 
                min="0.5" 
                step="0.5" 
                value={hours} 
                onChange={e => setHours(parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <button className="add-task-btn" onClick={addTask}>Add Task</button>
        </div>
        
        <div className="task-list-container">
          <div className="task-list-header">
            <h2>My Tasks</h2>
            <div className="filter-options">
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'active' ? 'active' : ''} 
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                className={filter === 'completed' ? 'active' : ''} 
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
          
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="no-tasks">No tasks found.</div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task-item priority-${task.priority}`}>
                  <div className="task-header">
                    <div className="task-checkbox">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleComplete(task.id)} 
                      />
                    </div>
                    <div className="task-title">
                      <h3 style={task.completed ? { textDecoration: 'line-through' } : {}}>
                        {task.name}
                      </h3>
                      <span className="task-category">{task.category}</span>
                    </div>
                    <div className="task-actions">
                      <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                  
                  <div className="task-details">
                    <div className="progress-container">
                      <label>Progress: {task.progress}%</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={task.progress} 
                        onChange={e => updateProgress(task.id, parseInt(e.target.value))}
                      />
                      <div 
                        className="progress-bar" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="task-meta">
                      <span className="task-hours">{task.hours} hours</span>
                      {task.dueDate && (
                        <span className="task-due-date">Due: {task.dueDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagerDemo; 