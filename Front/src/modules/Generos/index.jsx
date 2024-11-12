import { useContext, useState, useEffect } from 'react'
import {Link} from "react-router-dom"
import { Col, Row, Button, Input, Form, message, Modal, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from '../../components/AuthContext';

function Generos() {
    const [cargando, setCargando] = useState(false);
    const [generos, setGeneros] = useState([])
    const {esBiblio, esAdmin} = useContext(AuthContext)

    const columnas = [
        {
            title: 'Codigo',
            dataIndex: 'cod',
            key: 'cod',
        },
        {
            title: 'Descripcion',
            dataIndex: 'desc',
            key: 'desc',
            filters: [],
            onFilter: (value, record) => record.desc.indexOf(value) === 0,

        },
    ]

    async function pegar () {
        try {
            setCargando(true);
            const res = await serv.getAll('generos');
            setGeneros(res);
            setCargando(false);
            //columnas[1].filters = generos.map(x => {return {text: x.desc, value: x.desc}})
        }
        catch (err) {
            console.error(err);
            message.error("Error al cargar listado de generos");
        }
    }

    useEffect(() => {
        pegar();
        //console.log(generos)
        //columnas[1].filters = generos.map(x => {return {text: x.desc, value: x.desc}})
    }, []);

    //console.log(generos)
    columnas[1].filters = generos.map(x => {return {text: x.desc, value: x.desc}})

    return (
        <div>
            <Row>
                <Col>
                    <h1>Géneros</h1>
                </Col>
            </Row>
            {(esBiblio() || esAdmin()) &&
                <Row>
                    <Col>
                        <Link to ="../generos/nuevo" className= "botonLink">
                            Nuevo
                        </Link>                                        
                        <Link to = "../generos/buscar" className= "botonLink">
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
                        {generos.length == 0 ?
                            (<h2>No hay géneros</h2>) 
                            :
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                                <Table                                 
                                size = "middle"
                                dataSource={generos} 
                                columns={columnas} 
                                pagination = {{
                                    align: "center",
                                    size: "small",
                                    position: ["topLeft"],
                                    showTotal: () => <b>Total de géneros: {generos.length}</b>
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

function AltaGenero() {
    const [modalN, setModalN] = useState(false);
    const [formNuevo] = Form.useForm();        

    async function handle (v) {
        try {
            const resp = await serv.crear("generos", v);
            message.success(
                <>
                    ¡Alta exitosa! <br />
                    ID: <b>{resp._id}</b> <br />
                    Código: <b>{resp.cod}</b> <br />
                    Descripción: <b>{resp.desc}</b> <br />
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
                    <h1>Nuevo género</h1>
                    <Form
                        labelCol = {{span: 3}}
                        wrapperCol = {{span: 5}}
                        form={formNuevo}
                        name="formNuevo"
                        onFinish={handle}
                    >
                        <Form.Item 
                            name="cod" 
                            label={<b>Código</b>} 
                            rules={[{ required: true }]}
                            >
                            <Input type="number"
                                placeholder="Ingrese código"                                
                            />
                        </Form.Item>
                        <Form.Item 
                            name="desc" 
                            label={<b>Descripción</b>} 
                            rules={[{ required: true }]}>
                            <Input placeholder="Ingrese descripción" />
                        </Form.Item>                
                        <Form.Item wrapperCol={{offset: 3, span: 5}}>
                            <Link to = "../generos" className = "botonLink">
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
                                <b>Descripción: </b> {formNuevo.getFieldValue("desc")} <br />
                            </Modal>
                        </Form.Item>                
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

function BajaGenero() {
    const [generos, setGeneros] = useState([])
    const [generoM, setGeneroM] = useState(null)
    const [modif, setModif] = useState(false)
    const [modalM, setModalM] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [formBorra] = Form.useForm();
    const [formModif] = Form.useForm();  

    async function pegar () {
        try {
            const res = await serv.getAll('generos')
            setGeneros(res)
        }
        catch (err) {
            console.error(err)
            message.error("Problemas con el listado de géneros");
        }
    }

    function reiniciar() {
        formBorra.resetFields();
        formModif.resetFields();
        setModif(false);
        setModalB(false);
        setModalM(false);        
        setGeneroM(null);
    }

    useEffect(() => {
        pegar();
    }, [])        

    async function handleModif (v) {        
        try {
            v._id = generoM._id;
            await serv.actualizar('generos', generoM._id, v);
            message.success('Modificación exitosa');
            pegar();
            reiniciar();
        }
        catch (err) {
            console.error(err);
            message.error(err.response.data);
        }
    }

    async function handleBorra (v) {        
        try {
            const resp =  await serv.borrar('generos', generoM._id)
            message.success(
                <>
                    <h3>¡Baja exitosa!</h3>
                    <b>ID: </b> {resp._id} <br />
                    <b>Codigo: </b> {resp.cod} <br />
                    <b>Descripción: </b> {resp.desc} <br />
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
        const g = JSON.parse(v)
        setGeneroM(g)
        setModif(false)
    }

    return (
        <div>
            <Row>
                <Col span = {24}>
                    <h1>Buscar género</h1>
                    <Form          
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}       
                        form={formBorra}
                        name="formBorra"
                        onFinish={handleBorra}                
                    >
                        <Form.Item                              
                            name="genero" 
                            label={<b>Género</b>}
                            rules={[{ required: true }]}>
                            <Select
                                showSearch                                
                                onChange={guardarID}
                                placeholder="Ingrese género"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    
                                {generos.map(g => (
                                    <Select.Option key={g._id} value={JSON.stringify(g)}>
                                        {g.cod + ' - ' + g.desc}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol = {{offset: 3, span: 5}}>   
                            <Link to = "../generos" className = "botonLink">
                                Volver
                            </Link>                 
                            <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                                Modificar
                            </Button>                    
                            <Button danger
                                type="primary" 
                                onClick = {() => setModalB(true)}
                                >
                                Borrar género
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
                                {generoM && 
                                    <>
                                        <b>Codigo: </b> {generoM.cod} <br />
                                        <b>Descripción: </b> {generoM.desc} <br />
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
                        labelCol = {{span: 3}}
                        wrapperCol={{span: 5}}
                        form={formModif} 
                        name="formModif"
                        onFinish={handleModif} 
                    >
                        <Form.Item 
                            name="cod" 
                            label={<b>Código</b>}
                        >
                            <Input type="number" placeholder = {generoM.cod} />
                        </Form.Item>
                        <Form.Item 
                            name="desc" 
                            label={<b>Descripción</b>}
                        >
                            <Input placeholder= {generoM.desc} />
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
                                    {formModif.getFieldValue("desc") && 
                                        <>Descripción nueva: <b>{formModif.getFieldValue("desc")}</b><br/></>}
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

export { Generos, AltaGenero, BajaGenero}

