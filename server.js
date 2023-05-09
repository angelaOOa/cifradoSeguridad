require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const { Pool } = require('pg');
const flash = require('connect-flash');
const app = express();
app.set('view engine','ejs');
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser('Mi ultra hiper secreto'));

app.use(session({
    secret: 'misecre', 
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, 
})

// ...

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
      if (err) {
        return done(err);
      }
      const user = result.rows[0];
      done(null, user);
    });
  });
  
  // ...
  

  passport.use(
    new PassportLocal(function (username, password, done) {
      pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
        (err, result) => {
          if (err) {
            return done(err);
          }
          if (result.rows.length > 0) {
            const user = result.rows[0];
            if (user.password === password) {
              // Reiniciar los intentos fallidos si la contraseña es correcta
              pool.query(
                'UPDATE users SET intentos = 0 WHERE id = $1',
                [user.id],
                (err) => {
                  if (err) {
                    return done(err);
                  }
                  return done(null, user);
                }
              );
            } else {
              // Incrementar los intentos fallidos y verificar si se debe bloquear al usuario
              const newFailedAttempts = user.intentos + 1;
              const isBlocked = newFailedAttempts >= 3;
              const updateQuery = isBlocked
                ? 'UPDATE users SET intentos = $1, bloqueado = true WHERE id = $2'
                : 'UPDATE users SET intentos = $1 WHERE id = $2';
  
              pool.query(
                updateQuery,
                [newFailedAttempts, user.id],
                (err) => {
                  if (err) {
                    return done(err);
                  }
                  if (isBlocked) {
                    return done(null, false, {
                      message: 'Cuenta bloqueada. Intente más tarde.',
                    });
                  }
                  return done(null, false, {
                    message: 'Contraseña incorrecta.',
                  });
                }
              );
            }
          } else {
            return done(null, false, { message: 'Usuario no encontrado.' });
          }
        }
      );
    })
  );
  

app.get("/cifrador", (req, res) => {
    res.render("cifrador");
  });

app.get("/", (req, res) => {
    res.render("login");
  });

app.get("/login",(req,res)=>{
    const errorMessage = req.flash('error');
    res.render('login', { errorMessage });
});

app.post("/login", passport.authenticate('local',{
    successRedirect: "/cifrador",
    failureRedirect: "/login",
    failureFlash: true, // Habilita el uso de mensajes flash
}));

const server = app.listen(3000,()=> console.log("server started"));

