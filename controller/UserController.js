// const User = require("../models/User");
// const { createUser } = require("../services/UserService");
// const {
//   authenticateUser,
//   invalidateUser,
//   generateToken,
// } = require("../services/AuthService");

// const register = async (req, res) => {
//   try {
//     console.log("reached", req.body);
//     const userData = req.body;
//     const newUser = await createUser(userData);
//     if (newUser) {
//       console.log("user created successfully");

//       // Generate a JWT token for the user
//       const token = generateToken(newUser);
//       return res.status(201).json({
//         status: "success",
//         statusCode: 201,
//         message: "user created successfully",
//         token: token,
//       });
//     }
//   } catch (error) {
//     console.error("error:", error);
//     return res.status(500).json({
//       status: 500,
//       success: false,
//       message: `User registration failed${error.message}`,
//     });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const token = await authenticateUser(email, password);
//     if (!token) {
//       return res.status(401).json({
//         statusCode: 401,
//         status: "error",
//         message: "Invalid credentials",
//       });
//     } else {
//       return res.status(200).json({
//         statusCode: 200,
//         status: "success",
//         message: "Login Successful",
//         token: token,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       statusCode: 500,
//       status: "error",
//       message: `Error logging in: ${error.message}`,
//     });
//   }
// };

// const logout = async(req, res) => {
//   try {
//     const token = req.headers["authorization"];

//     if (!token) {
//       return res.status(400).json({
//         statusCode: 400,
//         status: "error",
//         message: "No token provided",
//       });
//     } 
//       const statusCode = await invalidateUser(token);
//       if (statusCode === 401) {
//         return res.status(401).json({
//           statusCode: 500,
//           status: "error",
//           message: "Token is already invalidated (logged out)",
//         });
//       } else if (statusCode === 200) {
//         return res.json({
//           statusCode: 500,
//           status: "error",
//           message: "Logout successful",
//         });
//       }
   
//   } catch (error) {
//     return res.status(500).json({
//       statusCode: 500,
//       status: "error",
//       message: `Error logging out: ${error.message}`,
//     });
//   }
// };

// module.exports = { register, login, logout };
