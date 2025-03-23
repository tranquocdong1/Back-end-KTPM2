// Import các model cần thiết
import User from "../models/user.mjs";
import Product from "../models/product.mjs";

class AdminController {
  // Trang quản lý Users
  static async manageUsers(req, res) {
    let q = req.query.q;
    const re = new RegExp(q);
    let users;
    if (q) {
      users = await User.find({ $or: [{ name: re }, { email: re }] });
    } else {
      users = await User.find({});
    }
    res.render("admin_users", { title: "User Management", users, q });
  }

  // Trang thêm User mới
  static async newUser(req, res) {
    res.render("formnew_user", { title: "Add New User" });
  }

  // Tạo User mới
  static async createUser(req, res) {
    let { email, name, age, password } = req.body; // Thêm trường password từ form
    try {
      let user = await User.create({ email, name, age, password }); // Lưu user với mật khẩu chưa mã hóa
      if (user) {
        res.redirect("/admin/users");
      } else {
        res.render("formnew_user", { title: "Add New User" });
      }
    } catch (error) {
      console.error(error);
      res.render("formnew_user", { title: "Add New User", error });
    }
  }

  // Trang sửa User
  static async editUser(req, res) {
    let id = req.params.id;
    let user = await User.findById(id);
    if (user) {
      res.render("formedit_user", { title: "Edit User", user });
    } else {
      res.redirect("/admin/users");
    }
  }

  // Cập nhật User
  static async updateUser(req, res) {
    let id = req.params.id;
    let { email, name, age, password } = req.body;
  
    try {
      let updateData = { email, name, age };
  
      // Nếu trường password không rỗng, thêm vào dữ liệu cập nhật mà không mã hóa
      if (password && password.trim() !== "") {
        updateData.password = password; // Lưu mật khẩu chưa mã hóa
      }
  
      await User.updateOne({ _id: id }, updateData);
      res.redirect("/admin/users");
    } catch (error) {
      console.error(error);
      let user = await User.findById(id); // Lấy lại dữ liệu nếu có lỗi
      res.render("formedit_user", { title: "Edit User", user, error });
    }
  }

  // Xóa User
  static async deleteUser(req, res) {
    let id = req.params.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/users");
  }

  // Trang quản lý Products
  static async manageProducts(req, res) {
    let q = req.query.q;
    const re = new RegExp(q);
    let products;
    if (q) {
      products = await Product.find({ name: re });
    } else {
      products = await Product.find({});
    }
    res.render("admin_products", { title: "Product Management", products, q });
  }

  // Trang thêm Product mới
  static async newProduct(req, res) {
    res.render("formnew_product", { title: "Add New Product" });
  }

  // Tạo Product mới
  static async createProduct(req, res) {
    let { name, category, price, originalPrice, image, sale, newArrival, bestSeller } = req.body;

    // Chuyển đổi checkbox từ chuỗi "on" thành Boolean
    sale = sale === "on";
    newArrival = newArrival === "on";
    bestSeller = bestSeller === "on";

    try {
      let product = await Product.create({
        name,
        category,
        price,
        originalPrice,
        image,
        sale,
        newArrival,
        bestSeller,
      });
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      res.render("formnew_product", { title: "Add New Product", error });
    }
  }

  // Trang sửa Product
  static async editProduct(req, res) {
    let id = req.params.id;
    let product = await Product.findById(id);
    if (product) {
      res.render("formedit_product", { title: "Edit Product", product });
    } else {
      res.redirect("/admin/products");
    }
  }

  // Cập nhật Product
  static async updateProduct(req, res) {
    let id = req.params.id;
    let { name, category, price, originalPrice, image, sale, newArrival, bestSeller } = req.body;

    // Chuyển đổi checkbox từ chuỗi "on" thành Boolean
    sale = sale === "on";
    newArrival = newArrival === "on";
    bestSeller = bestSeller === "on";

    try {
      await Product.updateOne({ _id: id }, {
        name,
        category,
        price,
        originalPrice,
        image,
        sale,
        newArrival,
        bestSeller,
      });
      res.redirect("/admin/products");
    } catch (error) {
      console.error(error);
      let product = await Product.findById(id); // Lấy lại dữ liệu để hiển thị
      res.render("formedit_product", { title: "Edit Product", product, error });
    }
  }

  // Xóa Product
  static async deleteProduct(req, res) {
    let id = req.params.id;
    await Product.deleteOne({ _id: id });
    res.redirect("/admin/products");
  }
}

export default AdminController;
