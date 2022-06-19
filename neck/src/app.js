import React, { useState, useEffect } from 'react';
import {useSessionStorage} from 'react-use';
import update from 'immutability-helper';

const SymbolList = ["", "♭", "2", "m", "M", "4", "T", "5", "+", "○", "7", "△"];

const RootNotes = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

const GetRoot = (letter) => {
    return RootNotes.indexOf(letter);
}

const NUT = 7;
const PADDING = 5;
const ROOTS = 40;
const CHORDS = 42;
const TUNINGS = 40;

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}


const maybeClass = (flag, name) => (flag ? name : "");

const Symbol = ({sym, rootNote, emphasized, select, size}) => {
    const margin = 2;
    return (
        <div
            className={[
                "selectable",
                "symbol",
                maybeClass(emphasized, "emphasized"),
                maybeClass(sym === 0, "root")
            ].join(" ")}
            style={{
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
            }} >{SymbolList[sym] || rootNote}</div>
    );
};

const Nut = ({size, horizontal}) => {
    return (
        <span style={{
            height: horizontal ? size : 3,
            width: horizontal ? 3 : size,
            backgroundColor: "gray",
            margin: 1.5,
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
        symbs.push(<Symbol rootNote={rootNote} size={size} emphasized={emphasized} key={i} sym={symbol} select={selectSymbol}/>);
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

const Neck = ({zeros, size, horizontal, rootNote, symbols, length, selectSymbol}) => {
    return (
        <div style={{
            flexGrow: 1,
            padding: PADDING,
            justifyContent: "space-around",
            alignItems: "center",
            display: "flex",
            flexDirection: horizontal ? "column" : "row-reverse"
        }}>
            {zeros.map((zero, i) => {
                return <String key={i} size={size} horizontal={horizontal} zero={zero} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol} length={length} /> ;
            })}
        </div>
    );   
}

const RootSelect = ({rootNote, onClick, selected}) => {
    return (
        <button 
            className={[
                "rootSelector",
                "selectable",
                maybeClass(selected, "emphasized"),
            ].join(" ")}
            
            style={{
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

const ChordSelect = ({horizontal, selectedSymbols, rootNote, name, selectSymbols, symbols}) => {
    return (
        <button
        className={[
            "chordSelector",
            "selectable",
            maybeClass(selectedSymbols === symbols, "emphasized"),
            maybeClass(horizontal, "horizontal")
        ].join(" ")}

        style={{
            height: 25,
            minWidth: CHORDS,
            fontSize: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
        }} onClick={()=>{
            selectSymbols(symbols.split(", ").map(parseFloat));
        }}>{rootNote}{name}</button>
    );
}

const ChordSelector = ({horizontal, rootNote, symbols, selectSymbols}) => {
    const selectedSymbols = symbols.join(", ");
    return (
        <div style={{
            display: "flex",
            flexDirection: horizontal ? "column" : "row",
            justifyContent: "space-between",
        }}>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="" selectSymbols={selectSymbols} symbols={"0, 4, 7"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="m" selectSymbols={selectSymbols} symbols={"0, 3, 7"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="7" selectSymbols={selectSymbols} symbols={"0, 4, 7, 10"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="△" selectSymbols={selectSymbols} symbols={"0, 4, 7, 11"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="m7" selectSymbols={selectSymbols} symbols={"0, 3, 7, 10"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="ø7" selectSymbols={selectSymbols} symbols={"0, 3, 6, 10"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="o7" selectSymbols={selectSymbols} symbols={"0, 3, 6, 9"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="6" selectSymbols={selectSymbols} symbols={"0, 4, 7, 9"}/>
            <ChordSelect selectedSymbols={selectedSymbols} horizontal={horizontal} rootNote={rootNote} name="aug" selectSymbols={selectSymbols} symbols={"0, 4, 8"}/>
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

const Tunings = [
    "standard",
    "dadgad",
    "open-g",
    "open-cmaj9",
    "drop-d"
];


const Tuning = ({horizontal, selected, tuning, selectTuning}) => {
    return (
        <button
            className={[
                "tuningSelector",
                "selectable",
                maybeClass(selected, "emphasized"),
                maybeClass(horizontal, "horizontal")
            ].join(" ")}
        
        style={{
            width: ROOTS,
            display: "flex",
            fontSize: 14,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
        }} onClick={()=>{selectTuning(tuning);}}>{tuning}</button>
    );
};

const TuningSelector = ({tuning, selectTuning, horizontal}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: horizontal ? "column" : "row",
            justifyContent: "space-between"
        }}>
            {Tunings.map((thisTuning) => {
                return <Tuning horizontal={horizontal} key={thisTuning} selected={tuning==thisTuning} tuning={thisTuning} selectTuning={selectTuning} />;
            })}
        </div>
    );
}

const GetZerosForTuning = (tuning) => {
    switch(tuning){
        case "drop-d":
            return [4, 11, 7, 2, 9, 2];
        case "open-cmaj9":
            return [4, 11, 7, 2, 7, 0];
        case "open-g":
            return [2, 11, 7, 2, 7, 2];
        case "dadgad":
            return [2, 9, 7, 2, 9, 2];
        case "standard":
        default:
            return [4, 11, 7, 2, 9, 4];
    }
}

const GetDimensions = () => {
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
    return {
        width, height
    };
}

const App = () => {

    const [rootNote, setRootNote] = useSessionStorage("rootNote", "E");
    const [symbols, setSymbols] = useSessionStorage("symbols", []);
    const [length, setLength] = useSessionStorage("length", 12);
    const [tuning, setTuning] = useSessionStorage("tuning", "standard");
    const [dimensions, setDimensions] = useState(GetDimensions());

    useEffect(()=>{
        const updateDimensions = () => {
            setDimensions(GetDimensions());
        };
        window.addEventListener("resize", updateDimensions);
        document.addEventListener("orientationchange", updateDimensions);
        return () => {
            window.removeEventListener("resize", updateDimensions);
            document.removeEventListener("orientationchange", updateDimensions);
        }
    }, [setDimensions]);

    const horizontal = dimensions.width > dimensions.height;
    const majorDimension = Math.max(dimensions.width, dimensions.height);
    const minorDimension = Math.min(dimensions.width, dimensions.height);
    const size = Math.min(
        (majorDimension - (ROOTS + CHORDS + TUNINGS + NUT + 2 * PADDING)) / (length + 1),
        ((minorDimension - (6 * PADDING)) / 6)
    );
    return (
        <div style={{display: "flex", flexDirection: horizontal ? "row" : "column", height: "100%", width: "100%"}}>
            <TuningSelector horizontal={horizontal} tuning={tuning} selectTuning={(tuning)=>{setTuning(tuning);}} />
            <RootSelector horizontal={horizontal} selectedRoot={rootNote} selectRoot={(rootNote)=>{
                setRootNote(rootNote);
            }}/>
            <ChordSelector horizontal={horizontal} rootNote={rootNote} symbols={symbols} selectSymbols={setSymbols} />
            <Neck zeros={GetZerosForTuning(tuning)} size={size} horizontal={horizontal} rootNote={rootNote} symbols={symbols} length={length} selectSymbol={(symbol) => {
                setSymbols((symbols) => {
                    if (symbols.indexOf(symbol) >= 0) {
                        return update(symbols, {$splice: [[symbols.indexOf(symbol), 1]]}).sort();
                    } else {
                        return update(symbols, {$push: [symbol]}).sort();
                    }
                });
            }}/>
        </div>
    );
}


module.exports = App;
