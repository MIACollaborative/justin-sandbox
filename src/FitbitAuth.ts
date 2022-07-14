import dotenv from 'dotenv';

dotenv.config();

const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID || '';
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET || '';

const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
const passport = require('passport');

passport.use(
	new FitbitStrategy(
		{
			clientID: FITBIT_CLIENT_ID,
			clientSecret: FITBIT_CLIENT_SECRET,
			callbackURL: 'https://localhost:9090/fitbit/success'
		},
		function (accessToken: any, refreshToken: any, profile: any, done: any) {
			return done(null, profile);
			// User.findOrCreate({ fitbitId: profile.id }, function (err: any, user: any) {
			// 	console.log(err);
			// 	return done(err, user);
			// });
			// function (err: any, user: any) {
			// 	console.log(err);
			// 	return done(err, profile);
			// });
		}
	)
);

passport.serializeUser(function (user: any, done: any) {
	done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
	done(null, user);
});
