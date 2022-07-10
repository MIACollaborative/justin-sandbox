// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

import { config } from './config/config';

const accountSid = config.sms.accountSid;
const authToken = config.sms.authToken;
const client = require('twilio')(accountSid, authToken);

// TODO: create Twilio type and replace 'message: any'
// client.messages
// 	.create({
// 		body: 'Are you sure about that?',
// 		from: '+18644771514',
// 		to: '+18455317988'
// 	})
// 	.then((message: any) => console.log(message.sid));
