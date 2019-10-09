import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ComplexCard from "components/ComplexCard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
// Moment
import moment from "moment";

const style = {};

class DataHandler extends React.Component {

    constructor(props) {
        super(props);
        let initialState = new Array(30).fill().map((e,id) => ({'id': id+1}));
        this.state = {'sensorData':initialState};
    }

    componentWillReceiveProps(){
        let sensorData = this.state.sensorData;
        let dt = this.props.data;
        dt.time = moment();
        sensorData[dt.id -1] = dt;
        this.setState(sensorData);
    }

    render() {
        return (
            <GridContainer>
                {this.state.sensorData.map(item => <ComplexCard key={item.id} data={item} />)}
            </GridContainer>
        );
    }
}

export default withStyles(style)(DataHandler);