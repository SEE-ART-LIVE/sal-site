import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";
import { withRouter } from "next/router";
import { Col, Row, Table } from "reactstrap";

class CurrentUserEventsList extends React.Component {
  async componentWillMount() {
    // console.log(this.props);
  }

  formatDate(date) {
    date = new Date(date);
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }

  render() {
    const {
      data: { loading, error, users },
      search
    } = this.props;
    console.log(users !== undefined)
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
      let events = users[0].events;
      console.log(events);
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
                      <th>Title A</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event._id}>
                        <td>
                          <img
                            src={
                              event.Image !== null
                                ? `http://localhost:1337/${event.Image.url}`
                                : ""
                            }
                            style={{
                              width: `50px`,
                              height: `auto`,
                              marginRight: `10px`
                            }}
                          />
                          {event.Title !== null ? event.Title : ""}
                        </td>
                        <td>
                          {event.Description !== null ? event.Description : ""}
                        </td>
                        <td>{event.location !== null ? event.location.Name : ""}</td>
                        <td>
                          {event.Date !== null
                            ? this.formatDate(event.Date)
                            : ""}
                        </td>
                        <td>
                          <Link
                            as={`/event?eventid=${event._id}&userid=${
                              this.props.loggedId
                              }`}
                            href={`/event?eventid=${event._id}&userid=${
                              this.props.loggedId
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
                  as={`/event?userid=${this.props.loggedId}`}
                  href={`/event?userid=${this.props.loggedId}`}
                >
                  <a className="btn btn-primary">Add Event</a>
                </Link>
              </Col>
            </Row>
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
                    as={`/event?userid=${this.props.loggedId}`}
                    href={`/event?userid=${this.props.loggedId}`}
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
    users(where: { _id: $id }) {
      _id
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

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (RestaurantList)
export const componentQuery = graphql(query, {
  options: props => ({ variables: { id: props.loggedId } }),
  props: ({ data }) => ({
    data
  })
})(CurrentUserEventsList);

export default withRouter(componentQuery);
