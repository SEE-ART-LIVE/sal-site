/* components/EventForm/index.js */
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { withRouter, Router, Link } from 'next/router'
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

class EventForm extends React.Component {
  constructor(props) {
    super(props);
    //query state will be passed to RestaurantList for the filter query
    this.state = {
      query: "",
      data: {
        title: "",
        date: "",
        description: "",
        image: "",
        description: "",
        location: "",
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
    const response = await axios.get("http://localhost:1337/users/me");
    const userId = await response.data._id;
    const postNewAddress = await axios.post(
      "http://localhost:1337/locations/",
      {
        Title: data.title,
        Description: data.description,
        Location: data.location,
        Image: data.image,
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
    document.getElementById("event-form").reset();
  }
  render() {
    console.log(this.props);
    const {
      data: { loading, error, users },
      search
    } = this.props;
    this.props.refetch;
    if (error)
      return (
        <FormGroup>
          <Label>Locations:</Label>
          <Alert color="danger">
            Error Loading Locations, Please reload and try again.
          </Alert>
        </FormGroup>
      );
    if (users && users.length) {
      let locations = users[0].location;
      if (locations.length != 0) {
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
                <Form id="event-form" ref={ref => (this.EventForm = ref)}>
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
                    <Label>Locations:</Label>
                    <Input
                      type="select"
                      name="location"
                      style={{ height: 50, fontSize: "1.2em" }}
                    >
                      {locations.map(res => (
                        <option key={res._id} value={res.Address}>
                          {res.Address}
                        </option>
                      ))}
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
        );
      } else {
        return (
          <FormGroup>
            <Label>Locations:</Label>
            <Alert color="warning">
              Error Loading Locations, Please reload and try again.
            </Alert>
          </FormGroup>
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

EventForm.getInitialProps = async ({ req }) => {};

EventForm.componentDidMount = props => {
  console.log(`props`);
};

// const userid = this.props.user;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (RestaurantList)
const ComponentWithMutation = graphql(query, {
  options: ({ router: { query } }) => ({
    variables: {
      id: query.userid
    }
  }),
  props: ({ data }) => ({
    data
  })
})(EventForm);

export default withRouter(ComponentWithMutation);
