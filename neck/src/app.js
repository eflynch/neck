import React from 'react';

const SymbolList = ["●", "♭", "2", "m", "M", "4", "T", "5", "+", "○", "7", "△"];

const RootNotes = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

const GetRoot = (letter) => {
    return RootNotes.indexOf(letter);
}

const NUT = 7;
const PADDING = 5;
const ROOTS = 40;
const SELECTED_BACKGROUND_COLOR = "#616f39";
const SELECTED_TEXT_COLOR = "#ffd98e";
const UNSELECTED_BACKGROUND_COLOR = "#ffd98e";
const UNSELECTED_TEXT_COLOR = "#616f39";



const Symbol = ({sym, emphasized, select, size}) => {
    const margin = 2;
    return (
        <div style={{
            color: emphasized ? SELECTED_TEXT_COLOR : UNSELECTED_TEXT_COLOR,
            backgroundColor: emphasized ? SELECTED_BACKGROUND_COLOR : UNSELECTED_BACKGROUND_COLOR,
            height: size - 2 * margin,
            width: size - 2 * margin,
            fontSize: size * 0.6,
            borderRadius: (size - 2 * margin) * 0.5,
            boxShadow: "rgba(0, 0, 0, 0.4) 1px 2px",
            margin: margin,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }} onClick={(e)=>{
            select(sym);
        }} >{SymbolList[sym]}</div>
    );
};

const Nut = ({size, horizontal}) => {
    return (
        <span style={{
            height: horizontal ? size : 2,
            width: horizontal ? 2 : size,
            backgroundColor: "black",
            margin: 2.5,
        }}></span>
    );
}

const String = ({size, horizontal, zero, rootNote, symbols, length, selectSymbol}) => {
    let symbs = [];
    for (let i=0; i<length + 1; i++){
        if (i === 1) {
            symbs.push(<Nut size={size} horizontal={horizontal} key={"nut"} />);
        }
        const symbol = (i + zero - GetRoot(rootNote) + SymbolList.length) % SymbolList.length;
        let emphasized = symbols.indexOf(symbol) > -1;
        symbs.push(<Symbol size={size} emphasized={emphasized} key={i} sym={symbol} select={selectSymbol}/>);
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: horizontal ? "row" : "column",
            justifyContent: "space-around"
        }}>
            {symbs}
        </div>
    );
}

const Neck = ({size, horizontal, rootNote, symbols, length, selectSymbol}) => {
    return (
        <div style={{
            flexGrow: 1,
            padding: PADDING,
            justifyContent: "space-around",
            alignItems: "center",
            display: "flex",
            flexDirection: horizontal ? "column" : "row"
        }}>
            <String size={size} horizontal={horizontal} zero={4} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length} />
            <String size={size} horizontal={horizontal} zero={11} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} horizontal={horizontal} zero={7} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} horizontal={horizontal} zero={2} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} horizontal={horizontal} zero={9} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
            <String size={size} horizontal={horizontal} zero={4} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length}/>
        </div>
    );   
}

const RootSelect = ({rootNote, onClick, selected}) => {
    return (
        <button style={{
            color: selected ? SELECTED_TEXT_COLOR: UNSELECTED_TEXT_COLOR,
            backgroundColor: selected ? SELECTED_BACKGROUND_COLOR : UNSELECTED_BACKGROUND_COLOR,
            width: ROOTS,
            display: "flex",
            fontSize: 14,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
        }} onClick={onClick}><span>{rootNote}</span></button>
    );
}

const ChordSelect = ({name, selectSymbols, symbols}) => {
    return (
        <button style={{
            backgroundColor: SELECTED_TEXT_COLOR,
            height: 25,
            fontSize: 10,
            borderRadius: 5,
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
            justifyContent: "space-between",
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

const RootSelector = ({horizontal, selectedRoot, selectRoot}) => {
    const rootNotes = RootNotes.map((rootNote) => {
        return <RootSelect key={rootNote} selected={rootNote===selectedRoot} rootNote={rootNote} onClick={(e)=>{
            selectRoot(rootNote);
        }} />;
    });
    return (
        <div style={{
            display: "flex",
            flexDirection: horizontal ? "column" : "row",
            justifyContent: "space-between"
        }}>{rootNotes}</div>
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
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
        let width = 0;
        let height = 0;
        if (iOS) {
            width = window.orientation === 0 ? screen.width : screen.height;
            height = window.orientation === 0 ? screen.height : screen.width;
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        setTimeout(()=>{this.setState({width: width, height: height});}, 0);
    };

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount(){
        window.addEventListener("resize", this.updateDimensions);
        document.addEventListener("orientationchange", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        document.removeEventListener("orientationchange", this.updateDimensions);
    }

    render() {
        const horizontal = this.state.width > this.state.height;
        const size = (Math.max(this.state.width, this.state.height) - (ROOTS + NUT + 2 * PADDING)) / (this.state.length + 1);
        return (
            <div style={{display: "flex", flexDirection: horizontal ? "row" : "column", height: "100%", width: "100%"}}>
                <RootSelector horizontal={horizontal} selectedRoot={this.state.rootNote} selectRoot={(rootNote)=>{
                    this.setState({rootNote: rootNote});
                }}/>
                <Neck size={size} horizontal={horizontal} rootNote={this.state.rootNote} symbols={this.state.symbols} length={this.state.length} selectSymbol={(symbol) => {
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
