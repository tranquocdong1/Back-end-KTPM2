// import User from "./models/user.mjs"; 

// const setAdminRole = async (email) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { email }, // Tìm user theo email
//       { role: "Admin" }, // Đặt role là Admin
//       { new: true }
//     );
//     if (user) {
//       console.log(`User ${user.name} is now an Admin.`);
//     } else {
//       console.log("User not found.");
//     }
//   } catch (error) {
//     console.error("Error updating role:", error);
//   }
// };

// // Gọi hàm để cập nhật
// setAdminRole("levanc@example.com");

// export default setAdminRole; // Xuất để có thể tái sử dụng
