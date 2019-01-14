import React, { Component } from 'react'


export default class CreationModal extends Component {
    state = {
        'values': {}
    }

    setValue(id, value) {
        const values = this.state.values;
        values[id] = value;
        this.setState({'values': values});
    }

    canSubmit() {
        const sameLength = Object.keys(this.state.values).length === this.props.inputs.length;
        if (sameLength) {
            return this.props.inputs.some((inp) => inp.validate(this.state.values[inp.id]));
        } else {
            return true;
        }
    }

    render() {
        return (
            <div className="modal" tabIndex="-1">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" onClick={this.props.close}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.inputs.map((inp) => <input
                                key={inp.id}
                                onChange={(e) => this.setValue(inp.id, e.target.value)}
                                className="form-control stock-input"
                                placeholder={inp.helpText} />
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    this.props.onCreate(this.state.values);
                                    this.props.close();
                                }}
                                disabled={this.canSubmit()}>
                                Create Portfolio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
