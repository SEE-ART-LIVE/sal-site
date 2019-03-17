/* components/currentUserLocations/index.js */
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { FormGroup, Label, Input, Alert } from "reactstrap";

const currentUserLocations = (
  { data: { loading, error, users }, search },
  req,
  props
) => {
  console.log(props);
  if (error)
    return (
      <FormGroup>
        <Label>Locations:</Label>
        <Alert color="warning">
          Error Loading Locations, Please reload and try again.
        </Alert>
      </FormGroup>
    );
  if (users && users.length) {
    let locations = users[0].location;
    if (locations.length != 0) {
      return (
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

currentUserLocations.getInitialProps = async ({ req }) => {
  let userid = this.props.user;
  console.log(`this.props`);
  const res = await fetch("https://api.github.com/repos/zeit/next.js");
  const json = await res.json();
  return { stars: json.stargazers_count };
};

currentUserLocations.componentDidMount = () => {
  console.log(`props`);
};

// const userid = this.props.user;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (RestaurantList)
export default graphql(query, {
  options: props => ({ variables: { id: props.user } }),
  props: ({ data, props }) => ({
    data,
    props
  })
})(currentUserLocations);
