import React, { useState, useEffect } from 'react';
import {useSessionStorage} from 'react-use';
import update from 'immutability-helper';

const SymbolList = ["", "♭", "2", "m", "M", "4", "T", "5", "+", "○", "7", "△"];

const RootNotes = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

const NumDots = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0];

const GetRoot = (letter) => {
    return RootNotes.indexOf(letter);
}

const NUT = 7;
const PADDING = 5;
const ROOTS = 40;
const CHORDS = 42;
const TUNINGS = 40;


const maybeClass = (flag, name) => (flag ? name : "");

const Symbol = ({sym, useNote, rootNote, emphasized, select, size}) => {
    const margin = 2;
    const symbol = useNote ? RootNotes[(sym + GetRoot(rootNote) + 12) % 12] : SymbolList[sym] || rootNote;
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
            }} >{symbol}</div>
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

const Slug = ({width, height}) => {
    return <span style={{width: width, height:height}}/>;
}

const Dots = ({size, horizontal, length}) => {
    let dots = [];
    const SIZE = 8;
    dots.push(<Slug key={"-1"} width={horizontal ? size : SIZE} height={horizontal ? SIZE : size}/>);
    for (let i=0; i<length; i++){
        if (i === 1) {
            dots.push(<Slug key={"nut"} width={5} height={5}/>);
        }
        const numDots = NumDots[i];
        if (numDots) {
            dots.push(<span key={i} style={{
                fontSize: 8,
                width: horizontal ? size : SIZE,
                height: horizontal ? SIZE : size,
                display:"flex",
                justifyContent: "center",
                alignItems: "center"
            }}><span>{"●".repeat(numDots)}</span></span>);
        } else {
            dots.push(<Slug key={i} width={horizontal ? size : SIZE} height={horizontal ? SIZE : size}/>);
        }
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: horizontal ? "row" : "column",
            justifyContent: "space-around"
        }}>
            {dots}
        </div>
    );
}

const String = ({useNotes, selectAll, selectedFret, selectFret, size, horizontal, zero, rootNote, symbols, length, selectSymbol}) => {
    let symbs = [];
    for (let i=0; i<length + 1; i++){
        if (i === 1) {
            symbs.push(<Nut size={size} horizontal={horizontal} key={"nut"} />);
        }
        const symbol = (i + zero - GetRoot(rootNote) + SymbolList.length) % SymbolList.length;
        const emphasizedSymbol = symbols.indexOf(symbol) > -1;
        const emphasizedFret = i === selectedFret;
        symbs.push(<Symbol
            rootNote={rootNote}
            size={size}
            useNote={useNotes}
            emphasized={selectAll ? emphasizedSymbol : emphasizedFret}
            key={i}
            sym={symbol}
            select={(symbol)=>{
                if (selectAll) {
                    selectSymbol(symbol);
                } else {
                    selectFret(emphasizedFret ? null : i);
                }
            }}/>);
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

const Neck = ({useNotes, zeros, frets, setFrets, selectAll, size, horizontal, rootNote, symbols, length, selectSymbol}) => {
    return (
        <div style={{
            flexGrow: 1,
            padding: PADDING,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: horizontal ? "column" : "row-reverse"
        }}>
            <Dots size={size} horizontal={horizontal} length={length} />
            <div style={{
                justifyContent: "space-around",
                alignItems: "center",
                display: "flex",
                flexDirection: horizontal ? "column" : "row-reverse"
            }}>
                {zeros.map((zero, i) => {
                    return <String
                        key={i} size={size} horizontal={horizontal}
                        useNotes={useNotes}
                        zero={zero} rootNote={rootNote} symbols={symbols} selectSymbol={selectSymbol}
                        selectAll={selectAll} selectedFret={frets[i]} selectFret={(fret)=>{
                            setFrets(update(frets, {[i]: {$set: fret === null ? "x" : fret}}));
                        }}
                        length={length} /> ;
                })}
            </div>
            <Dots size={size} horizontal={horizontal} length={length} />
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
    "drop-d",
    "banjo",
    "sawmill",
    "cgda",
    "gdae"
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
        case "banjo":
            return [2, 11, 7, 2];
        case "sawmill":
            return [2, 0, 7, 2];
        case "cgda":
            return [9, 2, 7, 0];
        case "gdae":
            return [4, 9, 2, 7];
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
        width= screen.width;
        height= screen.height;
    } else {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    return {
        width, height
    };
}

const Buttons = ({useNotes, selectAll, setSelectAll, setUseNotes, showHelp}) => {
    return (
        <div style={{
            position:"fixed",
            bottom: 5,
            right: 5,
            display:"flex"
        }}>
            <form action="https://www.paypal.me/boardzorg" target="_blank">
                <button type="submit" title="donate">❤</button>
            </form>
            <button onClick={showHelp}>?</button>
            <button onClick={()=>{
                setSelectAll(!selectAll);
            }}>{selectAll ? "fret" : "chord"}</button>
            <button onClick={()=>{
                setUseNotes(!useNotes);
            }}>{useNotes ? "note" : "symbol"}</button>
        </div>
    );
}

const FTUE = ({close}) => {
    return (
        <div style={{
            fontFamily:"system-ui",
            fontSize:12,
            position:"fixed",
            margin:"auto",
            top: 20,
            right: 30,
            left: 30,
            bottom: 20,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
        }}>
            <div style={{
                position:"relative",
                fontFamily:"system-ui",
                fontSize:12,
                backgroundColor:"white",
                borderRadius: 5,
                border: "black solid 1px",
                padding: 15,
                display:"flex",
                alignItems:"stretch",
                justifyContent:"flex-start",
                flexDirection: "column"
            }}>
                <button style={{position:"absolute", right: 5, top: 5}} onClick={close}>x</button>
                <div style={{display:"flex", flexWrap:"wrap", justifyContent:"space-around"}}> 
                    <div style={{maxWidth:350}}>
                    <p style={{textAlign:"justify"}}>
                    <b>Neck</b> is a tool for exploring the neck of a guitar
                    and how to play chords in different positions. 
                        Select a root note to highlight that note everywhere it appears on the guitar.
                        From there you can select a chord symbol or manually construct a chord from
                        intervals above that root by clicking on the frets.
                        Select a non-standard tuning if desired.
                        The intervals are represented symbolically inspired by common chord symbols that
                        contain them. 
                        Click the heart if you want to fund the creator.
                        </p>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>symbol</th>
                            <th>description</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr><td>[Root]</td><td>root note is noted with letter</td></tr>
                            <tr><td>♭</td><td> flat-2</td></tr>
                            <tr><td>2</td><td> 2 or 9 (defining of sus2 and add9 chords)</td></tr>
                            <tr><td>m</td><td> minor 3rd (defining of minor chords)</td></tr>
                            <tr><td>M</td><td> major 3rd (defining of major chords)</td></tr>
                            <tr><td>4</td><td> perfect 4th (defining of sus4)</td></tr>
                            <tr><td>T</td><td> "tritone" (defining of diminished chords)</td></tr>
                            <tr><td>5</td><td> perfect 5th (common in many chords)</td></tr>
                            <tr><td>+</td><td> augmented 5th and minor 6th</td></tr>
                            <tr><td>○</td><td> major 6th and diminished 7th</td></tr>
                            <tr><td>7</td><td> minor 7th (defining of a dominant 7 chord)</td></tr>
                            <tr><td>△</td><td> major 7th (defining of major 7th chord)</td></tr>
                        </tbody>
                    </table>
                </div>
                <button onClick={close}>Get Started</button>
            </div>
        </div>
    );
}

const App = () => {

    const [rootNote, setRootNote] = useSessionStorage("rootNote", "E");
    const [symbols, setSymbols] = useSessionStorage("symbols", []);
    const [length, setLength] = useSessionStorage("length", 12);
    const [tuning, setTuning] = useSessionStorage("tuning", "standard");
    const [dimensions, setDimensions] = useState(GetDimensions());
    const [showFTUE, setShowFTUE] = useSessionStorage("ftue", "show");
    const [selectAll, setSelectAll] = useSessionStorage("selectAll", true);
    const [useNotes, setUseNotes] = useSessionStorage("useNotes", false);
    const [frets, setFrets] = useSessionStorage("frets", ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"]);

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
    const zeros = GetZerosForTuning(tuning);
    const size = Math.min(
        (majorDimension - (ROOTS + CHORDS + TUNINGS + NUT + 2 * PADDING)) / (length + 1),
        ((minorDimension - (zeros.length * PADDING)) / zeros.length)
    );
    return (
        <div style={{display: "flex", flexDirection: horizontal ? "row" : "column", height: "100%", width: "100%"}}>
            <Buttons useNotes={useNotes} setUseNotes={setUseNotes} setSelectAll={setSelectAll} selectAll={selectAll} showHelp={()=>{setShowFTUE("show");}} />
            {showFTUE === "show" ? <FTUE close={()=>{setShowFTUE("hide");}}/> : <></>}
            <TuningSelector horizontal={horizontal} tuning={tuning} selectTuning={(tuning)=>{setTuning(tuning);}} />
            <RootSelector horizontal={horizontal} selectedRoot={rootNote} selectRoot={(rootNote)=>{
                setRootNote(rootNote);
            }}/>
            {selectAll ? <ChordSelector horizontal={horizontal} rootNote={rootNote} symbols={symbols} selectSymbols={setSymbols} /> : <></> }
            <Neck selectAll={selectAll}
                frets={frets}
                setFrets={setFrets}
                useNotes={useNotes}
                zeros={GetZerosForTuning(tuning)}
                size={size}
                horizontal={horizontal}
                rootNote={rootNote}
                symbols={symbols}
                length={length}
                selectSymbol={(symbol) => {
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
