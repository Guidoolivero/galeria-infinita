import React, { useState, useEffect } from 'react';
import { Heading } from './components/Heading';
import { UnsplashImage } from './components/UnsplashImage';
import { Loader } from './components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Resultados } from './components/Resultados';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import axios from 'axios'

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

const Div = styled.div `
display: flex;


`;


function App() {
  const [images, setImage] = useState([]);
  const [resultado, setResultados] = useState([]);
  const [valor, setValor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);



  const accessKey = 'ciwOoPuaPQzIa6JTNqFT3v--t5imQOjpVcjI1zerViQ';

  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = async () => {
    try {
      const count = 10;
      const apiRoot = `https://api.unsplash.com/photos/random/?client_id=${accessKey}&count=${count}&page=${currentPage}`;

      const response = await axios.get(apiRoot);
      const data = response.data;

      const fetchedImages = data.map(image => ({
          id: image.id,
          url: image.urls.regular,
          description: image.alt_description,
          exif: image.exif ? image.exif.name : 'Sin información de exif',
          location: image.location ? image.location.city : 'Sin información de ubicación',
        }));

      setImage(prevImages => [...prevImages, ...fetchedImages]);
      setCurrentPage(prevPage => prevPage + 1);

      console.log(data);
    } catch (error) {
      console.error('Error fetching images:', error);
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



  return (
    <div>
      <Heading />
      <GlobalStyle />
      <InfiniteScroll
        dataLength={valor.trim() === '' ? images.length :resultado.length}
        next={valor.trim() === '' ? fetchImages : buscarResultados}
        hasMore={true}
        loader={<Loader />}
      >
        <WrapperImages>
          <Div>
            <input placeholder='Buscar imagenes' onChange={e => setValor(e.target.value)} />
            <button onClick={() => buscarResultados()}>Buscar</button>
          </Div>

          {valor.trim() === '' ? (
            images.map((image, index) => (
              <UnsplashImage
                key={image.id + index}
                url={image.url}
                description={image.description}
                exif={image.exif}
                location={image.location}
              />
            ))
          ) : (
            resultado.map((results, index) => (
              <Resultados
                key={results.id + index}
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