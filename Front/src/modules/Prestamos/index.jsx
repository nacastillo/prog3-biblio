import { useState, useEffect } from 'react'
import { Button, Checkbox, DatePicker, Form, Input, message, Select, Space, Spin, Table } from 'antd'
import serv from '../../services/librapi'

function Prestamos() {
    const [cargando, setCargando] = useState(false);
    const [prestamos, setPrestamos] = useState([])
    const msjConfirm = (r) => {
        if (r.id_libro && r.id_socio) {
            return `¿Confirma que desea eliminar el siguiente prestamo?\n\nLibro: ${r.id_libro.titulo}\nUsuario: ${r.id_socio.fullName}\nFecha fin: ${r.fechaFin}`
        }
        else {
            return '¿Confirma que desea eliminar el prestamo?'
        }
    }

    const handleBorrar = async (r) => {
        if (confirm(msjConfirm(r))) {
            try {
                await serv.borrar('prestamos', r._id)
                message.success('Prestamo borrado exitosamente')
                pegar();
            }
            catch (err) {
                message.error('El prestamo no se pudo borrar')
            }
        }
    }

    const columnas = [
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
            render: (_, record) => (
                <a style={{ color: "red" }} onClick={() => handleBorrar(record)}>Borrar</a>
            )
        }
    ];


    const pegar = async () => {
        setCargando(true);
        const res = await serv.getAll('prestamos')
        setPrestamos(res);
        setCargando(false);
        console.log(res);
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <>
            {cargando ? (
                <Spin size="large" />
            ) : (
                <>
                    {prestamos.length == 0 ?
                        (<h1>No hay prestamos</h1>) :
                        (<>
                            <h1>Listado de todos los préstamos</h1>

                            <Table dataSource={prestamos} columns={columnas} />
                        </>)
                    }
                </>
            )}
        </>
    )
}

function AltaPrestamo() {
    const [libros, setLibros] = useState([])
    const [usuarios, setUsuarios] = useState([])

    const { Option } = Select;
    const [form] = Form.useForm();

    const onFinish = async (v) => {
        /*
        let f = new Date ();
        f = setDate(f.getDate()+15);
        
        const expira = new Date() + 15 * 86400000;

        const comprobarPrestamo = (x) => 
        Math.floor((new Date() - new Date(x)) / 86400000) > 15;
    
        const formatear = (x) => {
            const y = new Date (x);
            return '' + (1 + y.getDate()) + '/' + (1 + y.getMonth()) + '/' + y.getFullYear();    
        };
        */

        if (!v.fechaFin) {
            v.fechaFin = new Date();
            v.fechaFin.setDate(v.fechaFin.getDate() + 15);
        }
        if (confirm(`¿Confirma el alta del prestamo?\nFecha finalización: ${(v.fechaFin)}`)) {
            try {
                await serv.crear('prestamos', v)
                message.success('Alta de prestamo exitosa')
                form.resetFields();
            }
            catch (err) {
                message.error(`El prestamo no se pudo dar de alta (${err})`)
            }
        }
    };

    const pegar = async () => {
        try {
            const resL = await serv.getAll('libros')
            const resU = await serv.getAll('usuarios')
            setLibros(resL);
            setUsuarios(resU);
        }
        catch (err) {
            message.error(err)
        }
    }

    const onChange = (date, dateString) => {
        form.setFieldsValue({
            fechaFin: dateString
        })
        console.log(date, dateString);
    };

    useEffect(() => {
        pegar();
    }, [])

    return (
        <>
            <h1>Nuevo prestamo</h1>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item
                    name="cod"
                    label="Codigo"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="id_libro"
                    label="Libro"
                    rules={[{ required: true, },]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Ingrese título de libro"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.titulo ?? '').toLowerCase().localeCompare((optionB?.titulo ?? '').toLowerCase())}
                    >    {libros.map(libro => (
                        <Option key={libro._id}>
                            {libro.titulo}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="id_socio"
                    label="Usuario"
                    rules={[{ required: true, },
                    ]}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Ingrese usuario"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.dni ?? '').toLowerCase().localeCompare((optionB?.dni ?? '').toLowerCase())}
                    >    {usuarios.map(u => (
                        <Option key={u._id}>
                            {u.dni + ' - ' + u.fullName}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name="fechaFin" label="Fecha fin">
                    <Space direction="vertical">
                        <DatePicker onChange={onChange} placeholder="Ingrese fecha" />
                    </Space>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                    <Button type="primary" htmlType="submit">
                        Enviar
                    </Button>
                    <Button htmlType="button" onClick={() => form.resetFields()}>
                        Borrar
                    </Button>
                </Form.Item>
            </Form>

        </>
    )
}

function BajaPrestamo() {
    const [libros, setLibros] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [prestamos, setPrestamos] = useState([])
    const [modif, setModif] = useState(false)
    const [prestamoM, setPrestamoM] = useState(null)

    const { Option } = Select;

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const onFinish = async (v) => {
        const prestamo = JSON.parse(v.prestamo)
        //if (confirm(`¿Confirma que desea eliminar el prestamo seleccionado?\nTitulo: ${libro.titulo}\nAutor: ${libro.autor}`)) {
        if (confirm()) {
            try {
                await serv.borrar('prestamos', prestamo._id)
                message.success('Préstamo borrado exitosamente')
                form1.resetFields();
                form2.resetFields();
                pegar();
                setModif(false)
            }
            catch (err) {
                message.error(err)
            }
        }
    }

    const onFinishModif = async (v) => {
        if (confirm('¿Guardar modificaciones?')) {
            try {
                await serv.actualizar('prestamos', prestamoM, v)
                message.success('Modificación exitosa')
                form1.resetFields()
                form2.resetFields()
                setModif(false)
                pegar()
            }
            catch (err) {
                message.error(err)
            }
        }
    }

    const onChange = (date, dateString) => {
        form2.setFieldsValue({
            fechaFin: dateString
        })
        console.log(date, dateString);
    };

    const guardarID = async (v) => {
        const p = JSON.parse(v)
        setPrestamoM(p._id)
        setModif(false)
    }

    const pegar = async () => {
        const resL = await serv.getAll('libros');
        const resU = await serv.getAll('usuarios');
        const resP = await serv.getAll('prestamos')
        setLibros(resL);
        setUsuarios(resU);
        setPrestamos(resP);
        console.log(resL);
        console.log(resU);
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <>
            <h1>Buscar préstamo</h1>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form1}
                name="formBajaPrestamo"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item name="prestamo" label="Prestamo" rules={[{ required: true, },]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        onChange={guardarID}
                        placeholder="Ingrese prestamo"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.cod ?? '').localeCompare((optionB?.cod ?? ''))}
                    >    {prestamos.map(p => (
                        <Option key={p._id} value={JSON.stringify(p)}>
                            {`${p.cod} - ${p.id_libro.titulo} - ${p.id_socio.fullName} (${p.fechaFin})`}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                    <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                        Modificar
                    </Button>
                    <Button type="primary" htmlType="submit" danger>
                        Borrar préstamo
                    </Button>
                </Form.Item>
            </Form>
            <br></br><br></br>
            {modif &&
                (<Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={form2}
                    name="formModif"
                    onFinish={onFinishModif}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="cod" label="Código">
                        <Input type="number" placeholder="Ingrese código" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="id_libro" label="Libro" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Ingrese libro"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                        >    {libros.map(x => (
                            <Option key={x._id}>
                                {x.cod + ' - ' + x.titulo}
                            </Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="id_socio" label="Socio" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Ingrese libro"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.dni ?? '').toLowerCase().localeCompare((optionB?.dni ?? '').toLowerCase())}
                        >    {usuarios.map(x => (
                            <Option key={x._id}>
                                {x.dni + ' - ' + x.fullName}
                            </Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="fechaFin" label="Fecha fin">
                        <Space direction="vertical">
                            <DatePicker onChange={onChange} placeholder="Ingrese fecha" />
                        </Space>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                        <Button type="primary" htmlType="submit">
                            Enviar
                        </Button>
                        <Button htmlType="button"
                            onClick={() => form2.resetFields()}>
                            Borrar
                        </Button>
                    </Form.Item>
                </Form>
                )}
        </>
    )
}

export { Prestamos, AltaPrestamo, BajaPrestamo }