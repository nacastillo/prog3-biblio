import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './modules/Home'
import Libros from './modules/Libros'
import Libros2 from './modules/Libros2'
import Prestamos from './modules/Prestamos'
import Prestables from './modules/Prestables'
import Layout from './modules/Layout'
import NotFound from './modules/NotFound'
import SWCharacters from './modules/SWCharacters'
import CharacterDetail from './modules/CharacterDetail'
import Contact from './modules/Contact'
import About from './modules/About'
import Login from './modules/Login'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />            
            <Route path="libros2" element={<Libros2 />} />
            <Route path="prestables" element={<Prestables />} />
            <Route path="prestamos" element={<Prestamos />} />            
            <Route path="libros" element={<Libros />} />            
            <Route path="sw-characters">
              <Route index element={<SWCharacters />} />
              <Route path=":id" element={<CharacterDetail />} />
            </Route>
            
            <Route path="contact" element={<Contact />}>
              <Route path=":type" element={<Contact />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path = "login" element = {<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
