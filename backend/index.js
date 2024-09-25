import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "test",
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Where to store images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique name for the file
  },
});
const upload = multer({ storage: storage });

// Get all books
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add a book with cover image
app.post("/books", upload.single("cover"), (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";
  const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    coverPath,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json("Book has been added successfully");
  });
});

// Update a book with cover image
app.put("/books/:id", upload.single("cover"), (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";
  const coverPath = req.file ? `/uploads/${req.file.filename}` : req.body.cover;

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    coverPath,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json("Book has been updated successfully");
  });
});

app.listen(8800, () => {
  console.log("Connected to backend..");
});
