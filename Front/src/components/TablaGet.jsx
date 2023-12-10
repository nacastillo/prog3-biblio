import { Button, Checkbox, Form, Input, Select, Space, Spin, Table } from 'antd'
import serv from '../services/librapi'

export default function TablaGet({ tipo, datos }) {
    const pegar = async () => {
        setCargando(true);
        const res = await serv.getPrestamos();
        setPrestamos(res);
        setCargando(false);
        console.log(res);
    }

    const handleBorrarP = async (r) => {
        if (confirm(msjConfirm(r))) {
            //if (confirm(`¿Confirma que desea eliminar el siguiente prestamo?\n\nLibro: ${r.id_libro.titulo}\nUsuario: ${r.id_socio.fullName}\nFecha fin: ${r.fechaFin}`)) {
            try {
                await serv.deletePrestamo(r._id)
                alert('Prestamo borrado exitosamente')
                pegar();
            }
            catch (err) {
                alert('El prestamo no se pudo borrar')
            }
        }
    }

    const columnasP = [
        {
            title: 'Codigo',
            dataIndex: 'cod',
            key: 'cod',
        },
        {
            title: 'Libro',
            dataIndex: 'id_libro',
            key: 'id_libro',
            render: (l) => (l ? l.titulo : '')
        },
        {
            title: 'Usuario',
            dataIndex: 'id_socio',
            key: 'id_socio',
            render: (u) => (u ? `${u.fullName}` : '')
        },
        {
            title: 'Fecha de finalización',
            dataIndex: 'fechaFin',
            key: 'fechaFin',
        },
        {
            title: 'Accion',
            key: 'action',
            render: (_, x) => (
                <Space size="middle">
                    <a onClick={() => alert(x.id_libro.titulo)}>Modificar</a>
                    <a onClick={() => handleBorrarP(x)}>Borrar</a>
                </Space>
            )
        }
    ];

    return (
        <>
            {tipo === 'p' ?
                <>
                    <Table dataSource={datos} columns={columnasP} />
                </>
                :
                <p>hola</p>
            }
        </>
    )
}