import Logging from './lib/Logging';
import { Types } from 'mongoose';
import Trigger, { ITriggerModel } from './models/Trigger';
import User from './models/User';
import * as TriggerFuncs from './triggers/TriggerFuncs';

type TriggerType = ITriggerModel & {
	_id: Types.ObjectId;
};

const shouldRun = (triggerStr: string): boolean => {
	let triggerFunc = getTriggerFunc(triggerStr);
	if (triggerFunc !== false && triggerFunc() === true) {
		return true;
	}
	return false;
};

const getTriggerFunc = (triggerStr: string): (() => boolean) | false => {
	for (let funcName in TriggerFuncs.funcDict) {
		if (triggerStr === funcName) {
			console.log(typeof TriggerFuncs.funcDict[funcName]);
			return TriggerFuncs.funcDict[funcName];
		}
	}
	return false;
};

// TODO: FINISH
export const markTimeTriggerHasRunTrue = (triggerFunc: () => boolean): boolean => {
	return true;
};

const randomize = (randomizeFactor: number) => {
	if (Math.random() < randomizeFactor) {
		return true;
	}
	return false;
};

const executeAction = (actionStr: string): boolean => {
	return true;
};

const runAction = (trigger: TriggerType, actionStr: string): boolean => {
	try {
		executeAction(trigger.doAction);
		Logging.info(`SUCCESS: Trigger run: ${trigger.shouldRun}`);
		return true;
	} catch (error) {
		Logging.error(error);
		return false;
	}
};

const runCron = async () => {
	let triggers = await Trigger.find();
	let users = await User.find();
	for (let trigger of triggers) {
		let triggerStr: string = trigger.shouldRun;
		if (shouldRun(triggerStr)) {
			// if randomization factor exists
			if (trigger.randomizeFactor && randomize(trigger.randomizeFactor)) {
				runAction(trigger, trigger.doAction);
			} else if (!trigger.randomizeFactor) {
				runAction(trigger, trigger.doAction);
			}
		}
	}
};

// runCron method is executed every 60 seconds
// let seconds = 60;
// setInterval(runCron, seconds * 1000);
