import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RecipeList from './RecipeList'; // Change this line
// Remove the import statement for reportWebVitals

ReactDOM.render(
  <React.StrictMode>
    <RecipeList />
  </React.StrictMode>,
  document.getElementById('root')
);

// Remove the call to reportWebVitals();
