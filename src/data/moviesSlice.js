import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl) => {
    const response = await fetch(apiUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch movies')
    }
    return response.json()
})

const initialState = {
    movies: {
        results: [],
        total_pages: 0,
        page: 1,
    },
    fetchStatus: 'idle',
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        clearMovies: (state) => {
            state.movies = { results: [], page: 1, total_pages: 1 }
            state.fetchStatus = ''
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies.results = state.movies.results.concat(action.payload.results);
            state.movies.total_pages = action.payload.total_pages;
            state.movies.page = action.payload.page;
            state.fetchStatus = 'succeeded';
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export const { clearMovies } = moviesSlice.actions;
export default moviesSlice
