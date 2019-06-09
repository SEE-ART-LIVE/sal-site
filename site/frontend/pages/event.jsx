import React from "react";
import defaultPage from "../hocs/defaultPage";
import EventForm from "../components/EventForm";
import axios from "axios";

class Event extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      Router.push("/");
    }
  }

  render() {
    return (
      <EventForm
        loggedId={this.props.loggedId}
        loggedUser={this.props.loggedUser}
      />
    );
  }
}

export default defaultPage(Event);
