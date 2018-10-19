import React, {Component}  from 'react';

class SelectDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected
        }
    }

    render() {
        return(
            <select>
                {this.props.options.map((option) => <option>option</option>)}
            </select>
        )
    }
}

export default SelectDropdown;
