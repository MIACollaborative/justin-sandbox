import dotenv from 'dotenv';

dotenv.config();

const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID || '';
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET || '';

// using passport-fitbit-oauth2

// OAuth 2.0 configuration

// import FitbitOAuth2Strategy from 'passport-fitbit-oauth2';

var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
// import { FitbitOAuth2Strategy as FitbitStrategy } from 'passport-fitbit-oauth2';
var passport = require('passport-oauth2');
// import passport from 'passport-oauth2';
import User from './models/User';

// passport.use(
// 	new OAuth2Strategy(
// 		{
// 			authorizationURL: 'https://www.example.com/oauth2/authorize',
// 			tokenURL: 'https://www.example.com/oauth2/token',
// 			clientID: EXAMPLE_CLIENT_ID,
// 			clientSecret: EXAMPLE_CLIENT_SECRET,
// 			callbackURL: 'http://localhost:3000/auth/example/callback'
// 		},
// 		function (accessToken, refreshToken, profile, cb) {
// 			User.findOrCreate({ exampleId: profile.id }, function (err, user) {
// 				return cb(err, user);
// 			});
// 		}
// 	)
// );

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

// Authenticate requests middleware

import express from 'express';
import { AnyArray } from 'mongoose';

const router = express.Router();

router.get('/auth/fitbit', passport.authenticate('fitbit', { scope: ['activity', 'heartrate', 'location', 'profile'] }));

router.get(
	'/auth/fitbit/callback',
	passport.authenticate('fitbit', {
		successRedirect: '/auth/fitbit/success',
		failureRedirect: '/auth/fitbit/failure'
	})
);
export = router;

// using fitbit-node library below

// var FitbitApiClient = require('fitbit-node');

// var fitbit = new FitbitApiClient({ clientId: FITBIT_CLIENT_ID, clientSecret: FITBIT_CLIENT_SECRET, apiVersion: '1.2' });

// let scope = 'sleep';
// let redirectUrl = 'https://localhost:9090/auth/fitbit/callback';
// let authUrl = fitbit.getAuthorizeUrl(scope, redirectUrl);
// console.log(authUrl);
