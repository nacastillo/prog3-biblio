import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  BookOutlined,
  CalendarOutlined,
  LoginOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  HomeOutlined,
  TeamOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'

const { Header, Content, Footer, Sider } = Layout

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

const items = [
  getItem(<Link to="/login"> Iniciar sesión </Link>, '1', <LoginOutlined />),
  getItem(<Link to="/"> Inicio </Link>, '2', <HomeOutlined />),
  getItem(<Link> Consultar libros </Link>, '3', <BookOutlined/>, [
    getItem(<Link to="/libros2"> Todos </Link>, '4'),
    getItem(<Link to="/prestables"> Prestables </Link>, '5'),
  ]),
  getItem(<Link to="/prestamos">Prestamos</Link>,'6',<CalendarOutlined/>),
  // getItem(<Link to="/libros"> Alumnos </Link>, '4', <UserOutlined />),
  // getItem(<Link to="/sw-characters"> Personajes SW </Link>, '5', <HomeOutlined />),
  /*
  getItem(<Link to="/contact"> Contacto </Link>, '6', <TeamOutlined />, [
    getItem(<Link to="/contact/phone"> Telefono </Link>, '7', <PhoneOutlined />),
    getItem(<Link to="/contact/mail"> Mail </Link>, '8', <MailOutlined />),
  ]),
  */
  getItem(<Link to="/about"> Acerca de </Link>, '7', <QuestionCircleOutlined />),
  getItem(<Link> Nivel 1 </Link>, '8',<></>, [
    getItem(<Link> Nivel 2 </Link>, '9',<></>, [
      getItem(<Link> Nivel 3 </Link>, '10', <></>)])])
]

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider 
        style={{height: '100vh',position:'fixed'}}
        // collapsible
        // collapsed={collapsed}
        // onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        ></Menu>
      </Sider>
      <Layout style={{ width: '100%' }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>Biblioteca General José Justo de Urquiza</h1>
        </Header>
        <Content
          style={{
            margin: '20px 16px',
          }}
        >
          <div
            style={{
              height: '100%',
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}
export default App
