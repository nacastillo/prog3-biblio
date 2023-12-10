import { Button, Result } from 'antd'

const App = () => (
  <Result
    status="404"
    title="404"
    subTitle="Pagina no encontrada."
    extra={<Button type="primary">Back Home</Button>}
  />
)
export default App
