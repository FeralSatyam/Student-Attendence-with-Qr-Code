const express = require('express')
const studentModel = require("./models/student")
const teacherModel = require("./models/teacher")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const qrcode = require('qrcode')
const sessionRoutes = require('./routes/session')
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
function isLoggedInTeacher(req, res, next){
    if(req.cookies.token === "") res.redirect("/teacherlogin");
    else{
        let data = jwt.verify(req.cookies.token, "secret")
        req.teacher = data
        next()
    } 
}

app.get('/', (req, res)=>{
    res.render("index")
})
app.use('/session', sessionRoutes)

app.get('/studentlogin', (req, res)=>{
    res.render("studentlogin")
})
app.get('/teacherlogin', (req, res)=>{
    res.render("teacherlogin")
})
app.get('/admin', (req, res)=>{
    res.render("admin")
})
app.get('/studentregister', (req, res)=>{
    res.render("studentregister")
})
app.get('/teacherregister', (req, res)=>{
    res.render("teacherregister")
})
app.get('/studentprofile', isLoggedInStudent, async (req, res)=>{
    let student = await studentModel.findOne({email: req.student.email})
    res.render("studentprofile", {student})
})
app.get('/teacherprofile', isLoggedInTeacher, async (req, res)=>{
    let teacher = await studentModel.findOne({email: req.teacher.email})
    res.render("teacherprofile", {teacher})
})  
app.get('/teacherattendance', (req,res)=>{
    res.render("teacherattendence")
})
app.get('/aboutus', (req,res)=>{
    res.render("aboutus")
})

app.post('/studentlogin', async (req, res)=>{
    let {email, password} = req.body
    let student = await studentModel.findOne({email})
    if(!student) return res.status(500).send("Something went wrong")
    
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
app.post('/teacherlogin', async (req, res)=>{
    
    let {email, password} = req.body
    let teacher = await teacherModel.findOne({email})
    if(!teacher) return res.status(500).send("Something went wrong")
    
    bcrypt.compare(password, teacher.password, (err, result)=>{
        if(result){
            let token = jwt.sign({email: email, teacherid: teacher._id}, "secret")
            res.cookie("token", token)
            
            res.status(200).redirect("/teacherprofile")
        }
        else{
            res.redirect("/teacherlogin")
        }
    })  
})

app.post('/studentregister', async (req,res)=>{
    let {name, course, intake, email, password} = req.body
    let student = await studentModel.findOne({email})
    if(student) res.status(500).send("User Already Created")
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let student = await studentModel.create({
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
app.post('/teacherregister', async (req,res)=>{
    let {name, email, password} = req.body
    let teacher = await teacherModel.findOne({email})
    if(teacher) res.status(500).send("User Already Created")
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let teacher = await teacherModel.create({
                name,
                email,
                password: hash
            })
            let token = jwt.sign({email: email, teacherid: teacher._id}, "secret")
            res.cookie("token", token)
            res.send("Registered")
        });
    });
})

app.listen(3000)