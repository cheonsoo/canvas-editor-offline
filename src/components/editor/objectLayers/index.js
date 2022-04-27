import React, { useState, useEffect } from 'react';
import DraggableList from '../../common/draggableList';

const ObjectLayers = ({ data = [], handler = () => {} }) => {
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
    // setItems([ ...data ]);
  }, [data]);

  function handleChange(sorted) {
    handler(sorted);
  };

  return (<DraggableList data={items} handler={handleChange} />);
};

export default ObjectLayers;
