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

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  setValue = value => e => {
    this.setState({ [value]: e.target.value }, () =>
      console.log(this.state[value])
    );
  };

  login = () => {
    const { login } = this.props;
    const { email, password } = this.state;
    const users = window.localStorage.getItem('users');

    if (users) {
      const matchedUser = JSON.parse(users).filter(
        user => user.email === email
      )[0];

      if (matchedUser && matchedUser.password === password) {
        login(matchedUser);
      } else {
        this.setState({
          error: 'E-mail or password is invalid.'
        });
      }
    } else {
      this.setState({
        error: 'No users registered yep. Please, sign up first.'
      });
    }
  };

  goToRegister = () => {
    const { changePage } = this.props;
    changePage(2);
  };

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <>
        <AppBar position="relative" className={classes.appBar}>
          <Typography className={classes.heading} variant="h4" align="center">
            Login
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

        <form className={classes.form}>
          <TextField
            className={classes.textField}
            label="E-mail"
            onChange={this.setValue('email')}
          />
          <TextField
            className={classes.textField}
            label="Password"
            onChange={this.setValue('password')}
            type="password"
          />
          <div className={classes.btnsContainer}>
            <Button variant="outlined" onClick={() => this.goToRegister()}>
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => this.login()}
            >
              Login
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default withStyles(styles)(LoginPage);
