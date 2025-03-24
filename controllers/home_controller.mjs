import User from "../models/user.mjs";

class HomeController {
  static index(req, res) {
    console.log(req.query);
    res.render("index", { title: "Home Page" });
  }

  static login(req, res) {
    res.render("login", { title: "Login Page" });
  }

  static signup(req, res) {
    res.render("signup", { title: "Signup Page" });
  }

  static async createSignup(req, res) {
    try {
      const { name, email, password, confirmpassword, age } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email đã được sử dụng." });
      }

      // Tạo người dùng mới
      const newUser = new User({ name, email, password, confirmpassword, age });
      await newUser.save();

      res.status(201).json({ success: true, message: "Đăng ký thành công." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi trong quá trình đăng ký." });
    }
  }

  static async createLogin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Sai email hoặc mật khẩu." });
      }

      if (user.password !== password) {
        return res
          .status(401)
          .json({ success: false, message: "Sai email hoặc mật khẩu." });
      }

      req.session.userId = user._id.toString();
      req.session.user = { name: user.name, email: user.email };

      req.session.save((err) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json({
          message: "Đăng nhập thành công",
          success: true,
          userId: user._id.toString(), // Trả về userId trực tiếp
          user: user, // Giữ nguyên nếu cần
        });
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi trong quá trình đăng nhập." });
    }
  }

  // Phương thức mới để render trang index sau khi đăng nhập
  static dashboard(req, res) {
    if (!req.session.user) {
      // Nếu chưa đăng nhập, chuyển hướng về trang login
      return res.redirect("/login");
    }
    // Render trang index với thông tin người dùng (tuỳ chọn)
    res.render("index", {
      title: "Home Page",
      user: req.session.user,
    });
  }

  // Trong HomeController
  static logout(req, res) {
    try {
      // Hủy session của người dùng
      req.session.destroy((err) => {
        if (err) {
          console.error("Lỗi khi hủy session:", err);
          return res
            .status(500)
            .json({ success: false, message: "Lỗi server khi đăng xuất." });
        }

        // Xóa cookie nếu có (tùy cấu hình session của bạn)
        res.clearCookie("connect.sid"); // "connect.sid" là tên mặc định của session cookie trong Express

        // Trả về phản hồi thành công
        res
          .status(200)
          .json({ success: true, message: "Đăng xuất thành công." });
      });
    } catch (error) {
      console.error("Lỗi trong quá trình đăng xuất:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi trong quá trình đăng xuất." });
    }
  }

  static checkLogin(req, res) {
    if (req.session.userId) {
      res.json({
        isLoggedIn: true,
        username: req.session.user ? req.session.user.name : "User",
      });
    } else {
      res.json({ isLoggedIn: false });
    }
  }
}

export default HomeController;
