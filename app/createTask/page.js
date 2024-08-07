// components/CreateTaskForm.js

"use client";
import { useState } from 'react';

export default function CreateTask() {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [storyPoints, setStoryPoints] = useState('');
    const [priority, setPriority] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Your Appwrite endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); 
        e.preventDefault();
        // Process form submission here
        // Example: Send data to an API endpoint
        if (storyPoints <= 0) {
            setMessage('Story Points must be greater than zero.');
            return;
        }
        var data = {
            taskName: taskName,
            description: description,
            assignee: assignee,
            storyPoints: storyPoints,
            priority: priority,
        };
        console.log(data);
        try {
            const response = await fetch('/api/create-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskName,
                    description,
                    assignee,
                    storyPoints,
                    priority,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setMessage('Task created successfully!');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="form-container">
            <h1>Create Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="taskName">Task Name:</label>
                    <input
                        type="text"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="assignee">Assignee:</label>
                    <input
                        type="text"
                        id="assignee"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="storyPoints">Story Points:</label>
                    <input
                        type="number"
                        id="storyPoints"
                        value={storyPoints}
                        onChange={(e) => setStoryPoints(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit" className="button">Create Task</button>
                {message && <p className="message">{message}</p>}
            </form>
            <style jsx>{`
                .form-container {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 {
                    margin-bottom: 20px;
                    color: #333;
                    text-align: center;
                }
                .input-group {
                    margin-bottom: 15px;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #555;
                    font-weight: 500;
                }
                .input-group input,
                .input-group select,
                .input-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }
                .input-group textarea {
                    resize: vertical;
                    height: 100px;
                }
                .button {
                    background: #0070f3;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    padding: 12px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s;
                    width: 100%;
                }
                .button:hover {
                    background: #005bb5;
                }
                .message {
                    margin-top: 20px;
                    color: #e74c3c;
                    font-size: 14px;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
