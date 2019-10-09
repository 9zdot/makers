import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Update from "@material-ui/icons/Update";
// core Components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardBody from "components/Card/CardBody.jsx";
// Moment
import moment from "moment";
// @fortawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerThreeQuarters,
        faFireAlt,
        faTint,
        faLightbulb,
        faSquare,
        faMicrochip} from '@fortawesome/free-solid-svg-icons';

const style = {
    gbdata: {
        fontSize: "20px",
        display: "inline-block",
        marginTop: "5px"
    },
    ftext: {
        fontSize: "14px",
    },
    microchip: {
        float: "left",
        margin: "-17px -10px -20px -18px !important"

    }
};

function getArduinoStatus(item) {
        if (item && item.time) {
            if (moment() < moment(item.time).add(30, 's')) {
                return "success";
            } else {
                return "warning";
            }
        }
        return "danger";
    }

    function getTimePassed(cl, item) {
        if (item && item.time) {
            return (
                <span className={cl.ftext}>
                    <Update />
                    {" "+moment(item.time).fromNow()}
                </span>
            );
        }
        return "No connection"
    }

class ComplexCard extends React.Component {

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ now: moment() }), 29000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { classes, data } = this.props;
        let boxStatus = getArduinoStatus(data);

        return (
            <GridItem xs={12} sm={6} md={2} key={data.id} >
                <Card>
                    <CardHeader color={boxStatus} stats icon>
                        <CardIcon color={boxStatus}>
                            <div className={classes.microchip}>
                                <FontAwesomeIcon icon={faMicrochip} inverse transform="shrink-8" />
                            </div>
                            <h7>{"Arduino #"+data.id}</h7>
                        </CardIcon>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem md={6}>
                                <span className={classes.gbdata}>
                                    <span className="fa-layers fa-fw">
                                        <FontAwesomeIcon icon={faSquare} color="dimgray" transform="grow-2"/>
                                        <FontAwesomeIcon icon={faThermometerThreeQuarters} inverse />
                                    </span>
                                    {data && data.temp ? data.temp : "NA"}
                                </span>
                            </GridItem>
                            <GridItem md={6}>
                                <span className={classes.gbdata}>
                                    <span className="fa-layers fa-fw">
                                        <FontAwesomeIcon icon={faSquare} color="dimgray" transform="grow-2"/>
                                        <FontAwesomeIcon icon={faTint} inverse />
                                    </span>
                                    {data && data.humd ? data.humd : "NA"}
                                </span>
                            </GridItem>
                            <GridItem md={6}>
                                <span className={classes.gbdata}>
                                    <span className="fa-layers fa-fw">
                                        <FontAwesomeIcon icon={faSquare} color="dimgray" transform="grow-2"/>
                                        <FontAwesomeIcon icon={faLightbulb} inverse />
                                    </span>
                                    {data && data.light ? data.light : "NA"}
                                </span>
                            </GridItem>
                            <GridItem md={6}>
                                <span className={classes.gbdata}>
                                    <span className="fa-layers fa-fw">
                                        <FontAwesomeIcon icon={faSquare} color="dimgray" transform="grow-2"/>
                                        <FontAwesomeIcon icon={faFireAlt} inverse />
                                    </span>
                                    {data && data.gas ? data.gas : "NA"}
                                </span>
                            </GridItem>
                        </GridContainer>
                    </CardBody>
                    <CardFooter stats>
                        {getTimePassed(classes, data)}
                    </CardFooter>
                </Card>
            </GridItem>
        );
    }
}

export default withStyles(style)(ComplexCard);