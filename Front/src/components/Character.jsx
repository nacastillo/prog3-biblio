import { Button } from 'antd'
import { Link } from 'react-router-dom'

function Character({ name, url }) {
  const id = url.split('/')[5]
  return (
    <li>
      Nombre: {name}{' '}
      <Link to={`/sw-characters/${id}`}>
        <Button>Ver detalle</Button>
      </Link>
    </li>
  )
}

export default Character
