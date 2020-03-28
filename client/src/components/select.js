import React, {Component}  from 'react';

class SelectDropdown extends Component {
    constructor(props) {
        super(props);
        if(!props.id) {
            throw new Error("id is undefined for select element");
        }
        this.state = {
            selected: props.selected ? props.selected : props.options[0]
        }
    }

    shouldComponentUpdate() {
        return false; //always return false as select re-renders internally
    }

    handler = () => {
        let elem = document.getElementById(this.props.id);
        let selected = this.props.options[elem.selectedIndex];
        if(selected.key !== this.state.selected.key) {
            this.props.handler(selected);
            this.setState({ selected: selected })
        }
    }

    render() {
        return(
            <select id={this.props.id} name={this.props.name} onChange={this.handler}>
                {this.props.options.map((option) => 
                    <option key={option.key} value={option.key} defaultValue={this.state.selected.key === option.key}>{option.label}</option>
                )}
            </select>
        )
    }
}

export default SelectDropdown;
