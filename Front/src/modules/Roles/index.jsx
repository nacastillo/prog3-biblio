import { useContext, useState, useEffect } from 'react'
import {Link} from "react-router-dom";
import { Row, Col, Button, Input, Form, Modal, message, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from '../../components/AuthContext';

function Roles() {
    const [roles, setRoles] = useState([])
    const [cargando, setCargando] = useState(false);
    const {esBiblio, esAdmin} = useContext(AuthContext);    
 
    const columnas = [
        {
            title: 'Codigo',
            dataIndex: 'cod',
            key: 'cod'
        },
        {
            title: 'Descripcion',
            dataIndex: 'name',
            key: 'name'
        }
    ]

    async function pegar() {
        try {
            setCargando(true);
            const res = await serv.getAll('roles')
            setRoles(res);
            setCargando(false)
        }
        catch (err) {
            console.error(err);
            message.error("Error al cargar listado de roles");
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <div>
            <Row>
                <Col>
                    <h1>Roles</h1>
                </Col>
            </Row>
            {(esBiblio() || esAdmin()) &&
                <Row>
                    <Col>
                        <Link to ="../roles/nuevo" className= "botonLink">
                            Nuevo
                        </Link>                
                        <Link to = "../roles/buscar" className= "botonLink">
                            Buscar
                        </Link>
                    </Col>
                </Row>
            }
            <Row>
                <Col span = {24}>
                {cargando ? 
                    <Spin tip="Cargando listado..." size="large" />
                    :                     
                    <>
                        {roles.length == 0 ?
                            <h2>No hay roles</h2> 
                            :                   
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                                <Table 
                                    size = "middle"
                                    dataSource={roles.map(x => {return {...x, key: x._id}})} 
                                    columns={columnas}
                                    pagination = {{
                                        align: "center",
                                        size: "small",
                                        position: ["topLeft"],
                                        showTotal: () => <b>Total de roles: {roles.length}</b>
                                    }}
                                />  
                            </div>
                        }
                    </>
                    }
                </Col>
            </Row>
        </div>
    )
}

function AltaRol() {    
    const [modalN, setModalN] = useState(false);
    const [formNuevo] = Form.useForm();    

    async function handle (v) {
        try {
            const resp = await serv.crear("roles", v);
            message.success(
                <>
                    ¡Alta exitosa! <br />
                    ID: <b>{resp._id}</b> <br />
                    Código: <b>{resp.cod}</b> <br />
                    Nombre: <b>{resp.name}</b> <br />
                </>
            );
            formNuevo.resetFields();
            setModalN(false);            
        }
        catch (err) {
            console.error(err);            
            message.error(err.response.data);
        }
    }

    return (
        <div>
            <Row>
                <Col span = {24}>
                    <h1>Nuevo rol</h1>
                    <Form                
                        labelCol = {{span: 3}}
                        wrapperCol = {{span: 5}}
                        form={formNuevo}
                        name="formNuevo"                        
                        onFinish = {handle}
                    >
                        <Form.Item 
                            name="cod" 
                            label= {<b>Codigo</b>}
                            rules={[{ required: true }]} >
                            <Input type="number" 
                            placeholder="Ingrese código"                                
                            />
                        </Form.Item>
                        <Form.Item 
                            name="name" 
                            label= {<b>Nombre</b>}
                            rules={[{ required: true }]} >
                            <Input placeholder="Ingrese nombre"/>
                        </Form.Item>
                        <Form.Item wrapperCol = {{offset: 3, span: 5}}>
                            <Link to = "../roles" className= "botonLink">
                                Volver
                            </Link>
                            <Button type="primary" onClick = {() => setModalN(true)}>
                                Enviar
                            </Button>
                            <Button htmlType="button" onClick={() => formNuevo.resetFields()}>
                                Borrar campos
                            </Button>
                            <Modal                                
                                keyboard = {false}
                                closable = {false}
                                maskClosable = {false}
                                open = {modalN}
                                title = "¿Confirmar alta?"
                                okText = "Aceptar"
                                cancelText = "Cancelar"
                                onCancel = {() => setModalN(false)}
                                onOk = {() => formNuevo.submit()}
                            >      
                                <b>Codigo: </b> {formNuevo.getFieldValue("cod")} <br />
                                <b>Nombre: </b> {formNuevo.getFieldValue("name")} <br />
                            </Modal>
                        </Form.Item>                
                    </Form>
                </Col>
            </Row>
        </div>        
    )
}

function BajaRol() {
    const [roles, setRoles] = useState([]);
    const [rolM, setRolM] = useState(null);
    const [modif, setModif] = useState(false);
    const [modalM, setModalM] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [formBorra] = Form.useForm();
    const [formModif] = Form.useForm();    

    async function pegar () {
        try {
            const res = await serv.getAll('roles')
            setRoles(res);
        }
        catch (err) {
            console.error(err)
            message.error("Problemas con el listado de roles");
        }
    }     

    function reiniciar() {
        formBorra.resetFields();
        formModif.resetFields();
        setModif(false);
        setModalB(false);
        setModalM(false);        
        setRolM(null);
    }

    useEffect(() => {
        pegar();
    }, []);   

    async function handleModif (v) {
        try {            
            v._id = rolM._id;
            await serv.actualizar("roles", rolM._id, v);
            message.success("Modificación exitosa.");
            pegar();
            reiniciar();
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    }    

    async function handleBorra (v) {
        try {
            const resp = await serv.borrar("roles", rolM._id);
            message.success(
                <>
                    <h3>¡Baja exitosa!</h3>
                    <b>ID: </b> {resp._id} <br />
                    <b>Codigo: </b> {resp.cod} <br />
                    <b>Nombre: </b> {resp.name} <br />                    
                </>
            );
            pegar();
            reiniciar();
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    }

    const guardarID = async (v) => {
        const r = JSON.parse(v)
        setRolM(r)
        setModif(false)
    }

    return (
        <div>
            <Row>
                <Col span = {24}>
                    <h1>Buscar rol</h1>
                    <Form        
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}        
                        form={formBorra}
                        name="formBorra"
                        onFinish={handleBorra}
                    >
                        <Form.Item 
                            name="rol" 
                            label={<b>Rol</b>}
                            rules={[{ required: true }]}>
                            <Select
                                showSearch                        
                                onChange={guardarID}
                                placeholder="Ingrese rol"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    
                                {roles.map(r => (
                                    <Select.Option key={r._id} value={JSON.stringify(r)}>
                                        {r.cod + ' - ' + r.name}
                                    </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link className = "botonLink" to = "../roles">
                                Volver
                            </Link>
                            <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                                Modificar
                            </Button>
                            <Button danger
                                type="primary"
                                onClick= {() => setModalB(true)}
                            >
                                Borrar rol
                            </Button>
                            <Modal
                                keyboard = {false}
                                closable = {false}
                                maskClosable = {false}
                                open = {modalB}
                                title = "¿Confirmar baja?"
                                okText = "Aceptar"
                                cancelText = "Cancelar"
                                onCancel= {() => setModalB(false)}
                                onOk = {() => formBorra.submit()}
                            >
                                {rolM && 
                                    <>
                                        <b>Codigo: </b> {rolM.cod} <br />
                                        <b>Titulo: </b> {rolM.name} <br />
                                    </>
                                }
                            </Modal>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>                
            {modif &&
            <Row>
                <Col span = {24}>
                    <Form 
                        labelCol={{span: 3}}
                        wrapperCol={{span: 5}}
                        form={formModif} 
                        name="formModif"
                        onFinish={handleModif}
                    >
                        <Form.Item 
                            name="cod" 
                            label={<b>Codigo</b>}
                        >
                            <Input type="number" placeholder={rolM.cod} />
                        </Form.Item>
                        <Form.Item 
                            name="name" 
                            label={<b>Nombre</b>}
                            >
                            <Input placeholder={rolM.name}/>
                        </Form.Item>
                        <Form.Item
                            wrapperCol = {{offset: 3, span: 5}}
                            >
                            <Button type="primary" 
                                onClick = {() => setModalM(true)}
                                >
                                Guardar cambios
                            </Button>
                            <Button htmlType="button" 
                                onClick={() => formModif.resetFields()}
                            >
                                Borrar campos
                            </Button>
                            <Modal
                                keyboard = {false}
                                closable = {false}
                                maskClosable = {false}
                                open = {modalM}
                                title = "¿Guardar cambios?"
                                okText = "Aceptar"
                                cancelText = "Cancelar"
                                onCancel = {() => setModalM(false)}
                                onOk={() => formModif.submit()}
                            >
                                <>
                                    {formModif.getFieldValue("cod") && 
                                        <>Codigo nuevo: <b>{formModif.getFieldValue("cod")}</b><br/></>}
                                    {formModif.getFieldValue("name") && 
                                        <>Nombre nuevo: <b>{formModif.getFieldValue("name")}</b><br/></>}
                                </>
                            </Modal>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>                
            }
        </div>
    )
}

export { Roles, AltaRol, BajaRol}