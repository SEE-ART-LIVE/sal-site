/* /pages/restaurants.js */
import React from "react";
import { compose } from "recompose";
import { Router } from "next/router";
import { states } from "../../lists/usStates";
import { countries } from "../../lists/worldCountries";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";
import defaultPage from "../../hocs/defaultPage";

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
        user: this.props.loggedUser
      },
      loading: false,
      error: ""
    };
  }
  onChange(propertyName, event) {
    const { data } = this.state;
    data[propertyName] = event.target.value;
    this.setState({ data });
  }
  async onSubmit(e) {
    const { data } = this.state;
    this.setState({ loading: true });
    console.log(data)
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
    const { error } = this.state;
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

export default compose(defaultPage)(LocationForm);
