import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
    BookOutlined,
    CalendarOutlined,
    HomeOutlined,
    LoginOutlined,
    QuestionCircleOutlined,
    SecurityScanOutlined,
    TagsOutlined,
    TeamOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'

const { Header, Content, Footer, Sider } = Layout

function getItem(label, key, icon, children) { // getItem devuelve un objeto para pasarlo por "items"
    return {
        key,
        icon,
        children,
        label,
    }
}

const containerStyle = {
    display: "grid",    
};

const headerStyle = {
    textAlign: "center"
};

const mainStyle = {
    textAlign: "center",    
};

const footerStyle = {    
    textAlign: "center",
    height: "10%",    
};

const items = [
    getItem(<Link to="/login"> Iniciar sesión </Link>, '1', <LoginOutlined />),
    getItem(<Link to="/"> Inicio </Link>, '2', <HomeOutlined />),
    getItem(<Link> Libros </Link>, '3', <BookOutlined />, [        
        getItem(<Link to="/libros/alta"> Nuevo </Link>, '4'),
        getItem(<Link to="/libros/baja"> Buscar </Link>, '5'),
        getItem(<Link to="/libros"> Ver todos </Link>, '6'),
    ]),
    getItem(<Link> Prestamos </Link>, '7', <CalendarOutlined />, [
        getItem(<Link to="/prestamos/alta"> Nuevo </Link>, '8'),
        getItem(<Link to="/prestamos/baja"> Buscar </Link>, '9'),
        getItem(<Link to="/prestamos"> Ver todos </Link>, '10'),
    ]),
    getItem(<Link> Generos </Link>, '11', <TagsOutlined />, [
        getItem(<Link to="/generos/alta"> Nuevo </Link>, '12'),
        getItem(<Link to="/generos/baja"> Buscar </Link>, '13'),
        getItem(<Link to="/generos"> Ver todos </Link>, '14'),
    ]),
    getItem(<Link> Usuarios </Link>, '15', <TeamOutlined />, [        
        getItem(<Link to="/usuarios/alta"> Nuevo </Link>, '16'),
        getItem(<Link to="/usuarios/baja"> Buscar </Link>, '17'),
        getItem(<Link to="/usuarios"> Ver todos </Link>, '18'),
    ]),
    getItem(<Link> Roles </Link>, '19', <SecurityScanOutlined />, [
        getItem(<Link to="/roles/alta"> Nuevo </Link>, '20'),
        getItem(<Link to="/roles/baja"> Buscar </Link>, '21'),
        getItem(<Link to="/roles"> Ver todos </Link>, '22'),
    ]),
    getItem(<Link to="/about"> Acerca de </Link>, '23', <QuestionCircleOutlined />),
]

const rootSubmenuKeys = ['3', '7', '11', '15', '19']

const App = () => {

    const [openKeys, setOpenKeys] = useState([])
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken()
    
    return (
        <Layout style={{ minHeight: '100vh', }}>
            <Sider style={{ width: 300, height: '100vh', position: 'fixed' }}>
                <Menu style = {{width: 200}}theme="dark" defaultSelectedKeys={['1']} openKeys={openKeys}
                    onOpenChange={onOpenChange} mode="inline" items={items}
                />
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
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    )
    
    /*
    return (
        <div style = {containerStyle}>
            <header style = {headerStyle}>
                <h1>Biblioteca General José Justo de Urquiza</h1>
            </header>
            <nav>
                <ul style = {{display: "flex", flexDirection: "row"}}>
                    <li>Inicio</li>
                    <li>Libros</li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </nav>
            <main style = {mainStyle}>
                <div style = {{height: "70%"}} > 
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />
                    Cuerpo <br />                    
                </div>                
            </main>
            <footer style = {footerStyle}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </footer>
        </div>
    )
    */ 
}

export default App
