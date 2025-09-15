import { Router } from "express";
import { 
    createUserTable, createBulkUsers, deleteBulkUsers 
} from "../controllers/table.controller";
const tableRouter = Router();

tableRouter.route("/user-table").post(createUserTable);
tableRouter.route("/bulk-users").post(createBulkUsers);
tableRouter.route("/bulk-users").delete(deleteBulkUsers);

export default tableRouter;