/* components/LocationForm/form.js */
import { states } from "../../lists/usStates";
import { countries } from "../../lists/worldCountries";
import { withRouter } from "next/router";
import axios from "axios";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox
} from "availity-reactstrap-validation";
import { Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap";

class LForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
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
        user: this.props.loggedUser !== undefined ? this.props.loggedUser : ""
      },
      file: null,
      loading: false,
      error: "",
      errors: [],
      buttonText: this.props.location !== undefined ? `Update` : `Submit`
    };
  }
  onChange(propertyName, event) {
    const { data, file } = this.state;
    console.log(propertyName);
    if (propertyName === "file") {
      console.log("a", event.target.files[0]);
      this.readURL(document.getElementById(propertyName));
      this.setState({ file: event.target.files[0] });
    } else {
      console.log("b");
      data[propertyName] = event.target.value;
    }
    this.setState({ data });
  }
  async deletePost() {
    if (this.props.location) {
      const deleteItem = await axios.delete(
        `http://localhost:1337/locations/`,
        { _id: this.props.router.query.locationid }
      );
      const deleteItemRes = await deleteItem.data;
      this.props.router.push(`/user/${this.props.loggedUser}`);
    }
  }
  async readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("preview").setAttribute("src", e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  async onSubmit(event, errors, values) {
    if (errors.length === 0) {
      const { data, file } = this.state;
      this.setState({ loading: true });
      const userId = this.props.loggedId;
      const formData = new FormData();

      if (this.props.location) {
        await axios.put(
          `http://localhost:1337/locations/${
            this.props.router.query.locationid
          }`,
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
        formData.append("files", file);
        formData.append("path", "location/images");
        formData.append("refId", this.props.router.query.locationid);
        formData.append("ref", "location");
        formData.append("field", "Image");
        await axios.post("http://localhost:1337/upload/", formData);
      } else {
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
        await axios.put(`http://localhost:1337/users/${userId}`, {
          location: [addressRes._id]
        });
        formData.append("files", file);
        formData.append("path", "location/images");
        formData.append("refId", addressRes._id);
        formData.append("ref", "location");
        formData.append("field", "Image");
        await axios.post("http://localhost:1337/upload/", formData);
      }
      
      this.setState({ loading: false });
      this.props.router.push(`/user/${this.props.loggedUser}`);
    }
  }
  async componentWillMount() {
    if (this.props.location) {
      const { data } = this.state;
      data["name"] = this.props.location[0].Name;
      data["description"] = this.props.location[0].Description;
      data["country"] = this.props.location[0].Country;
      data["address"] = this.props.location[0].Address;
      data["city"] = this.props.location[0].City;
      data["state"] = this.props.location[0].State;
      data["zipcode"] = this.props.location[0].Zipcode;
      this.setState({ data });
      this.setState({ file: this.props.location[0].Image.url });
    }
  }
  render() {
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
              <div className="notification">{this.props.error}</div>
              <AvForm
                id="location-form"
                ref={ref => (this.LocationForm = ref)}
                onSubmit={this.onSubmit}
              >
                <AvGroup>
                  <Label>Name:</Label>
                  <AvInput
                    onChange={this.onChange.bind(this, "name")}
                    type="text"
                    name="name"
                    value={this.state.data.name}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  />
                </AvGroup>
                <AvGroup>
                  <Label>Description:</Label>
                  <AvInput
                    onChange={this.onChange.bind(this, "description")}
                    type="textarea"
                    name="description"
                    value={this.state.data.description}
                    style={{ height: 250, fontSize: "1.2em" }}
                    required
                  />
                </AvGroup>
                <AvGroup>
                  <Label>Country:</Label>
                  <AvField
                    onChange={this.onChange.bind(this, "country")}
                    type="select"
                    name="country"
                    value={this.state.data.country}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  >
                    <option label=" " />
                    {countries.map((c, i) => {
                      return (
                        <option key={i} value={c.code}>
                          {c.name}
                        </option>
                      );
                    })}
                  </AvField>
                </AvGroup>
                <AvGroup>
                  <Label>Address:</Label>
                  <AvInput
                    onChange={this.onChange.bind(this, "address")}
                    type="text"
                    name="address"
                    value={this.state.data.address}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  />
                </AvGroup>
                <AvGroup>
                  <Label>City:</Label>
                  <AvInput
                    onChange={this.onChange.bind(this, "city")}
                    type="text"
                    name="city"
                    value={this.state.data.city}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  />
                </AvGroup>
                <AvGroup>
                  <Label>State:</Label>
                  <AvField
                    onChange={this.onChange.bind(this, "state")}
                    type="select"
                    name="state"
                    value={this.state.data.state}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  >
                    <option label=" " />
                    {Object.entries(states[0]).map((s, i) => {
                      return (
                        <option key={i} value={s[0]}>
                          {s[1]}
                        </option>
                      );
                    })}
                  </AvField>
                </AvGroup>
                <AvGroup>
                  <Label>Zipcode:</Label>
                  <AvInput
                    onChange={this.onChange.bind(this, "zipcode")}
                    type="text"
                    name="zipcode"
                    value={this.state.data.zipcode}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  />
                </AvGroup>
                <AvGroup>
                  <Row>
                    <Col>
                      <Label>Image:</Label>
                      <AvInput
                        onChange={this.onChange.bind(this, "file")}
                        type="file"
                        id="file"
                        name="file"
                        value={this.state.file !== null ? this.state.name : ""}
                        style={{ height: 50, fontSize: "1.2em" }}
                        required
                      />
                    </Col>
                    <Col>
                      <img
                        id="preview"
                        src={
                          this.state.file !== null ? `http://localhost:1337${this.state.file}` : ""
                        }
                      />
                    </Col>
                  </Row>
                </AvGroup>
                <AvGroup>
                  <Button
                    style={{ float: "right", width: 120 }}
                    color="primary"
                  >
                    {this.state.buttonText}
                  </Button>
                </AvGroup>

                <AvGroup>
                  <Button
                    style={{ float: "right", width: 120 }}
                    color="danger"
                    onKeyPress={this.deletePost.bind(this)}
                    onClick={this.deletePost.bind(this)}
                  >
                    Delete
                  </Button>
                </AvGroup>
              </AvForm>
            </section>
          </Col>
        </Row>
        <style jsx>
          {`
            img {
              width: 100%;
              height: auto;
            }
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

export default withRouter(LForm);
