import React from "react";
import defaultPage from "../hocs/defaultPage";
import LocationForm from "../components/LocationForm";
import axios from 'axios'

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
    const response = await axios.get("http://localhost:1337/users/me");
    const userId = await response.data._id;
    this.setState({ user: userId });
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      Router.push("/");
    }
  }

  render() {
    return <LocationForm user={this.state.user} />;
  }
}

export default defaultPage(Location);
