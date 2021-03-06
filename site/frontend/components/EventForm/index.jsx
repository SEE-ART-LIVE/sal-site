/* components/EventForm/index.js */
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { withRouter } from "next/router";
import Eform from "./form";
import { FormGroup, Alert } from "reactstrap";
import Link from "next/link";

class EventForm extends React.Component {
  render() {
    const {
      data: { loading, error, users }
    } = this.props;
    // console.log(loading, error, users);
    if (error)
      return (
        <FormGroup>
          <Alert color="danger">
            Error Loading Form, Please reload and try again.
          </Alert>
        </FormGroup>
      );
    if (users && users.length) {
      let locations = users[0].locations;
      let events = users[0].events;
      events = events.filter(e => {
        // console.log();
        return e._id === this.props.router.query.eventid;
      });
      if (locations !== undefined) {
        if (locations.length != 0 && events.length != 0) {
          return (
            <Eform
              event={events}
              location={locations}
              loggedUser={this.props.loggedUser}
              loggedId={this.props.loggedId}
            />
          );
        } else if (locations.length != 0) {
          return (
            <Eform
              location={locations}
              loggedUser={this.props.loggedUser}
              loggedId={this.props.loggedId}
            />
          );
        } else {
          return (
            <FormGroup>
              <p>Please add your first location. </p>
              <Link as={`/location`} href={`/location`}>
                <a className="btn btn-primary">Add Location</a>
              </Link>
            </FormGroup>
          );
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
      locations {
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
      events {
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

// console.log(this);

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
