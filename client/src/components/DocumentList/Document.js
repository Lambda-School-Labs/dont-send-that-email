import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UncontrolledTooltip } from "reactstrap";
import moment from "moment-timezone";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardSubtitle,
  Row,
  Col
} from "reactstrap";

class Document extends Component {
  navigate = () => {
    this.props.history.push(`/email/${this.props.email.id}`);
  };

  render() {
    let { title, addressee, updated, text } = this.props.email;
    updated = moment(updated).calendar();
    console.log(updated);
    return (
      <Card onClick={this.navigate}>
        <CardBody>
          <CardTitle>
            <Row>
              <Col xs={12} style={{ marginBottom: 3 }}>
                <Badge className="titleBadge">Title</Badge> {title}
              </Col>
              <Col xs={12}>
                <Badge className="addresseeBadge">Addressee</Badge> {addressee}
              </Col>
              {updated !== "No versions." && (
                <Col xs={12} style={{ marginTop: 3 }}>
                  <Badge className="updatedBadge">Updated</Badge> {updated}
                </Col>
              )}

              <Col
                xs={12}
                style={{ marginTop: 3, marginBottom: 3 }}
                className="text-truncate"
              >
                <Badge className="textBadge">Text</Badge> {text}
              </Col>
            </Row>
          </CardTitle>
          <Row>
            <Col xs={12}>
              <Button
                id="copy"
                color="secondary"
                onClick={e => {
                  e.stopPropagation();
                  this.props.copy();
                }}
              >
                <FontAwesomeIcon icon="copy" />
                <UncontrolledTooltip placement="left" target="copy">
                  Copy
                </UncontrolledTooltip>
              </Button>
              <Button
                id="Trash"
                color="danger"
                onClick={e => {
                  e.stopPropagation();
                  this.props.delete();
                }}
                style={{ marginLeft: 7 }}
              >
                <FontAwesomeIcon icon="trash" />
                <UncontrolledTooltip placement="right" target="Trash">
                  Trash
                </UncontrolledTooltip>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default withRouter(Document);
