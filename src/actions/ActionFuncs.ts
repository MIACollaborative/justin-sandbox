import User, { IUser } from '../models/User';
import { config } from '../config/config';

// TODO: create better types for user, trigger, action to avoid 'any'
export const sendSmsAction = (user: IUser) => {
	const accountSid = config.sms.accountSid;
	const authToken = config.sms.authToken;
	const client = require('twilio')(accountSid, authToken);

	// TODO: create Twilio type and replace 'message: any'
	client.messages
		.create({
			body: 'Are you sure about that?',
			from: '+18644771514',
			to: user.phone
		})
		.then((message: any) => console.log(message.sid));
};
