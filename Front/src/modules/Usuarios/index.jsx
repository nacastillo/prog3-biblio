import {useParams, Link} from "react-router-dom"
import { useContext, useState, useEffect } from 'react'
import { Row, Col, Button, DatePicker, Form, Input, Modal, message, Space, Select, Spin, Table } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from "../../components/AuthContext"
import dayjs from "dayjs"

const columnas = [
    {
        title: 'Número de DNI',
        dataIndex: 'dni',
        key: 'dni',
    },
    {
        title: "Usuario",
        dataIndex: "usr",
        key: "usr"
    },
    {
        title: 'Nombre completo',
        dataIndex: 'fullName',
        key: 'fullName',
    },
    {
        title: 'Fecha de nac.',
        dataIndex: 'bornDate',
        key: 'bornDate',
    },
    {
        title: 'Correo',
        dataIndex: 'email',
        key: 'email',

    },
    {
        title: 'Rol',
        dataIndex: 'role',
        key: 'role',
        render: r => (r ? r.name : 'Sin rol'),
    },
    {
        title: 'Teléfono',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Activo',
        dataIndex: 'isActive',
        key: 'isActive',
        render: a => (a ? 'Si' : 'No')
    },
];


function Usuarios(props) {
    const [cargando, setCargando] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const {esBiblio, esAdmin} = useContext(AuthContext);

    const pegar = async () => {
        setCargando(true)
        const res = await serv.getAll('usuarios')        
        setUsuarios(res)
        setCargando(false)
        console.log(res)
    }

    useEffect(() => {
        pegar();
    }, [])

    return (
        <div>
            <Row>
                <Col>
                    <h1>Usuarios</h1>
                </Col>
            </Row>
            {(esBiblio() || esAdmin()) &&
                <Row>
                    <Col>
                        <Link to ="../usuarios/nuevo" className= "botonLink">
                            Nuevo
                        </Link>                                        
                        <Link to = "../usuarios/buscar" className= "botonLink">
                            Buscar
                        </Link>
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                {cargando ? (
                    <Spin tip="Cargando listado..." size="large" />
                ) 
                : 
                (
                    <>
                        {usuarios.length == 0 ?
                            (<h2>No hay usuarios</h2>) :
                            (<>
                                <h2>Listado de todos los usuarios</h2>
                                <Table dataSource={usuarios} columns={columnas}
                                    pagination = {{
                                        align: "center",
                                        size: "small",
                                        position: ["topLeft"],
                                        showTotal: () => <b>Total de libros: {usuarios.length}</b>
                                }}
                                />
                            </>)
                        }
                    </>
                )
                }
            </Col>
        </Row>
    </div>
    )
}

function AltaUsuario() {

    const [roles, setRoles] = useState([])
    const { Option } = Select;

    const [form] = Form.useForm();

    const onFinish = async (v) => {
        v.fullName = v.apellido + ', ' + v.nombre
        if (confirm(`¿Confirma el alta del usuario?\n ${v.dni + '\n' + v.fullName + '\n'}`)) {
            try {
                await serv.crear('usuarios', v)
                message.success('Alta de usuario exitosa')
                form.resetFields();
            }
            catch (err) {
                message.error(`El usuario no se pudo dar de alta\n(${err})`)
            }
        }
    };

    const pegar = async () => {
        try {
            const res = await serv.getAll('roles')
            setRoles(res);
        }
        catch (err) {
            message.error(err)
        }
    }

    const handleFecha = (date, dateString) => {
        form.setFieldsValue({
            bornDate: dateString
        })
        console.log(date, dateString);
    };

    useEffect(() => {
        pegar();
    }, [])

    return (
        <div>
            <Row>
                <Col span = {24}>            
                    <h1>Nuevo usuario</h1>
                    <Form
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        // layout = "vertical"
                        // style={{
                        //     maxWidth: 600,
                        // }}
                    >
                        <Form.Item
                            name="dni"
                            label="Número de DNI:"
                            // style={{ width: 400 }}
                            rules={[{ required: true }]}
                        >
                            <Input
                                placeholder="Ingrese DNI"
                                // style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="usr"
                            label="Nombre de usuario"
                            rules={[{ required: true, },]}
                        >
                            <Input
                                placeholder="Ingrese nombre de usuario"
                                // style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="apellido"
                            label="Apellido"
                            rules={[{ required: true, },]}
                        >
                            <Input
                                placeholder="Ingrese apellido(s)"
                                // style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input
                                placeholder="Ingrese nombre(s)"
                                // style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Teléfono"
                        >
                            <Input
                                placeholder="Ingrese teléfono"
                                // style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Correo"
                            rules={[{ required: true }]}
                        >
                            <Input
                                placeholder="Ingrese correo"
                                // style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="pwd"
                            label="Contraseña"
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Rol"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                // style={{ width: 200 }}
                                placeholder="Ingrese rol"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    {roles.map(g => (
                                <Option key={g._id}>
                                    {g.name}

                                </Option>
                            ))}
                            </Select>

                        </Form.Item>
                        <Form.Item name="bornDate" label="Fecha de nac.">
                            <Input type = "date">
                            </Input>
                            <DatePicker onChange={handleFecha} 
                                placeholder="Ingrese fecha"
                                maxDate = {dayjs()}
                            />                            
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link to = "../usuarios" className = "botonLink">
                                Volver
                            </Link>
                            <Button type="primary" htmlType="submit">
                                Enviar
                            </Button>
                            <Button htmlType="button" onClick={() => form.resetFields()}>
                                Borrar
                            </Button>                            
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

function BajaUsuario() {
/*
    const res = [
    { id: 1, name: 'Usuario 1', bornDate: '1990-05-15T00:00:00.000Z' },
    { id: 2, name: 'Usuario 2', bornDate: '1985-09-25T00:00:00.000Z' },
    // Otros objetos...
    ];  

    const formatDate = (fecha) => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
    };
    
    const resConFormatoAmigable = res.map((usuario) => (
        {...usuario, 
        bornDate: formatDate(usuario.bornDate),
    }));
  
    console.log(resConFormatoAmigable);
  */

    const [usuarios, setUsuarios] = useState([])
    const [roles, setRoles] = useState([])
    const [usuarioM, setUsuarioM] = useState([])
    const [modif, setModif] = useState(null)

    const pegar = async () => {
        try {
            const resU = await serv.getAll('usuarios')
            const resR = await serv.getAll('roles')
            setUsuarios(resU)
            setRoles(resR)
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


    async function handleBorra () {
    //const handleBorra = async (v) => {
        // const usuario = JSON.parse(v.usuario)
        // if (confirm(`${usuario._id}\n¿Confirma que desea eliminar el usuario seleccionado?\nDNI: ${usuario.dni}\nNombre completo: ${usuario.fullName}`)) {
        //     try {
        //         await serv.borrar('usuarios', usuario._id)
        //         message.success('Usuario borrado exitosamente')
        //         form1.resetFields();
        //         form2.resetFields();
        //         pegar();
        //     }
        //     catch (err) {
        //         message.error(err)
        //     }
        // }
        if (confirm(`${usuarioM._id}\n¿Confirma que desea eliminar el usuario seleccionado?\nDNI: ${usuarioM.dni}\nNombre completo: ${usuarioM.fullName}`)) {
            try {
                await serv.borrar('usuarios', usuarioM._id)
                message.success('Usuario borrado exitosamente')
                form1.resetFields();
                form2.resetFields();
                pegar();
                }
            catch (err) {
                message.error(err)
            }
        }
    }

    const onFinishModif = async (v) => {        
        if (confirm('¿Guardar modificaciones?')) {
            try {
                await serv.actualizar('usuarios', usuarioM, v)
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

    const handleFecha = (date, dateString) => {
        form2.setFieldsValue({
            bornDate: dateString
        })
        console.log(date, dateString);
    };

    function guardarID (v) {
    //const guardarID = v => {
        const u = JSON.parse(v)
        setUsuarioM(u)
        console.log(usuarioM);
        setModif(false)
    }

    return (
        <div>
            <h1>Buscar usuario</h1>
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form1}
                name="formBajaUsuario"
                onFinish={handleBorra}
                style={{ maxWidth: 600, }}
            >
                <Form.Item name="usuario" label="Usuario" rules={[{ required: true, },]}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        onSelect={guardarID}
                        // onChange={guardarID}
                        placeholder="Ingrese usuario"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.dni ?? '').toLowerCase().localeCompare((optionB?.dni ?? '').toLowerCase())}
                    >    {usuarios.map(u => (
                        <Option key={u._id} value={JSON.stringify(u)}>
                            {u.dni + ' - ' + u.fullName}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                    <Link to = "../usuarios" className = "botonLink">
                        Volver
                    </Link>
                    <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                        Modificar
                    </Button>
                    <Button type="primary" htmlType="submit" danger>
                        Borrar usuario
                    </Button>
                </Form.Item>
            </Form>
            {modif &&
                (<Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={form2}
                    name="formModif"
                    onFinish={onFinishModif}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="dni" label="Número de DNI:">
                        <Input placeholder="Ingrese DNI" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="fullName" label="Nombre completo" >
                        <Input placeholder="Apellido(s), nombre(s)" style={{ width: 200 }} />
                    </Form.Item>                    
                    <Form.Item name="phone" label="Teléfono" >
                        <Input placeholder="Ingrese teléfono" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="email" label="Correo" >
                        <Input placeholder="Ingrese correo" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name="pwd" label="Contraseña" >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="role" label="Rol" >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Ingrese rol"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                        >    {roles.map(r => (
                            <Option key={r._id}>
                                {r.cod + ' - ' + r.name}
                            </Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="bornDate" label="Fecha de nac.">
                        <Space direction="vertical">
                            <DatePicker onChange={handleFecha} placeholder="Ingrese fecha" />
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
        </div>
    )
}

export { Usuarios, AltaUsuario, BajaUsuario }