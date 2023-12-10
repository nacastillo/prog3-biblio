import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'

const columnasL = [
    {
        title: 'Codigo',
        dataIndex: 'cod',
        key: 'cod',
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
    },
];


function Libros() {
    const [cargando, setCargando] = useState(false);
    const [libros, setLibros] = useState([])

    const pegar = async () => {
        try {
            setCargando(true);
            const res = await serv.getAll('libros')
            setLibros(res);
            setCargando(false)
        }
        catch (err) {
            message.error(err)
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <>
            {cargando ? (
                <Spin tip="Cargando listado..." size="large">
                    <div className="content" />
                </Spin>
            ) : (
                <>
                    {libros.length == 0 ?
                        (<h1>No hay libros</h1>) :
                        (<>
                            <h1>Listado de todos los libros</h1>
                            <Table dataSource={libros} columns={columnasL} />
                            <h3>Total libros: {libros.length}</h3>
                        </>)
                    }
                </>
            )}
        </>
    )
}

function AltaLibro() {
    const [generos, setGeneros] = useState([])

    const { Option } = Select;
    const [form] = Form.useForm();

    const onFinish = async (v) => {
        if (confirm(`¿Confirma el alta del libro?\nCodigo: ${v.cod}\nTitulo: ${v.titulo}\nAutor: ${v.autor}`)) {
            try {
                await serv.crear('libros', v)
                message.success('Alta de libro exitosa')
                form.resetFields();
            }
            catch (err) {
                message.error(`El libro no se pudo dar de alta (${err})`)
            }
        }
    };    

    const pegar = async () => {
        try {
            const res = await serv.getAll('generos')
            setGeneros(res);
        }
        catch (err) {
            message.error(err)
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <>
            <h1>Nuevo libro</h1>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
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
                    <Input
                        type="number"
                        placeholder="Ingrese código"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="titulo"
                    label="Título"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="Ingrese título del libro"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="autor"
                    label="Autor"
                    rules={[{ required: true, },]}
                >
                    <Input
                        placeholder="Ingrese autor del libro"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="lecturaLocal"
                    label="Para lectura local"
                    style={{ width: 400 }}
                >
                    <Input
                        type="number"
                        placeholder="Ingrese cantidad"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="paraPrestamo"
                    label="Para préstamo"
                    style={{ width: 400 }}
                >
                    <Input
                        type="number"
                        placeholder="Ingrese cantidad"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="id_genero"
                    label="Género"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Ingrese género"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                    >    {generos.map(g => (
                        <Option key={g._id}>
                            {g.cod + ' - ' + g.desc}

                        </Option>
                    ))}
                    </Select>

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

function BajaLibro() {
    const [libros, setLibros] = useState([])
    const [generos, setGeneros] = useState([])
    const [libroM, setLibroM] = useState(null)
    const [modif, setModif] = useState(false)

    const pegar = async () => {
        try {
            const resL = await serv.getAll('libros')
            const resG = await serv.getAll('generos')
            setLibros(resL)
            setGeneros(resG)
        }
        catch (err) {
            message.error(err)
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    const { Option } = Select;    

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const onFinish = async (v) => {
        const libro = JSON.parse(v.libro)
        if (confirm(`¿Confirma que desea eliminar el libro seleccionado?\nTitulo: ${libro.titulo}\nAutor: ${libro.autor}`)) {
            try {
                await serv.borrar('libros', libro._id)
                message.success('Libro borrado exitosamente')
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
                await serv.actualizar('libros', libroM, v)
                message.success('Modificación exitosa')
                form1.resetFields();
                form2.resetFields();
                setModif(false)
                pegar()
            }
            catch (err) {
                message.error(err)
            }
        }
    }

    const guardarID = async (v) => {
        const l = JSON.parse(v)
        setLibroM(l._id)
        setModif(false)
    }

    return (
        <>
            <h1>Buscar libro</h1>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form1}
                name="formBajaLibro"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item name="libro" label="Libro" rules={[{ required: true, },]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        onChange={guardarID}
                        placeholder="Ingrese libro"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.cod ?? '').localeCompare((optionB?.cod ?? ''))}
                    >    {libros.map(l => (
                        <Option key={l._id} value={JSON.stringify(l)}>
                            {l.cod + ' - ' + l.titulo + ' - ' + l.autor}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                    <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                        Modificar
                    </Button>
                    <Button type="primary" htmlType="submit" danger>
                        Borrar libro
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
                    <Form.Item name="titulo" label="Título">
                        <Input placeholder="Ingrese título" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="autor" label="Autor">
                        <Input placeholder="Ingrese autor" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="lecturaLocal" label="Para lectura local">
                        <Input type="number" placeholder="Ingrese cantidad" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="paraPrestamo" label="Para préstamo">
                        <Input type="number" placeholder="Ingrese cantidad" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="id_genero" label="Género" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Ingrese género"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                        >    {generos.map(g => (
                            <Option key={g._id}>
                                {g.cod + ' - ' + g.desc}
                            </Option>
                        ))}
                        </Select>
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

export { Libros, AltaLibro, BajaLibro }