const express = require('express')
const studentModel = require("./models/student")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

function isLoggedInStudent(req, res, next){
    if(req.cookies.token === "") res.redirect("/studentlogin");
    else{
        let data = jwt.verify(req.cookies.token, "secret")
        req.student = data
        next()
    } 
}

app.get('/', (req, res)=>{
    res.render("index")
})
app.get('/studentlogin', (req, res)=>{
    res.render("studentlogin")
})
app.get('/admin', (req, res)=>{
    res.render("admin")
})
app.get('/studentregister', (req, res)=>{
    res.render("studentregister")
})
app.get('/studentprofile', isLoggedInStudent, async (req, res)=>{
    let student = await studentModel.findOne({email: req.student.email})
    res.render("studentprofile", {student})
})


app.post('/studentlogin', async (req, res)=>{
    let {email, password} = req.body
    let student = await studentModel.findOne({email})
    if(!student) res.status(500).send("Something went wrong")
    
    bcrypt.compare(password, student.password, (err, result)=>{
        if(result){
            let token = jwt.sign({email: email, studentid: student._id}, "secret")
            res.cookie("token", token)
            res.status(200).redirect("/studentprofile")
        }
        else{
            res.redirect("/studentlogin")
        }
    })  
})

app.post('/studentregister', async (req,res)=>{
    let {name, course, intake, email, password} = req.body
    let user = await studentModel.findOne({email})
    if(user) res.status(500).send("User Already Created")
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let user = await studentModel.create({
                name,
                email,
                intake,
                course,
                password: hash
            })
            let token = jwt.sign({email: email, studentid: student._id}, "secret")
            res.cookie("token", token)
            res.send("Registered")
        });
    });
})

app.listen(3000)