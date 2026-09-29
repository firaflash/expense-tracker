import Category from "../models/Category.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, icon, color, type } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      user: req.user._id,
      name,
      icon,
      color,
      type,
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already have a category with this name",
      });
    }

    return res.status(500).json({
      message: "Server error while creating category",
    });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching categories",
    });
  }
};

// GET ONE CATEGORY
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching category",
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "icon",
      "color",
      "type",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    Object.assign(category, updates);

    const updatedCategory = await category.save();

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already have a category with this name",
      });
    }

    return res.status(500).json({
      message: "Server error while updating category",
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Server error while deleting category",
    });
  }
};