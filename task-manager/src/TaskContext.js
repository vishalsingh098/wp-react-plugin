/* global taskManager */

import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const apiUrl = taskManager.apiUrl;

    // Fetch all tasks
    const fetchTasks = async () => {
        setLoading(true);
        const response = await fetch(apiUrl + "/get-tasks");
        const data = await response.json();
        setTasks(data);
        setLoading(false);
    };

    // Add a new task
    const addTask = async (task) => {
        const response = await fetch(apiUrl + "/save-tasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': taskManager.nonce,
            },
            body: JSON.stringify(task),
        });
        const newTask = await response.json();
        setMessage('Task Added Successfully.');
        fetchTasks();
        setTasks([...tasks, newTask]);
    };

    // Update a task
    const updateTask = async (id, updatedTask) => {
        const response = await fetch(`${apiUrl + "/update-tasks"}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': taskManager.nonce,
            },
            body: JSON.stringify(updatedTask),
        });
        const updatedData = await response.json();
        setMessage('Task Updated Successfully.');
        fetchTasks();
        setTasks(tasks.map(task => (task.id === id ? updatedData : task)));
    };

    // Delete a task
    const deleteTask = async (id) => {
        await fetch(`${apiUrl + "/delete-tasks" }/${id}`, {
            method: 'DELETE',
            headers: {
                'X-WP-Nonce': taskManager.nonce,
            },
        });
        setMessage('Task Deleted Successfully.');
        fetchTasks();
        setTasks(tasks.filter(task => task.id !== id));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, loading, message, addTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
