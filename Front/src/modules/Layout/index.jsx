import { useContext, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { BookOutlined, CalendarOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, QuestionCircleOutlined, SecurityScanOutlined, TagsOutlined, TeamOutlined,} from '@ant-design/icons'
import { Col, Row, Layout, Menu } from 'antd'
import { AuthContext } from '../../components/AuthContext';

const { Header, Content, Footer} = Layout

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    }
}

const App = () => {   

    const {autenticado, getFullName, getRol, esSocio, esBiblio, esAdmin} = useContext(AuthContext);
    const items = [
        getItem(<Link to="/"> Home </Link>, '1', <HomeOutlined />),
        getItem(<Link to="about"> Acerca de </Link>, '2', <HomeOutlined />),
        !autenticado && getItem(<Link to="login"> Iniciar sesión </Link>, '3', <LoginOutlined />),                
        autenticado && getItem(<Link to = "libros"> Libros </Link>, '4', <BookOutlined />),
        esSocio() && getItem(<Link to = "misprestamos">Mis préstamos</Link>, "5", <CalendarOutlined />),        
        (esAdmin() || esBiblio()) && getItem(<Link to = "prestamos"> Prestamos </Link>, '6', <CalendarOutlined />),        
        autenticado && getItem(<Link className="test" to = "generos">Generos</Link>,"7", <TagsOutlined />),
        (esAdmin() || esBiblio()) && getItem(<Link to = "usuarios"> Usuarios </Link>, '8', <TeamOutlined />),        
        esAdmin() && getItem(<Link className="test" to = "roles"> Roles </Link>, '9', <SecurityScanOutlined />),                
        autenticado && getItem(<Link to= "logout" >Cerrar sesión</Link>, '10', <LogoutOutlined /> )
    ]    

    const items2 = [
        getItem(<Link to="/"> Home </Link>, '1', <HomeOutlined />),
        getItem(<Link to="about"> Acerca de </Link>, '2', <HomeOutlined />),
        getItem(<Link to="login"> Iniciar sesión </Link>, '3', <LoginOutlined />),                
        getItem(<Link to = "libros"> Libros </Link>, '4', <BookOutlined />),
        getItem(<Link to = "misprestamos">Mis préstamos</Link>, "5", <CalendarOutlined />),        
        getItem(<Link to = "prestamos"> Prestamos </Link>, '6', <CalendarOutlined />),        
        getItem(<Link className="test" to = "generos">Generos</Link>,"7", <TagsOutlined />),
        getItem(<Link to = "usuarios"> Usuarios </Link>, '8', <TeamOutlined />),        
        getItem(<Link className="test" to = "roles"> Roles </Link>, '9', <SecurityScanOutlined />),                
        getItem(<Link to= "logout" >Cerrar sesión</Link>, '10', <LogoutOutlined /> )
    ]    

       
    return (
        <Layout>
            <Header className= "header">
                <Row style = {{height: "100%"}}>
                    <Col xxl= {4} xl={24} lg={12} md={8} sm={24} xs={24} 
                        style={{ display: 'flex', alignItems: 'center', height: '100%' }}>                        
                        <h1 style = {{textAlign: "center", color: "#FAFAFA"}}>Biblioteca Romeo</h1>                        
                    </Col>
                    <Col xxl= {15} xl={24} lg={12} md={16} sm={24} xs={24}
                        >
                        <Menu 
                            style = {{color: "#FAFAFA", backgroundColor: "#001529"}}
                            mode="horizontal" 
                            theme= "dark"
                            items={items}
                            selectedKeys={[]}
                        >                            
                        </Menu>
                        
                    </Col>
                    <Col xxl= {5} xl={24} lg={24} md={24} sm={24} xs={24}
                        style={{ display: 'flex', justifyContent: "flex-end", alignItems: 'center', height: '100%' }}>
                        <h3 style = {{color: "#FAFAFA"}}>
                            {autenticado?
                            `${getFullName()} - ${getRol()}`
                            :
                            "Sin autenticar"}
                        </h3>
                    </Col>
                </Row>
            </Header>
            <Content className = "content">
                <Row>   
                    <Col span = {24}>
                        <Outlet />
                    </Col>
                </Row>
            </Content>
            <Footer className = "footer">
                <span style = {{color: "#FAFAFA"}}>
                   <b>©{new Date().getFullYear()} Programación 3 - Instituto Nacional Superior del Profesorado Técnico - Universidad Tecnológica Nacional</b> 
                </span>
            </Footer>
        </Layout>
    )    
}

export default App
