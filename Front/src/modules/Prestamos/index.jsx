import { useContext, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Row, Col, Button, Checkbox, DatePicker, Form, Input, message, Modal, Select, Space, Spin, Table } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from "../../components/AuthContext";
import dayjs from "dayjs";

function Prestamos() {
    const [prestamos, setPrestamos] = useState([]);
    const [cargando, setCargando] = useState(false);   
    const [modalN, setModalN] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [modalM, setModalM] = useState(false);
    const [modalMUsuario, setModalMUsuario] = useState(false);
    const [prestamoM, setPrestamoM] = useState(null);
    const [socioM, setSocioM] = useState(null);
    const {esSocio, esAdmin, esBiblio} = useContext(AuthContext);

    const locale = {
        filterConfirm: 'Aceptar',
        filterReset: 'Reiniciar',
        sortTitle: 'Ordenar columna',
        triggerDesc: 'Descendente',
        triggerAsc: 'Ascendente',
    };

    const columnas = [        
        {
            title: 'Fecha de inicio',
            dataIndex: 'fechaInicio',
            key: 'fechaInicio',
            render: r => (r ? dayjs(r).format("DD/MM/YYYY") : "no tiene"),
            filters: [],
            onFilter: (value, record) => record.fechaInicio === value,
            sorter: (a, b) => new Date (a.fechaInicio).getTime() - new Date (b.fechaInicio).getTime(),
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Libro',
            dataIndex: 'id_libro',
            key: 'id_libro',
            render: (l) => (l ? l.titulo : '')
        },
        {
            title: 'Socio',
            dataIndex: 'id_socio',
            key: 'id_socio',
            render: (u) => (u ? `${u.fullName}` : ''),
            filters: [],
            onFilter: (value, record) => record.id_socio.fullName === value,

        },
        {
            title: 'Finaliza',
            dataIndex: 'fechaFin',
            key: 'fechaFin',
            render: r => (r ? dayjs(r).format("DD/MM/YYYY") : "no tiene"),
            filters: [],
            onFilter: (value, record) => record.fechaFin === value,
            sorter: (a, b) => new Date (a.fechaFin).getTime() - new Date (b.fechaFin).getTime(),
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: "Devuelto",
            dataIndex: "fechaDevuelto",
            key: "fechaDevuelto",
            render: r => (r ? dayjs(r).format("DD/MM/YYYY") : "no"),
            filters: [],
            onFilter: (value, record) => record.fechaDevuelto? record.fechaDevuelto === value : "no" === value,
            sorter: (a, b) => new Date (a.fechaDevuelto).getTime() - new Date (b.fechaDevuelto).getTime(),
            sortDirections: ["ascend", "descend", "ascend"],

        },
        {
            title: "Fuera de término",
            dataIndex: "termino",
            key: "termino",  
            filters: [{text: "Sí", value: "Sí"},{text: "No", value: "No"},{text: "---", value: "---"}],
            onFilter: (value, record) => record.termino === value            
        },
        (esAdmin() || esBiblio()) ?
        {
            title: 'Accion',
            key: 'action',
            render: (_, record) => (                
                <>  
                    <Button
                        danger
                        type = "primary"
                        disabled = {!!record.fechaDevuelto}                        
                        size = "small"
                        onClick = {() => {
                            setModalM(true);
                            setPrestamoM(record);
                        }}
                    >                        
                        Finalizar préstamo
                    </Button>
                    <Button                         
                        color = "default"
                        type = "primary" 
                        size = "small"                         
                        onClick={() => {
                        setModalMUsuario(true);
                        setSocioM(record);
                    }}
                    >
                        Penalizar usuario
                    </Button>
                </>
            )
        } : {}
    ];

    async function handleBorra (r) {    
        try {
            await serv.borrar('prestamos', prestamoM._id)
            message.success('Prestamo borrado exitosamente')
            setModalB(false);
            setPrestamoM(null);
            pegar();                
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }        
    } 
    
    async function handleFinalizar () {
        try {
            await serv.actualizar("prestamos/finalizar", prestamoM._id);
            message.success(<b>Préstamo finalizado exitosamente</b>);
            setModalM(false);
            setPrestamoM(null);
            pegar();
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    }

    async function handlePenalizar () {
        alert("penalizar!!");
    }

    async function pegar () {    
        try {
            setCargando(true);
            const res = await serv.getAll('prestamos')
            setPrestamos(res);
            setCargando(false);            
        }
        catch (err) {
            console.error(err);
            message.error("Error al cargar listado de préstamos");
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    const socios = new Map ();
    const fechas = new Map ();
    const devueltos = new Map ();
    prestamos.forEach(x => {
        socios.set(x.id_socio.fullName, x.id_socio.fullName);
        fechas.set(dayjs(x.fechaFin).format("DD/MM/YYYY"), x.fechaFin);
        devueltos.set(
            x.fechaDevuelto ? dayjs(x.fechaDevuelto).format("DD/MM/YYYY") : "no", 
            x.fechaDevuelto ? x.fechaDevuelto: "no");
    });
    columnas[2].filters = Array.from(socios).map(x => {return {text: x[0], value: x[1]}});
    columnas[3].filters = Array.from(fechas).map(x => {return {text: x[0], value: x[1]}});
    columnas[4].filters = Array.from(devueltos).map(x => {return {text: x[0], value: x[1]}});
    console.log(prestamos);
    
    return (
        <div>
            <Row style = {{alignItems: "center"}}>
                <Col>
                    <h1>Préstamos</h1>
                </Col>
                <Col offset= "1">
                    <Button type = "primary" onClick = {()=> setModalN(true)}>
                        Nuevo
                    </Button>
                </Col>
            </Row>
            {(esBiblio() || esAdmin()) &&
                <Row>
                    <Col>
                        <Link to ="../prestamos/nuevo" className= "botonLink">
                            Nuevo
                        </Link>                        
                        <Link to = "../prestamos/buscar" className= "botonLink">
                            Buscar
                        </Link>
                    </Col>
                </Row>
            }
            <Row>
                <Col span = {24}>
                {cargando ? 
                    <Spin size="large" />                     
                    : 
                    <>
                        {prestamos.length === 0 ?
                            <h2>No hay prestamos</h2> 
                            :                            
                            <div className = "tableContainer">
                                <Table 
                                    size = "middle"
                                    locale = {locale}
                                    dataSource={prestamos} 
                                    columns={columnas} 
                                    pagination = {{
                                        align: "center",
                                        size: "small",
                                        position: ["topLeft"],
                                        showTotal: () => <b>Total de préstamos: {prestamos.length}</b>
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
                        open = {modalB}
                        title = "¿Confirmar baja?"
                        okText = "Aceptar"
                        cancelText = "Cancelar"
                        onCancel= {() => setModalB(false)}
                        onOk = {handleBorra}
                    >
                        {prestamoM &&
                            <>
                                Codigo: <b>{prestamoM.cod}</b> <br />
                                Libro: <b>{prestamoM.id_libro.titulo}</b> <br />
                                Socio: <b>{prestamoM.id_socio.fullName}</b> <br />
                                Fecha de devolución: <b>{dayjs(prestamoM.fechaFin).format("DD/MM/YYYY HH:mm")}</b> <br />
                            </>
                        }
                    </Modal>
                    <Modal                        
                        closable = {false}
                        maskClosable = {false}
                        open = {modalMUsuario}
                        title = "¿Penalizar usuario?"
                        okText = "Aceptar"
                        cancelText = "Cancelar"
                        onCancel= {() => setModalMUsuario(false)}
                        onOk = {handlePenalizar}
                    >
                    </Modal>
                    <Modal                        
                        closable = {false}
                        maskClosable = {false}
                        open = {modalM}
                        title = "¿Finalizar préstamo?"
                        okText = "Aceptar"
                        cancelText = "Cancelar"
                        onCancel= {() => setModalM(false)}
                        onOk = {handleFinalizar}                    
                    >
                    </Modal>

                </Col>
            </Row>
        </div>

    )
}

function AltaPrestamo() {
    const [libros, setLibros] = useState([])
    const [socios, setSocios] = useState([])
    const [modalN, setModalN] = useState(false);    
    const [formNuevo] = Form.useForm();

    async function handle (v) {
        try {
            const auxLibro = JSON.parse(v.id_libro)._id;
            v.id_libro = auxLibro;
            const auxSocio = JSON.parse(v.id_socio)._id;
            v.id_socio = auxSocio;
            const resp = await serv.crear('prestamos', v);            
            message.success(
                <>
                    ¡Alta exitosa! <br />
                    ID: <b>{resp._id}</b> <br />
                    Libro: <b>{resp.id_libro.titulo}</b> <br />
                    Socio: <b>{resp.id_socio.fullName}</b> <br />
                    Fecha de devolución: <b>{dayjs(resp.fechaFin).format("DD/MM/YYYY") || "no tiene"}</b> <br />                    
                </>
            );
            formNuevo.resetFields();
            setModalN(false);
            pegar();
        }
        catch (err) {
            message.error(`El prestamo no se pudo dar de alta (${err})`)
        }
    };

    async function pegar () {
        try {
            const resL = await serv.getAll('libros/getprestables');
            setLibros(resL);            
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
        try {
            const resU = await serv.getAll('usuarios/getbyrol/socio');
            setSocios(resU);
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
                <Col span = {24}>            
                <h1>Nuevo prestamo</h1>
                <Form
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 5}}
                    form={formNuevo}
                    name="formNuevo"
                    onFinish={handle}
                >
                    <Form.Item
                        name="id_libro"
                        label= {<b>Libro</b>}
                        rules={[{ required: true, },]}>
                        <Select
                            showSearch                            
                            placeholder="Ingrese título de libro"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.titulo ?? '').toLowerCase().localeCompare((optionB?.titulo ?? '').toLowerCase())}
                            >
                                {libros.map(libro => (
                                <Select.Option key={libro._id} value = {JSON.stringify(libro)}>
                                    {`${libro.titulo} (disp: ${libro.paraPrestamo})`}
                                </Select.Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="id_socio"
                        label= {<b>Socio</b>}
                        rules={[{ required: true}]}
                    >
                        <Select
                            showSearch                            
                            placeholder="Ingrese socio"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.dni ?? '').toLowerCase().localeCompare((optionB?.dni ?? '').toLowerCase())}
                            >
                            {socios.map(u => (
                                <Select.Option key={u._id} value = {JSON.stringify(u)}>
                                    {u.dni + ' - ' + u.fullName}
                                </Select.Option>
                        ))}
                        </Select>
                    </Form.Item>
                    {/* <Form.Item name="fechaFin" label="Fecha fin">
                        <Space direction="vertical">
                            <DatePicker onChange={onChange} 
                            placeholder="Ingrese fecha"
                            minDate = {dayjs()}
                            />
                        </Space>
                    </Form.Item> */}
                    <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                        <Link to = "../prestamos" className = "botonLink">
                            Volver
                        </Link>
                        <Button type="primary"
                            onClick = {() => setModalN(true)}
                        >
                            Enviar
                        </Button>
                        <Button htmlType="button" onClick={() => formNuevo.resetFields()}>
                            Borrar
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
                            <>              
                                Libro: <b>{formNuevo.getFieldValue("id_libro") && JSON.parse(formNuevo.getFieldValue("id_libro")).titulo}</b> <br/>
                                Socio: <b>{formNuevo.getFieldValue("id_socio") && JSON.parse(formNuevo.getFieldValue("id_socio")).fullName}</b> <br/>
                                Fecha de devolución: <b>{dayjs(new Date().getTime() + 15 * 86400000).format("DD/MM/YYYY")}</b>
                            </>
                        </Modal>
                    </Form.Item>
                </Form>
                </Col>
            </Row>
        </div>
    )
}

function BajaPrestamo() {
    const [libros, setLibros] = useState([])
    const [socios, setSocios] = useState([])
    const [prestamos, setPrestamos] = useState([])
    const [prestamoM, setPrestamoM] = useState(null)
    const [modif, setModif] = useState(false)    
    const [modalM, setModalM] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [formModif] = Form.useForm();
    const [formBorra] = Form.useForm();   
    
    async function pegar() {
        try {
            const resL = await serv.getAll('libros/getprestables');
            setLibros(resL);
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de libros");
        }
        try {
            const resU = await serv.getAll('usuarios/getbyrol/socio');
            setSocios(resU);
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de socios");
        }
        try {
            const resP = await serv.getAll('prestamos')
            setPrestamos(resP);
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de prestamos");
        }
    }

    function reiniciar() {
        formBorra.resetFields();
        formModif.resetFields();
        setModif(false);
        setModalB(false);
        setModalM(false);        
        setPrestamoM(null);
    }

    async function handleModif (v) {     
        try {
            if (v.id_libro) {
                const x = JSON.parse(v.id_libro);
                v.id_libro = x;
            }
            if (v.id_socio) {
                const x = JSON.parse(v.id_socio);
                v.id_socio = x;
            }
            await serv.actualizar('prestamos', prestamoM._id, v)
            message.success('Modificación exitosa')            
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
            const resp = await serv.borrar('prestamos', prestamoM._id)
            message.success(
                <>
                    <h3>¡Baja exitosa!</h3>
                    ID: <b>{resp._id}</b> <br />
                    Libro: <b>{resp.id_libro.titulo}</b> <br />
                    Socio: <b>{resp.id_socio.fullName}</b> <br />
                    Fecha de devolución: <b>{dayjs(resp.fechaFin).format("DD/MM/YYYY") || "no tiene"}</b> <br />
                </>
            );
            pegar();
            reiniciar();
            
        }
        catch (err) {
            console.error(err)
            message.error(err.message);            
        }        
    }    

    const onChange = (date, dateString) => {
        formModif.setFieldsValue({
            fechaFin: dateString
        })
        console.log(date, dateString);
    };

    async function guardarID (v) {
        const p = JSON.parse(v)
        setPrestamoM(p)
        setModif(false)
    }        

    useEffect(() => {
        pegar();
    }, [])

    return (
        <div>
            <Row>
                <Col span = {24}>            
                    <h1>Buscar préstamo</h1>
                    <Form
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}
                        form={formBorra}
                        name="formBajaPrestamo"
                        onFinish={handleBorra}                
                    >
                        <Form.Item 
                            name="prestamo" 
                            label={<b>Préstamo</b>}
                            rules={[{ required: true, },]}>
                            <Select
                                showSearch                        
                                onChange={guardarID}
                                placeholder="Seleccione prestamo"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').localeCompare((optionB?.cod ?? ''))}
                            >    
                                {prestamos.map(p => (
                                <Select.Option key={p._id} value={JSON.stringify(p)}>
                                    {`${p.id_libro.titulo} - ${p.id_socio.fullName} (${dayjs(p.fechaFin).format("DD/MM/YYYY")})`}
                                </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link to = "../prestamos" className = "botonLink">
                                Volver
                            </Link>
                            <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                                Modificar
                            </Button>
                            <Button danger 
                                type="primary" 
                                onClick = {() => setModalB(true)}
                                >
                                Borrar préstamo
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
                                {prestamoM && 
                                    <>                                        
                                        Libro: <b>{prestamoM.id_libro.titulo || "no tiene"}</b> <br />
                                        Socio: <b>{prestamoM.id_socio.fullName || "no tiene"}</b> <br />
                                        Devolución: <b>{dayjs(prestamoM.fechaFin).format("DD/MM/YYYY") || "no tiene"}</b> <br />
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
                            name="id_libro" 
                            label={<b>Libro</b>}
                            >
                            <Select
                                showSearch                                
                                placeholder={prestamoM.id_libro.titulo}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    {libros.map(x => (
                                <Select.Option key={x._id} value = {JSON.stringify(x)}>
                                    {x.cod + ' - ' + x.titulo}
                                </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item 
                            name="id_socio" 
                            label={<b>Socio</b>}>
                            <Select
                                showSearch                                
                                placeholder={prestamoM.id_socio.fullName}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.dni ?? '').toLowerCase().localeCompare((optionB?.dni ?? '').toLowerCase())}
                            >    {socios.map(x => (
                                <Select.Option key={x._id} value = {JSON.stringify(x)}>
                                    {x.dni + ' - ' + x.fullName}
                                </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        <Form.Item 
                            name="fechaInicio" 
                            label= {<b>Fecha de inicio</b>}
                            >
                                <DatePicker 
                                    needConfirm
                                    format = "DD/MM/YYYY"
                                    placeholder={dayjs(prestamoM.fechaInicio).format("DD/MM/YYYY")}
                                />
                        </Form.Item>
                        <Form.Item 
                            name="fechaFin" 
                            label= {<b>Fecha estimada</b>}
                            >
                                <DatePicker 
                                    needConfirm
                                    format = "DD/MM/YYYY"
                                    placeholder={dayjs(prestamoM.fechaFin).format("DD/MM/YYYY")}
                                />
                        </Form.Item>
                        <Form.Item 
                            name="fechaDevuelto" 
                            label= {<b>Fecha devuelto</b>}
                            >
                                <DatePicker 
                                    needConfirm
                                    format = "DD/MM/YYYY"
                                    placeholder={dayjs(prestamoM.fechaDevuelto).format("DD/MM/YYYY")}
                                />                        
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Button type="primary" 
                                onClick = {() => setModalM(true)}
                            >
                                Guardar cambios
                            </Button>
                            <Button htmlType="button"
                                onClick={() => formModif.resetFields()}>
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
                                onOk={formModif.submit}
                            >                                
                                {formModif.getFieldValue("id_libro") && 
                                    <>Libro nuevo: <b>{JSON.parse(formModif.getFieldValue("id_libro")).titulo}</b><br />
                                    </>}
                                {formModif.getFieldValue("id_socio") && 
                                    <>Socio nuevo: <b>{JSON.parse(formModif.getFieldValue("id_socio")).fullName}</b><br />
                                    </>}
                                {formModif.getFieldValue("fechaFin") && 
                                    <>Fecha de devolución nueva: <b>{dayjs(formModif.getFieldValue("fechaFin")).format("DD/MM/YYYY")}</b><br />
                                    </>
                                }
                            </Modal>
                        </Form.Item>
                    </Form>                    
                </Col>
            </Row>
            }
        </div>
    )
}

export { Prestamos, AltaPrestamo, BajaPrestamo }