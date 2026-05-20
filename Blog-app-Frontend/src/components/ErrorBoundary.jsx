import React from 'react'
import { useRouteError } from 'react-router'
function ErrorBoundary() {
    const {data,status,statusText} = useRouteError();
    console.error("Route Error:", error);
  return (
    <div>
        <h1>Something went wrong!</h1>  
        <p>Status: {status}</p>
        <p>Status Text: {statusText}</p>
        <p>Data: {JSON.stringify(data)}</p>
      
    </div>
  )
}

export default ErrorBoundary
