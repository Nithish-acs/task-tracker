"use client"
import React, { useState, useEffect } from 'react';
import { account, database } from '../../src/lib/appwrite';
import { ID } from 'appwrite';
import withAuth from '../../src/lib/withAuth';
import { useRouter } from 'next/navigation';

function CreateTask() {
  const router = useRouter();

  // Existing state
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [assigneeList, setAssigneeList] = useState([]);
  const [storyPoints, setStoryPoints] = useState('');
  const [priority, setPriority] = useState('');
  const [reported, setReported] = useState('');
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');

  // New state for popup and status
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [status, setStatus] = useState('');

  const assignees = ["Alice", "Bob", "Charlie"];
  const priorities = ["Low", "Medium", "High"];
  const availableTags = ["Bug", "Feature", "Improvement", "Task"];
  const statuses = ["To Do", "In Progress", "Done"]; // Example statuses

  const getUserList = async () => {
    try {
      const response = await database.listDocuments('66b31bef0026c155d454', '66b36c41003881f1a29d');
      setAssigneeList(response.documents);
    } catch (error) {
      console.error('Error listing users:', error);
    }
  };
  useEffect(() => {
    getUserList();
  }, []);

  const handleTagsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setTags(selectedOptions);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    // Call function when status changes
    handleStatusUpdate(newStatus);
  };

  const handleStatusUpdate = (newStatus) => {
    // Function logic for handling status update
    console.log('Status updated to:', newStatus);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      'task_name': taskName,
      'description': description,
      'assignee': assignee,
      'story_points': parseInt(storyPoints),
      'priority': priority,
      'reporter': reported,
      'tag': tags,
      'status': status,
    };

    try {
      await database.createDocument(
        '66b31bef0026c155d454',
        '66b31bf7001daf18fd22',
        ID.unique(),
        data
      );
      router.push('/');
    } catch (error) {
      alert('Error creating task: ' + error);
      console.error(error);
      setMessage('Error creating task');
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setStatus(task.status); // Assuming task object contains status
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTask) return;
    let data = {
      'task_name': taskName,
      'description': description,
      'assignee': assignee,
      'story_points': parseInt(storyPoints),
      'priority': priority,
      'reporter': reported,
      'tag': tags,
      'status': status,
    };

    try {
      await database.updateDocument(
        '66b31bef0026c155d454',
        '66b31bf7001daf18fd22',
        editTask.$id, // Assuming editTask contains the document ID
        data
      );
      router.push('/');
    } catch (error) {
      alert('Error updating task: ' + error);
      console.error(error);
      setMessage('Error updating task');
    }
  };

  return (
    <div>
      {/* Create Task Form */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Create Task</h1>
        <form onSubmit={handleSubmit}>
          {/* Existing form fields */}
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-600 font-medium mb-2">Tags:</label>
            <select
              id="tags"
              multiple
              value={tags}
              onChange={handleTagsChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            >
              <option value="" disabled>Select Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-gray-600 font-medium mb-2">Task Name:</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-600 font-medium mb-2">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800 resize-y"
              rows="5"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="assignee" className="block text-gray-600 font-medium mb-2">Assignee:</label>
            <select
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            >
              <option value="" disabled>Select assignee</option>
              {assigneeList.map((assignee) => (
                <option key={assignee.name} value={assignee.name}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="storyPoints" className="block text-gray-600 font-medium mb-2">Story Points:</label>
            <input
              type="number"
              id="storyPoints"
              max={13}
              min={1}
              value={storyPoints}
              onChange={(e) => setStoryPoints(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-600 font-medium mb-2">Priority:</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            >
              <option value="" disabled>Select priority</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority.toLowerCase()}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="reported" className="block text-gray-600 font-medium mb-2">Reported:</label>
            <input
              type="text"
              id="reported"
              value={reported}
              onChange={(e) => setReported(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-600 font-medium mb-2">Status:</label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            >
              <option value="" disabled>Select status</option>
              {statuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium w-full hover:bg-blue-700 transition duration-300">Create Task</button>
          {message && <p className="mt-4 text-red-600 text-center text-sm">{message}</p>}
        </form>
      </div>

      {/* Edit Popup */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Same form fields as above */}
              <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-600 font-medium mb-2">Tags:</label>
                <select
                  id="tags"
                  multiple
                  value={tags}
                  onChange={handleTagsChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
                >
                  <option value="" disabled>Select Tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              {/* Other fields */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-600 font-medium mb-2">Status:</label>
                <select
                  id="status"
                  value={status}
                  onChange={handleStatusChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
                >
                  <option value="" disabled>Select status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium w-full hover:bg-blue-700 transition duration-300">Update Task</button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white rounded-md px-4 py-2 font-medium w-full mt-4 hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(CreateTask);
