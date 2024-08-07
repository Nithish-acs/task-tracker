"use client"
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faEllipsisH, faArrowDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/solid';
import withAuth from '../src/lib/withAuth';
import { database } from '@/src/lib/appwrite';

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [tasks, setTasks] = useState([]);

  const getTaskList = () => {
    try {
      database.listDocuments('66b31bef0026c155d454', '66b31bf7001daf18fd22')
        .then(response => {
          setTasks(response.documents);
          console.log('Documents:', response);
        }, error => {
          console.error('Error listing documents:', error);
        });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  useEffect(() => {
    getTaskList();
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
    router.push('/createTask')
  }

  const handleLogout = () => {
    router.push('/logout')
  }

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalContent({ ...modalContent, [name]: value });
  };

  const handleSave = () => {
    console.log("testing", isEdit);

    setTasks(tasks.map((task) => {
      console.log(task)
      task.$id === modalContent.$id ? { ...task, ...modalContent } : task
    }));

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

  // const assignees = [...new Set(tasks.map(task => task.assignee))];

  return (
    <div className="container mx-auto p-4">

      <div className="mb-4 flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedAssignee === '' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedAssignee('')}
        >
          All
        </button>
        {/* {assignees.map(assignee => (
          <button
            key={assignee}
            className={`px-4 py-2 rounded ${selectedAssignee === assignee ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedAssignee(assignee)}
          >
            {assignee}
          </button>
        ))} */}
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
              <div className="grid grid-cols-[2fr_1fr] gap-8 border border-gray-300 rounded-lg h-full">
                {/* First Column */}
                <div className="space-y-4 border-r border-gray-300 pr-8 flex flex-col">
                  <div className="space-y-4 border-b border-gray-300 pb-4">
                    <h3 className="text-2xl font-medium leading-6 text-gray-900">{modalContent.title}</h3>
                    <div className="space-y-2">
                      <p className="text-lg text-gray-700 font-semibold">Description:</p>
                      <p className="text-lg text-gray-700">{modalContent.description}</p>
                    </div>
                  </div>
                </div>

                {/* Second Column */}
                <div className="space-y-4 pl-8">
                  <p className="text-lg text-gray-700">
                    <strong>Assignee:</strong> {modalContent.assignee}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Priority:</strong> {modalContent.priority}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Story Points:</strong> {modalContent.storyPoints}
                  </p>
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