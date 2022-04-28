import React, { useState, useEffect, useRef } from 'react';

function Test() {
  const [data, setData] = useState(1);
  const dataRef = useRef();

  useEffect(() => {
    console.log('data 1: ', data);

    document.body.addEventListener('keyup', function(evt) {
      // console.log('keyCode: ', evt.keyCode);
      console.log('data in keyup 1: ', data);
      console.log('data in keyup 2: ', dataRef.current);
    });
  }, []);

  // useEffect(() => {
  //   document.body.addEventListener('keyup', function(evt) {
  //     console.log('keyCode: ', evt.keyCode);
  //     console.log('data: ', data);
  //     getData();
  //   });

  //   return () => {
  //     document.body.addEventListener('keyup', function(evt) {
  //       console.log('keyCode 2: ', evt.keyCode);
  //       console.log('data 2: ', data);
  //       getData();
  //     });
  //   }
  // }, []);

  useEffect(() => {
    console.log('data: ', data);
    dataRef.current = data;
  }, [data]);

  // function getData() {
  //   console.log('### data: ', data);
  // }

  return (
    <div>
      <div>data : {data}</div>
      <div>
        <input type='button' value='increase' onClick={() => setData(data + 1)} />
        <input type='button' value='decrease' onClick={() => setData(data - 1)} />
      </div>
    </div>
  );
}

export default Test;
