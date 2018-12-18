import React from 'react';

const SymbolList = ["●", "♭", "2", "m", "M", "4", "T", "5", "+", "°", "7", "▵"];



const Symbol = (props) => {
    return (
        <span>{props.sym}</span>
    );
};

const String = (props) => {
    let symbols = [];
    for (let i=0; i<SymbolList.length; i++){
        symbols.push(<Symbol key={i} sym={SymbolList[(i+props.root)%SymbolList.length]}/>);
    }
    return (
        <div>
            {symbols}
        </div>
    );
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            root: "A",
            symbols: ["●", "M", "5"]
        };
    }

    render() {
        return (
            <div>
                <String root={4}/>
                <String root={9}/>
                <String root={2}/>
                <String root={7}/>
                <String root={11}/>
                <String root={4}/>
            </div>
        );
    }
}


module.exports = App;
