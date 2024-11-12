import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Form, Input, message, Modal, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from '../../components/AuthContext';

function Libros() {    
    const [libros, setLibros] = useState([]);      
    const [cargando, setCargando] = useState(false);
    const [modalN, setModalN] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [modalM, setModalM] = useState(false);
    const [libroM, setLibroM] = useState(null);
    const {esBiblio, esAdmin} = useContext(AuthContext);
    const [formModif] = Form.useForm();

    const locale = {
        filterConfirm: 'Aceptar',
        filterReset: 'Reiniciar',
        sortTitle: 'Ordenar columna',
        triggerDesc: 'Descendente',
        triggerAsc: 'Ascendente',
    };

    const columnas = [
        {
            title: 'Codigo',
            dataIndex: 'cod',
            key: 'cod',
            defaultSortOrder: 'ascend',
            sortDirections: ["ascend", "descend", "ascend"],
            sorter: (a, b) => a.cod - b.cod

        },
        {
            title: 'Titulo',
            dataIndex: 'titulo',
            key: 'titulo',
        },
        {
            title: 'Autor',
            dataIndex: 'autor',
            key: 'autor',
        },
        {
            title: 'Lectura local',
            dataIndex: 'lecturaLocal',
            key: 'lecturaLocal',
        },
        {
            title: 'Para prestamo',
            dataIndex: 'paraPrestamo',
            key: 'paraPrestamo',
        },
        {
            title: 'Genero',
            dataIndex: 'id_genero',
            key: 'id_genero',
            render: g => (g ? g.desc : 'Sin género'),
            filters: [],            
            onFilter: (value, record) => record.id_genero.desc === value
        },
        (esAdmin() || esBiblio()) ?
        {
            title: "Accion",
            key: "Action",
            render: (_, record) => (
                <>
                    <Button 
                        type = "primary"
                        size = "small"
                        onClick = {() =>{
                            setModalM(true)
                            setLibroM(record);
                        }}
                        >
                        Modificación rápida
                    </Button>                    
                </>
            )
        } : {}
    ];

    async function handleModif (v) {
        try {
            await serv.actualizar("libros", libroM._id, v);
            message.success("Cambios guardados");
            pegar();
            setModalM(false);            
            setLibroM(null);
            formModif.resetFields();
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }

    }

    async function pegar () {
        setCargando(true);
        try {            
            const res = await serv.getAll('libros')
            setLibros(res);            
        }
        catch (err) {
            console.error(err);
            message.error("Error al cargar listado de libros");
        }        
        setCargando(false);
    }

    useEffect(() => {
        pegar();
    }, [])
    
    const generos = new Map();
    libros.forEach(x => {
        generos.set(x.id_genero.desc, x.id_genero.desc);
    });    
    columnas[5].filters = Array.from(generos).map(x => {return {text:x[0], value: x[1]}});    

    return (
        <div>
            <Row>
                <Col>
                    <h1>Libros</h1>
                </Col>
            </Row>
            {(esBiblio() || esAdmin()) &&
                <Row>
                    <Col>
                        <Link to ="../libros/nuevo" className= "botonLink">
                            Nuevo
                        </Link>                                        
                        <Link to = "../libros/buscar" className= "botonLink">
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
                        {libros.length === 0 ?
                            <h2>No hay libros</h2> 
                            :
                            <div className = "tableContainer">
                                <Table 
                                    size = "middle"
                                    locale = {locale}
                                    dataSource={libros} 
                                    columns={columnas}
                                    pagination = {{
                                        align: "center",
                                        size: "small",
                                        position: ["topLeft"],
                                        showTotal: () => <b>Total de libros: {libros.length}</b>
                                    }} 
                                />
                            </div>
                        }                
                    </>
                }
                </Col>
            </Row>
            <Row>
                <Col span = {24}>
                    <Modal                        
                        closable = {false}
                        maskClosable = {false}
                        open = {modalM}
                        title = {libroM?.titulo}
                        okText = "Guardar cambios"
                        cancelText = "Atrás"
                        onCancel= {() => setModalM(false)}
                        onOk = {formModif.submit}
                    >
                        <Form
                            labelCol = {{span: 12}}
                            wrapperCol = {{span: 12}}
                            form = {formModif}
                            name = "formModif"
                            onFinish = {handleModif}
                        >
                            <Form.Item
                                name = "lecturaLocal"
                                label = {<b>Para lectura local</b>}
                            >
                                <Input type = "number"
                                    placeholder= {libroM?.lecturaLocal} />
                            </Form.Item>
                            <Form.Item
                                name = "paraPrestamo"
                                label = {<b>Para préstamo</b>}
                        >
                            <Input type = "number"
                                placeholder= {libroM?.paraPrestamo} />                                
                            </Form.Item>
                        </Form>
                    </Modal>            
                </Col>
            </Row>
        </div>
    )        
}

function AltaLibro() {
    const [generos, setGeneros] = useState([]);
    const [modalN, setModalN] = useState(false);
    const [formNuevo] = Form.useForm();    

    async function handle (v) {
        try {            
            const id = JSON.parse(v.id_genero)._id
            v.id_genero = id;
            const resp = await serv.crear("libros", v);
            message.success(
                <>
                    ¡Alta exitosa! <br />
                    ID: <b>{resp._id}</b> <br />
                    Codigo: <b>{resp.cod}</b> <br />
                    Titulo: <b>{resp.titulo}</b> <br />
                    Autor: <b>{resp.autor}</b> <br />
                    Cantidad para lectura local: <b>{resp.lecturaLocal || 0}</b> <br />
                    Cantidad para préstamo: <b>{resp.paraPrestamo || 0}</b> <br />
                    Género: <b>{resp.id_genero? resp.id_genero.desc : "no tiene"}</b> <br />
                </>
            );
            formNuevo.resetFields();
            setModalN(false);
            pegar();
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    }

    async function pegar () {
        try {
            const res = await serv.getAll('generos')
            setGeneros(res);
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <div>
            <Row>
                <Col span= {24}>
                    <h1>Nuevo libro</h1>
                    <Form                        
                        labelCol={{ span: 3}}
                        wrapperCol={{ span: 5 }}
                        form={formNuevo}
                        name="formNuevo"                        
                        onFinish = {handle}
                    >
                        <Form.Item
                            name="cod"
                            label={<b>Código</b>}
                            rules={[{required: true}]}
                        >
                            <Input type="number"
                                placeholder="Ingrese código"                            
                            />
                        </Form.Item>
                        <Form.Item
                            name="titulo"
                            label={<b>Título</b>}
                            rules={[{required: true}]}
                        >
                            <Input
                                placeholder="Ingrese título del libro"
                            />
                        </Form.Item>
                        <Form.Item
                            name="autor"
                            label={<b>Autor</b>}
                            rules={[{ required: true, },]}
                        >
                            <Input placeholder="Ingrese autor del libro"/>
                        </Form.Item>
                        <Form.Item
                            name="lecturaLocal"
                            label={<b>Para lectura local</b>}
                        >
                            <Input
                                type="number"
                                placeholder="Ingrese cantidad"                                
                            />
                        </Form.Item>
                        <Form.Item
                            name="paraPrestamo"
                            label={<b>Para préstamo</b>}                            
                        >
                            <Input
                                type="number"
                                placeholder="Ingrese cantidad"                                
                            />
                        </Form.Item>
                        <Form.Item
                            name="id_genero"
                            label={<b>Género</b>}
                            rules={[{required: true}]}
                        >
                            <Select
                                showSearch                                
                                placeholder="Ingrese género"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    {generos.map(g => (
                                <Select.Option key={g._id} value = {JSON.stringify(g)}>
                                    {g.cod + ' - ' + g.desc}
                                </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link to = "../libros" className = "botonLink">
                                Volver
                            </Link>
                            <Button type="primary"                                 
                                onClick = {() => setModalN(true)}
                            >
                                Enviar
                            </Button>                            
                            <Button htmlType="button" onClick={() => formNuevo.resetFields()}>
                                Limpiar
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
                                <b>Titulo: </b> {formNuevo.getFieldValue("titulo")} <br />
                                <b>Autor: </b> {formNuevo.getFieldValue("autor")} <br />
                                <b>Cantidad para lectura local: </b> {formNuevo.getFieldValue("lecturaLocal") || 0} <br />
                                <b>Cantidad para prestamo: </b> {formNuevo.getFieldValue("paraPrestamo") || 0} <br />
                                <b>Genero: </b> {formNuevo.getFieldValue("id_genero") ? JSON.parse(formNuevo.getFieldValue("id_genero")).desc : "no tiene"} <br />
                            </Modal>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>            
        </div>
    )
}

function BajaLibro() {
    const [libros, setLibros] = useState([])
    const [generos, setGeneros] = useState([])
    const [libroM, setLibroM] = useState(null)
    const [modif, setModif] = useState(false)    
    const [modalM, setModalM] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [formModif] = Form.useForm();
    const [formBorra] = Form.useForm();        

    async function pegar () {    
        try {
            const resL = await serv.getAll('libros');
            setLibros(resL);            
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de libros");
        }
        try {
            const resG = await serv.getAll('generos');
            setGeneros(resG);
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de géneros");
        } 
    }

    function reiniciar() {
        formBorra.resetFields();
        formModif.resetFields();
        setModif(false);
        setModalB(false);
        setModalM(false);        
        setLibroM(null);
    }

    useEffect(() => {
        pegar();
    }, []);    

    async function handleModif (v) {
        try {
            if (v.id_genero) {
                const x = JSON.parse(v.id_genero);
                v.id_genero = x._id;
            }
            v.id = libroM._id;
            await serv.actualizar('libros', libroM._id, v);
            message.success("Modificación exitosa.");
            pegar();
            reiniciar();            
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    };

    async function handleBorra (v) {
        try {
            const resp = await serv.borrar("libros", libroM._id);
            message.success(
                <>
                    <h3>¡Baja exitosa!</h3>
                    Codigo: <b>{resp.cod}</b>  <br />
                    Titulo: <b>{resp.titulo}</b>  <br />
                    Autor: <b>{resp.autor}</b>  <br />
                    Cantidad para lectura local: <b>{resp.lecturaLocal || 0}</b>  <br />
                    Cantidad para prestamo: <b>{resp.paraPrestamo || 0}</b>  <br />
                    Género: <b>{resp.id_genero? resp.id_genero.desc : "no tiene"}</b> <br />
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
        const l = JSON.parse(v)
        setLibroM(l)
        setModif(false)
    }

    return (
        <div>
            <Row>
                <Col span = {24}>            
                    <h1>Buscar libro</h1>
                    <Form
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}
                        form={formBorra}
                        name="formBajaLibro"                        
                        onFinish = {handleBorra}
                    >
                        <Form.Item 
                            name="libro" 
                            label={<b>Libro</b>} 
                            rules={[{ required: true}]}>
                            <Select
                                showSearch                                
                                onChange={guardarID}
                                placeholder="Ingrese libro"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').localeCompare((optionB?.cod ?? ''))}
                            >    
                                {libros.map(l => (
                                    <Select.Option key={l._id} value={JSON.stringify(l)}>
                                        {l.cod + ' - ' + l.titulo + ' - ' + l.autor}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link to = "../libros" className = "botonLink">
                                Volver
                            </Link>
                            <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                                Modificar
                            </Button>
                            <Button danger
                                type="primary"                                                                     
                                onClick = {() => setModalB(true)}
                            >
                                Borrar libro
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
                                {libroM && 
                                    <>
                                        <b>Codigo: </b> {libroM.cod} <br />
                                        <b>Titulo: </b> {libroM.titulo} <br />
                                        <b>Autor: </b> {libroM.autor} <br />
                                        <b>Cantidad para lectura local: </b> {libroM.lecturaLocal || 0} <br />
                                        <b>Cantidad para prestamo: </b> {libroM.paraPrestamo || 0} <br />
                                        <b>Genero: </b> {libroM.id_genero? libroM.id_genero.desc : "no tiene"} <br />
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
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}
                        form={formModif}
                        name="formModif"
                        onFinish={handleModif}
                    >
                        <Form.Item 
                            name="cod" 
                            label={<b>Código</b>}
                            >
                            <Input type="number" placeholder={libroM.cod}/>
                        </Form.Item>
                        <Form.Item 
                            name="titulo" 
                            label={<b>Título</b>}
                            >
                            <Input placeholder={libroM.titulo}/>
                        </Form.Item>
                        <Form.Item 
                            name="autor" 
                            label={<b>Autor</b>}
                            >
                            <Input placeholder={libroM.autor}/>
                        </Form.Item>
                        <Form.Item 
                            name="lecturaLocal" 
                            label={<b>Para lectura local</b>}>
                            <Input type="number" placeholder={libroM.lecturaLocal}/>
                        </Form.Item>
                        <Form.Item 
                            name="paraPrestamo" 
                            label={<b>Para préstamo</b>}
                            >
                            <Input type="number" placeholder={libroM.paraPrestamo}/>
                        </Form.Item>
                        <Form.Item 
                            name="id_genero" 
                            label={<b>Género</b>} 
                            >
                            <Select
                                showSearch                                    
                                placeholder={libroM.id_genero.desc}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                                >
                                {generos.map(g => (
                                    <Select.Option key={g._id} value = {JSON.stringify(g)}>
                                        {g.cod + ' - ' + g.desc}
                                    </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item 
                            wrapperCol={{ offset: 3, span: 5}}
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
                                        <>Código nuevo: <b>{formModif.getFieldValue("cod")}</b><br/></>} 
                                    {formModif.getFieldValue("titulo") && 
                                        <>Título nuevo: <b>{formModif.getFieldValue("titulo")}</b><br/></>} 
                                    {formModif.getFieldValue("autor") && 
                                        <>Autor nuevo: <b>{formModif.getFieldValue("autor")}</b><br/></>} 
                                    {formModif.getFieldValue("lecturaLocal") && 
                                        <>Cantidad para lectura local nueva: <b>{formModif.getFieldValue("lecturaLocal")}</b><br/></>} 
                                    {formModif.getFieldValue("paraPrestamo") && 
                                        <>Cantidad para préstamos nueva: <b>{formModif.getFieldValue("paraPrestamo")}</b><br/></>}
                                    {formModif.getFieldValue("id_genero") && 
                                        <>Género nuevo: <b>{JSON.parse(formModif.getFieldValue("id_genero")).desc}</b><br/></>}
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

export { Libros, AltaLibro, BajaLibro }