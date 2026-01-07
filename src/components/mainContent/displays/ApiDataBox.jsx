import React from 'react';
import DefaultDisplay from './DefaultDisplay';
import './ApiDataBox.css';

const ApiDataBox = ({title, loading, error, children}) => {
  let content;
  if (loading) {
    content =  (
      <DefaultDisplay title="Loading">
        "Please wait while we fetch the data..."
      </DefaultDisplay>
    )
  } else if (error) {
    content = (
      <DefaultDisplay title="Error">
        {`An error occurred: ${error}`}
      </DefaultDisplay>
    );
  } else {
    content = (
    <DefaultDisplay title={title}>
      {children}
    </DefaultDisplay>
    );
  } 

  return (
      <div className="ApiDataBoxDiv">
        {content}
      </div>
  ); 
}

export default ApiDataBox

