export const isAdmin = (req, res, next) => {
    try {
      if (req.session && req.session.user && req.session.user.role === "Admin") {
        next(); 
      } else {
       
        res.status(403).json({ message: "Access denied. Admins only." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  