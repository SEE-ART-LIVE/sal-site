/* components/RestaurantList/index.js */
import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";
import { Col, Row, Table } from "reactstrap";

import React, { Component } from 'react'

class CurrentUserLocationsList extends React.Component {
  render() {
    const {
      data: { loading, error, users },
      search
    } = this.props;
    console.log(users)
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
      // searchQuery
      // console.log(users[0].location);
      let locations = users[0].locations;
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
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map(res => (
                      <tr key={res._id}>
                        <td>
                          {" "}
                          <img
                            src={
                              res.Image !== null
                                ? `http://localhost:1337/${res.Image.url}`
                                : ""
                            }
                            style={{
                              width: `50px`,
                              height: `auto`,
                              marginRight: `10px`
                            }}
                          />
                          {res.Name}
                        </td>
                        <td>{res.Description}</td>
                        <td>{res.Address}</td>
                        <td>{res.City}</td>
                        <td>
                          <Link
                            as={`/location?locationid=${res._id}&userid=${
                              users[0]._id
                              }`}
                            href={`/location?locationid=${res._id}&userid=${
                              users[0]._id
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
                  as={`/location?userid=${users[0]._id}`}
                  href={`/location?userid=${users[0]._id}`}
                >
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
                  <Link
                    as={`/location?userid=${users[0]._id}`}
                    href={`/location?userid=${users[0]._id}`}
                  >
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
    }
  }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (RestaurantList)
export default graphql(query, {
  options: props => ({ variables: { id: props.loggedId } }),
  props: ({ data }) => ({
    data
  })
})(CurrentUserLocationsList);
