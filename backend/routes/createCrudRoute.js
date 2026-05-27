const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const createCrudRoute = (controller) => {
  const router = express.Router();

  router
    .route("/")
    .get(protect, controller.getAll)
    .post(protect, authorize("admin"), controller.create);

  router
    .route("/:id")
    .get(protect, controller.getOne)
    .put(protect, authorize("admin"), controller.update)
    .delete(protect, authorize("admin"), controller.remove);

  return router;
};

module.exports = createCrudRoute;