const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "AniketisGOODBoy"

router.post('/createuser',
    [
        body('name', 'name must be of atleast 3 characters').isLength(3),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password must be of atleast 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        // if there are error return bad request and error
        const errors = validationResult(req);
        let success = false;
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }

        try {
            

            // check wether the user with the same email already
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            console.log(authtoken)
            success = true
            res.json({ success, authtoken })
        }
        catch (error) {
            res.status(500).send("Internal server error")
        }
    })



//Authentication a User using post 


router.post('/login',
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ],

    async (req, res) => {
        let success = false
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body
        try {
            let user = await User.findOne({ email: req.body.email })
            if (!user) {
                success = false
                return res.status(400).json({ error: "Please try to login with correct credentials" })
            }

            // for comparing the password using compare function (comparision between password from db and currently entered password)
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                success = false
                return res.status(400).json({ success, error: "Please try to login with correct credentials" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true
            console.log(authtoken)
            res.json({ success, authtoken })

        }
        catch (error) {
            console.error(error.message)
            res.status(500).send("Internal server error")
        }

    }
)



// ROute 3 - get user details. login required;

router.post('/getuser', fetchuser,async(req, res) => {

        try{

            userId=req.user.id
            const user = await User.findById(userId).select("-password")
            res.json(user)
        }
        catch(error){
            res.status(500).send("Internal server error")
        }
    }

)



module.exports = router