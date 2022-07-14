import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
// TODO: check for version errors: using node-fetch@3.2.6 but @types/node-fetch@3.0.2 installed
import fetch from 'node-fetch';
import Logging from '../lib/Logging';

const createUser = (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;

	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		username,
		password
	});

	return user
		.save()
		.then((user) => res.status(201).json({ user }))
		.catch((error) => res.status(500).json({ error }));
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	return User.findById(userId)
		.then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'not found' })))
		.catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
	return User.find()
		.then((users) => res.status(200).json({ users }))
		.catch((error) => res.status(500).json({ error }));
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	return User.findById(userId)
		.then((user) => {
			if (user) {
				user.set(req.body);

				return user
					.save()
					.then((user) => res.status(201).json({ user }))
					.catch((error) => res.status(500).json({ error }));
			} else {
				return res.status(404).json({ message: 'not found' });
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

async function updateUserPreferredTimes(userId: string, preferredTimes: [Date, Date, Date]) {
	try {
		// 👇️ const response: Response
		const response = await fetch(`http://localhost:9090/users/update/${userId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				preferredTimes: preferredTimes
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			Logging.error(response);
			throw new Error(`Error! status: ${response.status}`);
		}

		// 👇️ const result: UpdateUserPreferredTimesResponse
		const result = (await response.json()) as IUser;

		Logging.log('RESPONSE: ' + JSON.stringify(result, null, 4));

		return result;
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

// TODO: replace params with just user model and use user.fitbit.accessToken etc.
async function getUserTimezoneFromFitbit(fitbitId: string, fitbitAccessToken: string): Promise<string> {
	try {
		// 👇️ const response: Response
		// TODO: use https://api.fitbit.com/1/user/-/profile.json for current logged-in user
		const response = await fetch(`https://api.fitbit.com/1/user/${fitbitId}/profile.json`, {
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

		let timezone: string = result.timezone;
		return timezone;
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

// updateUserPreferredTimes();

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	return User.findByIdAndDelete(userId)
		.then((user) => (user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
		.catch((error) => res.status(500).json({ error }));
};

export default { createUser, readUser, readAll, updateUser, updateUserPreferredTimes, getUserTimezoneFromFitbit, deleteUser };
