import React from 'react';

const SymbolList = ["●", "♭", "2", "m", "M", "4", "T", "5", "+", "○", "7", "△"];

const RootNotes = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

const GetRoot = (letter) => {
    return RootNotes.indexOf(letter);
}



const Symbol = ({sym, emphasized, select, size}) => {
    return (
        <div style={{
            color: emphasized ? "black" : "rgba(0, 0, 0, 0.2)",
            backgroundColor: emphasized ? "green" : "white",
            height: size,
            width: size,
            fontSize: 20,
            fontFamily: "monospace",
            borderRadius: size * 0.5,
            border: "solid black 1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }} onClick={(e)=>{
            select(sym);
        }} >{SymbolList[sym]}</div>
    );
};

const Nut = ({size}) => {
    return (
        <span style={{
            height: size,
            width: 2,
            backgroundColor: "black",
            margin: 2.5,
        }}></span>
    );
}

const String = ({size, zero, rootNote, symbols, length, selectSymbol}) => {
    let symbs = [];
    for (let i=0; i<length + 1; i++){
        if (i === 1) {
            symbs.push(<Nut size={size} key={"nut"} />);
        }
        const symbol = (i + zero - GetRoot(rootNote) + SymbolList.length) % SymbolList.length;
        let emphasized = symbols.indexOf(symbol) > -1;
        symbs.push(<Symbol size={size} emphasized={emphasized} key={i} sym={symbol} select={selectSymbol}/>);
    }
    return (
        <div style={{
            flexGrow: 1,
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

const Neck = ({size, rootNote, symbols, length, selectSymbol}) => {
    return (
        <div style={{
            flexGrow: 1,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            padding: 10,
            display: "flex",
            flexDirection: "column"
        }}>
            <String size={size} zero={4} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length} />
            <String size={size} zero={11} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} zero={7} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} zero={2} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} zero={9} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} zero={4} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
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
            width: undefined,
            height: undefined,
            rootNote: "E",
            symbols: [0, 3, 7],
            length: 12
        };
    }

    updateDimensions = () => {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    };

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount(){
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
        const size = (this.state.width - 12) / (this.state.length + 1);
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div>
                    <RootSelector selectedRoot={this.state.rootNote} selectRoot={(rootNote)=>{
                        this.setState({rootNote: rootNote});
                    }}/>
                    <ChordSelector selectSymbols={(symbols) => {
                        this.setState({symbols: symbols});
                    }}/>
                </div>
                <Neck size={size} rootNote={this.state.rootNote} symbols={this.state.symbols} length={this.state.length} selectSymbol={(symbol) => {
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
