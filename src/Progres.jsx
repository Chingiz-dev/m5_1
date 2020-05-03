import React from 'react';
import PropTypes, { number } from 'prop-types';
import Decimal from './Decimal';
import greenArrow from '../src/img/greenArrow.png';
import redArrow from '../src/img/redArrow.png';

class Progres extends React.Component {
    state = {
        oldBalance: null,
        changes: '',
        changesPercentage: ''
    }
    componentDidMount() {
        this.takeTickerPrice()
    }
    takeTickerPrice = () => {
        const { ticker } = this.props;
        fetch(`https://financialmodelingprep.com/api/v3/company/profile/${ticker}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (!data.companyProfiles) {
                    const value = (data.profile.price - this.props.price).toFixed(2);
                    const changesValue = (100 - ((this.props.price * 100) / data.profile.price)).toFixed(2)
                    this.setState({
                        changes: value,
                        changesPercentage: changesValue
                    });
                } else {
                    const newDat = data.companyProfiles;
                    const arr = [];
                    for (let i = 0; i < newDat.length; i++) {
                        arr.push(newDat[i].profile.price * this.props.amount[i]);
                    }
                    const oldBalance = this.props.balance;
                    const totalBalance = (oldBalance - +arr.reduce((a, b) => { return a + b })).toFixed(2);
                    const changesBalance = (totalBalance * 100) / this.props.balance;
                    this.setState({
                        oldBalance: oldBalance,
                        changes: totalBalance,
                        changesPercentage: changesBalance
                    })
                }
            })
    }
    render() {
        const { oldBalance, changes, changesPercentage } = this.state
        const balance = oldBalance == null ? false : true;
        const status = changes > 0 ? priceUp : priceDown;
        console.log(balance)
        return (
            <div >
                {balance ? <Decimal number={oldBalance} /> : null}
                <div style={{ ...tdArrowPrice, ...status }}>
                    <div >{changes > 0 ? <img src={greenArrow} /> : <img src={redArrow} />}{changes}$</div>
                    <div>({changesPercentage}%)</div>
                </div>
            </div>
        )
    }
}
const tdArrowPrice = {
    'color': "#000",
    'fontSize': "18px",
    'fontWeight': "normal",
    'justify-content': "space-around",
    'display': "flex",
    'align-items': 'center',
    'width': '120px',
}
const priceDown = {
    'color': "#FF2C2C",

}
const priceUp = {
    'color': "#2FC20A",
}
export default Progres