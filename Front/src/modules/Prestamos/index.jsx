import {useState, useEffect} from 'react'
import listadoPrestamos from '../../data/prestamos.json'
import Prestamo from '../../components/Prestamo'

function Prestamos () {
    const [prestamos, setPrestamos] = useState([])
    useEffect( () => {
        setPrestamos(listadoPrestamos)
        },[])

    return (
      <>
        <h1>Prestamos:</h1>
        {prestamos.length == 0 ? (
            <p>Cargando...</p>
        ) : (
            <>
                <ul>
                    {
                        prestamos.map((a) => (
                            <Prestamo key={a.id} {...a}/>
                        ))}
                </ul>
            </>
        )}    
    </>
    )
}

export default Prestamos