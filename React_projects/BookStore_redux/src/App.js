import './App.css';
import { useState } from 'react';
import {useSelector, useDispatch} from "react-redux";

// Action types
const ADD_BOOK = "ADD_BOOk";
const REMOVE_BOOK = "REMOVE_BOOK";
const SELL_BOOK = "SELL_BOOK";


// Action creators
const addBookAction = (book) => ({
  type: ADD_BOOK,
  payload: book,
})
const removeBookAction = (id) => ({
  type: REMOVE_BOOK,
  payload: id,
});
const sellBookAction = (id) => ({
  type: SELL_BOOK,
  payload: id,
});

const initialState = [
  { id: 1, title: "Aakkoset", author: "Matti Meikäläinen", stock: 10, price: 15 },
  { id: 2, title: "Musiikin perusteet", author: "Rockpete", stock: 2, price: 10 }
];

export const bookReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_BOOK:
      return [...state, action.payload];

    case REMOVE_BOOK:
      return state.filter(book => book.id !== action.payload);

    case SELL_BOOK:
      return state.map(book => 
        book.id === action.payload && book.stock > 0
        ? {...book, stock: book.stock - 1}
        : book
      )

    default:
      return state;
  }
}

function App() {
  const books = useSelector((state) => state.books)

  // uuden kirjan tiedot
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const dispatch = useDispatch();

  const addBook = () => {
    if (title && author && stock >= 0 && price >= 0) {
      const newBook = {
        id: Date.now(),
        title,
        author,
        stock,
        price
      };
      dispatch(addBookAction(newBook));
      setTitle(""); setAuthor(""); setStock(0); setPrice(0);
    }
  };

  return (
    <div className="app-container">
      <h1>Book Inventory</h1>

      <form onSubmit={(e) => { e.preventDefault(); addBook(); }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label>
          Stock
          <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
        </label>
        <label>
          Price
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </label>
        <button type="submit">Add</button>
      </form>

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
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
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.stock}</td>
                <td>{book.price} €</td>
                <td>
                  <button onClick={() => dispatch(sellBookAction(book.id))}>Sell</button>
                  <button onClick={() => dispatch(removeBookAction(book.id))}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

}

export default App;
