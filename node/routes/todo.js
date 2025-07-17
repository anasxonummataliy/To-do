const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Xatolik yuz berdi' });
    }
});

router.post('/', async (req, res) => {
    const { text } = req.body;
    try {
        const newTodo = new Todo({ text });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ error: 'Todo yaratib bo‘lmadi' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    try {
        const updated = await Todo.findByIdAndUpdate(id, { done }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Yangilab bo‘lmadi' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo o‘chirildi' });
    } catch (err) {
        res.status(400).json({ error: 'O‘chirishda xatolik' });
    }
});

module.exports = router;
