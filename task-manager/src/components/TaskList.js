import React, { useState, useContext } from 'react';
import { TaskContext } from '../TaskContext';
import TaskForm from './TaskForm';

const TaskList = () => {
    const { tasks, deleteTask, updateTask, loading } = useContext(TaskContext);
    const [editTaskId, setEditTaskId] = useState(null);

    const columnWidth = '200px';

    // Toggle editing for a selected task
    const handleEditClick = (taskId) => {
        setEditTaskId(taskId);
    };

    // Finish editing
    const handleUpdateSubmit = () => {
        setEditTaskId(null);
    };

    return (
        <div>
            <h2>Task List</h2>
            <table className="wp-list-table widefat striped table-view-list" style={{width: 'fit-content'}}>
                <thead>
                    <tr>
                        <th style={{ width: columnWidth }}>Title</th>
                        <th style={{ width: columnWidth }}>Content</th>
                        <th style={{ width: columnWidth }}>Status</th>
                        <th style={{ width: `calc(${columnWidth} * 4)` }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {loading ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                                Loading...
                            </td>
                        </tr>
                    ) : ( tasks.length === 0 ) ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                                No tasks found
                            </td>
                        </tr>
                    ) : (
                        tasks.map(task => (
                            <tr key={task.id}>
                              <td style={{ width: columnWidth }}>{task.title}</td>
                              <td style={{ width: columnWidth }}>{task.content}</td>
                              <td style={{ width: columnWidth }}>{task.status}</td>
                              <td style={{ width: `calc(${columnWidth} * 3)` }}>
                                    {editTaskId === task.id ? (
                                        <TaskForm
                                            taskToEdit={task}
                                            onSubmit={handleUpdateSubmit}
                                        />
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(task.id)} style={{marginRight: '1rem', backgroundColor: '#0073aa', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>Edit</button>
                                            <button onClick={() => deleteTask(task.id)} style={{marginRight: '1rem', backgroundColor: '#0073aa', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;

