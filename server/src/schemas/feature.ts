import mongoose from 'mongoose';

export interface IFeature extends mongoose.Document {
    name: string;
    shortDescription: string;
    description: string;
    url: string;
    activationKey: string;
    navigable: boolean;
}

const featureSchema = new mongoose.Schema({
    name: String,
    shortDescription: String,
    description: String,
    url: String,
    activationKey: String,
    navigable: { type: Boolean, default: true }
});

const Feature = mongoose.model<IFeature>('features', featureSchema);

export default Feature;
