import React, { Component } from 'react';

import CreationModal from './CreationModal.jsx';
import Stock from './Stock.jsx';


/**
 * A Component which represents a portfolio in the application. The
 * portfolio is responsible for fetching the data for the stocks and
 * representing them in a table for the user.
 */
export default class Portfolio extends Component {
    API_URL = "https://www.alphavantage.co/query";
    API_KEY = "RKZX2JYAYBAFV5S6";
    state = {
        'showStockCreationModal': false,
        'unitValues': {}
    }

    // If we have loaded a portfolio from the local storage, we must
    // fetch the current stock values from the stock API.
    componentDidMount() {
        if (this.props.stocks.length) {
            this.props.stocks.forEach((stock) => {
                this.fetchStockValue(stock.symbol);
            });
        }
    }

    // Use the Alphavantage API to fetch current stock values. The API
    // is limited to only 5 requests / minute for free users, which is
    // why this fails if too many different stocks are added.
    fetchStockValue(stockName) {
        const data = fetch(this.API_URL + "?function=GLOBAL_QUOTE&symbol=" + stockName + "&apikey=" + this.API_KEY);
        data.then((result) => {
            result.json().then((resultData) => {
                if (resultData["Global Quote"]) {
                    const unitValues = this.state.unitValues;
                    unitValues[stockName] = resultData["Global Quote"]["05. price"];
                    this.setState({'unitValues': unitValues});
                }
            });
        })
    }

    render() {
        // Calculate the total value of all the stocks in the portfolio.
        let totalValue = 0;
        this.props.stocks.forEach((stock) => {
            if (this.state.unitValues[stock.symbol]) {
                totalValue += this.state.unitValues[stock.symbol] * stock.amount;
            }
        });

        return (
            <div className="portfolio col-sm-12 col-md-6 px-2 mt-2">
                <div className="p-2 border border-dark">
                    <div className="row">
                        <div className="col-12">
                            <p className="font-weight-bold mx-2 mb-2">{this.props.name}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stocks mb-3 mx-1">
                                <div className="row stock-header">
                                    <div className="col">
                                        <span>Symbol</span>
                                    </div>
                                    <div className="col">
                                        <span>Unit value</span>
                                    </div>
                                    <div className="col">
                                        <span>Quantity</span>
                                    </div>
                                    <div className="col">
                                        <span>Total value</span>
                                    </div>
                                    <div className="checkbox col" />
                                </div>
                                {this.props.stocks.map((stock, i) => {
                                    return <Stock
                                        key={i} stock={stock}
                                        unitValue={this.state.unitValues[stock.symbol]}
                                        selectStock={(stock, selected) => this.props.selectStock(stock, this.props.id, selected)} />
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="px-1 m-0 pb-3">Total value of the portfolio: <strong>{totalValue.toFixed(2)} $</strong></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary btn-sm mobile-full-width" 
                                    onClick={() => this.setState({'showStockCreationModal': true})}>
                                Add stock
                            </button>
                            <button className="btn btn-lightdanger btn-sm float-right mobile-full-width" onClick={this.props.deletePortfolio}>
                                Delete a portfolio
                            </button>
                            <button className="btn btn-lightdanger btn-sm delete-button mobile-full-width float-right mr-sm-2"
                                onClick={this.props.deleteSelectedStocks}>
                                Delete stocks
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.showStockCreationModal
                    ? <CreationModal
                        title="Create a new stock"
                        inputs={[{
                            id: "symbol",
                            helpText: "Write the symbol of the stock...",
                            validate: (val) => val.length < 1
                        }, {
                            id: "amount",
                            helpText: "Write the amount of shares...",
                            validate: (val) => isNaN(parseInt(val, 10)) || parseInt(val, 10) <= 0
                        }]}
                        close={() => this.setState({'showStockCreationModal': false})}
                        onCreate={(values) => {
                            this.fetchStockValue(values.symbol);
                            this.props.addStock(values);
                        }}
                        submitName={"Add stock"} />
                    : null
                }
            </div>
        )
    }
}
