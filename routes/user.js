const express = require("express");
const router = express.Router();

const { createUser, fetchUsers, fetchUserById, updateUser, updateUserInvestigations, deleteUser } = require("../controllers/userController");

router.post("/create", createUser);

router.get("/fetch", fetchUsers);
router.get("/fetch/:id", fetchUserById);

router.put("/update/:id", updateUser);
router.put("/update/investigations/:id", updateUserInvestigations);

router.delete("/delete/:id", deleteUser);

module.exports = router;