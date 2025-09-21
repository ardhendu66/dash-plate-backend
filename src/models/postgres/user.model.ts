import { pool } from "../../config/db/postgres.db";
import bcrypt from "bcryptjs";
import { UserModelDto } from "../../dtos/user.dto";

interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: "user" | "vendor" | "delivery" | "admin";
    created_at?: Date;
}

const UserModel: UserModelDto = {
    // find user by id
    async findUserById(id: number): Promise<User | null> {
        const result = await pool.query(
            `SELECT * FROM users WHERE id = $1`, [id]
        );
        return result.rows[0] || null;
    },
    // find a user by email-id
    async findUserByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        );
        return result.rows[0] || null;
    },
    // create a new user
    async createUser(user: User): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const role = user.role || 'user';
        const result = await pool.query(
            `INSERT INTO users (name, email, password, mobile, role) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user.name, user.email, hashedPassword, user.mobile, role]
        );
        return result.rows[0];
    },
    // update the role of a user
    async updateUserRole(id: number, role: User["role"]): Promise<User | null> {
        const result = await pool.query(
            `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, mobile, role, created_at`,
            [role, id]
        );
        return result.rows[0] || null;
    },
    // delete a user: Admin purpose
    async deleteUser(id: number): Promise<User | null> {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING *`, [id]
        );
        return result.rows[0] || null;
    }
};

export { UserModel, User };