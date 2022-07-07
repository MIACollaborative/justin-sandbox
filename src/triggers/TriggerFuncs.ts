export const triggerFuncTrue = (): boolean => {
	return true;
};

export const triggerFuncFalse = (): boolean => {
	return false;
};

// TODO: uses local time, use timezone
export const timeTrigger = (time: Date, timezone: string): boolean => {
	let timeNow: Date = new Date();
	let withinHour: boolean = false;
	if (
		time.getUTCMonth() === timeNow.getUTCMonth() &&
		time.getUTCDate() == timeNow.getUTCDate() &&
		time.getUTCFullYear() === timeNow.getUTCFullYear() &&
		time.getUTCHours() === timeNow.getUTCHours()
	) {
		withinHour = true;
	}

	if (withinHour) {
		let timeMin = time.getUTCMinutes();
		let currMin = timeNow.getUTCMinutes();
		// TODO: make 1-2 minute leeway
		return true;
	}
	return false;
};

export let funcDict: { [key: string]: () => boolean } = {
	triggerFuncTrue: function () {
		return triggerFuncTrue();
	},
	triggerFuncFalse: function () {
		return triggerFuncFalse();
	}
};
