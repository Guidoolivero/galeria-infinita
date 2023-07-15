import React from 'react';
import styled from 'styled-components';
import 'tailwindcss/tailwind.css'

const Header = styled.header`
  max-width: 70rem;
  margin: 2rem auto;
  text-align: center;
`;

export const Heading = () => {

  return (
    <Header>
      <h1 className='text-4xl underline mb-4'>Galeria infinita</h1>
    </Header>
  )
}
