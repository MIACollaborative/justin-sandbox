import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
	username: string;
	password: string;
	phone: number;
	preferredTimes: [Date, Date, Date];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		phone: { type: Number, required: false },
		preferredTimes: { type: [Date, Date, Date], required: false }
	},
	{
		timestamps: true,
		strict: false // allows new fields to be added to UserSchema dynamically
	}
);

export default mongoose.model<IUserModel>('User', UserSchema);
