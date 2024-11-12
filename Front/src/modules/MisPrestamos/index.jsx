import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Form, Input, message, Modal, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from '../../components/AuthContext';
import dayjs from "dayjs";

function MisPrestamos () {
    const [prestamos, setPrestamos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const {getId, penalizadoHasta} = useContext(AuthContext);

    function estaPenalizado () {
        const hoy = new Date ()
        const x = new Date (penalizadoHasta());
        return hoy.getTime() < x.getTime();
    }

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
        filters: [{text: "Sí", value: "Sí"},{text: "No", value: "No"}, {text: "---",  value: "---"}],
        onFilter: (value, record) => record.termino === value            
    },     
    ];

    async function pegar () {    
        try {
            setCargando(true);
            const res = await serv.leer('prestamos/misprestamos', getId());
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
    }, []);

    return (
        <div>
            {estaPenalizado() && 
            <Row>
                <Col>
                    <h1>Usted se encuentra penalizado hasta el {dayjs(penalizadoHasta()).format("DD/MM/YYYY")} por no haber devuelto un libro en el tiempo estimado.</h1>
                </Col>
            </Row>
            }
            <Row>
                <Col span = {24}>
                    <h1>Mis préstamos</h1>
                    {cargando ? 
                        <Spin size = "large" />
                        :
                        <>
                        {prestamos.length === 0 ?
                            <h2>No hay préstamos</h2>
                            :
                            <div className = "tableContainer">
                                <Table
                                    size = "middle"
                                    columns = {columnas}
                                    dataSource = {prestamos}
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
        </div>
        
    )

}

export default MisPrestamos;