import React, { useContext, useState } from 'react';
import { TaskContext } from '../TaskContext';

const TaskForm = ({ taskToEdit = null, onSubmit = () => {} }) => {
    const { addTask, updateTask } = useContext(TaskContext);
    const [task, setTask] = useState(
        taskToEdit || { title: '', content: '', status: 'pending' }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskToEdit) {
            updateTask(taskToEdit.id, task);
        } else {
            addTask(task);
        }
        onSubmit();  // Call onSubmit to close edit mode in TaskTable
        setTask({ title: '', content: '', status: 'pending' });
    };

    return (
        <form onSubmit={handleSubmit} style={ (taskToEdit === 'Update') ? {display: 'inline'} : {display: 'flex', alignItems: 'center', gap: '2rem'} }>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={task.title}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="content"
                placeholder="Content"
                value={task.content}
                onChange={handleChange}
            />
            <select name="status" value={task.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
            <button type="submit"style={{marginRight: '1rem', backgroundColor: '#0073aa', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>{taskToEdit ? 'Update' : 'Add'} Task</button>
        </form>
    );
};

export default TaskForm;
