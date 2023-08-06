const express = require("express");
const app = express(); 
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.get("/classes", async (req,res) => {
    try {
        const all = await pool.query("select * from class_timetable",[]);
        console.log(all.rows);
        res.json(all.rows);

    } catch(err){
        console.error(err.message);
    }
});

app.get("/users", async (req,res) => {
    try {
        const all = await pool.query("select * from users",[]);
        console.log(all.rows);
        res.json(all.rows);

    } catch(err){
        console.error(err.message);
    }
});

app.get("/pre_req", async (req,res) => {
    try {
        const all = await pool.query("select * from pre_req",[]);
        console.log(all.rows);
        res.json(all.rows);

    } catch(err){
        console.error(err.message);
    }
});

app.get("/classes/search_by_course/:course", async (req,res) => {
    try {
        const { course } = req.params;
        const all = await pool.query("select * from class_timetable where course = '".concat(course, "'"));
        console.log(all.rows);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/classes/search_by_time/:class_time", async (req,res) => {
    try {
        const { class_time } = req.params;
        const all = await pool.query("select * from class_timetable where class_time = ($1)",[class_time]);
        console.log(all.rows);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/pre_req/:course", async (req,res) => {
    try {
        const { course } = req.params;
        const all = await pool.query("select * from pre_req where course = ($1)",[course]);
        console.log(all.rows);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/classes/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const all = await pool.query("select * from class_timetable where id = ($1)",[id]);
        console.log(all.rows);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});


app.listen(4000);