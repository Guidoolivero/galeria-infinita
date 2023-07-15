import React, { useState, useEffect } from 'react';
import { Heading } from './components/Heading';
import { UnsplashImage } from './components/UnsplashImage';
import { Loader } from './components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Resultados } from './components/Resultados';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import 'tailwindcss/tailwind.css'

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
  grid-gap: 1.5em;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 300px;
`;

const SearchBarContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Input= styled.input`
  padding: 10px;
  border: 1px solid #3336ff;
  border-radius: 4px;
  font-size: 16px;
  width: 300px;
  margin-right: .2rem;
`;


const Div = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-right: 1rem;
  &:hover {
    background-color: #3336ff ;
    transform:scale(1.1);
  }
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
        dataLength={valor.trim() === '' ? images.length : resultado.length}
        next={valor.trim() === '' ? fetchImages : buscarResultados}
        hasMore={true}
        loader={<Loader />}
      >

        <SearchBarContainer>
          <Input
            onChange={(e => setValor(e.target.value))}
            placeholder='Buscar imagenes...'
          />
          <Div>
            <SearchButton onClick={() => { buscarResultados(); setResultados([]); }}>Buscar</SearchButton>
            {/* Imagend de una lupa */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg> */}
          </Div>
        </SearchBarContainer>

        <WrapperImages>
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