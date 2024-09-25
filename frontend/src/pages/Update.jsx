import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: null, // Changed to null for storing file
  });
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState(""); // To show image preview before submitting

  const navigate = useNavigate();
  const { id: bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/books/${bookId}`);
        setBook(res.data);
        setPreview(res.data.cover); // Set preview for existing cover image
      } catch (err) {
        console.log(err);
      }
    };
    fetchBook();
  }, [bookId]);

  const handleChange = (e) => {
    if (e.target.name === "cover") {
      const file = e.target.files[0];
      setBook((prev) => ({ ...prev, cover: file })); // Store the image file
      setPreview(URL.createObjectURL(file)); // Preview the image before submitting
    } else {
      setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("desc", book.desc);
    formData.append("price", book.price);
    if (book.cover) {
      formData.append("cover", book.cover); // Append the cover file
    }

    try {
      await axios.put(`http://localhost:8800/books/${bookId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Update the Book</h1>
      <input
        type="text"
        placeholder="Book title"
        name="title"
        value={book.title}
        onChange={handleChange}
      />
      <textarea
        rows={5}
        type="text"
        placeholder="Book description"
        name="desc"
        value={book.desc}
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Book price"
        name="price"
        value={book.price}
        onChange={handleChange}
      />
      <input
        type="file"
        name="cover"
        accept="image/*"
        onChange={handleChange} // Handle image upload
      />
      {preview && <img src={preview} alt="Book Cover Preview" style={{ width: 150, height: 200 }} />}
      
      <button onClick={handleClick} disabled={!book.title || !book.desc || !book.price}>
        Update
      </button>
      {error && <p style={{ color: "red" }}>Error updating the book. Please try again.</p>}
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Update;
