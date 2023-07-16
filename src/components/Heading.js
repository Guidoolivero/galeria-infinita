import React from 'react';
import styled from 'styled-components';
import 'tailwindcss/tailwind.css'

const Header = styled.header`
  max-width: 70rem;
  margin: 1rem auto 0;
  text-align: center;
`;

export const Heading = () => {

  return (
    <Header>
      <h1 className='text-4xl mb-4 font-sans'>Encontra la foto que buscas</h1>
    </Header>
  )
}
