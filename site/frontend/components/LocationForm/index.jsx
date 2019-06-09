/* components/LocationForm/index.js */
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { withRouter } from "next/router";
import Lform from "./form";
import { FormGroup, Alert } from "reactstrap";

class LocationForm extends React.Component {
  render() {
    const {
      data: { loading, error, users }
    } = this.props;
    console.log(loading, error, users);
    if (this.props.router.query.locationid === undefined) {
      return (
        <Lform
          loggedUser={this.props.loggedUser}
          loggedId={this.props.loggedId}
        />
      );
    }
    if (error)
      return (
        <FormGroup>
          <Alert color="danger">
            Error Loading Form, Please reload and try again.
          </Alert>
        </FormGroup>
      );
    if (users && users.length) {
      let locations = users[0].location;
      locations = locations.filter(l => {
        return l._id === this.props.router.query.locationid;
      });
      if (locations.length !== 0) {
        return (
          <Lform
            location={locations}
            loggedUser={this.props.loggedUser}
            loggedId={this.props.loggedId}
          />
        );
      } else {
        return (
          <Lform
            loggedUser={this.props.loggedUser}
            loggedId={this.props.loggedId}
          />
        );
      }
    }
    return (
      <FormGroup>
        <p>Loading</p>
      </FormGroup>
    );
  }
}

const query = gql`
  query users($id: ID!) {
    users(where: { _id: $id }, limit: 1) {
      _id
      location {
        _id
        Name
        Description
        Country
        Address
        City
        State
        Zipcode
        Image {
          url
          name
        }
      }
    }
  }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (RestaurantList)
const ComponentWithMutation = graphql(query, {
  options: ({ router: { query } }) => ({
    variables: {
      id: query.userid,
      locationid: query.locationid
    }
  }),
  props: ({ data }) => ({
    data
  })
})(LocationForm);

export default withRouter(ComponentWithMutation);
