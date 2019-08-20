/* components/EventForm/form.js */
import { withRouter } from "next/router";
import axios from "axios";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput
} from "availity-reactstrap-validation";
import { Label, Row, Col, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import DatePickerInput from "../DatePickerInput";

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
        date: null,
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
    this.handleChange = this.handleChange.bind(this);
  }
  removeImage() {
    const { file } = this.state;
    this.setState({ file: null });
  }
  handleChange(date) {
    const { data } = this.state;
    data["date"] = date;
    this.setState({ data });
    // console.table(data);
  }
  onChange(propertyName, event, date) {
    const { data } = this.state;
    if (propertyName === "file") {
      this.readURL(document.getElementById(propertyName));
      this.setState({ file: event.target.files[0] });
    } else if (propertyName === "date") {
      // data[propertyName] = event.toString();
    } else {
      data[propertyName] = event.target.value;
    }
    this.setState({ data });
  }
  async deletePost() {
    if (this.props.event) {
      await axios.delete(`http://localhost:1337/events/${this.props.router.query.eventid}`);
      this.props.router.push(`/user/${this.props.loggedUser}`);
    }
  }
  async readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
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

        const postNewEvent = await axios.post("http://localhost:1337/events/", {
          Title: data.title,
          Date: data.date,
          Description: data.description
        });

        // Get event ID
        const eventID = await postNewEvent.data;

        // Get all the events a user has
        const userEvents = await axios.get(`http://localhost:1337/users/${userId}`)

        console.log(data.location)

        // get userID and set it to the event
        await axios.put(`http://localhost:1337/users/${userId}`, {
          events: [eventID._id, ...userEvents.data.events]
        });

        // get Location Id and set it on the event
        await axios.put(`http://localhost:1337/locations/${data.location}`, {
          event: eventID._id
        });

        formData.append("files", file);
        formData.append("path", "event/images");
        formData.append("refId", eventID._id);
        formData.append("ref", "event");
        formData.append("field", "Image");
        await axios.post("http://localhost:1337/upload/", formData);
      }

      this.setState({ loading: false });
      this.props.router.push(`/user/${this.props.loggedUser}`);
    }
  }
  async componentWillMount() {
    console.log(this.props.event);
    if (this.props.event) {
      const { data } = this.state;
      data["title"] = this.props.event[0].Title;
      data["description"] = this.props.event[0].Description;
      data["date"] = new Date(this.props.event[0].Date);
      data["location"] = this.props.event[0].location._id;
      this.setState({ data });
      this.setState({ file: this.props.event[0].Image.url });
    }
  }
  render() {
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
                  <br />
                  <style jsx>
                    {`
                      input {
                        width: 100%;
                        height: 50px;
                      }
                    `}
                  </style>
                  {/*                   <DateTimePicker
                    onChange={this.handleChange}
                    value={this.state.data.date}
                    required
                  /> */}
                  <DatePicker
                    selected={this.state.data.date}
                    onChange={this.handleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="time"
                    name="date"
                    style={{ height: 50, fontSize: "1.2em" }}
                    className="is-untouched is-pristine av-invalid form-control"
                    placeholderText="Click to select a date"
                    customInput={<DatePickerInput />}
                    required
                  />
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
                    <option label=" " />
                    {this.props.location.map(res => (
                      <option key={res._id} value={res._id}>
                        {res.Address}
                      </option>
                    ))}
                  </AvField>
                </AvGroup>
                <AvGroup>
                  <Row>
                    {this.state.file !== null ? (
                      <Col>
                        <Button
                          style={{
                            position: "absolute",
                            bottom: 20,
                            right: 40
                          }}
                          onClick={this.removeImage.bind(this)}
                        >
                          Change Image
                        </Button>

                        <img
                          id="preview"
                          style={{
                            width: "100%"
                          }}
                          src={
                            this.state.file !== null
                              ? `http://localhost:1337${this.state.file}`
                              : ""
                          }
                        />
                      </Col>
                    ) : (
                        <Col>
                          <AvInput
                            onChange={this.onChange.bind(this, "file")}
                            type="file"
                            id="file"
                            name="file"
                            style={{ height: 50, fontSize: "1.2em" }}
                            required
                          />
                        </Col>
                      )}
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
                {this.props.event !== undefined ? (
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
                ) : (
                    <AvGroup></AvGroup>
                  )}
              </AvForm>
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(EForm);
