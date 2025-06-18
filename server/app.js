const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose')

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api") 
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const students = require("./models/students.model");
const cohorts = require ("./models/cohorts.model");

const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors())
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

//Retrieves all of the students for a given cohort

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.get("/api/students", async(req, res)=>{
  try {
    const allStudents = await students.find()
    res.json(allStudents)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
  
})
// Creates a new student


app.post("/api/students", async (req, res) => {
  try{ 
    const newStudent = await students.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ "error": error.message });
  }
})


// Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    
    const cohortStudents = await students.find({cohort:req.params.cohortId}).populate('cohort')
    res.status(200).json(cohortStudents)
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
})

//Retrieves a specific student by id

app.get("/api/students/:studentId", async(req, res)=>{
  try {
    const student = await students.findById(req.params.studentId)
    res.status(201).json(student);
    
  } catch (error) {
    res.status(500).json(error);
  }
})
//Updates a specific student by id

app.patch("/api/students/:studentId", async(req, res)=>{
  try {
    const updatedStudent = await students.findByIdAndUpdate(req.params.studentId, req.body, {new: true});
    res.status(200).json(updatedStudent);
    
  } catch (error) {
    res.status(500).json(error)
  }
})
// Deletes a specific student by id
app.delete("/api/students/:studentsId", async(req, res)=>{
  try {
    const deletedStudent = await students.findByIdAndDelete(req.params.studentsId);
    res.status(200).json(deletedStudent)
    
  } catch (error) {
    res.status(500).json(error)
  }
})



app.get("/api/cohorts", async (req, res)=>{
  try {
    const allCohorts = await cohorts.find();
  res.json(allCohorts);
  } catch (error) {
     res.status(500).json({error: error.message})
  }
  
})

app.post("/api/cohorts", async (req, res)=>{
  try {
    const newCohort = await cohorts.create(req.body);
    res.status(201).json(newCohort);
} catch (error) {
  res.status(500).json({error: error.message})
}
})
// GET /api/cohorts/:cohortId - Retrieves a specific cohort by id


app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await cohorts.findById(req.params.cohortId);
    res.json(cohort);    
  } catch (error) {
    res.status(500).json({error: error.message}); 
  }
}); 
//Updates a specific cohort by id

app.patch("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const updatedCohort = await cohorts.findByIdAndUpdate(
      req.params.cohortId, req.body, {new:true})
      res.json(updatedCohort);
    } catch (error) {
      res.status(500).json({error: error.message}); 
  }
});
    
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const deletedCohort = await cohorts.findByIdAndDelete(req.params.cohortId);
    res.status(201).json(deletedCohort);
    } catch (error) {
      res.status(500).json({error: error.message}); 
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});