import React from 'react';
import styled from 'styled-components';
import 'tailwindcss/tailwind.css'


const Img = styled.img`
  width: 100%;
  height: 20rem;
  object-fit: cover;
  margin-bottom: 1.5rem;
  &:hover {
    transform: scale(1.1);
    transition: transform 0.5s, border-radius 0.5s;
    border-radius: .5rem;
    transition: ;
  }
  
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const P = styled.p`
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
font-size: .8rem;
align-items: center;
`;



export const UnsplashImage = ({ url, description, exif, location }) => {

  return (
    <>
      <Div>
        <Img
          src={url}
          alt="Unsplash" />

        <Div>
          {location && location.length <= 15 ? (
            <P>Ubicacion: {location}</P>
          ) : (
            <P>Ubicacion: Sin informacion</P>
          )}

          {exif && exif.length <= 20 ? (
            <P>Camara: {exif}</P>
          ) : (
            <P>Camara: Sin informacion</P>
          )}

          {description && description.length <= 50 ? (
            <P className='text-red-700'>{description}</P>
          ) : (
            <P className='text-red-700'>Sin informacion</P>
          )}
        </Div>
      </Div>


    </>
  )
}
