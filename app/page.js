"use client"
// pages/index.js
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [tasks, setTasks] = useState([
    { "id": 1, "title": "Task 1", "status": "ToDo","assignee":"Nithish","descr":"Test","priority":"High" },
    { "id": 2, "title": "Task 2", "status": "InProgress" },
    { "id": 3, "title": "Task 3", "status": "Done" },
    { "id": 4, "title": "Task 4", "status": "ToDo" },
    { "id": 5, "title": "Task 5", "status": "InProgress" }
  ])

  const openModal = (content) => {
    setModalContent(content);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const renderTasks = (status) => {
    return tasks.filter(task => task.status === status).map(task => (
      <> <div
      key={task.id}
      className="p-4 mb-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 border border-gray-300"
      onClick={() => openModal(task.title)}
    >
      <div className="font-bold">{task.title}</div>
      <div className="text-sm text-gray-600">{task.assignee}</div>
    </div>
        </>

    ));
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4">ToDo</h2>
          {renderTasks('ToDo')}
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4">InProgress</h2>
          {renderTasks('InProgress')}
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Done</h2>
          {renderTasks('Done')}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{modalContent}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Details about {modalContent} tasks.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
