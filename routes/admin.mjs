import express from "express";
import AdminController from "../controllers/adminController.mjs";


const router = express.Router();


router.get("/users", isAdmin, AdminController.manageUsers);
router.get("/users/new", isAdmin, AdminController.newUser);
router.post("/users/create", isAdmin, AdminController.createUser);
router.post("/users/delete/:id", isAdmin, AdminController.deleteUser);

// Routes quản lý products
router.get("/products", isAdmin, AdminController.manageProducts);
router.get("/products/new", isAdmin, AdminController.newProduct);
router.post("/products/create", isAdmin, AdminController.createProduct);
router.post("/products/delete/:id", isAdmin, AdminController.deleteProduct);

export default router;
