import { pool } from "../config/db/postgres.db";
import { BadRequestError } from "../utils/GlobalError";

const tableService = {
    async createUserTable() {
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
            console.error("User-Table creating Error: ", err);          
            throw new BadRequestError("Error creating USER table");
        }
    },
    async createOrderTable() {
        try {
            // const checkingUserQuery = `
            //     SELECT EXISTS (
            //         SELECT FROM information_schema.tables 
            //         WHERE table_schema = 'public' 
            //         AND table_name = 'users'
            //     );
            // `;
            // const result = await pool.query(checkingUserQuery);
            // const exists = result.rows[0].exists;
            // console.log(exists);
            // return exists;

            const orderTableQuery = `
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
                        CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PAID', 'FAILED');
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
                        CREATE TYPE order_status_enum AS ENUM ('PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
                    END IF;
                END$$;

                CREATE TABLE IF NOT EXISTS orders (
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id) ON DELETE CASCADE,
                    restaurant_id VARCHAR(50) NOT NULL, -- store Mongo ObjectId
                    items JSONB NOT NULL,
                    total_amount DECIMAL(10,2) NOT NULL,
                    payment_status payment_status_enum DEFAULT 'PENDING',
                    order_status order_status_enum DEFAULT 'PLACED',
                    delivery_address TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            `;
            
            await pool.query(orderTableQuery);
            return "ORDER Table created sucessfully";
        }
        catch(err) {
            console.error("Order-Table creating Error: ", err);          
            throw new BadRequestError("Error creating ORDER table");
        }
    },
    async createBulkUsers() {
        try {
            const bulkUsersQuery = `
                INSERT INTO users (name, email, password, mobile, role, created_at)
                SELECT
                    'User_' || gs,
                    'user' || gs || '@example.com',
                    '$2a$12$Yfo89zIgVFrEVy5PR7uPF.6CJfRigPTZ4GqpG47vecyDXXx7teDPC',
                    '9083000000'::bigint + gs,
                    (ARRAY['user','vendor','delivery'])[floor(random()*3 + 1)],
                    NOW() - (random() * interval '365 days')
                FROM generate_series(1, 50000) gs;

            `;
            await pool.query(bulkUsersQuery);
            return '50K Bulk Users inserted successfully';
        }
        catch (err) {
            console.error("Bulk-User Inserting Error: ", err);            
            throw new BadRequestError("Error inserting users in USER table");
        }
    },
    async deleteBulkUsers() {
        try {
            // const deleteUsersQuery = `DELETE FROM users`;
            const deleteUsersQuery = `TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
            // faster than DELETE, id sequence will be reset(from 1) too
            await pool.query(deleteUsersQuery);
            return "50K users deleted successfully";
        }
        catch (err) {
            console.log("Bulk-User Deleting Error: ", err);            
            throw new BadRequestError("Error deleting users from USER table");
        }
    }
}

export { tableService };