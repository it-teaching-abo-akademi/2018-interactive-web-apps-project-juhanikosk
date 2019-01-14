import React from 'react';


/**
 * A component which represents a single stock row in a portfolio.
 * The only functionality of the component is that it maintains it's
 * selected status.
 */
export default class Stock extends React.Component {
    state = {
        selected: false
    }

    render() {
        const { props } = this;
        return (
            <div className="row stock-row">
                <div className="col">
                    <span>{props.stock.symbol}</span>
                </div>
                <div className="col">
                    <span>{`${props.unitValue ? parseFloat(props.unitValue).toFixed(2) + ' $' : 'No value fetched'}`}</span>
                </div>
                <div className="col">
                    <span>{props.stock.amount}</span>
                </div>
                <div className="col">
                    <span>{`${(props.stock.amount * props.unitValue).toFixed(2)} $`}</span>
                </div>
                <div className="checkbox col">
                    <input type="checkbox"
                        onChange={(e) => this.setState({
                            selected: !this.state.selected
                        }, () => props.selectStock(props.stock, this.state.selected))}
                        value={this.state.selected}
                    />
                </div>
            </div>
        );
    }
}