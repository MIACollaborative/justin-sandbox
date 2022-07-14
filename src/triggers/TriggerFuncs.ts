import Logging from '../lib/Logging';

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

// TODO: replace params with just user model and use user.fitbit.accessToken etc.
// TODO: change from Promise<any> to boolean to fit Trigger invariant
async function stepsFitbitTrigger(fitbitId: string, fitbitAccessToken: string, date: Date, stepGoal: number): Promise<any> {
	try {
		// 👇️ const response: Response
		// TODO: use https://api.fitbit.com/1/user/-/activities/steps/date/${dateStr}/1d/1min.json for current logged-in user
		let isoDate: string = date.toISOString();
		let dateStr: string = isoDate.split('T', 1)[0];
		const response = await fetch(`https://api.fitbit.com/1/user/${fitbitId}/activities/steps/date/${dateStr}/1d/1min.json`, {
			method: 'GET',
			headers: {
				// TODO: maybe don't need 'Content-Type', not used in documentation
				// https://dev.fitbit.com/build/reference/web-api/user/get-profile/
				'Content-Type': 'application/json',
				Accept: 'application/json',
				authorization: `Bearer ${fitbitAccessToken}`
			}
		});

		if (!response.ok) {
			Logging.error(response);
			throw new Error(`Error! status: ${response.status}`);
		}

		// 👇️ const result: any --> replace any
		const result = await response.json();
		Logging.log('RESPONSE: \n\n' + JSON.stringify(result, null, 4));

		let steps: number = result['activities-steps'];
		return steps < stepGoal;
	} catch (error) {
		if (error instanceof Error) {
			Logging.error('error message: ' + error.message);
			return error.message;
		} else {
			Logging.error('unexpected error: ' + error);
			return 'An unexpected error occurred';
		}
	}
}

export let funcDict: { [key: string]: () => boolean } = {
	triggerFuncTrue: function () {
		return triggerFuncTrue();
	},
	triggerFuncFalse: function () {
		return triggerFuncFalse();
	}
};
