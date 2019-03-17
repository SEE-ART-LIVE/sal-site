/* /pages/restaurants.js */
import React from "react";
import LocationForm from "../components/LocationForm";
import CurrentUserLocationsList from "../components/CurrentUserLocationsList";
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
    const response = await axios.get("http://localhost:1337/users/me");
    const userId = await response.data._id;
    this.setState({ user: userId });
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      Router.push("/");
    }
  }
  render() {
    return (
      <div className="container-fluid">
        <LocationForm />
        <CurrentUserLocationsList user={this.state.user} />
      </div>
    );
  }
}

export default defaultPage(User);
