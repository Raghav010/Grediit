import './App.css';
import Profile from './Profile';
import LS from './LS';
import { Route, Routes } from 'react-router-dom';

// Todo
// add greddit to login and register
// fix relative sizes of all text boxes, max width set for mobile users
// use theme colors or change them
// chaneg font
// handle wrong inputs
// add server validation
// make components more modular i.e the outermost div in each component needs to have w-full and h-full
// make functionality to upload a photo in registeration
// make loading into a component
// add try catch around fetch!!!



function App() 
{
  return(
    <>
      <Routes>
        <Route path="/" element={<LS />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </>
  );  
}

export default App;
