import { useState, useEffect } from 'react'
import {Button, Divider, Spin} from 'antd'
import lbServ from '../../services/librapi'
import Libro2 from '../../components/Libro2'

function Libros2() {
  const [cargando, setCargando] = useState(false);
  const [libros2, setLibros2] = useState([])

  const pegar = async () => {
      setCargando(true);
      const res = await lbServ.getLibros();      
      setLibros2(res);
      setCargando(false)
    }

  useEffect(() => {    
    pegar();
    }, [])

    return (
    <>
      <h1>Listado de todos los libros</h1>
      {cargando ? (
        <Spin tip="Cargando listado..." size="large">
        <div className="content" />
      </Spin>
      ) : (
        <>          
          <ul>
            {libros2.map((l) => (
              <>
              <Libro2 key={l.id} {...l}/>
              {l.prestable &&
               l.cant > 0 &&
               <>
               <br></br>
               <Button type="primary" >Solicitar préstamo</Button>
               </>
               }
              <Divider style={{backgroundColor:'black'}} />               
              </>             
            ))}
          </ul>
          <p>Cantidad total de libros: {libros2.length}</p>          
        </>
      )}
    </>
  )
}

export default Libros2
