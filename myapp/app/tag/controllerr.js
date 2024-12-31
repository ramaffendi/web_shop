const Tag = require("./model");
const Product = require("../product/model");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();
    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = await Tag.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    let tag = await Tag.findByIdAndDelete(req.params.id);
    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let tag = await Tag.find();
    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const getProducts = async (req, res) => {
  const { skip = 0, limit = 10, category, tags } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (tags) filter.tags = tags; // Filter berdasarkan tags

  try {
    const products = await Product.find(filter)
      .skip(Number(skip))
      .limit(Number(limit));
    const count = await Product.countDocuments(filter);

    res.json({ data: products, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

module.exports = {
  store,
  update,
  destroy,
  index,
  getProducts,
};
