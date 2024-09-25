import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: null,  // Initialize as null since it's a file
  });
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Handle text input and file input changes
  const handleChange = (e) => {
    if (e.target.name === "cover") {
      setBook((prev) => ({ ...prev, cover: e.target.files[0] })); // For file input
    } else {
      setBook((prev) => ({ ...prev, [e.target.name]: e.target.value })); // For text input
    }
  };

  console.log(book);

  // Handle form submission
  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("desc", book.desc);
    formData.append("price", book.price);
    formData.append("cover", book.cover);  // Add cover image file to form data

    try {
      await axios.post("http://localhost:8800/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Set content type for file upload
        },
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input
        type="text"
        placeholder="Book title"
        name="title"
        onChange={handleChange}
      />
      <textarea
        rows={5}
        type="text"
        placeholder="Book description"
        name="desc"
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Book price"
        name="price"
        onChange={handleChange}
      />
      <input
        type="file"
        accept="image/*"
        placeholder="Book cover"
        name="cover"
        onChange={handleChange}  // Handle image file input
      />
      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Add;
