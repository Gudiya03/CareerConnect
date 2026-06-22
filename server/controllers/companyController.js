const Company = require("../models/Company");

// Create Company
exports.createCompany = async (req, res) => {
  try {
    const { companyName, description, website, location, logo } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const company = await Company.create({
      companyName,
      description,
      website,
      location,
      logo,
      userId: req.user._id
    });

    res.status(201).json({ message: "Company profile created successfully", company });
  } catch (err) {
    res.status(555).json({ message: "Error creating company profile" });
  }
};

// Get All Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("userId", "name email");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching companies" });
  }
};

// Get Single Company
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("userId", "name email");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Error fetching company details" });
  }
};

// Update Company
exports.updateCompany = async (req, res) => {
  try {
    const { companyName, description, website, location, logo } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Verify ownership
    if (company.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You are not the owner of this company profile." });
    }

    if (companyName !== undefined) company.companyName = companyName;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;
    if (logo !== undefined) company.logo = logo;

    await company.save();
    res.json({ message: "Company profile updated successfully", company });
  } catch (err) {
    res.status(500).json({ message: "Error updating company profile" });
  }
};

// Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Verify ownership
    if (company.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    await company.deleteOne();
    res.json({ message: "Company profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting company profile" });
  }
};
