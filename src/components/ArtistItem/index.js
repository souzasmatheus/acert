import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AlbumIcon from '@material-ui/icons/Album';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const styles = {
  iconContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  iconText: {
    fontSize: '12px'
  },
  paper: {
    margin: '10px 20px',
    padding: '20px'
  }
};

class ArtistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showAlbums: false,
      error: null
    };
  }

  searchAlbums = async () => {
    const { artistName } = this.props;

    try {
      const response = await axios.get(
        `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&format=json&api_key=${process.env.REACT_APP_APIKEY}`
      );

      if (response.data.topalbums.album.length > 0) {
        this.setState({
          data: [...response.data.topalbums.album],
          error: null,
          showAlbums: true
        });
      } else {
        this.setState({
          data: [],
          error: 'No album for this artist was found',
          showAlbums: true
        });
      }
    } catch (e) {
      this.setState({
        error: 'There has been an error trying to load data. Please, try again',
        showAlbums: true
      });
    }
  };

  toggleShowAlbums = () => {
    const { data, showAlbums } = this.state;

    if (data.length === 0) {
      this.searchAlbums();
    } else {
      this.setState({ showAlbums: !showAlbums });
    }
  };

  render() {
    const { classes, pic, artistName, listeners } = this.props;
    const { showAlbums, data, error } = this.state;

    const albums = data
      .filter((e, i) => i < 6)
      .map((element, index) => (
        <ListItem key={`listItem-${index + 1}`}>
          <ListItemAvatar>
            <Avatar>
              <AlbumIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${index + 1}- ${element.name}`}
            secondary={element.artist.name}
          />
        </ListItem>
      ));

    return (
      <Grid data-testid="artist-container" item md={4} sm={6} xs={11}>
        <Card>
          <CardHeader
            avatar={<Avatar alt="Artist image" src={pic} />}
            action={
              <div className={classes.iconContainer}>
                <IconButton
                  onClick={() => this.toggleShowAlbums()}
                  size="small"
                >
                  <AlbumIcon fontSize="large" />
                </IconButton>
                <Typography align="center" className={classes.iconText}>
                  Show albums
                </Typography>
              </div>
            }
            title={artistName}
            subheader={listeners}
          />
          {showAlbums && (
            <CardContent>
              <List>{albums}</List>
            </CardContent>
          )}
          {error && (
            <Paper className={classes.paper}>
              <Typography color="error" variant="p" align="center">
                {error}
              </Typography>
            </Paper>
          )}
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(ArtistItem);
