//  start writing your code from here
const express = require("express");
const { Todo } = require("../db/index");
const { authenticateJwt } = require("../middleware/user");
const router = express.Router();
router.use(authenticateJwt);
// todo Routes
router.post('/', async (req, res) => {
    // Implement todo creation logic
    try {
        const userId = req.userId;
        const title = req.body.title;
        // const {title}=req.body;
        const todo = await Todo.create({
            title,
            userId,
            done: false
        })
        res.json({
            message: `todo is created`,
            todo
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create todo", error });
    }
});
router.get('/', async (req, res) => {
    // Implement fetching all todo logic
    try {
        const userId = req.userId;
        const todos = await Todo.find({
            userId
        })
        res.json({
            todos: todos
        })
    } catch (error) {
    res.status(500).json({
        msg: "error fetching todos",
        error: error.message
    })
}
});

router.put('/:id', async (req, res) => {
    // Implement update todo  logic
    try {
        const todoId = req.params.id;
        const userId = req.userId;
        const { done } = req.body;
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId: userId },
            { done },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    // Implement delete todo by id logic
    const todoId = req.params.id;
    const userId = req.userId;
    const result = await Todo.deleteOne(
        { _id: todoId, userId: userId }
    )
    if (result.deletedCount === 1) {
        res.json({
            message: `Todo with id ${todoId} deleted successfully`
        });
    } else {
        res.status(404).json({
            message: "Todo not found or not authorized to delete"
        });
    }
});
// router.delete('/', async (req, res) => {
//     // Implement delete todo logic
//     const result = await Todo.deleteMany({ userId: req.userId });
//     res.json({
//         message: `${result.deletedCount} todos deleted`
//     })
// });





// router.get('/:id', async (req, res) => {
//     // Implement fetching todo by id logic
//     const todoId = req.params.id;
//     const userId = req.userId;
//     const todo = await TodoModel.findOne(
//         { _id: todoId, userId: userId }
//     )
//     if (!todo) {
//         res.json({
//             message: "todo not found"
//         })
//     }
//     else {
//         res.json({
//             title: todo.title
//         })
//     }
// });

module.exports = router;