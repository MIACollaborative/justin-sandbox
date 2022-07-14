import mongoose, { Document, Schema } from 'mongoose';

export interface ITrigger {
	shouldRun: string;
	doAction: string;
	forUser: string;
	hasRun: boolean;
	randomizeFactor: number;
}

export interface ITriggerModel extends ITrigger, Document {}

const TriggerSchema: Schema = new Schema(
	{
		shouldRun: { type: String, required: true },
		doAction: { type: String, required: true },
		forUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		hasRun: { type: Boolean, required: false, default: false },
		randomizeFactor: { type: Number, required: false }
	},
	{
		timestamps: true
	}
);

export default mongoose.model<ITriggerModel>('Trigger', TriggerSchema);
