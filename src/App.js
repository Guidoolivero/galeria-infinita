import React, { useState, useEffect } from 'react';
import { Heading } from './components/Heading';
import { UnsplashImage } from './components/UnsplashImage';
import { Loader } from './components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Resultados } from './components/Resultados';
import { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import accessKey from './components/config';

// Style
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
  }
`;


function App() {
  const [images, setImage] = useState([]);
  const [resultado, setResultados] = useState([]);
  const [valor, setValor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const count = 10;
      const apiRoot = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${count}&page=${currentPage}`;

      const response = await axios.get(apiRoot);
      const data = response.data;

      const fetchedImages = data.map(image => ({
        id: image.id,
        url: image.urls.regular,
        description: image.alt_description,
        exif: image.exif ? image.exif.name : 'Sin información de camara',
        location: image.location ? image.location.city : 'Sin información de ubicación',
      }));

      setImage(prevImages => [...prevImages, ...fetchedImages]);
      setCurrentPage(prevPage => prevPage + 1);

      console.log(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const buscarResultados = async () => {
    try {

      const apiRoot = `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${valor}&page=${currentPage}`;

      const response = await axios.get(apiRoot);
      const data = response.data;

      const fetchedImages = data.results
        .filter(result => result.description)
        .map(result => ({
          id: result.id,
          url: result.urls.regular,
          description: result.alt_description,
          exif: result.exif ? result.exif.name : 'Sin información de camara',
          location: result.location ? result.location.city : 'Sin información de ubicación',
        }));

      setResultados(prevResults => [...prevResults, ...fetchedImages]);
      setCurrentPage(prevPage => prevPage + 1);

      console.log(data);
    } catch (error) {
      console.error('Error searching images:', error);
    }
  };

  return (
    <>
      <Heading />
      <GlobalStyle />
      <InfiniteScroll
        dataLength={valor.trim() === '' ? images.length : resultado.length}
        next={valor.trim() === '' ? fetchImages : buscarResultados}
        hasMore={true}
        loader={<Loader />}
      >
        {/* Contenedor del input y boton*/}
        <div className='flex items-center justify-center mb-8 mr-2'>
          <input className='p-2 border mt-4 border-blue-500 rounded-md text-lg w-72 mr-1'
            onChange={(e => setValor(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                buscarResultados();
                setResultados([]);
              }
            }}
            placeholder='Buscar imagenes...'
          />
          {/* Boton */}
          <button className='ml-[-2.2rem] mt-4 cursor-pointer hover:scale-125'
            onClick={() => { buscarResultados(); setResultados([]); }}>
            {/* Imagen de una lupa */}
            <svg
              className="text-gray-500 hover:text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </button>

        </div>
            {/* Contenedor de las imagenes */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {isLoading ? (
            <Loader />
          ) : valor.trim() === '' ? (
            images.map((image, index) => (
              <UnsplashImage
                key={image.id + index}
                url={image.url}
                description={image.description}
                exif={image.exif}
                location={image.location}
              />
            ))
          ) : resultado.length > 0 ? (
            resultado.map((results, index) => (
              <Resultados
                key={results.id + index}
                url={results.url}
                description={results.description}
                exif={results.exif}
                location={results.location}
              />
            ))
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>
      </InfiniteScroll>
    </>
  )
}
export default App;