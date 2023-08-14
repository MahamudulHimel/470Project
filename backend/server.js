const express = require("express");
const app = express(); 
const cors = require("cors");
const pool = require("./db");

const fetch_data = async (s,userId) => {
    const response = await fetch(`http://localhost:4000/taken_courses/${s}/${userId}`)
    let exam = []
    let arr1 = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
      ]
    const all = await response.json()
    const data = all[0][`target_class_ids_${s}`]
    for (let i in data){

        const cls = await fetch(`http://localhost:4000/classes/${data[i]}`)
        const cls1 = await cls.json()
        const cls2 = await fetch(`http://localhost:4000/course_info/${cls1[0]["course"]}`)
        const cls3 = await cls2.json()

        arr1[parseInt(cls1[0]['class_time'])-1][parseInt(cls1[0]['class_days'])-1] = cls1[0]["course"] + "-" + cls1[0]['section']
        if (parseInt(cls1[0]['class_days']) == 1){
            arr1[parseInt(cls1[0]['class_time'])-1][parseInt(cls1[0]['class_days'])+4] = cls1[0]["course"] + "-" + cls1[0]['section']
        }
        else{
            arr1[parseInt(cls1[0]['class_time'])-1][parseInt(cls1[0]['class_days'])+1] = cls1[0]["course"] + "-" + cls1[0]['section']
        }
        exam.push({time: cls3[0].exam_time, date:cls3[0].exam_date, course: cls3[0].course})
    }
    console.log(arr1,exam)
    return [arr1, exam]
    }

app.use(cors());
app.use(express.json());

app.get("/classes", async (req,res) => {
    try {
        const all = await pool.query("select * from class_timetable",[]);
        res.json(all.rows);

    } catch(err){
        console.error(err.message);
    }
});

app.get("/users", async (req,res) => {
    try {
        const all = await pool.query("select * from users",[]);
        res.json(all.rows);

    } catch(err){
        console.error(err.message);
    }
});

app.get("/pre_req", async (req,res) => {
    try {
        const all = await pool.query("select * from pre_req",[]);
        res.json(all.rows);

    } catch(err){
        console.error(err.message);
    }
});

app.get("/classes/search_by_course/:course", async (req,res) => {
    try {
        const { course } = req.params;
        const all = await pool.query("select * from class_timetable where course = '".concat(course, "'"));
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/classes/search_by_time/:class_time", async (req,res) => {
    try {
        const { class_time } = req.params;
        const all = await pool.query("select * from class_timetable where class_time = ($1)",[class_time]);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/pre_req/:course", async (req,res) => {
    try {
        const { course } = req.params;
        const all = await pool.query("select * from pre_req where course = ($1)",[course]);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/classes/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const all = await pool.query("select * from class_timetable where id = ($1)",[id]);
        console.log(all.rows[0].course)
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/time_get/:user_id", async (req,res) => {
    try {
        let arr1 = [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
          ];
        const { user_id } = req.params;
        const t0 = await pool.query("select allowed_time_0 from users where id = ($1)",[user_id]);
        const t1 = await pool.query("select allowed_time_1 from users where id = ($1)",[user_id]);

        for (i in t1.rows[0].allowed_time_1){
            arr1[parseInt(t1.rows[0].allowed_time_1[i])-1][parseInt(t0.rows[0].allowed_time_0[i])-1] = 1
        }
        res.json({'routine' : arr1});
    } catch(err){
        console.error(err.message);
    }
});


app.put("/time_set/:user_id", async (req,res) => {
    try {
        const { user_id } = req.params;
        let t0 = []
        let t1 = []
        for (i in req.body.allowed_time){
            t0.push(req.body.allowed_time[i][0])
            t1.push(req.body.allowed_time[i][1])
        }
        const a = await pool.query('UPDATE users SET allowed_time_0 = ($1), allowed_time_1 = ($2) WHERE id = ($3)',[t0,t1,user_id]);
        res.json(a)
    } catch(err){
        console.log(err.message)
    }
});

app.get("/taken_courses/:set/:user_id", async (req,res) => {
    try {
        const { set , user_id } = req.params;
        const all = await pool.query(`select target_class_ids_${set} from users where id = ($1)`,[ user_id]);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/routine/:set/:user_id", async (req,res) => {
    try {
        const { set , user_id } = req.params;
        const all = await fetch_data(set, user_id)
        console.log(all)
        res.json(all);
    } catch(err){
        console.error(err.message);
    }
});

app.get("/course_info/:course", async (req,res) => {
    try {
        const { course } = req.params;
        const all = await pool.query(`select * from pre_req where course = ($1)`,[course]);
        res.json(all.rows);
    } catch(err){
        console.error(err.message);
    }
});

app.listen(4000);

