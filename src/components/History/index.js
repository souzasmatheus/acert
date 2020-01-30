import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import HistoryIcon from '@material-ui/icons/History';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { history } = this.props;

    const items = history
      .filter((e, i) => i < 10)
      .map((element, index) => (
        <MenuItem
          key={`menuItem-${index + 1}`}
          disabled
          onClick={() => this.handleClose()}
        >
          {element}
        </MenuItem>
      ));

    return (
      <>
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={e => this.handleClick(e)}
          edge="start"
          color="inherit"
        >
          <HistoryIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => this.handleClose()}
        >
          {items}
        </Menu>
      </>
    );
  }
}

export default History;
