'use strict'

const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('../public/views/index');
})

app.get('/admins/register', (req, res) => {
    res.render('../public/views/register');
})

app.get('/admins/login', (req, res) => {
    res.render('../public/views/login');
})

app.get('/admins/edit', (req, res) => {
    res.render('../public/views/edit');
})

app.post('/admins/register', async (req, res) => {
    let { name, email, password, password2 } = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    //  validation check
    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ message: 'Password should be at least 6 characters' });
    }

    if (password !== password2) {
        errors.push({ message: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('../public/views/register', { errors });
    } else {
        // Form validation has passed

        let hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);

        pool.query(
            `SELECT * FROM admins
        WHERE email = $1;`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }

                console.log('reaches here');
                console.log(results.rows);
            }
        );
    }
});

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
})