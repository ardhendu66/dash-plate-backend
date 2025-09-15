import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: "user" | "vendor" | "delivery" | "admin";
    created_at?: Date;
}

const createUser = async (user: User): Promise<User> => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const role = user.role || 'user';

    const result = await pool.query(
        `INSERT INTO users (name, email, password, mobile, role) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user.name, user.email, hashedPassword, user.mobile, role]
    );

    return result.rows[0];
}

const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );

    return result.rows[0] || null;
}

const findUserByMobile = async (mobile: string): Promise<User | null> => {
    const result = await pool.query(
        `SELECT id, name, email, mobile, role, created_at FROM users WHERE mobile = $1`, [mobile]
    );

    return result.rows[0] || null;
}

const findUserById = async (id: number): Promise<User | null> => {
    const result = await pool.query(
        `SELECT id, name, email, mobile, role, created_at FROM users WHERE id = $1`, [id]
    );

    return result.rows[0] || null;
}

const updateUserRole = async (id: number, role: User["role"]): Promise<User | null> => {
    const result = await pool.query(
        `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, mobile, role, created_at`,
        [role, id]
    );
    return result.rows[0] || null;
}

export { 
    createUser, findUserByEmail, findUserByMobile, findUserById, updateUserRole
};