import mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
    name: string;
}

const roleSchema = new mongoose.Schema({
    name: String
});

const Role = mongoose.model<IRole>('roles', roleSchema);

export default Role;
