const express = require("express");
const axios = require("axios")
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user." });
  }

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(404).json({ message: "Username already exists." });
  }

  users.push({
    username: username,
    password: password,
  });

  return res.status(200).json({
    message: `User ${username} successfully registered. Now you can login`,
  });
});

// Get the book list available in the shop using Promise with Async/Await
public_users.get("/", async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => resolve(books));
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Helper Function to fetch book by ISBN using Axios and Async/Await
async function getBookByIsbnAxios(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book Details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
}

// Route المخدّم للبيانات
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });

  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });

  res.send(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];

  res.send(book["reviews"]);
});

module.exports.general = public_users;
