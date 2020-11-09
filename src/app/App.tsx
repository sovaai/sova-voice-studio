import React, { memo } from 'react';
import { BrowserRouter } from 'react-router-dom';
/* import Footer from '../components/footer/footer'; */
import Main from '../components/main/main';
import '../styles/tailwind.output.css';

const App = memo(() => {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen flex flex-col overflow-hidden relative">
        <Main />
        {/*       <Footer /> */}
      </div>
    </BrowserRouter>
  );
});

App.displayName = 'App';

export default App;
