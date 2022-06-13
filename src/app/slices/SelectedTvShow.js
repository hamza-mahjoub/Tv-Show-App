import { createSlice } from "@reduxjs/toolkit";
import { api } from "../api/APIConfig"

// initial state
export const initialState = {
  loading: false,
  error: false,
  tvShow:{},
  episodes:{},
};

// our slice
const SelectedtvShowSlice = createSlice({
  name: "selectedTvShow",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setTvShow: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.tvShow = payload;
    },
    setEpisodes: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.episodes = payload;
    },
    setError: (state) => {
      state.error = true;
    },
  },
});


// export the actions
export const { setLoading, setTvShow,setEpisodes, setError } = SelectedtvShowSlice.actions;

// export the selectors
export const tvShowSelector = (state) => state.tvShow;
export const tvShowEpisodesSelector = (state) => state.episodes;

// export the default reducer
export default SelectedtvShowSlice.reducer;

// fetch all tv-Shows
export const fetchTvShow = (id) => {
  return async (dispatch) => {
    api
      .get(`/tv/${id}`)
      .then((response) => {
        dispatch(setTvShow(response.data));
      })
      .catch((er) => {
        dispatch(setError());
      });
  };
}

export function fetchTvShowEpisodesBySeason(tv_id,season_number) {
    return async (dispatch) => {
      api
        .get(`/tv/${tv_id}/season/${season_number}`)
        .then((response) => {
          dispatch(setEpisodes(response.data));
        })
        .catch((er) => {
          dispatch(setError());
        });
    };
  }
