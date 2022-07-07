import mongoose, { Document, Schema } from 'mongoose';

export interface ITrigger {
	name: string;
	shouldRun: string;
	randomizeFactor: number;
	doAction: string;
}

export interface ITriggerModel extends ITrigger, Document {}

const TriggerSchema: Schema = new Schema(
	{
		name: { type: String, required: false },
		shouldRun: { type: String, required: true },
		randomizeFactor: { type: Number, required: false },
		doAction: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

export default mongoose.model<ITriggerModel>('Trigger', TriggerSchema);
