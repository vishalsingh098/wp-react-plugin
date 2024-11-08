import React from 'react';
import { TaskProvider } from './TaskContext';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AdminNotice from './components/AdminNotice';

const App = () => {
    return (
        <TaskProvider>
            <div className="App">
                <AdminNotice />
                <br />
                <h1>Task Manager</h1>
                <TaskForm />
                <TaskList />
            </div>
        </TaskProvider>
    );
};

export default App;
