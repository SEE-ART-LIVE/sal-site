/* components/RestaurantList/index.js */
import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImg,
  CardSubtitle
} from "reactstrap";
import { CardText, CardTitle, Col, Row } from "reactstrap";

const CurrentUserLocationsList = (
  { data: { loading, error, users }, search },
  req
) => {
  if (error) return "Error loading locations";
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
      <div className="container-fluid">
        <Row>
          <Col sm="6" md="6">
            {locations.map(res => (
              <Card
                style={{ width: "30%", margin: "0 10px" }}
                className="h-100"
                key={res._id}
              >
                <CardBody>
                  <CardTitle>{res.Name}</CardTitle>
                  <CardText>{res.Description}</CardText>
                  <CardText>{res.Address}</CardText>
                  <CardText>{res.City}</CardText>
                </CardBody>
                <div className="card-footer">
                  <Link
                    as={`/locations/${res._id}`}
                    href={`/locations?id=${res._id}`}
                  >
                    <a className="btn btn-primary">View</a>
                  </Link>
                </div>
              </Card>
            ))}
          </Col>

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
        </Row>
      </div>
      );
    } else {
      return <h1>No Locations Found</h1>;
    }
  }
  return <h1>Loading</h1>;
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
