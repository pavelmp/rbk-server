import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    constructor(){
        super();
        this.state = {
            name: 'RBK'
        }
    }

    render(){
        return (
            <div>
                <h1>{`Welcome to ${this.state.name}!`}</h1>
                <img src='./images/tree.jpeg'/>
            </div>
        )
    }
};

ReactDOM.render(<App/>, document.getElementById('root'));
