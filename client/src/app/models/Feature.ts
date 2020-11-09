export class Feature {
    id: string;

    activationKey: string;

    constructor(
        public name: string = null,
        public shortDescription: string = null,
        public description: string = null,
        public url: string = null
    ) {}
}
