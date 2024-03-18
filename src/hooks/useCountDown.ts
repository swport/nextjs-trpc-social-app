import React from "react";

type TReturn = [number, () => void];

const useCountDown = (target: number, autoStart = false, onComplete?: () => void): TReturn => {
	const [count, setCount] = React.useState(0);
	const [started, setStarted] = React.useState(false);

	const interval = React.useRef<number | NodeJS.Timer>();
	const cb = React.useRef(onComplete);

	const stop = React.useCallback(() => {
		if (interval.current) {
			clearInterval(interval.current);
			interval.current = undefined;
		}
	}, []);

	// fn to start or restart the countdown
	const start = React.useCallback(() => {
		setCount(target);
		setStarted(true);
	}, [target]);

	React.useEffect(() => {
		cb.current = onComplete;
	});

	React.useEffect(() => {
		setCount(target);
		setStarted(autoStart);
	}, [target, autoStart]);

	React.useEffect(() => {
		if (started && !interval.current) {
			interval.current = setInterval(() => {
				setCount((c) => c - 1);
			}, 1000);
		}

		return () => {
			stop();
		};
	}, [started, stop]);

	React.useEffect(() => {
		if (count < 1 && interval.current) {
			stop();
			setStarted(false);
			cb.current?.();
		}
	}, [count, stop]);

	return [count, start];
};

export default useCountDown;
