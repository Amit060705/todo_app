//  start writing your code from here
const { Router } = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const router = Router();
const z = require("zod");
const jwt = require("jsonwebtoken")
dotenv.config();
const SECRET=process.env.SECRET;
const { User } = require("../db/index");


// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    console.log("hitting signup");
    const requiredBody = z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(3).max(100),
    })
    const parsedWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedWithSuccess.success) {
        return res.status(422).json({
            message: "invalid input",
            errors: parsedWithSuccess.error.errors
        });
    };
    const { username, password } = parsedWithSuccess.data;
    try {
        const existingUser = await User.findOne({
            username: username
        })
        if (existingUser) {
            return res.status(409).json({
                message: "user already exists try to login",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 5);
        // console.log("hitting signup");
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "User successfully created",
            user: {
                id: newUser._id,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error("signup error:", error);
        return res.status(500).json({
            message: "internal server error"
        })
    }

});

router.post('/login', async (req, res) => {
    // Implement user login logic
    try {
        const loginSchema = z.object({
            username: z.string().min(3).max(100),
            password: z.string().min(3).max(100)
        });
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(422).json({
                message: "invalid input",
                errors: parsed.error.errors
            });
        }
        const { username, password } = parsed.data;
        console.log({
            username,
            password
        })
        const user = await User.findOne({
            username
        })
        if (!user) {
            return res.status(401).json({
                message: "User does not exist in our database"
            })
        }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(403).json({
                    message: "incorrect credentials"
                });
            }
            const token = jwt.sign({
                    id: user._id.toString()
                }, SECRET,{expiresIn:"1h"});
                console.log(token);
                return res.status(200).json({
                    message:"login successful",
                    token,
                    user:{
                        id:user._id,
                        username:user.username
                    }
                });
                
    }catch (error) {
        console.error("login error:",error);
        return res.status(500).json({message:"internal server error"});
    }
});

// router.get('/todos', userMiddleware,async(req, res) => {
//     // Implement logic for getting todos for a user
//     const userId=req.userId;
//     const todos=await Todo.find({
//         userId
//     })
//     if (todos.length > 0) {
//     res.json({
//         todos: todos.map(todo => ({
//             title: todo.title,
//             done: todo.done
//         }))
//     });
// }
//     else{
//         res.json({
//             message:"todo not found"
//         })
//     }
// });

// router.post('/logout', userMiddleware, (req, res) => {
//     // Implement logout logic
//     res.json({
//         message:"logged out successfully"
//     })
// });

module.exports = router