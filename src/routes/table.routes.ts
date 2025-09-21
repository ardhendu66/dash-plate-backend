import { Router } from "express";
import { 
    createUserTable, createOrderTable, createBulkUsers, deleteBulkUsers 
} from "../controllers/table.controller";
const tableRouter = Router();

tableRouter.route("/users").post(createUserTable);
tableRouter.route("/orders").post(createOrderTable);
tableRouter.route("/bulk-users").post(createBulkUsers);
tableRouter.route("/bulk-users").delete(deleteBulkUsers);

export default tableRouter;