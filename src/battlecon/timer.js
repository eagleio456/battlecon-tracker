import React, {useState, useEffect} from 'react';

export default function Timer({value}) {
    let [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
          }, 1000);
        return () => clearInterval(interval);
      }, [seconds]);

      useEffect(() => {
        setSeconds(value);
      }, [value]);

    return (
        <div>{seconds}s</div>
    );
}