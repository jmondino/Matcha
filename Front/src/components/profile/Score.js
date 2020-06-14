import React, { Component } from 'react'

class Score extends Component {

    colorScore = (score) => {
        if (score === -99999999) {
            return <div><i className="fas fa-infinity"></i><i className="fas fa-star"></i></div>;
        }
        if (score <= 25) {
            return <div className="red-text"> { score } <i className="fas fa-star red-text"></i></div>;
        } else if (score <= 50) {
            return <div className="yellow-text"> { score } <i className="fas fa-star yellow-text"></i></div>;
        } else if (score <= 75) {
            return <div className="green-text"> { score } <i className="fas fa-star green-text"></i></div>;
        }
        return <div className="sweet_pink"> { score } <i className="fas fa-star sweet_pink"></i></div>;
    }

    render() {
        const output = this.colorScore(this.props.score ? this.props.score : -99999999);
        return (
            output
        )
    }
}

export default Score
