import { configureStore } from '@reduxjs/toolkit';
import tvShowsReducer from '../app/slices/tvShows';
import selecteTvShowReducer from '../app/slices/SelectedTvShow';

export const store = configureStore({
  reducer: {
    tvShows: tvShowsReducer,
    tvShow: selecteTvShowReducer,
  },
});
