import { Feature } from './Feature';

export class User {
    id: string;
    jwt: string;

    features: (string | Feature)[] = [];

    constructor(
        public username: string = null,
        public email: string = null,
        public password: string = null,
        public roles: Role[] = []
    ) {}
}

export class Role {
    constructor(public name: string = null) {}
}
