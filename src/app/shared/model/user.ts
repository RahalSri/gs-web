import { Role } from './role';

export class User {
    userName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    deleted: boolean;
    confirmPassword: string;
    newPassword: string;
    organisationId: string;
    active: boolean;
    supGuId: string;
    passwordResetExpiry: string;
    isPublicTokenEnabled: boolean;
    roles: Role[];
    customUserFullName: string;
    customUserStatus: string;
    defaultSpaceId: string;
    passwordResetKey: string;
    justification: string;
    passwordChanged: boolean;

    constructor() {
        this.userName = '';
        this.firstName = '';
        this.lastName = '';
        this.fullName = '';
        this.email = '';
        this.password = '';
        this.deleted = false;
        this.confirmPassword = '';
        this.newPassword = '';
        this.organisationId = '';
        this.active = true;
        this.supGuId = '';
        this.passwordResetExpiry = '';
        this.isPublicTokenEnabled = false;
        this.roles = [];
        this.customUserFullName = '';
        this.customUserStatus = '';
        this.defaultSpaceId = '';
        this.passwordResetKey = '';
        this.justification = '';
        this.passwordChanged = false;
    }
}