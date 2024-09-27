/**
 * @file Manages all operations related to journals
 * @author mike
 * @description This function creates a new journal
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object
 */

import JournalRepository from "../../repositories/journalRepositories.js";
import {
  updateEntity,
  deleteEntity,
} from "./baseController.js";

const createJournal = async (req, res) => {
  try {
    const { drinkId, userId, timeDrunk = new Date() } = req.body; // Set default value for timeDrunk
    const journal = await JournalRepository.create({
      drinkId,
      userId,
      timeDrunk,
    });
    return res.status(201).json({ data: journal });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getJournals = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request
    const journals = await JournalRepository.findByUserId(userId);
    if (!journals) {
      return res.status(404).json({ message: "No journals found" });
    }
    return res.status(200).json({ data: journals });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getJournal = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request
    const journal = await JournalRepository.findByIdAndUserId(req.params.id, userId);
    if (!journal) {
      return res.status(404).json({ message: `No journal with the id: ${req.params.id} found` });
    }
    return res.status(200).json({ data: journal });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateJournal = updateEntity(JournalRepository);
const deleteJournal = deleteEntity(JournalRepository);

export { createJournal, getJournals, getJournal, updateJournal, deleteJournal };