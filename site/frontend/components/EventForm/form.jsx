/* components/EventForm/form.js */
// import { states } from "../../lists/usStates";
// import { countries } from "../../lists/worldCountries";
import { withRouter } from "next/router";
import axios from "axios";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput
} from "availity-reactstrap-validation";
import { Label, Input, Row, Col, Button } from "reactstrap";
import css from "react-datepicker/dist/react-datepicker.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";

class EForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    //query state will be passed to RestaurantList for the filter query
    this.state = {
      query: "",
      startDate: new Date(),
      data: {
        title: "",
        date: "",
        description: "",
        location: "",
        user: this.props.loggedUser !== undefined ? this.props.loggedUser : ""
      },
      file: null,
      loading: false,
      error: "",
      errors: [],
      buttonText: this.props.event !== undefined ? `Update` : `Submit`
    };
  }
  onChange(propertyName, event) {
    const { data } = this.state;
    if (propertyName === "file") {
      this.readURL(document.getElementById(propertyName));
      this.setState({ file: event.target.files[0] });
    } else {
      data[propertyName] = event.target.value;
    }
    this.setState({ data });
  }
  async deletePost() {
    /*     if (this.props.event) {
          await axios.delete(`http://localhost:1337/events/`, {
            _id: this.props.router.query.eventid
          });
          this.props.router.push(`/user/${this.props.loggedUser}`);
        } */
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

      if (this.props.event) {
        await axios.put(
          `http://localhost:1337/events/${this.props.router.query.eventid}`,
          {
            Title: data.title,
            Date: data.date,
            Description: data.description,
            Location: data.location
          }
        );
        formData.append("files", file);
        formData.append("path", "event/images");
        formData.append("refId", this.props.router.query.eventid);
        formData.append("ref", "location");
        formData.append("field", "Image");
        await axios.post("http://localhost:1337/upload/", formData);
      } else {
        const postNewAddress = await axios.post(
          "http://localhost:1337/events/",
          {
            Title: data.title,
            Date: data.date,
            Description: data.description,
            Location: data.location
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
    if (this.props.event) {
      const { data } = this.state;
      data["title"] = this.props.event[0].Title;
      data["description"] = this.props.event[0].Description;
      data["date"] = this.props.event[0].Date;
      data["location"] = this.props.event[0].Location;
      this.setState({ data });
      this.setState({ file: this.props.event[0].Image.url });
    }
  }
  render() {
    console.log(css)
    return (
      <div className="container-fluid">
        <Row>
          <Col sm="12" md="12">
            <div className="header">
              <h3>Event</h3>
            </div>
          </Col>
          <Col sm="12" md="12">
            <section className="wrapper">
              <div className="notification">{this.props.error}</div>
              <AvForm
                id="event-form"
                ref={ref => (this.EventForm = ref)}
                onSubmit={this.onSubmit}
              >
                <AvGroup>
                  <Label>Title:</Label>
                  <AvInput
                    onChange={this.onChange.bind(this, "title")}
                    type="text"
                    name="title"
                    value={this.state.data.title}
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
                  <Label>Date:</Label>

                  <DatePicker
                    onChange={this.onChange.bind(this, "date")}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="time"
                  />

                  {/*                   <DateTimePicker
                    onChange={this.onChange.bind(this, "date")}
                    defaultValue={new Date()}
                    data={["orange", "red", "blue", "purple"]}
                    name="date"
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  /> */}
                </AvGroup>
                <AvGroup>
                  <Label>Location:</Label>
                  <AvField
                    onChange={this.onChange.bind(this, "location")}
                    type="select"
                    name="location"
                    value={this.state.data.location}
                    style={{ height: 50, fontSize: "1.2em" }}
                    required
                  >
                    {this.props.location.map(res => (
                      <option key={res._id} value={res.Address}>
                        {res.Address}
                      </option>
                    ))}
                  </AvField>
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
                          this.state.file !== null
                            ? `http://localhost:1337${this.state.file}`
                            : ""
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
      </div>
    );
  }
}

export default withRouter(EForm);
