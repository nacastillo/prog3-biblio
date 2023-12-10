import { useState, useEffect } from 'react'
import { Button, Input, Form, message, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'

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

function Roles() {
    const [cargando, setCargando] = useState(false);
    const [roles, setRoles] = useState([])

    async function pegar() {
        try {
            setCargando(true);
            const res = await serv.getAll('roles')
            setRoles(res);
            setCargando(false)
        }
        catch (err) {
            alert(err)
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
                    {roles.length == 0 ?
                        (<h1>No hay roles</h1>) :
                        (<>
                            <h1>Listado de todos los roles</h1>
                            <Table dataSource={roles} columns={columnas} />
                            <h3>Total de roles: {roles.length}</h3>
                        </>)
                    }
                </>
            )}
        </>
    )
}

function AltaRol() {
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
        if (confirm(`¿Confirma el alta del rol?\nCodigo: ${v.cod}\nNombre: ${v.name}`)) {
            try {
                await serv.crear('roles', v)
                message.success('Alta de rol exitosa')
                form.resetFields();
            }
            catch (err) {
                message.error(`El rol no se pudo dar de alta\n(${err})`)
            }
        }
    }

    return (
        <>
            <h1>Nuevo rol</h1>
            <Form
                {...layout}
                form={form}
                name="formNuevoRol"
                onFinish={onFinish}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item name="cod" label="Codigo" rules={[{ required: true }]} >
                    <Input
                        type="number"
                        placeholder="Ingrese código"
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item name="name" label="Nombre" rules={[{ required: true }]} >
                    <Input
                        placeholder="Ingrese nombre"
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

function BajaRol() {
    const [roles, setRoles] = useState([])
    const [modif, setModif] = useState(false)
    const [rolM, setRolM] = useState(null)

    const pegar = async () => {
        try {
            const res = await serv.getAll('roles')
            setRoles(res);
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

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const onFinish = async (v) => {
        const rol = JSON.parse(v.rol)
        if (confirm(`¿Confirma que desea eliminar el siguiente rol?\n${rol.name}`)) {
            try {
                await serv.borrar('roles', rol._id)
                message.success('Rol borrado exitosamente')
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
                await serv.actualizar('roles', rolM, v)
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
        const r = JSON.parse(v)
        setRolM(r._id)
        setModif(false)
    }

    return (
        <>
            <h1>Buscar rol</h1>
            <Form
                {...layout}
                form={form1}
                name="formBuscarRol"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item name="rol" label="Rol" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        onChange={guardarID}
                        placeholder="Ingrese rol"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                    >    {roles.map(r => (
                        <Option key={r._id} value={JSON.stringify(r)}>
                            {r.cod + ' - ' + r.name}
                        </Option>
                        
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                        Modificar
                    </Button>
                    <Button type="primary" htmlType="submit" danger>
                        Borrar rol
                    </Button>
                </Form.Item>
            </Form>
            <br></br><br></br>
            {modif &&
                (<>
                    <Form {...layout} form={form2} name="formModif"
                        onFinish={onFinishModif} style={{ maxWidth: 600 }}
                    >
                        <Form.Item name="cod" label="Código">
                            <Input type="number" placeholder="Ingrese código" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item name="name" label="Nombre">
                            <Input placeholder="Ingrese nombre" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Enviar
                            </Button>
                            <Button htmlType="button" 
                                onClick={() => form2.resetFields()}>
                                Borrar
                            </Button>
                        </Form.Item>
                    </Form>
                </>)
            }
        </>
    )
}

export { Roles, AltaRol, BajaRol}