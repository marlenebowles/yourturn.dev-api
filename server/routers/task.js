const express = require('express');
let router = express.Router();
const Task = require('./../models/task');

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch(err) {
        res.status(404).send(err)
    }
}); 

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (err) {
        res.status(500).send();
    }
});


// :id is a route parameter
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) { 
        res.status(500).send();
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    const update = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = update.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send({ error: "invalid update"});
    }
    try {
        const task = await Task.findById(_id);
        update.forEach((update) => task[update] = req.body[update]);
        await task.save();
        if (!task) {
            return res.status(400).send();
        }
        res.send(task);
    } catch (err) {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(400).send({error: 'Task doesn\'t exist.'});
        }
        res.send(task);
    } catch(err) {
        res.status(500).send()
    }
});

module.exports = router;