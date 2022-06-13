import React, { useEffect, useState } from 'react'

// to get Id from url
import { useParams } from 'react-router-dom'

// redux mapping
import { useDispatch, useSelector } from "react-redux";
import { fetchTvShow, fetchTvShowEpisodesBySeason, tvShowSelector } from '../../slices/SelectedTvShow';

// material ui components
import {
  Container,
  Tab,
  Tabs,
  CardMedia,
  Card,
  Typography,
  CardContent,
  CircularProgress,
  Alert,
  TablePagination,
  TableContainer,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody
} from '@mui/material'


export function DetailsPage() {

  // Season id
  const [value, setValue] = useState(0)

  //table config
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // set up dispatch 
  const dispatch = useDispatch();

  // fetch data from store 
  const { loading, error, tvShow, episodes } = useSelector(tvShowSelector)

  let { id } = useParams();

  // hook to fetch tv shows
  useEffect(() => {
    dispatch(fetchTvShow(id))
    dispatch(fetchTvShowEpisodesBySeason(id, 1))
  }, [dispatch, id])

  const handleSeasonSelect = (event, season_number) => {
    setValue(season_number)
    dispatch(fetchTvShowEpisodesBySeason(id, tvShow.seasons[season_number].season_number))
  }

  // table columns 
  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'air_date', label: 'Aired Date', minWidth: 100 },
  ];

  // set table page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // change number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  return (
    <Container fixed>
      <Card sx={{ maxWidth: '100%', marginTop: 5, marginBottom: 5 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="auto"
          image={tvShow.backdrop_path ? `https://image.tmdb.org/t/p/original/${tvShow.backdrop_path}` : 'https://www.vuescript.com/wp-content/uploads/2018/11/Show-Loader-During-Image-Loading-vue-load-image.png'}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {tvShow.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {`First air date: ${tvShow.first_air_date}`}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {`Seasons: ${tvShow.number_of_seasons}`}
          </Typography>
          <Typography variant="body2">
            {tvShow.overview}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" sx={{ mt: 1.5 }}>
            Seasons
          </Typography>
          <Tabs
            value={value}
            variant="scrollable"
            scrollButtons={true}
            aria-label="scrollable prevent tabs example"
            onChange={handleSeasonSelect}
          >
            {
              tvShow.seasons ? tvShow.seasons.map((season) => (
                <Tab key={season.id} label={season.name} value={season.number} />
              )) : <Tab key='0' label='No Seasons' value={0} />
            }
          </Tabs>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {episodes.episodes ? (episodes.episodes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })) : <></>}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={episodes.episodes ? episodes.episodes.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Container>
  )
}

DetailsPage.prototype = {

}