import { useEffect, useRef } from 'react';

const useInterval = (callback, delay, { skip = false, leading = false }) => {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => !skip && savedCallback.current();

		if (leading) tick();

		const id = setInterval(tick, delay);

		return () => clearInterval(id);
	}, [delay, leading, skip]);
};

export default useInterval;
