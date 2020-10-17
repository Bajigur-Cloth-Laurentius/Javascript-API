function errorHandler(err, req, res, next) {
  if (err.name !== "Error") {
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
      if (err.errors[0].message === "name must be unique") {
        res.status(400).json({ "message": "Product item already registered" })
      } else if (err.errors[0].message === "email must be unique") {
        res.status(400).json({ "message": "Email already registered" })
      }
      else res.status(400).json({ "message": err.errors[0].message })
    } else {
      res.status(500).json({ "message": "Internal error" })
    }
  } else {
    switch (err.message) {
      case "Wrong email/password combination":
        res.status(400).json({ "message": "Username/password didn't match" })
        break;
      case "Please fill in the name":
        res.status(400).json({ "message": "Please fill in the name" })
        break;
      case "Please fill the name with the right format without symbols and numbers":
        res.status(400).json({ "message": "Please fill the name with the right format without symbols and numbers" })
        break;
      case "Please fill in the email":
        res.status(400).json({ "message": "Please fill in the email" })
        break;
      case "Please fill the right email format":
        res.status(400).json({ "message": "Please fill the right email format" })
        break;
      case "Please fill in the password":
        res.status(400).json({ "message": "Please fill in the password" })
      case "Password must be length of 8 to 35":
        res.status(400).json({ "message": "Password must be length of 8 to 35" })
        break;
      case "File not found":
        res.status(404).json({ "message": "File not found" })
        break;
      case "Invalid Admin CSV file":
        res.status(400).json({ "message": "Invalid Admin CSV file" })
        break;
      case "Invalid Member CSV file":
        res.status(400).json({ "message": "Invalid Member CSV file" })
        break;
      case "Invalid Product CSV file":
        res.status(400).json({ "message": "Invalid Product CSV file" })
        break;
      case "Invalid token":
        res.status(401).json({ "message": "Access denied" })
        break;
      case "Unauthorized access":
        res.status(401).json({ "message": "Unauthorized access" })
        break;
      default:
        res.status(500).json({ "message": "Internal error" })
        break;
    }
  }

}

module.exports = errorHandler