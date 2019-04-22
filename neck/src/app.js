import React from 'react';

const SymbolList = ["●", "♭", "2", "m", "M", "4", "T", "5", "+", "○", "7", "△"];

const RootNotes = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

const GetRoot = (letter) => {
    return RootNotes.indexOf(letter);
}



const Symbol = ({sym, emphasized, select}) => {
    return (
        <span style={{
            color: emphasized ? "black" : "rgba(0, 0, 0, 0.2)",
            backgroundColor: emphasized ? "green" : "white",
            margin: 2.5,
            width: 40,
            height: 40,
            fontSize: 20,
            fontFamily: "monospace",
            borderRadius: 20,
            border: "solid black 1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }} onClick={(e)=>{
            select(sym);
        }} >{SymbolList[sym]}</span>
    );
};

const Nut = (props) => {
    return (
        <span style={{
            height: 30,
            width: 2,
            backgroundColor: "black",
            margin: 2.5,
        }}></span>
    );
}

const String = ({zero, rootNote, symbols, length, selectSymbol}) => {
    let symbs = [];
    for (let i=0; i<length + 1; i++){
        if (i === 1) {
            symbs.push(<Nut key={"nut"} />);
        }
        const symbol = (i + zero - GetRoot(rootNote) + SymbolList.length) % SymbolList.length;
        let emphasized = symbols.indexOf(symbol) > -1;
        symbs.push(<Symbol emphasized={emphasized} key={i} sym={symbol} select={selectSymbol}/>);
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
        }}>
            {symbs}
        </div>
    );
}


const FretBoard = ({length}) => {
    let symbols = [];
    for (let i=0; i<length + 1; i++){
        let sym = "";
        if ([3, 5, 7, 9, 11, 13].indexOf(i) >= 0) {
            sym = "◆" ;
        }
        symbols.push(<span style={{
            margin: 5,
            width: 51,
            height: 10,
            fontSize: 20,
            fontFamily: "monospace",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }} key={i} >{sym}</span>);
    }
    return (
        <div style={{
            paddingLeft: 7,
            display: "flex",
            flexDirection: "row",
            height: 20,
        }}>
        {symbols}
        </div>
    );
}

const Neck = ({rootNote, symbols, length, selectSymbol}) => {
    return (
        <div style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            padding: 10,
            borderRadius: 20,
        }}>
            <String zero={4} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length} />
            <String zero={11} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String zero={7} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String zero={2} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String zero={9} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String zero={4} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
        </div>
    );   
}

const RootSelect = ({rootNote, onClick, selected}) => {
    return (
        <button style={{
            backgroundColor: selected ? "green" : "white",
            height: 25,
            fontSize: 10,
            borderRadius: 5,
            fontFamily: "monospace",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
        }} onClick={onClick}>{rootNote}</button>
    );
}

const ChordSelect = ({name, selectSymbols, symbols}) => {
    return (
        <button style={{
            backgroundColor: "white",
            height: 25,
            fontSize: 10,
            borderRadius: 5,
            fontFamily: "monospace",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
        }} onClick={(e)=>{
            selectSymbols(symbols);
        }}>{name}</button>
    );
}

const ChordSelector = ({selectSymbols}) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between"
        }}>
            <ChordSelect name="M" selectSymbols={selectSymbols} symbols={[0, 4, 7]}/>
            <ChordSelect name="m" selectSymbols={selectSymbols} symbols={[0, 3, 7]}/>
            <ChordSelect name="7" selectSymbols={selectSymbols} symbols={[0, 4, 7, 10]}/>
            <ChordSelect name="maj7" selectSymbols={selectSymbols} symbols={[0, 4, 7, 11]}/>
            <ChordSelect name="m7" selectSymbols={selectSymbols} symbols={[0, 3, 7, 10]}/>
            <ChordSelect name="half-dim7" selectSymbols={selectSymbols} symbols={[0, 3, 6, 10]}/>
            <ChordSelect name="dim7" selectSymbols={selectSymbols} symbols={[0, 3, 6, 9]}/>
            <ChordSelect name="6" selectSymbols={selectSymbols} symbols={[0, 4, 7, 9]}/>
            <ChordSelect name="aug" selectSymbols={selectSymbols} symbols={[0, 4, 8]}/>
        </div>
    );
}

const RootSelector = ({selectedRoot, selectRoot}) => {
    const rootNotes = RootNotes.map((rootNote) => {
        return <RootSelect key={rootNote} selected={rootNote===selectedRoot} rootNote={rootNote} onClick={(e)=>{
            selectRoot(rootNote);
        }} />;
    });
    return (
        <div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>{rootNotes}</div>
        </div>
    );
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rootNote: "E",
            symbols: [0, 3, 7],
            length: 12
        };
    }

    render() {
        return (
            <div>
                <div>
                    <RootSelector selectedRoot={this.state.rootNote} selectRoot={(rootNote)=>{
                        this.setState({rootNote: rootNote});
                    }}/>
                    <ChordSelector selectSymbols={(symbols) => {
                        this.setState({symbols: symbols});
                    }}/>
                </div>
                <Neck rootNote={this.state.rootNote} symbols={this.state.symbols} length={this.state.length} selectSymbol={(symbol) => {
                    if (this.state.symbols.indexOf(symbol) >= 0) {
                        this.state.symbols.splice(this.state.symbols.indexOf(symbol), 1);
                    } else {
                        this.state.symbols.push(symbol);
                    }
                    this.setState({symbols: this.state.symbols});
                }}/>
            </div>
        );
    }
}


module.exports = App;
