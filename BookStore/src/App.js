import './App.css';
import { useState } from "react";


const Form = ({ title, author, stock, price, setTitle, setAuthor, setStock, setPrice, addBook }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    addBook();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input type="text" placeholder="e.g. Harry Potter and the Philosopher's Stone" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label>
        Author
        <input type="text" placeholder='e.g. J.K. Rowling' value={author} onChange={(e) => setAuthor(e.target.value)} />
      </label>

      <label>
        Stock
        <input type="number" placeholder='e.g. 5' value={stock} onChange={(e) => setStock(Number(e.target.value))} />
      </label>

      <label>
        Price (€)
        <input type="number" placeholder='e.g. 20' value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </label>

      <button type='submit'>Add</button>
    </form>
  )
}

const TableRow = ({ book, sellBook, addStock, removeBook }) => {
  const getRowClass = () => {
    if (book.stock === 0) return "out-of-stock";
    if (book.stock < 3) return "low-stock";
    return "";
  };

  return (
    <tr className={getRowClass()}>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.stock}</td>
      <td>{book.price}€</td>
      <td>
        <button onClick={() => sellBook(book.id)}>Sell</button>
        <button onClick={() => addStock(book.id)}>Add stock</button>
        <button onClick={() => removeBook(book.id)}>Remove</button>
      </td>
    </tr>
  );
};


function App() {
  const [books, setBooks] = useState([
    { id: 1, title: "Programming basics", author: "Peter Programmer", stock: 10, price: 15 },
    { id: 2, title: "Learn react", author: "Ronald React", stock: 2, price: 10 }
  ]);

  // uuden kirjan tiedot
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");


  const addBook = () => {
    if (title && author && stock && price) {
      const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        stock: stock,
        price: price
      }

      setBooks([...books, newBook]);

      setTitle("");
      setAuthor("");
      setStock(0);
      setPrice(0);

      console.log("New book added successfully!");
    }
  }

  const sellBook = (id) => {
    setBooks(books.map(book =>
      book.id === id && book.stock > 0
        ? { ...book, stock: book.stock - 1 }
        : book
    ))
  }

  const removeBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = books.reduce((sum, book) => sum + book.stock * book.price, 0);

  const addStock = (id) => {
    setBooks(books.map(book =>
      book.id === id
        ? { ...book, stock: book.stock + 1 }
        : book
    ));
  };

  return (
    <div>
      <h1>Book Store</h1>

      <Form
        title={title}
        author={author}
        stock={stock}
        price={price}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setStock={setStock}
        setPrice={setPrice}
        addBook={addBook}
      ></Form>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <p><strong>Total stock value:</strong> {totalValue} €</p>


      {filteredBooks.length === 0
        ? <p>No books available</p>
        :
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book =>
              <TableRow
                key={book.id}
                book={book}
                sellBook={sellBook}
                addStock={addStock}
                removeBook={removeBook}
              />
            )}
          </tbody>
        </table>
      }
    </div>
  );

}

export default App;
