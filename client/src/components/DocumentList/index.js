import React, { Component } from "react";
import axios from "axios";
import {
  UncontrolledAlert,
  Card,
  CardBody,
  CardTitle,
  CardColumns,
  Col,
  Container,
  Row,
  Button
} from "reactstrap";
import { withRouter } from "react-router-dom";
import Document from "./Document";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

class DocumentList extends Component {
  state = {
    emails: [],
    componentState: 0
  };

  componentDidMount = async () => {
    this.fetchEmails();
  };

  fetchEmails = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/emails", {
        withCredentials: true
      })
      .then(({ data }) => {
        const { emails, err } = data;

        if (emails) {
          this.setState({ emails });
        }
      });
  };

  emailElements = () =>
    /* I think we have to check for message ID. If it is already being mapped. Then skip others with the same ID*/
    this.state.emails.map((e, i) => (
      <Document
        key={i}
        email={e}
        copy={this.copyEmail(e)}
        delete={() => this.deleteEmail(e)}
      />
    ));

  emailCreateButton = param => (
    <Card
      className={param !== "single" ? "documentCard" : null}
      onClick={this.redirectToCreateEmailPage}
      style={{ width: "100%", height: 188.5 }}
    >
      <CardBody style={{ textAlign: "center" }}>
        <CardTitle style={{ marginTop: 5, marginBottom: 20 }}>
          <h3>Create New E-mail</h3>
        </CardTitle>
        <Button size="lg" color="danger">
          <FontAwesomeIcon icon="plus-circle" size="3x" />
        </Button>
      </CardBody>
    </Card>
  );

  redirectToCreateEmailPage = () => {
    if (this.props.user.subscribed === true || this.state.emails.length < 5) {
      this.props.history.push("/email");
    } else {
      this.setState({ componentState: 1 });
    }
  };
  deleteEmail = e => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL + "/emails/"}${e.id}`, {
        withCredentials: true
      })
      .then(res => {
        if (this.state.componentState === 1) {
          this.setState({ componentState: 0 }, () => this.fetchEmails());
        } else {
          this.fetchEmails();
        }
      })
      .catch(err => err);
  };

  copyEmail = ({ title, addressee, text }) => e => {
    if (this.props.user.subscribed === true || this.state.emails.length < 5) {
      text = text || "";
      const version = { text };
      const body = { email: { title, addressee }, version: version };
      axios
        .post(process.env.REACT_APP_BACKEND_URL + "/emails", body, {
          withCredentials: true
        })
        .then(({ data }) => {
          if (data.id) {
            this.fetchEmails();
          }
        });
    } else {
      this.setState({ componentState: 1 });
    }
  };

  resetComponentState = () => {
    this.setState({ componentState: 0 });
  };
  emailCountAlert = () => {
    if (this.state.componentState === 1) {
      return (
        <UncontrolledAlert
          color="danger"
          onClick={() => this.resetComponentState()}
          className="mt-2"
        >
          Free users can only have 5 emails in their dashboard, please clean up
          any unnecessary emails.
        </UncontrolledAlert>
      );
    }
    return null;
  };

  emailCards = () => {
    if (this.state.emails.length === 0) {
      return (
        <Container fluid className="button-center">
          <div>{this.emailCreateButton("single")}</div>
        </Container>
      );
    }
    return (
      <Col>
        <CardColumns>
          {this.emailCreateButton()}
          {this.emailElements()}
        </CardColumns>
      </Col>
    );
  };

  render() {
    return (
      <Container className="mt-3">
        <Row>
          <Col xs={12}>{this.emailCountAlert()}</Col>
        </Row>
        <Row>{this.emailCards()}</Row>
      </Container>
    );
  }
}
export default withRouter(DocumentList);
