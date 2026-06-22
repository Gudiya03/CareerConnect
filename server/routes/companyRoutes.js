const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

// Public list & detail
router.get("/all", getAllCompanies);
router.get("/:id", getCompanyById);

// Protected CRUD
router.post("/create", protect, createCompany);
router.put("/update/:id", protect, updateCompany);
router.delete("/:id", protect, deleteCompany);

module.exports = router;
