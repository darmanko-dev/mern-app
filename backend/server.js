const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

mongoose.connect("mongodb://127.0.0.1:27017/todos", {
    useNewUrlParser: true,
});

mongoose.connection.once("open", () => {
    console.log("Mongodb connection established succesfully.");
});

const PORT = 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    // eslint-disable-next-line array-callback-return
    Todo.find((err, todo) => {
        if (err) console.log(err);
        else res.json(todo);
    });
});

app.post("/create", (req, res) => {
    const todo = new Todo(req.body);
    todo
        .save()
        .then((todo) => {
            res.json(todo);
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.get("/:id", (req, res) => {
    const id = req.params.id;
    Todo.findById(id, (err, todo) => {
        res.json(todo);
    });
});

app.post("/:id", (req, res) => {
    const id = req.params.id;
    Todo.findById(id, (err, todo) => {
        if (!todo) res.status(404).send("Todo not Found .");
        else todo.text = req.body.text;
        todo
            .save()
            .then((todo) => {
                res.json(todo);
            })
            .catch((err) => res.status(500).send(err.message));
    });
});

app.listen(PORT, () => {
    console.log("Server is runnig on port" + PORT);
});