const mysql = require('mysql');
const cors = require('cors');
const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
app.use(express.json());

app.use(cors({
    origin:["http://localhost:3000"],
    methods: ["GET","POST"],
    credentials:true
}));

const port = 3001
const saltRounds = 10;

app.post("/register", (req, res) => {
    const PIDU = req.body.PIDU;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(
            "Insert into users (PIDU,username,email,password) values (?,?,?,?)",
            [PIDU, username, email, hash],
            (err, result) => {
                console.log(err);
            }
        );
    })

});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
        "SELECT email,password FROM users WHERE email = ?;",
        email,
        (err, result) => {
            if (err) {
                res.send({err: err});
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, result2) => {
                    if (result2) {
                        req.session.user =result;
                        console.log(req.session.user)
                        res.send(result)
                    } else {
                        res.send({message: "Wrong usernamme or password!"})
                    }
                });
            }else {
                res.send({message: "User does not exist!"})
            }
        }
    );
});


app.use(cookieParser);
app.use(express.urlencoded());


app.use(session({
    key:"userId",
    secret:"Secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60*60*24*7,
    },
}));



const db = mysql.createConnection({
    user: "root",
    host: "35.246.174.11",
    port: 3306,
    password: "root",
    database: "tutorhub_test",
})




app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.get('/login',(req,res)=>{
    if(req.session.user){
        res.send({loggedIn:true,user:req.session.user})
    }else{
        res.send({loggedIn:false})
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


