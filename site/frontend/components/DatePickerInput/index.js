import React from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";

class DatePickerInput extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    return (
      <Input 
        onClick={this.props.onClick} 
        onChange={this.props.onChange} 
        value={this.props.value}
        style={{ height: 50, fontSize: "1.2em" }}
      />
    );
  }
}

export default DatePickerInput;
