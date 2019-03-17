/* components/RestaurantList/index.js */
import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row,
  Table,
  Button
} from "reactstrap";

const CurrentUserLocationsList = (
  { data: { loading, error, users }, search },
  req
) => {
  if (error)
    return (
      <div className="py-5">
        <Row>
          <Col sm="12" md="12">
            <h3 className="error">Error Loading Locations</h3>
          </Col>
        </Row>
      </div>
    );
  // if locations are returned from the GraphQL query, run the filter query
  // and set equal to variable locationsearch
  if (users && users.length) {
    //searchQuery
    console.log(users[0].location);
    let locations = users[0].location;
    /* 
    const searchQuery = locations.filter(query =>
      query.Name.toLowerCase().includes(search)
    ); 
    */
    if (locations.length != 0) {
      return (
        <div className="py-5">
          <Row>
            <Col sm="12" md="12">
              <h3>Locations</h3>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="12">
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map(res => (
                    <tr key={res._id}>
                      <td>{res.Name}</td>
                      <td>{res.Description}</td>
                      <td>{res.Address}</td>
                      <td>{res.City}</td>
                      <td>
                        <Link
                          as={`/location/${res._id}`}
                          href={`/location?id=${res._id}`}
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
              <Link as={`/location`} href={`/location`}>
                <a className="btn btn-primary">Add Location</a>
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
                <h3>No Locations Found</h3>
              </Col>
            </Row>
          </div>
          <div className="py-2">
            <Row>
              <Col sm="12" md="12">
                <Link as={`/location`} href={`/location`}>
                  <a className="btn btn-primary">Add Location</a>
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
        <Col sm="12" md="12">
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
    }
  }
`;

CurrentUserLocationsList.getInitialProps = async ({ req }) => {
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
})(CurrentUserLocationsList);
