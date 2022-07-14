export const triggerFuncTrue = (): boolean => {
	return true;
};

export const triggerFuncFalse = (): boolean => {
	return false;
};

// TODO: uses UTC time, use timezone
export const timeTriggerUTC = (time: Date): boolean => {
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
		// if the triggered time is right now or at most 2 minutes after current time
		if (currMin > timeMin && Math.abs(currMin - timeMin) < 2) {
			// TODO: make sure triggers within 2 cron execution intervals (1-min) don't get executed twice
			return true;
		}
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
