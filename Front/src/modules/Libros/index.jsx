import { useState, useEffect } from 'react'
import listadoAlumnos from '../../data/alumnos.json'
import Libro from '../../components/Libro'
import { Button } from 'antd'

function Libros() {
  const [isFiltered, setIsFiltered] = useState(false)
  const [libros, setLibros] = useState([])

  useEffect(() => {
    setLibros(listadoAlumnos)
    /*
    const timer = setTimeout(() => {
      console.log('Ejecutado despues de 5 segundos')
      setLibros(listadoAlumnos)
    }, 5000)
    return () => clearTimeout(timer)
    */
  }, [])

  const onFilterClick = () => {
    if (!isFiltered) {
      setLibros(listadoAlumnos.filter((a) => a.legajo > 150000))
    } else {
      setLibros(listadoAlumnos)
    }
    setIsFiltered((isFiltered) => !isFiltered)
  }

  // TODO: agregar un input  para  buscar un alumno y marcarlo en la lista

  return (
    <>
      <h1>Listado de alumnos de la clase</h1>
      {libros.length == 0 ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div>
            <Button type="primary" onClick={() => onFilterClick()}>
              {isFiltered ? 'Quitar filtro' : 'Filtrar'} legajo mayor 150.000
            </Button>
          </div>
          <ul>
            {libros.map((a) => (
              <Libro key={a.legajo} {...a} />
            ))}
          </ul>
          <p>Cantidad total de alumnos: {libros.length}</p>
        </>
      )}
    </>
  )
}

export default Libros
