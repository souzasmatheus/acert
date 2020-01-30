import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
  appBar: {},
  heading: {
    margin: '10px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '40px'
  },
  textField: {
    minWidth: '300px'
  },
  btnsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '300px',
    marginTop: '28px'
  },
  errorMsg: {
    margin: '40px auto 0 auto',
    width: '300px'
  }
};

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      error: null
    };
  }

  setValue = value => e => {
    this.setState({ [value]: e.target.value });
  };

  register = () => {
    const { error, ...newUser } = this.state;

    const users = window.localStorage.getItem('users');

    if (users) {
      const matchedUser = JSON.parse(users).filter(
        user => user.email === newUser.email
      )[0];

      if (matchedUser) {
        this.setState({ error: 'This user already exists' });
      } else {
        const parsedUsers = JSON.parse(users);
        parsedUsers.push({ ...newUser, history: [] });

        window.localStorage.setItem('users', JSON.stringify(parsedUsers));
        this.goToLogin();
      }
    } else {
      const newUsers = [{ ...newUser, history: [] }];

      window.localStorage.setItem('users', JSON.stringify(newUsers));

      this.goToLogin();
    }
  };

  goToLogin = () => {
    const { changePage } = this.props;
    changePage(1);
  };

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <>
        <AppBar position="relative" className={classes.appBar}>
          <Typography
            data-testid="register-heading"
            className={classes.heading}
            variant="h4"
            align="center"
          >
            Register
          </Typography>
        </AppBar>

        {error && (
          <Typography
            className={classes.errorMsg}
            color="error"
            variant="h5"
            align="center"
          >
            {error}
          </Typography>
        )}

        <form
          className={classes.form}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              this.register();
            }
          }}
        >
          <TextField
            className={classes.textField}
            label="Name"
            placeholder="Name"
            onChange={this.setValue('name')}
          />
          <TextField
            className={classes.textField}
            label="E-mail"
            placeholder="E-mail"
            onChange={this.setValue('email')}
          />
          <TextField
            className={classes.textField}
            label="Password"
            placeholder="Password"
            onChange={this.setValue('password')}
            type="password"
          />
          <div className={classes.btnsContainer}>
            <Button
              data-testid="go-to-login"
              variant="outlined"
              onClick={() => this.goToLogin()}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => this.register()}
              data-testid="register-btn"
            >
              Register
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default withStyles(styles)(RegisterPage);
