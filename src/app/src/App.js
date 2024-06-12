// import './App.css';
// import logo from './logo.svg';


// export function App() {

//   return (
//     <div className="App">
//       <div>
//         <h1>List of TODOs</h1>
//         <li>Learn Docker</li>
//         <li>Learn React</li>
//       </div>
//       <div>
//         <h1>Create a ToDo</h1>
//         <form onSubmit={}>
//           <div>
//             <label for="todo">ToDo: </label>
//             <input type="text" />
//           </div>
//           <div style={{"marginTop": "5px"}}>
//             <button>Add ToDo!</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch TODOs');
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching TODOs:', error);
        // Optionally, display an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos(); // Call the function on component mount
  }, []); // Empty dependency array ensures it runs only once

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const todoText = document.getElementById('todo').value.trim();

    // Input validation (optional, but recommended):
    if (!todoText) {
      alert('Please enter a TODO description.');
      return;
    }

    setIsLoading(true);

    try {
      // Create the TODO using a POST request:
      const createResponse = await fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todoText }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create TODO');
      }

      // After successful creation, fetch all TODOs again using GET:
      const response = await fetch('http://localhost:8000/todos/');
      if (!response.ok) {
        throw new Error('Failed to fetch TODOs');
      }
      const data = await response.json();
      setTodos(data); // Update state with all TODOs including the newly created one
    } catch (error) {
      console.error('Error:', error);
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false);
      document.getElementById('todo').value = ''; // Clear the input field after successful creation
    }
  };

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        {isLoading && <p>Loading TODOs...</p>} {/* Optional loading message */}
        {!isLoading && todos.length > 0 && (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input type="text" id="todo" />
          </div>
          <div style={{ marginTop: "5px" }}>
            <button type="submit">Add ToDo!</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
