import { useParams } from 'react-router-dom'

function Contact() {
  const { type } = useParams()

  return (
    <div>
      <h1>This is the Contact page</h1>
      {type && <h2>Type {type}</h2>}
    </div>
  )
}

export default Contact
