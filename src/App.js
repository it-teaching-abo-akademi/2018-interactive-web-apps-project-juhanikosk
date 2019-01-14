import React, { Component } from 'react';
import './App.scss';
import Portfolio from './components/Portfolio';
import CreationModal from './components/CreationModal';


class App extends Component {
    state = {
        'portfolios': [],
        'showCreationModal': false,
        'selectedStocks': []
    }

    // Load data from local storage.
    componentDidMount() {
        const data = localStorage.getItem('data');
        if (data) {
            const jsonData = JSON.parse(data);
            this.setState(jsonData)
        }
    }

    // Create a new unique ID for a portfolio.
    getNewPortolioId() {
        let portfolioId = 0;
        this.state.portfolios.forEach((port) => {
            if (port.id >= portfolioId) {
                portfolioId = port.id + 1
            }
        });

        return portfolioId;
    }

    // Create a new unique ID for a stock in portfolio.
    getNewStockId(stocks) {
        let stockId = 0;
        stocks.forEach((stock) => {
            if (stock.id >= stockId) {
                stockId = stock.id + 1
            }
        });

        return stockId;
    }

    // Create a new portfolio, which can contain stocks.
    createNewPortfolio(values) {
        const portfolio = {
            'name': values.name,
            'id': this.getNewPortolioId(),
            'stocks': []
        };

        this.setState({'portfolios': [...this.state.portfolios, portfolio]}, () => localStorage.setItem('data', JSON.stringify(this.state)));
    }

    // Add a stock to a portfolio.
    addStockToPortfolio(values, id) {
        const portfolios = this.state.portfolios.map((port) => {
            if (port.id === id) {
                if (port.stocks.filter((s) => s.symbol === values.symbol).length >= 50) {
                    alert("Can't add more than 50 unique stocks to a portfolio");
                    return port;
                }

                values.id = this.getNewStockId(port.stocks);
                port.stocks.push(values);
            }

            return port;
        });

        this.setState({'portfolios': portfolios}, () => localStorage.setItem('data', JSON.stringify(this.state)));
    }

    // Filter out the currently selected stocks to the state.
    selectStock = (stock, portfolioId, selected) => {
        let selectedStocks = this.state.selectedStocks;
        if (selected) {
            selectedStocks.push({
                'stock': stock,
                'portId': portfolioId
            });
        } else {
            selectedStocks = selectedStocks.filter((s) => s.stock.id !== stock.id);
        }

        this.setState({selectedStocks});
    }

    // Delete the stocks according to the state's selected stocks array.
    deleteSelectedStocks = () => {
        let portfolios = this.state.portfolios;
        this.state.selectedStocks.forEach((stock) => {
            portfolios = portfolios.map((port) => {
                if (port.id === stock.portId) {
                    port.stocks = port.stocks.filter((p) => p.id !== stock.stock.id);
                }

                return port;
            });
        });

        this.setState({portfolios, selectedStocks: []}, localStorage.setItem('data', JSON.stringify(this.state)));
    }

    render() {
        return (
            <div className="app-container">
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-primary mt-2 mx-2 mb-0"
                                onClick={() => this.setState({'showCreationModal': true})}
                                disabled={this.state.portfolios.length >= 10}>
                            Add new portfolio
                        </button>
                    </div>
                </div>
                <div className="row mx-0">
                    {this.state.portfolios.length
                        ? this.state.portfolios.map((portfolio, index) => 
                            <Portfolio
                                key={index}
                                id={portfolio.id}
                                name={portfolio.name}
                                stocks={portfolio.stocks}
                                deletePortfolio={() =>
                                    this.setState({
                                        'portfolios': this.state.portfolios.filter((port) => port.id !== portfolio.id)
                                    }, () => localStorage.setItem('data', JSON.stringify(this.state)))}
                                addStock={(values) => this.addStockToPortfolio(values, portfolio.id)}
                                selectStock={this.selectStock}
                                deleteSelectedStocks={this.deleteSelectedStocks}
                            />
                        )
                        : <div className="col-12 px-2">
                            <p className="mx-1 my-2 text-white">No portfolios made</p>
                        </div>}
                </div>
                {this.state.showCreationModal
                    ? <CreationModal
                        title="Create a new portfolio"
                        inputs={[{
                            id: "name",
                            helpText: "Write the name of the portfolio...",
                            validate: (val) => val.length < 4
                        }]}
                        close={() => this.setState({'showCreationModal': false})}
                        onCreate={(values) => this.createNewPortfolio(values)}
                        submitName={"Create portfolio"} />
                    : null}
            </div>
        );
    }
}

export default App;
