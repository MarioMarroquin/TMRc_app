import { useEffect, useRef } from 'react';

const useLiveTime = (callback) => {
	const savedCallback = useRef();

	function getLiveTime() {
		const currentTime = new Date();

		const missingToNextMinute =
			(60 - currentTime.getSeconds()) * 1000 - currentTime.getMilliseconds();

		savedCallback.current(currentTime);
		return missingToNextMinute;
	}

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		(async function () {
			let missingTime = 0;
			while (true) {
				missingTime = getLiveTime();
				await new Promise((resolve) => setTimeout(resolve, missingTime));
			}
		})();
	}, []);
};

export default useLiveTime;
