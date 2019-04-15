/* components/EventForm/index.js */
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { withRouter } from "next/router";
import Eform from "./form";
import { FormGroup, Alert } from "reactstrap";

class EventForm extends React.Component {
  render() {
    const {
      data: { loading, error, users }
    } = this.props;
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
      let events = users[0].events;
      if (locations !== undefined) {
        if (locations.length != 0) {
          return (
            <Eform location={locations} loggedUser={this.props.loggedUser} />
          );
        } else if (locations.length != 0 && events.length != 0) {
          return (
            <Eform
              event={events}
              location={locations}
              loggedUser={this.props.loggedUser}
            />
          );
        } else {
          return (
            <FormGroup>
              <Alert color="danger">
                Please add some locations.{" "}
                <Link as={`/location`} href={`/location`}>
                  <a className="btn btn-primary">Add Location</a>
                </Link>
              </Alert>
            </FormGroup>
          );

          {
            /* <Eform loggedUser={this.props.loggedUser} />; */
          }
        }
      } else {
        return <p>something went right...</p>;
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
        Address
        City
        State
        Zipcode
        Image {
          url
        }
      }
      event {
        _id
        Title
        Description
        Date
        location {
          _id
          Name
          Description
          Address
          City
          State
          Zipcode
          Image {
            url
          }
        }
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
      eventid: query.eventid
    }
  }),
  props: ({ data }) => ({
    data
  })
})(EventForm);

export default withRouter(ComponentWithMutation);
