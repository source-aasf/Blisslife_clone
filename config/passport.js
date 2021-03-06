const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');


// load user models
const User=require('../models/User');

module.exports=function(passport){
  passport.use(
    new LocalStrategy({usernameField:'email'},function(email,password,done){
      User.findOne({email:email},function(err,user){
        if(err){
          return done(err);
        }
        if(!user)
         {return done(null,false,{message:'the email is not yet registered'});
       }
        bcrypt.compare(password,user.password,function(err,isMatch){
          if(err) throw err;

          if(isMatch){
            return done(null,user);
          }
          else{
            return done(null,false,{message:"Incorrect Password"});
           }
        });

      });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
