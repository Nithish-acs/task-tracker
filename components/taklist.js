// components/TaskList.js
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './board';

const TaskList = ({ tasks }) => {
  return (
    <Droppable droppableId="tasklist">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ padding: 16, width: 300, minHeight: 500, background: '#f0f0f0' }}
        >
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
