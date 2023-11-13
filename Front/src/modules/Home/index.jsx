import { useEffect } from 'react'
import swService from '../../services/swapi'

function Home() {
  /** 
  useEffect(() => {
    const fetchData = async () => {
      const response = await swService.getPersonById(1)
      console.log(response)
    }
    fetchData()
  }, [])
  */
  return <>
          <h1>Home</h1> 
          </>
}

export default Home
