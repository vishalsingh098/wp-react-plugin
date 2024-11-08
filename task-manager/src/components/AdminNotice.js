import React, { useState, useContext } from 'react';
import { TaskContext } from '../TaskContext';

const AdminNotice = () => {
    const { message } = useContext(TaskContext);

    return (
        <div>
            {/* Admin Notice */}
            {message ? (
                <div className="notice notice-success is-dismissible">
                    <p>{message}</p>
                </div>
            ) : ('')}
        </div>
    );
};

export default AdminNotice;
