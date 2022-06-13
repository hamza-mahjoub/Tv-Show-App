import { useEffect, useState, React } from 'react';
import PropTypes from 'prop-types';

// for moving from one page to another
import { useNavigate } from 'react-router-dom'

// redux mapping
import { useDispatch, useSelector } from "react-redux";
import { fetchTvShowsByType, tvShowsSelector, fetchTvShowsByContent } from '../../slices/tvShows';

// material ui components
import {
  Autocomplete,
  Container,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  IconButton,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material'

// Icons
import PreviewIcon from '@mui/icons-material/Preview';
import SearchIcon from '@mui/icons-material/Search';

export function SearchPage(props) {

  // data is passed to autoComplete component (Tv Show List)
  const [data, setData] = useState([])

  // used in data fetching
  const [query, setQuery] = useState({ page: 1, searchValue: '', type: 'airing_today' })

  // total pages is passed to pagination component
  const [totalPages, setTotalPages] = useState(0)

  // set up navigate
  const navigate = useNavigate();

  // set up dispatch 
  const dispatch = useDispatch();

  // fetch data from store 
  const { loading, error, tvShows } = useSelector(tvShowsSelector)

  // hook to fetch tv shows
  useEffect(() => {
    if (query.searchValue === '')
      dispatch(fetchTvShowsByType(query.page, query.type))
  }, [dispatch, query])

  // hook to update data
  useEffect(() => {
    setData(tvShows.results)
    setTotalPages(tvShows.total_pages)
  }, [tvShows])

  // for the quick search select component
  const tvShowsTypes = [
    { title: 'Tv Airing Today', path: 'airing_today' },
    { title: 'Tv on the Air', path: 'on_the_air' },
    { title: 'Popular', path: 'popular' },
    { title: 'Top Rated', path: 'top_rated' }
  ]

  // fired when a type is selected
  // it resets everything
  const handleTypeChange = (event) => {
    setQuery({ page: 1, searchValue: '', type: event.target.value })
  }

  // when we change the requested page of tv shows
  const handlePageChange = (event, value) => {
    setQuery({ ...query, page: value })
  }

  // fired when we change a page of the result of a search by title
  const handlePageChangeTitle = (event, value) => {
    setQuery({ ...query, page: value })
    dispatch(fetchTvShowsByContent(query.page, query.searchValue))
  }

  // when we select a value from the auto complete component
  const handleAutoCompleteChange = (event, newValue) => {
    navigate(`/tv-show/${newValue.id}`)
  }

  // updates the search by title value
  const handleSearchValueChange = (event) => {
    setQuery({ ...query, searchValue: event.target.value })
  }

  // when the search button is clicked
  const searchTvShows = () => {
    dispatch(fetchTvShowsByContent('query.page', query.searchValue))
  }

  // the loader
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '30vh' }}>
      <CircularProgress />
    </div>
  )

  // a message if there is an error
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '30vh', justifyContent: 'center' }}>
      <Alert severity="error">This is an error alert — check it out!</Alert>
    </div>

  )

  if (tvShows.total_pages !== 0)
    return (
      <Container fixed>
        <Paper elevation={3}>
          <Grid container spacing={2} sx={{ marginTop: 5 }} direction="row" alignItems="center" justifyContent="center">
            <Grid item xs={10} sm={7} sx={{ marginBottom: 2 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment">Title Content</InputLabel>
                <OutlinedInput
                  id="outlined-adornment"
                  value={query.searchValue}
                  onChange={handleSearchValueChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={searchTvShows}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Title Content"
                />
              </FormControl>
            </Grid>
            <Grid item xs={10} sm={4} sx={{ marginBottom: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="tv-show-type-select">Quick Search</InputLabel>
                <Select
                  labelId="tv-show-type-select"
                  id="demo-simple-select"
                  value={query.type}
                  label="Quick Search"
                  onChange={handleTypeChange}
                >
                  {
                    tvShowsTypes.map((type) => (
                      <MenuItem key={type.path} value={type.path}>{type.title}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} >
          <Grid container spacing={2} sx={{ marginTop: 5 }} direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={12} width="80%" sx={{ marginTop: 3 }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={data}
                renderInput={(params) => <TextField {...params} label="Search in the Tv Show List" />}
                fullWidth={true}
                getOptionLabel={(option) => option.name}
                onChange={handleAutoCompleteChange}
              />
            </Grid>
          </Grid>

          <List dense={true}>
            <Grid container spacing={2} sx={{ marginTop: 5 }}>
              {data.map((tvShow) => (
                <Grid key={tvShow.id} item xs={12} sm={6} sx={{ marginTop: 2 }}>
                  <ListItem
                    onClick={(event) => navigate(`/tv-show/${tvShow.id}`)}
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar>
                          <PreviewIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={tvShow.name}
                        secondary={`Language: ${tvShow.original_language}; First Aired: ${tvShow.first_air_date}`}
                      />
                    </ListItemButton>
                  </ListItem>
                </Grid>
              ))
              }
            </Grid>
          </List>
          <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={5} sm={12} sx={{ marginTop: 5, marginBottom: 5 }}>
              <Pagination
                count={totalPages}
                variant="outlined"
                shape="rounded"
                page={query.page}
                onChange={query.searchValue === '' ? handlePageChange : handlePageChangeTitle}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container >
    )
}

SearchPage.prototype = {

}