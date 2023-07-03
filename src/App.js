import React, { useState, useEffect } from 'react';
import { Heading } from './components/Heading';
import { UnsplashImage } from './components/UnsplashImage';
import { Loader } from './components/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Search } from './components/Search';
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
  const [searchResults, setSearchResults] = useState([]);

  const apiRoot = "https://api.unsplash.com";
  const accessKey = 'lMHa1efEUx-NUADOm8eKdo0vRkibyjOq-0bmxl7g5ww'

  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = (count = 10) => {

    fetch(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`)
      .then(response => response.json())
      .then(data => {
        const fetchedImages = data.map(image => ({
          id: image.id,
          url: image.urls.thumb,
          description: image.alt_description,
          exif: image.exif.name,
          location: image.location.city,
        }));

        setImage(prevImages => [...prevImages, ...fetchedImages]);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }


  const handleSearch = (query) => {
    
    setSearchResults([]);

    if (query.trim() === '') {
      fetchImages();
      return;
    }

    fetch(`${apiRoot}/search/photos?query=${query}&client_id=${accessKey}`)
      .then(res => res.json())
      .then(data => {
        const results = data.results.map(result => ({
          id: result.id,
          url: result.urls.thumb,
          description: result.alt_description,
          exif: result.exif.name,
          location: result.location.city,
        }));

        setSearchResults(results)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }


  return (
    <div>
      <Heading />
      <GlobalStyle />
      <Search onSearch={handleSearch} />
      <InfiniteScroll
        dataLength={images.length}
        next={fetchImages}
        hasMore={true}
        loader={<Loader />}
      >
        <WrapperImages>
          {searchResults.length > 0
            ? searchResults.map((image) => (
              <UnsplashImage
                key={image.id}
                url={image.url}
                description={image.description}
                exif={image.exif}
                location={image.location}
              />
            ))
            : images.map((image) => (
              <UnsplashImage
                key={image.id}
                url={image.url}
                description={image.description}
                exif={image.exif}
                location={image.location}
              />
            ))}


        </WrapperImages>
      </InfiniteScroll>
    </div>
  );
}

export default App;