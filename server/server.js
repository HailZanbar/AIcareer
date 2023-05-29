const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Occupation = require('./models/Occupation.js');
const Question = require('./models/Question.js');
const Home = require('./models/Home.js');
const Response = require('./models/Response.js');
const HomeRouter = require('./routes/home.js');
const QuestionsRouter = require('./routes/questions.js');
const OccupationsRouter = require('./routes/occupations.js');
const ResponseRouter = require('./routes/response.js');
const RecommendRouter = require('./routes/recommend.js');
const cookieParser = require('cookie-parser');

require('dotenv').config()
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'kasefrac4r5r3wq45wdfgw34twrfx';

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }));

mongoose.connect(process.env.MONGO_URL);

// route the occupations
app.use('/api/occupations',OccupationsRouter)

// route the questions
app.use('/api/questions',QuestionsRouter)

// route the home 
app.use('/api/home',HomeRouter)

// route the response 
app.use('/api/response',ResponseRouter)

// route the recommend 
app.use('/api/recommend',RecommendRouter)


app.get('/test', (req, res) => {
    res.json('test ok');
});

/////// hail area ///////

// register post request
app.post('/api/register', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {name,email,password,type,answered} = req.body;
  
    try {
      const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
        type,
        answered
      });
      res.json(userDoc);
    } catch (e) {
      res.status(422).json(e);
    }
  
});

// login post request
app.post('/api/login', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.json('not found');
    }
});

// get user profile request
app.get('/api/profile', (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name,email,type,answered,_id,} = await User.findById(userData.id);
        res.json({name,email,type,answered,_id});
      });
    } else {
      res.json(null);
    }
});

// logout request
app.post('/api/logout', (req,res) => {
    res.cookie('token', '').json(true);
});
  
// get the number of users in the DB
app.get('/api/users', async (req, res) => {
  try {
    const count = await User.countDocuments({});
    res.json(count);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/useranswered', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const {user_id} = req.body;
    await User.updateOne({ _id: user_id }, { $set: { answered: 1 } })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/////// hail area ///////


app.listen(4000);