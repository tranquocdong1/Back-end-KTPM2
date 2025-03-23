import express from "express";
import rootRouter from "./routes/root.mjs";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import { productDBConnection, userDBConnection } from "./config/connectDB.mjs";
import AdminController from "./controllers/adminController.mjs";
import { isAdmin } from "./middlewares/isAdmin.mjs";
import aboutRouter from "./routes/aboutRoutes.mjs";
import apiuserRouter from "./routes/api.mjs";
import blogRouter from "./routes/blogRoutes.mjs";
import cartRouter from "./routes/cartRoutes.mjs";
import checkOutRouter from "./routes/checkOutRoutes.mjs";
import contactRouter from "./routes/contactRoutes.mjs";
import productRouter from "./routes/productRoutes.mjs";
import singleProductRouter from "./routes/singleProductRoutes.mjs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Chấp nhận mọi origin
    },
    credentials: true,
  })
);
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://tranquocdong102:uIFYTUJ9naAOZEKe@cluster0.s51on.mongodb.net", // Thay bằng URL MongoDB
      collectionName: "sessions",
    }),
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Kết nối cơ sở dữ liệu
userDBConnection.on("connected", () => {
  console.log("Successfully connected to users database.");
});
productDBConnection.on("connected", () => {
  console.log("Successfully connected to productDB.");
});

// Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Định nghĩa các route
app.use("/", rootRouter);
app.use("/api/v1", apiuserRouter);
app.use("/", aboutRouter);
app.use("/", productRouter);
app.use("/", singleProductRouter);
app.use("/", cartRouter);
app.use("/", checkOutRouter);
app.use("/", blogRouter);
app.use("/", contactRouter);

// Routes admin
app.get("/admin/users", isAdmin, AdminController.manageUsers);
app.get("/admin/users/new",  isAdmin, AdminController.newUser);
app.post("/admin/users",  isAdmin, AdminController.createUser);
app.get("/admin/users/edit/:id",  isAdmin, AdminController.editUser);
app.post("/admin/users/update/:id",  isAdmin, AdminController.updateUser);
app.post("/admin/users/delete/:id",  isAdmin, AdminController.deleteUser);

// Routes for managing products
app.get("/admin/products",  isAdmin, AdminController.manageProducts);
app.get("/admin/products/new",  isAdmin, AdminController.newProduct);
app.post("/admin/products/create",  isAdmin, AdminController.createProduct);
app.get("/admin/products/edit/:id",  isAdmin, AdminController.editProduct);
app.post("/admin/products/update/:id",  isAdmin, AdminController.updateProduct);
app.post("/admin/products/delete/:id",  isAdmin, AdminController.deleteProduct);

app.post("/place-order", (req, res) => {
  const { firstname, lastname, phone, email } = req.body;
  if (!firstname || !lastname || !phone || !email) {
    return res.status(400).json({ message: "Tất cả các trường đều bắt buộc." });
  }
  console.log(`Đơn hàng được đặt bởi ${firstname} ${lastname}. Liên hệ: ${phone}, ${email}.`);
  res.status(200).json({ message: "Đơn hàng đã được đặt thành công!" });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});