const { sequelize, User, Post } = require('./models');
const express = require('express');
const app = express();

app.use(express.json());

// create a new user
app.post('/api/user', async (req, res) => {
    const { name, email, role } = req.body;

    try {
        const user = await User.create({ name, email, role });
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

// get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

// get a single user
app.get('/api/user/:uuid', async (req, res) => {
    const { uuid } = req.params;
    try {
        const user = await User.findOne({ where: { uuid }, include: 'posts' });
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

// delete a single user
app.delete('/api/user/:uuid', async (req, res) => {
    const { uuid } = req.params;
    try {
        const user = await User.findOne({ where: { uuid } });
        await user.destroy();
        return res.json({ message: 'User deleted!' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

// edit a single user
app.put('/api/user/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const { name, email, role } = req.body;
    try {
        const user = await User.findOne({ where: { uuid } });

        user.name = name;
        user.email = email;
        user.role = role;

        await user.save();

        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

// create a user post
app.post('/api/post', async (req, res) => {
    const { userUUID, body } = req.body;

    try {
        const user = await User.findOne({ where: { uuid: userUUID } });
        const post = await Post.create({ body, userId: user.id });

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

// get all posts
app.get('/api/posts', async (req, res) => {

    try {
        // const posts = await Post.findAll({ include: [{ model: User, as: 'user' }]});
        const posts = await Post.findAll({ include: [ 'user' ]});

        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.errors[0].message });
    }
});

app.listen({ port: 5000 }, async () => {
    console.log('Server up on http://localhost:5000');
    // create database tables and sync 
    await sequelize.authenticate();
    console.log('Database connected!');
});