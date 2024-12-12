const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const authMiddleware = require('./routes/auth');
const User = require('./models/User');


require('dotenv').config();

const app = express();
//Db connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'jfjhgjfkdghjdfgo4454gdgdfg8465',
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    async(username, password, done)=>{
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: 'User not found' });
            const isMatch = await user.isValidPassword(password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    try {
        const user =  User.findById(id); 
        done(null, user); 
    } catch (error) {
        done(error); 
    }
});

app.use('/auth', authMiddleware);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));