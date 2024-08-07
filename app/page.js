"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faEllipsisH, faArrowDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import withAuth from '../src/lib/withAuth';
import { database } from '@/src/lib/appwrite';

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [tasks, setTasks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [statusOptions] = useState(['ToDo', 'InProgress', 'Done']); // Status options

  const getUserList = async () => {
    try {
      const response = await database.listDocuments('66b31bef0026c155d454', '66b36c41003881f1a29d');
      setUsersList(response.documents);
      console.log('Users:', response);
    } catch (error) {
      console.error('Error listing users:', error);
    }
  };

  const getTaskList = async () => {
    try {
      const response = await database.listDocuments('66b31bef0026c155d454', '66b31bf7001daf18fd22');
      setTasks(response.documents);
      console.log('Documents:', response);
    } catch (error) {
      console.error('Error listing documents:', error);
    }
  };

  useEffect(() => {
    getTaskList();
    getUserList();
  }, []);

  const router = useRouter();

  const openModal = (content, isEdit) => {
    setModalContent(content);
    setIsEdit(isEdit);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent({});
    setIsEdit(false);
  };

  const navigateToCreateTask = () => {
    router.push('/createTask');
  };

  const handleLogout = () => {
    router.push('/logout');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalContent({ ...modalContent, [name]: value });
  };

  const handleSave = () => {
    setTasks(tasks.map(task => (
      task.$id === modalContent.$id ? { ...task, ...modalContent } : task
    )));
    var updateData = {
      task_name: modalContent.task_name,
      description: modalContent.description,
      assignee: modalContent.assignee,
      story_points: modalContent.story_points,
      priority: modalContent.priority,
      reporter: modalContent.reporter,
      tag: modalContent.tag,
      status: modalContent.status,
    };
    database.updateDocument('66b31bef0026c155d454', '66b31bf7001daf18fd22', modalContent.$id, updateData);
    closeModal();
  };

  const TaskCard = ({ task }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative p-4 mb-5 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 border border-blue-300 max-w-xs mx-auto"
        onClick={() => openModal(task, false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: '80%' }}
      >
        <div className="font-bold mb-2">{task.task_name}</div>
        {task.tag && (
          <div className="text-center mb-2">
            <span
              className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full"
              style={{ backgroundColor: '#D6A9E2', width: '80%', borderRadius: 5 }}
            >
              {task.tag}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-2 mb-2">
          <span
            className="flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-200"
            style={{ borderRadius: '50%', height: '25px', width: '25px', lineHeight: '25px' }}
          >
            {task.story_points}
          </span>
          <span className="flex items-center space-x-2">
            <FontAwesomeIcon
              icon={task.priority === 'High' ? faArrowUp : task.priority === 'Medium' ? faEllipsisH : faArrowDown}
              style={{ color: task.priority === 'High' ? '#f56565' : task.priority === 'Medium' ? '#f6ad55' : '#63b3ed', fontSize: '20px' }}
            />
          </span>
        </div>
        <div className="text-sm text-gray-600">{task.assignee}</div>
        {isHovered && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                openModal(task, true);
              }}
            >
              <FontAwesomeIcon icon={faEdit} style={{ color: '#4A5568' }} />
            </button>
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setTasks(tasks.filter(t => t.$id !== task.$id));
              }}
            >
              <FontAwesomeIcon icon={faTrash} style={{ color: '#E53E3E' }} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTasks = (status) => {
    return tasks
      .filter(task => task.status === status && (selectedAssignee === '' || task.assignee === selectedAssignee))
      .map(task => (
        <TaskCard key={task.$id} task={task} />
      ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedAssignee === '' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedAssignee('')}
        >
          All
        </button>
        {usersList.map(user => (
          <button
            key={user.$id}
            className={`px-4 py-2 rounded ${selectedAssignee === user.name ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedAssignee(user.name)}
          >
            {user.name}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <button
          className="bg-gradient-to-r from-teal-400 to-teal-600 text-white py-2 px-6 rounded-lg shadow-xl hover:from-teal-500 hover:to-teal-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={navigateToCreateTask}
        >
          Add Task
        </button>
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-xl hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-blue-800">ToDo</h2>
          {renderTasks('ToDo')}
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">InProgress</h2>
          {renderTasks('InProgress')}
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-green-800">Done</h2>
          {renderTasks('Done')}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div
            className="bg-white rounded-lg shadow-lg z-50 flex flex-col"
            style={{ width: '80%', maxWidth: '800px', height: '80vh', maxHeight: '90vh' }}
          >
            <div className="flex-1 p-8 overflow-auto">
              <h3 className="text-2xl font-medium leading-6 text-gray-900">{isEdit ? 'Edit Task' : 'Task Details'}</h3>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700">Task Name</span>
                      <input
                        type="text"
                        name="task_name"
                        value={modalContent.task_name || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Status</span>
                      <select
                        name="status"
                        value={modalContent.status || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Description</span>
                      <textarea
                        name="description"
                        value={modalContent.description || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        rows="4"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Story Points</span>
                      <input
                        type="number"
                        name="story_points"
                        value={modalContent.story_points || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Priority</span>
                      <select
                        name="priority"
                        value={modalContent.priority || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Assignee</span>
                      <select
                        name="assignee"
                        value={modalContent.assignee || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      >
                        <option value="">Select Assignee</option>
                        {usersList.map(user => (
                          <option key={user.$id} value={user.name}>{user.name}</option>
                        ))}
                      </select>
                    </label>

                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(Home);
