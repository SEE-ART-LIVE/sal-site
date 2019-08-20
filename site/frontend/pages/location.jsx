import React from "react";
import defaultPage from "../hocs/defaultPage";
import LocationForm from "../components/LocationForm";
import Router from "next/router"
import axios from "axios";

class Location extends React.Component {
  constructor(props) {
    super(props);
    //query state will be passed to RestaurantList for the filter query
    this.state = {
      query: "",
      user: "",
      loading: false,
      error: ""
    };
  }

  async componentDidMount() {
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      Router.push("/");
    }
  }

  render() {
    return (
      <LocationForm
        loggedId={this.props.loggedId}
        loggedUser={this.props.loggedUser}
      />
    );
  }
}

export default defaultPage(Location);
