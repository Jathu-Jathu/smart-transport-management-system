exports.getAll = (Model, populate = "") => async (req, res, next) => {
  try {
    let query = Model.find().sort({ createdAt: -1 });
    if (populate) query = query.populate(populate);

    const data = await query;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getOne = (Model, populate = "") => async (req, res, next) => {
  try {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);

    const data = await query;

    if (!data) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const data = await Model.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};