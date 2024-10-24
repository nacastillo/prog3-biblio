import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Input, InputNumber, Form, message, Modal, Select, Spin, Table } from "antd";
import serv from "../../services/librapi"
import { AuthContext } from "../../components/AuthContext";

function Generos () {
    const [generos, setGeneros] = useState([]);
    const [entidadM, setEntidadM] = useState(null);
    const [mostrarDatos, setMostrarDatos] = useState(false);
    const [modif, setModif] = useState(false);
    const [modalN, setModalN] = useState(false);
    const [modalM, setModalM] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [cargando, setCargando] = useState(false);    
    const { modo } = useParams();
    const [formAlta] = Form.useForm();
    const [formBaja] = Form.useForm();
    const [formModif] = Form.useForm();    
    const {esSocio, esAdmin, esBiblio} = useContext(AuthContext);

    function conservar (v) {
        setEntidadM(JSON.parse(v));
        setMostrarDatos(true);
    }

    async function handleAlta (v) {
        try {
            const resp = await serv.crear("generos", v);
            message.success(
                <>
                    <h3>¡Alta exitosa!</h3>
                    ID: <b>{resp._id}</b>
                    Codigo: <b>{resp.cod}</b>
                    Descripcion: <b>{resp.desc}</b>
                </>
            );
            formAlta.resetFields();
            setModalN(false);
            pegar();
        }
        catch (err) {
            message.error(err.message);
        }
    }

    async function handleModif (v) {
        try {
            //v.id = entidadM._id;
            const resp = await serv.actualizar("generos",entidadM.id, v);
            message.success("Cambios guardados.");
            pegar();
            formBaja.resetFields();
            formModif.resetFields();
            setModif(false);
            setModalB(false);
            setModalM(false);
            setMostrarDatos(false);
            setEntidadM(null);
        }
        catch (err) {
            message.error(err.message);
        }
    }

    async function handleBaja (v) {
        try {
            const resp = await serv.borrar("generos", entidadM.id);
            message.success(
                <>
                    <h3>¡Baja exitosa!</h3>
                    ID: <b>{resp._id}</b>
                    Codigo: <b>{resp.cod}</b>
                    Descripcion: <b>{resp.desc}</b>
                </>
            );
            pegar();
            formBaja.resetFields();
            setModif(false);
            setModalB(false);
            setMostrarDatos(false);
            setEntidadM(null);
        }
        catch (err) {
            message.error(err.message);
        }
    }   

    const pegar = async () => {
        try {
            setCargando(true);
            const res = await serv.getAll('generos')
            setGeneros(res);
            setCargando(false);
        }
        catch (err) {
            alert(err)
        }
    }    


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
        },
        {
            title: "Accion",

        }
    ]

    useEffect(() => {
        pegar();
    },[]);




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
            {cargando ? (
                <Spin tip="Cargando listado..." size="large">
                    
                </Spin>
            ) : (
                <Col span = {24}>
                    {generos.length == 0 ?
                        (<h2>No hay géneros</h2>) :
                        (                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                                <Table 
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
                        )
                    }
                </Col>
            )}                
            </Row>
        </div>
    ) 




}

export default Generos;