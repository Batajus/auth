import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: Uint8Array;
    salt: string;
    roles: mongoose.Types.ObjectId[];
    features: mongoose.Types.ObjectId[];
}

const user = new mongoose.Schema({
    username: String,
    email: String,
    password: Buffer,
    salt: String,
    roles: [mongoose.Types.ObjectId],
    features: [mongoose.Types.ObjectId]
});

const User = mongoose.model<IUser>('users', user);

export default User;
