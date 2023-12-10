import { useState, useEffect } from 'react'
import { Button, Input, Form, message, Modal, Select, Space, Spin, Table } from 'antd'
import serv from '../../services/librapi'

function Generos() {
    const [cargando, setCargando] = useState(false);
    const [generos, setGeneros] = useState([])

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

    useEffect(() => {
        pegar();
    }, [])

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
    ]

    return (
        <>
            {cargando ? (
                <Spin tip="Cargando listado..." size="large">
                    <div className="content" />
                </Spin>
            ) : (
                <>
                    {generos.length == 0 ?
                        (<h1>No hay generos</h1>) :
                        (<>
                            <h1>Listado de todos los generos</h1>
                            <Table dataSource={generos} columns={columnas} />
                            <h3>Total de géneros: {generos.length}</h3>
                        </>)
                    }
                </>
            )}
        </>
    )
}

/** Para probar CRUD:
   Suspenso
   Biografía
   Autoayuda
   Poesía
   Ciencia
   Ensayo
   Teatro
   Deportivo
   Comic
   Manga
 */

function AltaGenero() {



    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const [form] = Form.useForm();

    const onFinish = async (v) => {
        if (confirm(`¿Confirma el alta del género?\nCodigo: ${v.cod}\nDescripción: ${v.desc}`)) {
            try {
                await serv.crear('generos', v)
                message.success('Alta de género exitosa');
                //alert('Alta de género exitosa')
                form.resetFields();
            }
            catch (err) {
                message.error(`El género no se pudo dar de alta (${err})`);
                //alert(`El género no se pudo dar de alta\n${err}`)
            }
        }
    }

    return (
        <>
            <h1>Nuevo género</h1>
            <Form
                {...layout}
                form={form}
                name="formNuevoGenero"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item name="cod" label="Codigo" rules={[{ required: true }]}>
                    <Input
                        type="number"
                        placeholder="Ingrese código"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item name="desc" label="Descripción" rules={[{ required: true }]}>
                    <Input
                        placeholder="Ingrese descripción"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
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

function BajaGenero() {
    const [generos, setGeneros] = useState([])
    const [modif, setModif] = useState(false)
    const [generoM, setGeneroM] = useState(null)

    const pegar = async () => {
        try {
            const res = await serv.getAll('generos')
            setGeneros(res)
        }
        catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        pegar();
    }, [])

    const { Option } = Select;
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    }

    const onFinish = async (v) => {
        const genero = JSON.parse(v.genero)
        if (confirm(`¿Confirma que desea eliminar el siguiente género?\n${genero.desc}`)) {
            try {
                await serv.borrar('generos', genero._id)
                message.success('Género borrado exitosamente')
                //alert('Género borrado exitosamente')
                form.resetFields();
                pegar();
            }
            catch (err) {
                message.error(err)
                //alert(err)
            }
        }
    }

    const onFinishModif = async (v) => {
        if (confirm('¿Guardar modificaciones?')) {
            try {
                await serv.actualizar('generos', generoM, v)
                message.success('Modificación exitosa')
                //alert('Modificación exitosa')
                form.resetFields();
                setModif(false)
                pegar()
            }
            catch (err) {
                message.error(err)
                //alert(err)
            }
        }
    }

    const guardarID = async (v) => {
        const g = JSON.parse(v)
        setGeneroM(g._id)
        setModif(false)
    }

    return (
        <>
            <h1>Buscar género</h1>
            <Form
                {...layout}
                form={form}
                name="formBuscarGenero"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item name="genero" label="Género" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        onChange={guardarID}
                        placeholder="Ingrese género"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                    >    {generos.map(g => (
                        <Option key={g._id} value={JSON.stringify(g)}>
                            {g.cod + ' - ' + g.desc}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                        Modificar
                    </Button>
                    <br></br><br></br>
                    <Button type="primary" htmlType="submit" danger>
                        Borrar género
                    </Button>
                </Form.Item>
            </Form>
            <br></br><br></br>

            {/** PARTE DE LA MODIF */}
            {modif &&
                (<>
                    <Form {...layout} form={form} name="formModif"
                        onFinish={onFinishModif} style={{ maxWidth: 600 }}
                    >
                        <Form.Item name="cod" label="Codigo">
                            <Input type="number" placeholder="Ingrese código" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item name="desc" label="Descripción">
                            <Input placeholder="Ingrese descripción" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Enviar
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Borrar
                            </Button>
                        </Form.Item>
                    </Form>
                </>)
            }
        </>
    )
}

export { Generos, AltaGenero, BajaGenero}

