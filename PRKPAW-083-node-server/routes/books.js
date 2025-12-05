 	const express = require('express');
 	const router = express.Router();
 	
 	let books = [
 	  {id: 1, title: 'Book 1', author: 'Author 1'},
 	  {id: 2, title: 'Book 2', author: 'Author 2'}
 	];
 	
 	router.get('/', (req, res) => {
 	  res.json(books);
 	});
 	
 	router.get('/:id', (req, res) => {
 	  const book = books.find(b => b.id === parseInt(req.params.id));
 	  if (!book) return res.status(404).send('Book not found');
 	  res.json(book);
 	});
 	
 	router.post('/', (req, res) => {
 	  const { title, author } = req.body;
 	  if (!title || !author) {
 	      return res.status(400).json({ message: 'Title and author are required' });
 	  }
 	  const book = {
 	    id: books.length + 1,
 	    title,
 	    author
 	  };
 	  books.push(book);
 	  res.status(201).json(book);
 	});
 	
 
router.put('/:id', (req, res) => {
    // 1. Cari buku berdasarkan ID
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        // Jika buku tidak ditemukan, kirim 404
        return res.status(404).send('Book not found');
    }

    // 2. Validasi input dari body
    const { title, author } = req.body;
    if (!title || !author) {
        // Jika title atau author kosong, kirim 400 Bad Request
        return res.status(400).json({ message: 'Title and author are required' });
    }

    // 3. Perbarui data buku
    book.title = title;
    book.author = author;

    // 4. Kirim respons buku yang sudah diperbarui
    res.json(book);
});
 

router.delete('/:id', (req, res) => {
    // 1. Cari indeks buku berdasarkan ID
    const index = books.findIndex(b => b.id === parseInt(req.params.id));

    // 2. Periksa apakah buku ditemukan (index >= 0)
    if (index === -1) {
        // Jika buku tidak ditemukan, kirim 404
        return res.status(404).send('Book not found');
    }

    // 3. Hapus buku dari array
    const deletedBook = books.splice(index, 1);

     
    res.json(deletedBook[0]);
});
 	module.exports = router;