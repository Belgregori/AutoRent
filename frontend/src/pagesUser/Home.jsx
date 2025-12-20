import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Main } from '../components/Main';
import { Footer } from '../components/Footer';
import { UserNavControls } from '../components/UserNavControls';

const Home = () => {
 
  return (
    <>
      <Header />
      <Main/>
      <UserNavControls />
      <Footer />
    </>
  );
};


export default Home;