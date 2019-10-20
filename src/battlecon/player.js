import React, {useState, useEffect} from 'react';

export default function Player({currentTurn, dispatch, className, playerNbr}) {
    let [force, setForce] = useState(1);
    let [life, setLife] = useState(20);
    let [isSpeedUp, setSpeedUp] = useState(false);
    let [isPowerUp, setPowerUp] = useState(false);
    let [isBulkUp, setBulkUp] = useState(false);
    let [isForcePlusOne, setForcePlusOne] = useState(false);
    let [isFinisherActive, setFinisherActive] = useState(false);
    let [finisherUsed, setFinisherUsed] = useState(false);

    
    useEffect(() => {
        let forceToAdd = 1;
        if (life < 8) {
            forceToAdd++;
        }
        if (isForcePlusOne) {
            forceToAdd++;
        }
        if (isFinisherActive) {
            setFinisherUsed(true);
        }
        setSpeedUp(false);
        setPowerUp(false);
        setBulkUp(false);
        setForcePlusOne(false);
        setFinisherActive(false);
        addForce(forceToAdd);

        dispatch({
            type: 'TURN_PLAYER'+playerNbr,
            payload: {
                life,
                force
            }
        })
        //NOTE: This could probably be reworked somehow
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTurn]);

    let addForce = amount => {
        setForce(force + amount);
        dispatch({
            type: 'REMOVE',
            payload: amount
        });
    };

    let speedUp = () => {
        if (isSpeedUp) {
            setSpeedUp(false);
            setForce(force + 2);
        } else {
            setSpeedUp(true);
            setForce(force - 2);
        }
    };

    let powerUp = () => {
        if (isPowerUp) {
            setPowerUp(false);
            setForce(force + 2);
        } else {
            setPowerUp(true);
            setForce(force - 2);
        }
    };

    let bulkUp = () => {
        if (isBulkUp) {
            setBulkUp(false);
            setForce(force + 2);
        } else {
            setBulkUp(true);
            setForce(force - 2);
        }
    };

    let forcePlusOne = () => {
        if (isForcePlusOne) {
            setForcePlusOne(false);
        } else {
            setForcePlusOne(true);
        }
    };

    let activateFinisher = () => {
        if (isFinisherActive) {
            setFinisherActive(false);
            setForce(force + life);
        } else {
            setFinisherActive(true);
            setForce(force - life);
        }
    };

    let special = () => {
        if (determineSpecialAction()) {
            forcePlusOne();
        } else {
            activateFinisher();
        }
    };

    let heal = () => {
        setLife(life + 1);
    };

    let damage = () => {
        setLife(life - 1);
    };

    let determineSpecialAction = () => {
        return force < life && !isFinisherActive;
    };

    let getSpecialButtonClass = () => {
        let name = 'special-button';
        if (isForcePlusOne || isFinisherActive) {
            name += ' active';
        }
        if (!determineSpecialAction()) {
            name += ' finisher';
        }
        if (finisherUsed) {
            name += ' disabled';
        }
        return name;
    };

    return (
        <div className={className + ' player'+playerNbr}>
            <div className="health-container">
                <button
                    type="button"
                    onClick={damage}
                    className="health-button"
                >
                    -
                </button>
                <label className={'health' + (life < 8 ? ' low' : '')}>
                    {life}
                </label>
                <button type="button" onClick={heal} className="health-button">
                    +
                </button>
            </div>
            <label className="force">Force: {force}</label>
            <div className="action-container">
                <button
                    type="button"
                    className={
                        'force-button speed' + (isSpeedUp ? ' active' : '')
                    }
                    onClick={speedUp}
                >
                    Speed Up
                </button>
                <button
                    type="button"
                    className={
                        'force-button power' + (isPowerUp ? ' active' : '')
                    }
                    onClick={powerUp}
                >
                    Power Up
                </button>
                <button
                    type="button"
                    className={
                        'force-button bulk' + (isBulkUp ? ' active' : '')
                    }
                    onClick={bulkUp}
                >
                    Bulk Up
                </button>
            </div>
            <button
                type="button"
                className={getSpecialButtonClass()}
                onClick={special}
                disabled={finisherUsed}
            >
                {finisherUsed ? 'Used' : (determineSpecialAction() ? 'Force +1' : 'Finisher')}
            </button>
        </div>
    );
}
