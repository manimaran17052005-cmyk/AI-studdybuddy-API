const fs = require("fs");
const mongoose = require("mongoose");
const Material = require("../models/Material");
const { askGemini } = require("../utils/gemini");

// Helper: read uploaded file text
const readFileText = (filePath) => fs.readFileSync(filePath, "utf-8");

const findMaterialForUser = (id, user) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const filter = user.role === "admin" ? { _id: id } : { _id: id, user: user.userId };
  return Material.findOne(filter);
};

const parseCount = (value) => {
  const count = value === undefined ? 5 : Number(value);
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    const error = new Error("count must be an integer between 1 and 20");
    error.status = 400;
    throw error;
  }
  return count;
};

// POST /api/materials/upload
const uploadMaterial = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { title } = req.body;
  try {
    const content = readFileText(req.file.path);
    const material = await Material.create({
      user: req.user.userId,
      title: title?.trim() || req.file.originalname,
      content,
      filename: req.file.originalname,
    });
    res.status(201).json({ message: "Material uploaded", material });
  } finally {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
};

// GET /api/materials
const getMaterials = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user.userId };
  const materials = await Material.find(filter).select("-content -flashcards -quiz -studyPlan").sort("-createdAt");
  res.json(materials);
};

// GET /api/materials/:id
const getMaterial = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid material id" });
  const material = await findMaterialForUser(req.params.id, req.user);
  if (!material) return res.status(404).json({ message: "Not found" });

  res.json(material);
};

// DELETE /api/materials/:id
const deleteMaterial = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid material id" });
  const material = await findMaterialForUser(req.params.id, req.user);
  if (!material) return res.status(404).json({ message: "Not found" });

  await material.deleteOne();
  res.json({ message: "Deleted" });
};

// POST /api/materials/:id/summarize
const summarize = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid material id" });
  const material = await findMaterialForUser(req.params.id, req.user);
  if (!material) return res.status(404).json({ message: "Not found" });

  const prompt = `Summarize the following study material clearly and concisely in bullet points:\n\n${material.content}`;
  const summary = await askGemini(prompt);

  material.summary = summary;
  await material.save();

  res.json({ summary });
};

// POST /api/materials/:id/flashcards
const generateFlashcards = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid material id" });
  const material = await findMaterialForUser(req.params.id, req.user);
  if (!material) return res.status(404).json({ message: "Not found" });

  const count = parseCount(req.body.count);

  const prompt = `
Create ${count} flashcards from the study material below.
Return ONLY valid JSON in this format, no extra text:
[{"question": "...", "answer": "..."}]

Study material:
${material.content}
`;

  const raw = await askGemini(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  const flashcards = JSON.parse(clean);

  material.flashcards = flashcards;
  await material.save();

  res.json({ flashcards });
};

// POST /api/materials/:id/quiz
const generateQuiz = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid material id" });
  const material = await findMaterialForUser(req.params.id, req.user);
  if (!material) return res.status(404).json({ message: "Not found" });

  const count = parseCount(req.body.count);

  const prompt = `
Create ${count} multiple choice quiz questions from the study material below.
Return ONLY valid JSON in this format, no extra text:
[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]

Study material:
${material.content}
`;

  const raw = await askGemini(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  const quiz = JSON.parse(clean);

  material.quiz = quiz;
  await material.save();

  res.json({ quiz });
};

// POST /api/materials/:id/study-plan
const generateStudyPlan = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid material id" });
  const material = await findMaterialForUser(req.params.id, req.user);
  if (!material) return res.status(404).json({ message: "Not found" });

  const { goal, hoursPerDay, days } = req.body;

  const prompt = `
You are a study planner. Based on the study material below, create a personalized ${days || 7}-day study plan.
Student's goal: ${goal || "Understand and retain the material"}
Available study time: ${hoursPerDay || 2} hours per day.

Return a clear day-by-day schedule with topics and activities.

Study material:
${material.content}
`;

  const studyPlan = await askGemini(prompt);

  material.studyPlan = studyPlan;
  await material.save();

  res.json({ studyPlan });
};

module.exports = {
  uploadMaterial,
  getMaterials,
  getMaterial,
  deleteMaterial,
  summarize,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
};
