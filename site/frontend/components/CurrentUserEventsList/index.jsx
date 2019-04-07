/* components/RestaurantList/index.js */
import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";

const CurrentUserEventsList = (
  { data: { loading, error, users }, search },
  req
) => {
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
  // if locations are returned from the GraphQL query, run the filter query
  // and set equal to variable locationsearch
  if (users && users.length) {
    //searchQuery

    let events = users[0].event !== null ? users[0].event : [];
    /* 
    const searchQuery = events.filter(query =>
      query.Name.toLowerCase().includes(search)
    ); 
    */
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
                      <td>{res.Name}</td>
                      <td>{res.Description}</td>
                      <td>{res.Location.Name}</td>
                      <td>{res.Date}</td>
                      <td>
                      <Link
                          as={`/location?eventid=${res._id}&userid=${users[0]._id}`}
                          href={`/location?eventid=${res._id}&userid=${users[0]._id}`}
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
              <Link as={`/event?userid=${users[0]._id}`} href={`/event?userid=${users[0]._id}`}>
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
                <Link as={`/event?userid=${users[0]._id}`} href={`/event?userid=${users[0]._id}`}>
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
};

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

CurrentUserEventsList.getInitialProps = async ({ req }) => {
  let userid = this.props.user;
  const res = await fetch("https://api.github.com/repos/zeit/next.js");
  const json = await res.json();
  return { stars: json.stargazers_count };
};
// const userid = this.props.user;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (RestaurantList)
export default graphql(query, {
  options: props => ({ variables: { id: props.user } }),
  props: ({ data }) => ({
    data
  })
})(CurrentUserEventsList);
