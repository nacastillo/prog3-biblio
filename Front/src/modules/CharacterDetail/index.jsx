import { Spin } from 'antd'
import swService from '../../services/swapi'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function CharacterDetail() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [characterInfo, setCharacterInfo] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await swService.getPersonById(id)
      console.log(response)
      setCharacterInfo(response)
      setIsLoading(false)
    }
    fetchData()
  }, [id])
  return (
    <>
      <h1>Información del personaje</h1>
      {isLoading ? (
        <Spin tip="Cargando info del personaje..." size="large">
          <div className="content" />
        </Spin>
      ) : (
        <div>
          <pre>{JSON.stringify(characterInfo, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default CharacterDetail
