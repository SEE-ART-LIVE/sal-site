/* /pages/index.js */

import React from "react";
import defaultPage from "../hocs/defaultPage";
import {
  Col,
  Row
} from "reactstrap";

class Index extends React.Component {

  constructor(props) {
    super(props);
    //query state will be passed to RestaurantList for the filter query
    this.state = {
      query: ""
    };
  }

  render() {
    return (
      <div className="container-fluid">
        <Row>
          <Col>
            <div className="search">SEE ART LIVE 🎨</div>
          </Col>
          <Col>
            <div className="search">SEE ART LIVE 🎨</div>
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

export default defaultPage(Index);