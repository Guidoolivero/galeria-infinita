import React, { useState } from 'react'

export const Search = ({ onSearch }) => {

    const [query, setQuery] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
        setQuery('')
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Buscar imagenes...' />
            <button type='submit'>Buscar</button>
        </form>
    )
}
