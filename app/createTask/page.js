"use client";
import { useState } from 'react';
import { account, database } from '../../src/lib/appwrite';
import withAuth from '../../src/lib/withAuth';

function CreateTask() {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [storyPoints, setStoryPoints] = useState('');
  const [priority, setPriority] = useState('');
  const [reported, setReported] = useState('');
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');

  const assignees = ["Alice", "Bob", "Charlie"]; // Example assignees
  const priorities = ["Low", "Medium", "High"]; // Example priorities
  const availableTags = ["Bug", "Feature", "Improvement", "Task"]; // Example tags

  const handleTagsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setTags(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    var data = {
      'task_name': taskName,
      'description': description,
      'assignee': assignee,
      'story_points': parseInt(storyPoints),
      'priority': priority,
      'reporter': reported,
      'tag': "66b3563d001dbf2a9471",
    }
    e.preventDefault();
    try {
      database.createDocument(
        '66b31bef0026c155d454', // Replace with your database ID
        '66b31bf7001daf18fd22', // Replace with your collection ID
        'unique()', // Use unique() for automatic ID generation
        data
      );
      alert('Task created successfully');
    } catch (error) {
      alert('Error creating task' + error);
      console.error(error);
      setError('Error creating task');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Create Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-600 font-medium mb-2">Tags:</label>
          <select
            id="tags"
            value={tags}
            onChange={handleTagsChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
          >
            <option value="" disabled>Select assignee</option>
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
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
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

        <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium w-full hover:bg-blue-700 transition duration-300">Create {tags}</button>
        {message && <p className="mt-4 text-red-600 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}

export default withAuth(CreateTask);