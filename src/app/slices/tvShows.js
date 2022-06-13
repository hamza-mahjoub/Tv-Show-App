import { createSlice } from "@reduxjs/toolkit";

import { api } from "../api/APIConfig"

// initial state
export const initialState = {
  loading: false,
  error: false,
  tvShows: {
    page: 0,
    results: [],
    total_page: 0,
    total_results: 0,
  },
};

// our slice
const tvShowsSlice = createSlice({
  name: "tvShows",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setTvShows: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.tvShows = payload;
    },
    setError: (state) => {
      state.error = true;
    },
  },
});


// export the actions
export const { setLoading, setTvShows, setError } = tvShowsSlice.actions;

// export the selectors
export const tvShowsSelector = (state) => state.tvShows;

// export the default reducer
export default tvShowsSlice.reducer;

// fetch all tv-Shows
export function fetchTvShowsByType(page,type) {
  return async (dispatch) => {
    api
      .get(`/tv/${type}`,{ params: { page }})
      .then((response) => {
        dispatch(setTvShows(response.data));
      })
      .catch((er) => {
        dispatch(setError());
      });
  };
}

export function fetchTvShowsByContent(page,query) {
    return async (dispatch) => {
      api
        .get('/search/tv',{ params: { page , query }})
        .then((response) => {
          if(response.data.total_results !== 0){
            dispatch(setTvShows(response.data));
          }
        })
        .catch((er) => {
          dispatch(setError());
        });
    };
  }