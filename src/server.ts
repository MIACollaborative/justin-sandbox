import express, { NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './lib/Logging';
import authorRoutes from './routes/Author';
import bookRoutes from './routes/Book';
import userRoutes from './routes/User';
import triggerRoutes from './routes/Trigger';
// TODO: unistall 'passport-oauth2' package
var session = require('express-session');
const passport = require('passport');
require('./FitbitAuth');

// TODO: replace 'any' and put in middleware/ directory
function isFitbitLoggedIn(req: any, res: any, next: NextFunction) {
	req.user ? next() : res.sendStatus(401);
}

const router = express();

// connect to mongodb
mongoose
	.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
	.then(() => {
		Logging.info('connected to mongodb!');
		StartServer();
	})
	.catch((err) => {
		Logging.error('unable to connect to mongodb!');
		Logging.error(err);
	});

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
	/** Log the request */
	router.use((req, res, next) => {
		/** Log the req */
		Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

		res.on('finish', () => {
			/** Log the res */
			Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
		});

		next();
	});

	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());

	/** Rules of our API */
	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}

		next();
	});

	/** Routes */
	router.use('/authors', authorRoutes);
	router.use('/books', bookRoutes);
	router.use('/users', userRoutes);
	// TODO: test trigger routes extensively
	router.use('/trigger', triggerRoutes);

	/** Healthcheck */
	router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

	// TODO: source secret from config env
	router.use(session({ secret: 'cats' }));
	router.use(passport.initialize());
	router.use(passport.session());

	router.get('/', (req, res) => {
		res.send('<a href="/auth/fitbit">Authenticate with fitbit</a>');
	});

	router.get('/auth/fitbit', passport.authenticate('fitbit', { scope: ['sleep'] }));

	// TODO: test
	router.get(
		'/fitbit/callback',
		passport.authenticate('fitbit', {
			successRedirect: '/protected',
			failureRedirect: '/auth/fitbit-failure'
		})
	);

	// TODO: test
	router.get('/auth/fitbit-failure', (req, res) => {
		res.send('Failed to authenticate Fitbit..');
	});

	// TODO: test isFitbitLoggedIn middleware
	router.get('/protected', isFitbitLoggedIn, (req, res) => {
		res.send('Hello!');
	});

	router.get('/logout', (req, res) => {
		// TODO: move session within function scope
		// TODO: move auth logic into separate function and file
		// req.logout();
		// req.session.destroy();
		res.send('Goodbye!');
	});

	router.listen(5000, () => console.log('listening on port: 5000'));

	/** Error handling */
	router.use((req, res, next) => {
		const error = new Error('Not found');

		Logging.error(error);

		res.status(404).json({
			message: error.message
		});
	});

	http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
