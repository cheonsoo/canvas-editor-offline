import React, { useState, useEffect } from 'react';
import Example from './example.js'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function DraggableList({ data = [], handler = () => {} }) {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Example data={data} handler={handler} />
      </DndProvider>
    </div>
  )
}

export default DraggableList;
