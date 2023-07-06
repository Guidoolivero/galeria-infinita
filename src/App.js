import React, { useState, useEffect } from 'react';
import { Heading } from './components/Heading';
import { UnsplashImage } from './components/UnsplashImage';
import { Loader } from './components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
// import { Search } from './components/Search';
import { Resultados } from './components/Resultados';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';


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

const WrapperImages = styled.section`
  max-width: 70rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 300px;
`;


function App() {
  const [images, setImage] = useState([]);
  const [resultado, setResultados] = useState([]);
  const [valor, setValor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


  const apiRoot = "https://api.unsplash.com";
  const accessKey = process.env.APP_ACCESSKEY;

  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = async (count = 100) => {
    try {
      const response = await fetch(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}&page=${currentPage}`)
      const data = await response.json()
      
      const fetchedImages = data.map(image => ({
        id: image.id,
        url: image.urls.regular,
        description: image.alt_description,
        exif: image.exif.name,
        location: image.location.city,
      }));

      setImage(prevImages => [...prevImages, ...fetchedImages]);
      setCurrentPage(prevPage => prevPage + 1);

      console.log(data);

    } catch {
      (error) => {
        console.log('Error:', error);
      }
    }
  }


  const buscarResultados = async () => {
    try {
      const accessKey = process.env.APP_ACCESSKEY;
      const apiRoot = `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${valor}&page=${currentPage}`;

      const response = await fetch(apiRoot);
      const data = await response.json();

      const fetchedImages = data.results
        .filter(result => result.description) // Filtrar resultados con descripción definida
        .map(result => ({
          id: result.id,
          url: result.urls.regular,
          description: result.alt_description,
          exif: result.exif ? result.exif.name : 'Sin información de exif',
          location: result.location ? result.location.city : 'Sin información de ubicación',
        }));

      setResultados(prevResults => [...prevResults, ...fetchedImages]);
      setCurrentPage(prevPage => prevPage + 1); // Incrementar el número de página para la próxima búsqueda

      console.log(data);
    } catch (error) {
      console.error('Error searching images:', error);
    }
  };



  // const nextPage = () => {
  //   fetchImages();
  // }



  return (
    <div>
      <Heading />
      <GlobalStyle />
      <InfiniteScroll
        dataLength={resultado.length}
        next={valor.trim() === '' ? fetchImages : buscarResultados}
        hasMore={true}
        loader={<Loader />}
      >
        <WrapperImages>
          <div className='search__box'>
            <input className='search__box--input' placeholder='Buscar imagenes' onChange={e => setValor(e.target.value)} />
            <button className='search__box--btn' onClick={() => buscarResultados()}>Buscar</button>
          </div>

          {valor.trim() === '' ? (
            images.map((image) => (
              <UnsplashImage
                key={image.id}
                url={image.url}
                description={image.description}
                exif={image.exif}
                location={image.location}
              />
            ))
          ) : (
            resultado.map((results) => (
              <Resultados
                key={results.id}
                url={results.url}
                description={results.description}
                exif={results.exif}
                location={results.location}
              />
            ))
          )}
        </WrapperImages>
      </InfiniteScroll>
    </div>
  )
}
export default App;