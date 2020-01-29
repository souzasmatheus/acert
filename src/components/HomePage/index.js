import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import ExitIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';

import ArtistItem from '../ArtistItem';
import History from '../History';

const styles = {
  artistsContainer: {
    padding: '40px 16px'
  },
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: '40px',
    display: 'flex',
    alignItems: 'center'
  },
  searchBtn: {
    marginLeft: '10px'
  },
  toolBar: {
    justifyContent: 'space-between'
  },
  heading: {
    margin: '10px 0'
  },
  errorMsg: {
    margin: '40px auto 0 auto',
    width: '300px'
  }
};

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      showHistory: false,
      data: [],
      error: null
    };
  }

  handleInput = query => {
    this.setState({ query: query.trim() });
  };

  search = async () => {
    const { updateHistory } = this.props;
    const { query } = this.state;

    try {
      const response = await axios.get(
        `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&format=json&api_key=${process.env.REACT_APP_APIKEY}`
      );

      this.setState(
        {
          data: [...response.data.results.artistmatches.artist],
          error: null
        },
        () => updateHistory(query)
      );
    } catch (e) {
      this.setState({
        error: 'There has been an error trying to load data. Please, try again'
      });
    }
  };

  render() {
    const { classes, logout, user } = this.props;
    const { error, data } = this.state;

    const artists = data.map((element, index) => (
      <ArtistItem
        key={`artist-${index + 1}`}
        pic={element.image[1]['#text']}
        artistName={element.name}
        listeners={element.listeners}
      />
    ));

    return (
      <div className={classes.homeContainer}>
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <History history={user.history} />
            <Typography className={classes.heading} align="center" variant="h4">
              Olá, {user.name}!
            </Typography>
            <IconButton onClick={() => logout()} edge="end" color="inherit">
              <ExitIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container className={classes.inputContainer} maxWidth="sm">
          <TextField
            fullWidth
            className={classes.textField}
            onChange={e => this.handleInput(e.target.value)}
            placeholder="type to search artists"
            variant="outlined"
            size="small"
          />
          <Button
            className={classes.searchBtn}
            size="large"
            variant="outlined"
            color="primary"
            onClick={() => this.search()}
          >
            Search
          </Button>
        </Container>

        {error && (
          <Grid
            style={{ padding: '40px 16px' }}
            xs={12}
            justify="center"
            container
          >
            <Typography
              className={classes.errorMsg}
              color="error"
              variant="h5"
              align="center"
            >
              {error}
            </Typography>
          </Grid>
        )}

        <Grid
          className={classes.artistsContainer}
          item
          xs={12}
          justify="center"
          container
          spacing={2}
        >
          {artists}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
