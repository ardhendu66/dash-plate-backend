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

export { UserResponseDto };