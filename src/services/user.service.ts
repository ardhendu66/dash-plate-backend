import { pool } from "../config/db/postgres.db";
import { User } from "../models/postgres/user.model";

const userService = {

    // find a single user by id
    getUserById: async (id: number): Promise<Omit<User, "password"> | null> => {
        const result = await pool.query(
            `SELECT id, name, email, mobile, role, created_at FROM users WHERE id = $1`, [id]
        );
    
        return result.rows[0] || null;
    },

    // find all users
    getAllUsers: async (): Promise<Omit<User, "password">[]> => {
        const result = await pool.query(
            `SELECT id, name, email, mobile, role, created_at FROM users
            ORDER BY created_at DESC`
        );
    
        return result.rows;
    },

    // update user profile(name, email, mobile) by id or email
    updateUserProfileById: async (
        id: number, 
        updates: Partial<Omit<User, "id" | "created_at" | "role">>
    )
    : Promise<Omit<User, "password"> | null> =>
    {
        if(Object.keys(updates).length === 0) {
            const result = await pool.query(`
                SELECT id, name, email, mobile, role, created_at FROM users
                WHERE id = $1`, [id]
            );
    
            return result.rows[0] || null;
        }
    
        const fields: string[] = [], values: any[] = [];
        let idx = 1;
    
        if(updates.name) {
            fields.push(`name = $${idx++}`);
            values.push(updates.name);
        }
    
        if(updates.email) {
            fields.push(`email = $${idx++}`);
            values.push(updates.email);
        }
    
        if(updates.mobile) {
            fields.push(`mobile = $${idx++}`);
            values.push(updates.mobile);
        }
    
        values.push(id);
    
        const result = await pool.query(`
            UPDATE users SET ${fields.join(", ")} WHERE id = $${idx}
            RETURNING id, name, email, mobile, role, created_at`, values
        );
    
        return result.rows[0] || null;
    },

    // update user role by id
    updateUserRole: async (id: number, role: User["role"])
    :Promise<Omit<User, "password"> | null> => {    
        const result = await pool.query(`
            UPDATE users SET role = $1 WHERE id = $2
            RETURNING id, name, email, mobile, role, created_at`, [role, id]
        );
        
        return result.rows[0] || null;
    },

    // delete user by id or email
    deleteUser: async(id: number): Promise<boolean> => {    
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1`, [id]
        );
    
        return (result.rowCount ?? 0) > 0;
    },
}


export { userService };