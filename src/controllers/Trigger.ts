import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Trigger from '../models/Trigger';

const createTrigger = (req: Request, res: Response, next: NextFunction) => {
	const { shouldRun, doAction, forUser } = req.body;

	const trigger = new Trigger({
		_id: new mongoose.Types.ObjectId(),
		shouldRun,
		doAction,
		forUser
	});

	return trigger
		.save()
		.then((trigger) => res.status(201).json({ trigger }))
		.catch((error) => res.status(500).json({ error }));
};

const readTrigger = (req: Request, res: Response, next: NextFunction) => {
	const triggerId = req.params.triggerId;

	return Trigger.findById(triggerId)
		.populate('forUser')
		.then((trigger) => (trigger ? res.status(200).json({ trigger }) : res.status(404).json({ message: 'not found' })))
		.catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
	return Trigger.find()
		.populate('forUser')
		.then((triggers) => res.status(200).json({ triggers }))
		.catch((error) => res.status(500).json({ error }));
};

const updateTrigger = (req: Request, res: Response, next: NextFunction) => {
	const triggerId = req.params.triggerId;

	return Trigger.findById(triggerId)
		.then((trigger) => {
			if (trigger) {
				trigger.set(req.body);

				return trigger
					.save()
					.then((trigger) => res.status(201).json({ trigger }))
					.catch((error) => res.status(500).json({ error }));
			} else {
				return res.status(404).json({ message: 'not found' });
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

const deleteTrigger = (req: Request, res: Response, next: NextFunction) => {
	const triggerId = req.params.triggerId;

	return Trigger.findByIdAndDelete(triggerId)
		.then((trigger) => (trigger ? res.status(201).json({ trigger, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
		.catch((error) => res.status(500).json({ error }));
};

export default { createTrigger, readTrigger, readAll, updateTrigger, deleteTrigger };
