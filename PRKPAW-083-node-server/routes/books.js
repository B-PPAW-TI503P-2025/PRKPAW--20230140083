const express = require('express'); // [cite: 98]
const router = express.Router(); // [cite: 99]

// Data sementara dalam bentuk array [cite: 100]
let books = [
  {id: 1, title: 'Book 1', author: 'Author 1'}, // [cite: 101]
  {id: 2, title: 'Book 2', author: 'Author 2'}  // [cite: 102]
];

// GET semua buku [cite: 104]
router.get('/', (req, res) => {
  res.json(books); // [cite: 105]
});

// GET buku berdasarkan ID [cite: 107]
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id)); // [cite: 108]
  if (!book) return res.status(404).send('Book not found'); // [cite: 109]
  res.json(book); // [cite: 110]
});

// POST (membuat) buku baru [cite: 112]
router.post('/', (req, res) => {
  const { title, author } = req.body; // [cite: 113]
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' }); // [cite: 114, 115]
  }
  const newBook = {
    id: books.length + 1, // [cite: 118]
    title, // [cite: 119]
    author // [cite: 120]
  };
  books.push(newBook); // [cite: 122]
  res.status(201).json(newBook); // [cite: 123]
});

module.exports = router; // [cite: 125]