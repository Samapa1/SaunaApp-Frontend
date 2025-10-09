import { Route, Routes } from 'react-router-dom';
import Calendar from "./components/Calendar"
import Home from './components/Home';

function App() {
  
return(
  <div>
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sauna1' element={<Calendar sauna={"Sauna 1"}/>} />
        <Route path='/sauna2' element={<Calendar sauna={"Sauna 2"}/>} />
        <Route path='/sauna3' element={<Calendar sauna={"Sauna 3"}/>} />
        <Route path='/sauna4' element={<Calendar sauna={"Sauna 4"}/>} />
        <Route path='/sauna5' element={<Calendar sauna={"Sauna 5"}/>} />
        <Route path="*" element={<Home/>} />
    </Routes>
  </div>
)
}

export default App
