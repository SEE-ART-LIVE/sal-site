import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";
import { withRouter } from "next/router";
import { Col, Row, Table } from "reactstrap";

class CurrentUserEventsList extends React.Component {
  async componentWillMount() {
    // console.log(this.props)
  }

  render() {
    const {
      data: { loading, error, users },
      search
    } = this.props;
    if (error)
      return (
        <div className="py-5">
          <Row>
            <Col sm="6" md="6">
              <h3 className="error">Error Loading Events</h3>
            </Col>
          </Row>
        </div>
      );
    if (users && users.length) {
      let events = users[0] !== null ? users[0].event : [];
      events = events !== null ? events : [];
      if (events.length != 0) {
        return (
          <div className="py-5">
            <Row>
              <Col sm="12" md="12">
                <h3>Events</h3>
              </Col>
            </Row>
            <Row>
              <Col sm="12" md="12">
                <Table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(res => (
                      <tr key={res._id}>
                        <td>{res.Title}</td>
                        <td>{res.Description}</td>
                        <td>{res.location.Name}</td>
                        <td>{res.Date}</td>
                        <td>
                          <Link
                            as={`/location?eventid=${res._id}&userid=${
                              this.props.user
                            }`}
                            href={`/location?eventid=${res._id}&userid=${
                              this.props.user
                            }`}
                          >
                            <a className="btn btn-primary">Edit</a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <style jsx global>
                  {`
                    a {
                      color: white;
                    }
                    a:link {
                      text-decoration: none;
                      color: white;
                    }
                    a:hover {
                      color: white;
                    }
                    .card-columns {
                      column-count: 3;
                    }
                  `}
                </style>
              </Col>
            </Row>
            <Row>
              <Col sm="12" md="12">
                <Link
                  as={`/event/${this.props.user}`}
                  href={`/event/${this.props.user}`}
                >
                  <a className="btn btn-primary">Add Event</a>
                </Link>
              </Col>
            </Row>
            <Row>
              <Col sm="12" md="12">
                <Link
                  as={`/event/${this.props.user}`}
                  href={`/event/${this.props.user}`}
                >
                  <a className="btn btn-primary">Add Event</a>
                </Link>
              </Col>
            </Row>{" "}
            cat
          </div>
        );
      } else {
        return (
          <div className="py-5">
            <div className="py-2">
              <Row>
                <Col sm="12" md="12">
                  <h3>No Events Found</h3>
                </Col>
              </Row>
            </div>

            <div className="py-2">
              <Row>
                <Col sm="12" md="12">
                  <Link
                    as={`/event/${this.props.user}`}
                    href={`/event/${this.props.user}`}
                  >
                    <a className="btn btn-primary">Add Event</a>
                  </Link>
                </Col>
              </Row>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="py-5">
        <Row>
          <Col sm="6" md="6">
            <h3>Loading</h3>
          </Col>
        </Row>
      </div>
    );
  }
}

const query = gql`
  query users($id: ID!) {
    users(where: { _id: $id }, limit: 1) {
      _id
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
export const componentQuery = graphql(query, {
  options: props => ({ variables: { id: props.user } }),
  props: ({ data }) => ({
    data
  })
})(CurrentUserEventsList);

export default withRouter(componentQuery);
