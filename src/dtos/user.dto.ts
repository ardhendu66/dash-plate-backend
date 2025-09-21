import { User } from "../models/postgres/user.model";

class UserResponseDto {
    id?: number;
    email: string;
    role: string;

    constructor(user: { id?: number, email: string, role: string }) {
        this.id = user.id;
        this.email = user.email;
        this.role = user.role;
    }
}

interface UserModelDto {
    findUserById: (id: number) => Promise<User | null>;
    findUserByEmail: (email: string) => Promise<User | null>;
    createUser: (user: User) => Promise<User>;
    updateUserRole: (id: number, role: User["role"]) => Promise<User | null>;
    deleteUser: (id: number) => Promise<User | null>;
}

export { UserResponseDto, UserModelDto };