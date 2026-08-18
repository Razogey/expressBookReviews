const express = require("express");
const axios = require("axios");
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

// Task 10: Get the book list available in the shop using Promise with Async/Await
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

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Helper function to get books by Author using Axios & Async/Await (FIXED PARAMETER)
async function getBookByAuthorAxios(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log("Book Details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by Author:", error.message);
  }
}

public_users.get("/author/:author", function (req, res) {
  const authorParam = req.params.author.toLowerCase();
  let booksByAuthor = [];
  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === authorParam) {
      booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 13: Helper function to get book details based on Title using Axios & Async/Await
async function getBooksByTitleAxios(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log("Books by Title:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
}

public_users.get("/title/:title", function (req, res) {
  const titleParam = req.params.title.toLowerCase();
  let booksByTitle = [];
  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === titleParam) {
      booksByTitle.push(books[key]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;