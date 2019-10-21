import React from "react";
import PropTypes from "prop-types";
//mqtt
import { Connector } from 'mqtt-react';
import {subscribe} from 'mqtt-react';
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import SvgIcon from '@material-ui/core/SvgIcon';
// Components
import _DataHandler from "components/DataHandler.jsx";
// Font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
//style
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class App extends React.Component {

  handleClick = () => {
    window.open("https://github.com/9zdot/makersdash", "_blank")
  };

  AmdocsIcon(classes, props) {
    return (
        <SvgIcon className={classes.amdocsIcon} {...props} >
            <path d="M17.495,15.9383333 C17.495,17.1441667 16.5133333,18.1258333 15.3075,18.1258333 L6.56166667,18.1258333 C5.355,18.1258333 4.37416667,17.1441667 4.37416667,15.9383333 C4.37416667,14.7325 5.355,13.7508333 6.56166667,13.7508333 L17.495,13.7508333 L17.495,15.9383333 Z M15.3075,0.6275 L2.46666667,0.6275 L3.7325,5.00083333 L15.3075,5.00083333 C16.5133333,5.00083333 17.495,5.9825 17.495,7.18916667 L17.495,9.37666667 L6.56166667,9.37666667 C2.94333333,9.37666667 0,12.32 0,15.9383333 C0,19.5566667 2.94333333,22.5 6.56166667,22.5 L15.3075,22.5 C18.925,22.5 21.8691667,19.5566667 21.8691667,15.9383333 L21.8691667,7.18916667 C21.8691667,3.57083333 18.925,0.6275 15.3075,0.6275 Z" id="Fill-1"></path>
            <polyline id="Fill-2" points="28.1283333 9.37666667 24.1416667 9.37666667 24.1416667 13.7508333 29.3933333 13.7508333 28.1283333 9.37666667"></polyline>
        </SvgIcon>
    )
  }

  render() {

    const { classes } = this.props;

    const DataHandler = subscribe({topic: 'makers'})(_DataHandler);

    return (
    <Connector mqttProps="ws://192.168.0.100:9001">
      <div className={classes.makerdash}>
         <DataHandler />
        <div className={classes.footerApp}>
            <Chip className={classes.chip}
                variant="outlined"
                avatar={
                    <Avatar className={classes.chipAvatar}>
                        {this.AmdocsIcon(classes, null)}
                    </Avatar>
                }
                label="Amdocs Makers"
            />
            <Chip className={classes.chip}
                variant="outlined"
                avatar={
                    <Avatar className={classes.chipAvatar}>
                        <FaceIcon />
                    </Avatar>
                }
                label="Created by WMACEDO"
            />
            <Chip className={classes.chip}
                variant="outlined"
                avatar={
                    <Avatar className={classes.chipAvatar}>
                        <FontAwesomeIcon icon={faGithub} />
                    </Avatar>
                }
                label="github.com/9zdot/makers"
                clickable
                onClick={this.handleClick}
            />
        </div>
      </div>
      </Connector>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);