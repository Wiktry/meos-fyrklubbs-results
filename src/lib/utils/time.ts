const toString = function (input: number) {
	return input.toString().padStart(2, '0');
};

export const secondsToString = function (input: number, forceHours?: boolean) {
	const hours = Math.floor(input / 3600);
	const minutes = Math.floor((input % 3600) / 60);
	const seconds = (input % 3600) % 60;

	if (hours || forceHours) {
		return [toString(hours), toString(minutes), toString(seconds)].join(':');
	}
	return [toString(minutes), toString(seconds)].join(':');
};

export const oneTenthSecondsToString = function (input: number, forceHours?: boolean) {
	return secondsToString(input / 10, forceHours);
};
