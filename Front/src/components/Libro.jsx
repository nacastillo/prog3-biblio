function Libro({ legajo, nombre, condicion, mail }) {
  return (
    <li>
      Legajo: {legajo}. 
      <br></br>
      Nombre: {nombre}.{' '}
      {condicion === 'Inscripto' && `Mail: ${mail}`}
      <br></br>
      <br></br>
    </li>
  )
}

export default Libro
