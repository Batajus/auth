export class Feature {
    _id: string;

    activationKey: string;

    navigable = true;

    constructor(
        public name: string = null,
        public shortDescription: string = null,
        public description: string = null,
        public url: string = null
    ) {}
}
