import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <RegisterPage />
      </div>
    );
  }
}

export default App;
