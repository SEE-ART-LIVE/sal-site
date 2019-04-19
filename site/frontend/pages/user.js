/* /pages/user.js */
import React from "react";
// import LocationForm from "../components/LocationForm";
import CurrentUserLocationsList from "../components/CurrentUserLocationsList";
import CurrentUserEventsList from "../components/CurrentUserEventsList";
import defaultPage from "../hocs/defaultPage";
import axios from "axios";

class User extends React.Component {
  
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
      <div className="container-fluid">
        <CurrentUserLocationsList user={this.props.loggedId} />
        <CurrentUserEventsList user={this.props.loggedId} />
      </div>
    );
  }
}

export default defaultPage(User);
