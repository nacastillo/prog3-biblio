import { Button, Result } from 'antd'

const App = () => (
  <Result
    status="404"
    title="Página no encontrada"    
    extra={<Button type="primary" href ="/">Volver a Home</Button>}
  />
)
export default App
