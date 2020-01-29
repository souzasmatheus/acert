import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      user: null
    };
  }

  updateHistory = query => {
    const { user } = this.state;

    const users = JSON.parse(window.localStorage.getItem('users'));

    users.forEach(u => {
      if (u.email === user.email) {
        u.history.push(query);

        this.setState({
          user: { name: u.name, history: u.history, email: u.email }
        });
      }
    });

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  logout = () => {
    this.setState({ currentPage: 1, user: null });
  };

  login = user => {
    const { password, ...loggedUser } = user;

    this.setState({ user: loggedUser }, () => this.changePage(3));
  };

  changePage = page => {
    this.setState({ currentPage: page });
  };

  render() {
    const { currentPage, user } = this.state;

    switch (currentPage) {
      case 1:
        return <LoginPage login={this.login} changePage={this.changePage} />;
      case 2:
        return <RegisterPage changePage={this.changePage} />;
      case 3:
        return (
          <HomePage
            updateHistory={this.updateHistory}
            logout={this.logout}
            user={user}
          />
        );
      default:
        return <RegisterPage />;
    }
  }
}

export default App;
