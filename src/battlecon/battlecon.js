import React, {useState, useReducer} from 'react';
import Chart from 'chart.js';
import Player from './player';
import './battlecon.css';
import Timer from './timer';

let initialState = {
    forceLeft: 43,  //45 total. 2 are grabbed on init of player objectsß
    player1Turns: [],
    player2Turns: []
};

let reducer = (state, action) => {
    switch (action.type) {
        case 'ADD': {
            return {
                ...state,
                forceLeft: state.forceLeft + action.payload
            };
        }
        case 'REMOVE': {
            return {
                ...state,
                forceLeft: state.forceLeft - action.payload
            };
        }
        case 'TURN_PLAYER1': {
            state.player1Turns.push(action.payload);
            return {
                ...state,
                player1Turns: [...state.player1Turns]
            }
        }
        case 'TURN_PLAYER2': {
            state.player2Turns.push(action.payload);
            return {
                ...state,
                player2Turns: [...state.player2Turns]
            }
        }
        default: {
            return state;
        }
    }
};

export default function Battlecon() {
    let [state, dispatch] = useReducer(reducer, initialState);
    let [currentTurn, setCurrentTurn] = useState(1);
    let [useLineChart, setLineChart] = useState(false);
    let [secondsValue, setSecondsValue] = useState(0);

    let nextTurn = () => {
        setCurrentTurn(currentTurn + 1);
        
        //This is dirty and it renders twice
        setSecondsValue(0);
        setTimeout(()=> {
            setSecondsValue(1);
        }, 1000);
    };

    let flipCoin = () => {
        let number = Math.floor(Math.random() * 100);
        // console.log(number);
        if (number % 2 === 0) {
            alert('Player 1 wins the coin toss');
        } else {
            alert('Player 2 wins the coin toss');
        }
    }

    let switchGraph = () => {
        setLineChart(!useLineChart);
    }

    let ctx = document.getElementById('myChart');
    if (ctx) {
        new Chart(ctx, {
            type: useLineChart ? 'line' : 'bar',
            data: {
                labels: Object.keys(state.player1Turns),
                datasets: [
                    {
                        label: 'P1 Life',
                        type: 'line',
                        fill: false,
                        borderColor: 'rgba(2, 39, 202, 1)',
                        backgroundColor: 'rgba(38, 77, 253, 1)',
                        data: state.player1Turns.reduce((acc, curr) => [...acc, curr.life], [])
                    },
                    {
                        label: 'P1 Force',
                        fill: false,
                        borderColor: 'rgba(2, 39, 202, 0.5)',
                        backgroundColor: 'rgba(38, 77, 253, 0.5)',
                        data: state.player1Turns.reduce((acc, curr) => [...acc, curr.force], [])
                    },
                    {
                        label: 'P2 Life',
                        type: 'line',
                        fill: false,
                        borderColor: 'rgba(202, 2, 2, 1)',
                        backgroundColor: 'rgba(253, 28, 28, 1)',
                        data: state.player2Turns.reduce((acc, curr) => [...acc, curr.life], [])
                    },
                    {
                        label: 'P2 Force',
                        fill: false,
                        borderColor: 'rgba(202, 2, 2, 0.5)',
                        backgroundColor: 'rgba(253, 28, 28, 0.5)',
                        data: state.player2Turns.reduce((acc, curr) => [...acc, curr.force], [])
                    }
                ]
            },
            options: {
                animation: {
                    duration: 0
                }
            }
        });
    }

    return (
        <>
            <div id="battlecon-counter" className="battlecon-container">
                <Player
                    playerNbr={1}
                    className="player"
                    currentTurn={currentTurn}
                    dispatch={dispatch}
                />
                <div className="middle">
                    <button type="button" onClick={nextTurn}>
                        Next Turn
                    </button>
                    <Timer value={secondsValue} />
                    <div>Force Left: {state.forceLeft}</div>
                    <button type="button" onClick={flipCoin}>Flip Coin</button>
                    <button type="button" onClick={switchGraph}>Graph Style</button>
                </div>
                <Player
                    playerNbr={2}
                    className="player"
                    currentTurn={currentTurn}
                    dispatch={dispatch}
                />
            </div>
            <canvas id="myChart" width="400" height="100" />
        </>
    );
}
