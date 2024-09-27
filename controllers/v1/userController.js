/**
 * @file Manages all operations related to users
 * @author logan
 * @description This function creates a new user
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object
 */

import UserRepository from "../../repositories/userRepositories.js";
import {
  createEntity,
  getEntities,
  getEntity,
  getEmailResource,
  updateEntity,
  deleteEntity,
} from "./baseController.js";

const createUser = createEntity(UserRepository);

const getUsers = async (req, res) => {
  try {
    const users = await UserRepository.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserRepository.findById(id);
    if (!user) {
      return res.status(404).json({ message: `No user with the id: ${id} found` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getEmail = async (req, res) => getEmailResource(req, res, "user");
const updateUser = updateEntity(UserRepository);
const deleteUser = deleteEntity(UserRepository);

export { createUser, getUsers, getUser, getEmail, updateUser, deleteUser };