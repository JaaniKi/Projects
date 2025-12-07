import { configureStore } from '@reduxjs/toolkit';
import { bookReducer } from '../App'; // tai oma tiedosto

export const store = configureStore({
  reducer: {
    books: bookReducer
  }
});