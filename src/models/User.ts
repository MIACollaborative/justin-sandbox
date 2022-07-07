import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
	username: string;
	phone: number;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		phone: { type: Number, required: false }
	},
	{
		timestamps: true,
		strict: false // allows new fields to be added to UserSchema dynamically
	}
);

export default mongoose.model<IUserModel>('User', UserSchema);
