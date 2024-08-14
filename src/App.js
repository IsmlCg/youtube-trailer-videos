import { useEffect, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies,clearMovies  } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import YoutubePlayer from './components/YoutubePlayer'
import AppModal from './components/AppModal'
import useInfiniteScroll from './components/useInfiniteScroll'
import './app.scss'

const App = () => {

  const state = useSelector((state) => state)
  const { movies } = state
  const {fetchStatus} = state.movies
  const page = state.movies.movies.page
  const total_pages = state.movies.movies.total_pages

  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const [noTrailerMessage, setNoTrailerMessage] = useState(false)
  const navigate = useNavigate()
  
  const closeModal = () => {
    setNoTrailerMessage(false)
    setOpen(false)
  }
  const openModal = () => {setOpen(true)}
  const closeCard = () => {}

  const getSearchResults = (query) => {
    dispatch(clearMovies())
    if (query !== '') {        
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
        setSearchParams(createSearchParams({ search: query }))
    } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER))
        setSearchParams()
    }
  }

  const fetchMoreMovies = () => {
    if (fetchStatus === 'succeeded' && page < total_pages) {
        
        if (searchQuery) {
            dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${Number(page+1)}`))
        } else {
            dispatch(fetchMovies( `${ENDPOINT_DISCOVER}&page=`+Number(page+1)))
        }
    }
  }

  const observer = useInfiniteScroll(fetchMoreMovies)

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+searchQuery))
    } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER))
    }
  }

  const viewTrailer = (movie) => {
    getMovie(movie.id)
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    setOpen(false)
    setNoTrailerMessage(false)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
      setOpen(true)
    }else{
      setNoTrailerMessage(true)
    }
  }

  useEffect(() => {
        return () => {
            getMovies()
        }
  }, [])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        {videoKey ? (
          <AppModal isOpen={isOpen} onRequestClose = {closeModal} title="Watch Trailer">
              <div className="p-modal__body">
                  <YoutubePlayer videoKey={videoKey} />
              </div>
          </AppModal>
        ) : (
          <AppModal isOpen={noTrailerMessage}  onRequestClose = {closeModal} title="no trailer available. Try another movie "/>
        )}

        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
        <div ref={observer} />
      </div>
    </div>
  )
}

export default App
