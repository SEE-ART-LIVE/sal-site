/* components/LocationForm/index.js */
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { withRouter, Router, Link } from 'next/router'
import { states } from "../../lists/usStates";
import { countries } from "../../lists/worldCountries";
import axios from 'axios';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Row,
  Col,
  Button
} from "reactstrap";

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    //query state will be passed to RestaurantList for the filter query
    this.state = {
      query: "",
      data: {
        state: "",
        city: "",
        address: "",
        name: "",
        description: "",
        country: "",
        zipcode: "",
        user: this.props.loggedUser !== undefined ? this.props.loggedUser : this.props.router.query.userid
      },
      loading: false,
      error: ""
    };
  }
  onChange(propertyName, event) {
    const { data } = this.state;
    data[propertyName] = event.target.value;
    console.table(data)
    this.setState({ data });
  }
  async onSubmit(e) {
    const { data } = this.state;
    this.setState({ loading: true });
    const response = await axios.get("http://localhost:1337/users/me");
    const userId = await response.data._id;
    const postNewAddress = await axios.post(
      "http://localhost:1337/locations/",
      {
        Name: data.name,
        Description: data.description,
        Country: data.country,
        Address: data.address,
        City: data.city,
        State: data.state,
        Zipcode: data.zipcode
      }
    );
    const addressRes = await postNewAddress.data;
    const postUserRelation = await axios.put(
      `http://localhost:1337/users/${userId}`,
      {
        location: [addressRes._id]
      }
    );
    const postUserRelationRes = await postUserRelation.data;
    this.setState({ loading: false });
    document.getElementById("location-form").reset();
  }
  render() {
    console.log(this.props.router);
    const { data: { loading, error, users } } = this.props;
    if (this.props.router.query.locationid === undefined) {
      return (
        <div className="container-fluid">
          <Row>
            <Col sm="12" md="12">
              <div className="header">
                <h3>Location</h3>
              </div>
            </Col>
            <Col sm="12" md="12">
              <section className="wrapper">
                <div className="notification"></div>
                <Form id="location-form" ref={ref => (this.locationForm = ref)}>
                  <FormGroup>
                    <Label>Name:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "name")}
                      type="text"
                      name="name"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "description")}
                      type="textarea"
                      name="username"
                      style={{ height: 250, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Country:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "country")}
                      type="select"
                      name="country"
                      style={{ height: 50, fontSize: "1.2em" }}
                    >
                      {countries.map((c, i) => {
                        return (
                          <option key={i} value={c.code}>
                            {c.name}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Address:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "address")}
                      type="text"
                      name="address"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>City:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "city")}
                      type="text"
                      name="city"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>State:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "state")}
                      type="select"
                      name="state"
                      style={{ height: 50, fontSize: "1.2em" }}
                    >
                      {Object.entries(states[0]).map((s, i) => {
                        return (
                          <option key={i} value={s[0]}>
                            {s[1]}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Zipcode:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "zipcode")}
                      type="text"
                      name="zipcode"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      style={{ float: "right", width: 120 }}
                      color="primary"
                      onKeyPress={this.onSubmit.bind(this)}
                      onClick={this.onSubmit.bind(this)}
                    >
                      Submit
                    </Button>
                  </FormGroup>
                </Form>
              </section>
            </Col>
          </Row>
          <style jsx>
            {`
          .search {
            margin: 20px;
            width: 500px;
          }
        `}
          </style>
        </div>
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
      })
      console.table(locations[0])
      if (locations.length !== 0) {
        return (
          <Row>
            <Col sm="12" md="12">
              <div className="header">
                <h3>Location</h3>
              </div>
            </Col>
            <Col sm="12" md="12">
              <section className="wrapper">
                <div className="notification">{error}</div>
                <Form id="location-form" ref={ref => (this.LocationForm = ref)}>
                  <FormGroup>
                    <Label>Name:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "name")}
                      type="text"
                      name="name"
                      value={this.state.data.name || locations[0].Name }
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "description")}
                      type="textarea"
                      name="description"
                      value={locations[0].Description}
                      style={{ height: 250, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Country:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "country")}
                      type="select"
                      name="country"
                      value={locations[0].Country}
                      style={{ height: 50, fontSize: "1.2em" }}
                    >
                      {countries.map((c, i) => {
                        return (
                          <option key={i} value={c.code}>
                            {c.name}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Address:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "address")}
                      type="text"
                      name="address"
                      value={locations[0].Address}
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>City:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "city")}
                      type="text"
                      name="city"
                      value={locations[0].City}
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>State:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "state")}
                      type="select"
                      name="state"
                      value={locations[0].State}
                      style={{ height: 50, fontSize: "1.2em" }}
                    >
                      {Object.entries(states[0]).map((s, i) => {
                        return (
                          <option key={i} value={s[0]}>
                            {s[1]}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Zipcode:</Label>
                    <Input
                      onChange={this.onChange.bind(this, "zipcode")}
                      type="text"
                      name="zipcode"
                      value={locations[0].Zipcode}
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      style={{ float: "right", width: 120 }}
                      color="primary"
                      onKeyPress={this.onSubmit.bind(this)}
                      onClick={this.onSubmit.bind(this)}
                    >
                      Update
                  </Button>
                  </FormGroup>
                </Form>
              </section>
            </Col>
          </Row>
        );
      } else {
        return (
          <div className="container-fluid">
            <Row>
              <Col sm="12" md="12">
                <div className="header">
                  <h3>Location</h3>
                </div>
              </Col>
              <Col sm="12" md="12">
                <section className="wrapper">
                  <div className="notification">{error}</div>
                  <Form id="location-form" ref={ref => (this.locationForm = ref)}>
                    <FormGroup>
                      <Label>Name:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "name")}
                        type="text"
                        name="name"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Description:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "description")}
                        type="textarea"
                        name="username"
                        style={{ height: 250, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Country:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "country")}
                        type="select"
                        name="country"
                        style={{ height: 50, fontSize: "1.2em" }}
                      >
                        {countries.map((c, i) => {
                          return (
                            <option key={i} value={c.code}>
                              {c.name}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Address:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "address")}
                        type="text"
                        name="address"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>City:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "city")}
                        type="text"
                        name="city"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>State:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "state")}
                        type="select"
                        name="state"
                        style={{ height: 50, fontSize: "1.2em" }}
                      >
                        {Object.entries(states[0]).map((s, i) => {
                          return (
                            <option key={i} value={s[0]}>
                              {s[1]}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Zipcode:</Label>
                      <Input
                        onChange={this.onChange.bind(this, "zipcode")}
                        type="text"
                        name="zipcode"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <span>
                        <a href="">
                          <small>Forgot Password?</small>
                        </a>
                      </span>
                      <Button
                        style={{ float: "right", width: 120 }}
                        color="primary"
                        onKeyPress={this.onSubmit.bind(this)}
                        onClick={this.onSubmit.bind(this)}
                      >
                        Submit
                    </Button>
                    </FormGroup>
                  </Form>
                </section>
              </Col>
            </Row>
            <style jsx>
              {`
              .search {
                margin: 20px;
                width: 500px;
              }
            `}
            </style>
          </div>
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
        }
      }
    }
  }
`;

// const userid = this.props.user;
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
