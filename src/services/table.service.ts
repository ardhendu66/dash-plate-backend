import { pool } from "../config/db";
import { BadRequestError } from "../utils/GlobalError";

const tableService = {
    createUserTable: async function () {
        try {
            const userTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    mobile VARCHAR(13) UNIQUE NOT NULL,
                    role VARCHAR(20) NOT NULL DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `;
            // const userTableQuery = `
            //     ALTER TABLE users ADD COLUMN mobile VARCHAR(15) UNIQUE NOT NULL
            // `;
            await pool.query(userTableQuery);
            return "USER table created successfully";
        }
        catch (err) {
            throw new BadRequestError("Error creating USER table");
        }
    },
    createBulkUsers: async function () {
        try {
            const bulkUsersQuery = `
                INSERT INTO users (name, email, password, mobile, role, created_at)
                SELECT
                    'User_' || gs,
                    'user' || gs || '@example.com',
                    '$2a$12$Yfo89zIgVFrEVy5PR7uPF.6CJfRigPTZ4GqpG47vecyDXXx7teDPC',
                    '9083000000'::bigint + gs,
                    (ARRAY['user','vendor','delivery','admin'])[floor(random()*4 + 1)],
                    NOW() - (random() * interval '365 days')
                FROM generate_series(1, 30000) gs;

            `;
            await pool.query(bulkUsersQuery);
            return '30K Bulk Users inserted successfully';
        }
        catch (err) {
            throw new BadRequestError("Error inserting users in USER table");
        }
    },
    deleteBulkUsers: async function () {
        try {
            // const deleteUsersQuery = `DELETE FROM users`;
            const deleteUsersQuery = `TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
            // faster than DELETE, id sequence will be reset(from 1) too
            await pool.query(deleteUsersQuery);
            return "30K users deleted successfully";
        }
        catch (err) {
            throw new BadRequestError("Error deleting users from USER table");
        }
    }
}

export { tableService };