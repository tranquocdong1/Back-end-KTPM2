import express from "express";
import jwt from "jsonwebtoken";
import ApiUserController from "../controllers/api_user_controller.mjs";

// ẨN VIỆC PHẢI ĐĂNG NHẬP TRƯỚC KHI TRUY CẬP
// function checkLoginApi(req, res, next) {
//   let token = req.headers.authorization;
//   try {
//     var decoded = jwt.verify(token, "demoDA");
//     next();
//   } catch (err) {
//     res.status(404).json({ message: "Ban can phai login de su dung!!!" });
//   }
// }
const apiuserRouter = express.Router();
// apiuserRouter.get("/users", checkLoginApi, ApiUserController.index);
apiuserRouter.get("/users", ApiUserController.index);

apiuserRouter.get("/users/:id", ApiUserController.show);
apiuserRouter.delete("/users/:id", ApiUserController.destroy);
apiuserRouter.post("/users", ApiUserController.create);

apiuserRouter.post("/login", ApiUserController.login);



export default apiuserRouter;
