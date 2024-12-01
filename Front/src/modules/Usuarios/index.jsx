import { useContext, useState, useEffect } from 'react'
import { Link} from "react-router-dom"
import { Row, Col, Button, DatePicker, Form, Input, Modal, message, Space, Select, Spin, Table, Checkbox } from 'antd'
import serv from '../../services/librapi'
import { AuthContext } from "../../components/AuthContext"
import dayjs from "dayjs"

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(false);    
    const {esBiblio, esAdmin} = useContext(AuthContext);

    const columnas = [
        {
            title: 'Número de DNI',
            dataIndex: 'dni',
            key: 'dni',
        },
        {
            title: "Nombre de usuario",
            dataIndex: "usr",
            key: "usr"
        },
        {
            title: 'Nombre completo',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Fecha de nacimiento.',
            dataIndex: 'bornDate',
            key: 'bornDate',
            render: r => (r ? dayjs(r).format("DD/MM/YYYY") : "no tiene")
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

    async function pegar () {
        try {
            setCargando(true)
            const res = await serv.getAll('usuarios')
            setUsuarios(res)
            setCargando(false)            
        }
        catch (err) {
            console.error(err);
            message.error("Error al cargar listado de usuarios");
        }
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
                <Col span = {24}>
                {cargando ? 
                    <Spin tip="Cargando listado..." size="large" />                
                    :                 
                    <>
                        {usuarios.length === 0 ?
                            <h2>No hay usuarios</h2>
                            :
                            <div className = "tableContainer">                                
                                <Table 
                                    size = "middle"
                                    dataSource={usuarios.map(x => {return {...x, key: x._id}})} 
                                    columns={columnas}
                                    pagination = {{
                                        align: "center",
                                        size: "small",
                                        position: ["topLeft"],
                                        showTotal: () => <b>Total de libros: {usuarios.length}</b>
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

function AltaUsuario() {
    const [roles, setRoles] = useState([])
    const [modalN, setModalN] = useState(false);
    const [formNuevo] = Form.useForm();
    const {esAdmin} = useContext(AuthContext);

    async function handle (v) {                
        try {
            v.fullName = `${v.apellido.toUpperCase()}, ${v.nombre}`;
            const id = JSON.parse(v.role)._id;
            v.role = id;
            const resp = await serv.crear("usuarios", v);
            message.success(
                <>
                    ¡Alta exitosa! <br />
                    ID: <b>{resp._id}</b> <br />
                    Número de DNI: <b>{resp.dni}</b> <br />
                    Nombre de usuario: <b>{resp.usr}</b> <br />
                    Nombre completo: <b>{resp.fullName}</b> <br />
                    Teléfono: <b>{resp.phone || "no tiene"}</b> <br />
                    Fecha de nacimiento: <b>{dayjs(resp.bornDate).format("DD/MM/YYYY") || "no tiene"}</b> <br />
                    Correo electrónico: <b>{resp.email}</b> <br />
                    Rol: <b>{resp.role.name}</b>
                </>
            );
            formNuevo.resetFields();
            setModalN(false);
            pegar();
        }
        catch (err) {
            console.error(err);
            if (err.response.data.code && err.response.data.code === 11000) {
                message.error(`El siguiente campo se encuentra repetido:\n${JSON.stringify(err.response.data.keyValue)}`);
            }
            else {
                message.error(err.message);
            }
        }
    };

    async function pegar () {
        try {
            const res = await serv.getAll('roles')
            if (esAdmin()) {
                setRoles(res);
            }
            else {                
                setRoles(res.filter(x => x.name != "Administrador"));
            }
            
        }
        catch (err) {
            console.error(err);
            message.error(err.message)
        }
    }    

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
                        form={formNuevo}
                        name="formNuevo"
                        onFinish={handle}                        
                    >
                        <Form.Item
                            name="dni"
                            label={<b>Número de DNI</b>}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Ingrese DNI"/>
                        </Form.Item>
                        <Form.Item
                            name="usr"                            
                            label= {<b>Nombre de usuario</b>}
                            rules={[{ required: true, },]}
                        >
                            <Input placeholder="Ingrese nombre de usuario" />
                        </Form.Item>
                        <Form.Item
                            name="pwd"
                            label={<b>Contraseña</b>}
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label={<b>Correo electrónico</b>}
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Ingrese correo" />
                        </Form.Item>
                        <Form.Item
                            name="nombre"
                            label={<b>Nombre</b>}
                            rules={[{required: true}]}
                        >
                            <Input placeholder="Ingrese nombre(s)" />
                        </Form.Item>
                        <Form.Item
                            name="apellido"
                            label={<b>Apellido</b>}
                            rules={[{ required: true, },]}
                        >
                            <Input placeholder="Ingrese apellido(s)" />
                        </Form.Item>                        
                        <Form.Item
                            name="phone"
                            label={<b>Teléfono</b>}
                        >
                            <Input placeholder="Ingrese teléfono" />
                        </Form.Item>
                        <Form.Item 
                            name="bornDate" 
                            label= {<b>Fecha de nacimiento</b>}
                            >
                            <DatePicker placeholder="Ingrese fecha"
                                needConfirm                                
                                maxDate = {dayjs()}
                                format = "DD/MM/YYYY"
                            />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label={<b>Rol</b>}
                            rules={[{required: true}]}
                        >
                            <Select
                                showSearch                                
                                placeholder="Ingrese rol"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    {roles.map(g => (
                                <Select.Option key={g._id} value = {JSON.stringify(g)}>
                                    {g.name}
                                </Select.Option>
                            ))}
                            </Select>
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link to = "../usuarios" className = "botonLink">
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
                                Número de DNI: <b>{formNuevo.getFieldValue("dni")}</b> <br/>
                                Nombre de usuario: <b>{formNuevo.getFieldValue("usr")}</b> <br/>
                                Correo electrónico: <b>{formNuevo.getFieldValue("email")}</b> <br/>
                                Nombre: <b>{formNuevo.getFieldValue("nombre")}</b> <br/>
                                Apellido: <b>{formNuevo.getFieldValue("apellido")}</b> <br/>
                                Teléfono: <b>{formNuevo.getFieldValue("phone")}</b> <br/>
                                Fecha de nacimiento: <b>{formNuevo.getFieldValue("bornDate") ? formNuevo.getFieldValue("bornDate").format("DD/MM/YYYY") : "no tiene"}</b> <br/>
                                Rol: <b>{formNuevo.getFieldValue("role") && JSON.parse(formNuevo.getFieldValue("role")).name}</b> <br/>                                
                            </Modal>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

function BajaUsuario() {
    const [usuarios, setUsuarios] = useState([])
    const [roles, setRoles] = useState([])
    const [usuarioM, setUsuarioM] = useState([])
    const [modif, setModif] = useState(null)
    const [modalM, setModalM] = useState(false);
    const [modalB, setModalB] = useState(false);
    const [despenalizar, setDespenalizar] = useState(false);
    const [formModif] = Form.useForm();
    const [formBorra] = Form.useForm();        

    async function pegar () {
        try {
            const resU = await serv.getAll('usuarios');
            setUsuarios(resU);
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de usuarios");
        }
        try {
            const resR = await serv.getAll('roles');
            setRoles(resR);
        }
        catch (err) {
            console.error(err);
            message.error("Problemas con el listado de roles");
        }
    }

    function reiniciar() {
        formBorra.resetFields();
        formModif.resetFields();
        setModif(false);
        setModalB(false);
        setModalM(false);        
        setUsuarioM(null);
    }    

    async function handleModif (v) {
        try {            
            if (v.role) {
                const x = JSON.parse(v.role);
                v.role = x._id;
            }            
            if (despenalizar) {
                v.penalizadoHasta = null;
            }
            v.id = usuarioM._id;            
            await serv.actualizar('usuarios', usuarioM._id, v);
            message.success("Modificación exitosa.");
            pegar();
            reiniciar();   
            setDespenalizar(false);
        }
        catch (err) {
            console.error(err);
            message.error(err.message);
        }
    };

    async function handleBorra (v) {
        try {
            const resp = await serv.borrar("usuarios", usuarioM._id);
            message.success(
                <>
                    <h3>¡Baja exitosa!</h3>
                    DNI: <b>{resp.dni}</b>  <br />
                    Nombre completo: <b>{resp.fullName}</b>  <br />
                    Nombre de usuario: <b>{resp.usr}</b>  <br />
                    Correo electrónico: <b>{resp.email}</b>  <br />
                    Teléfono: <b>{resp.phone || "no tiene"}</b>  <br />
                    Rol: <b>{resp.role? resp.role.name : "no tiene"}</b> <br />
                    Fecha de nacimiento: <b>{dayjs(resp.bornDate).format("DD/MM/YYYY") || "no tiene"}</b> <br />
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

    async function guardarID (v) {
        const u = JSON.parse(v);
        setUsuarioM(u);        
        setModif(false);
    }

    useEffect(() => {
        pegar();
    }, []);

    return (
        <div>
            <Row>
                <Col span = {24}>            
                    <h1>Buscar usuario</h1>
                    <Form
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 5 }}
                        form={formBorra}
                        name="formBajaUsuario"
                        onFinish={handleBorra}                        
                    >
                        <Form.Item 
                            name="usuario" 
                            label={<b>Usuario</b>} 
                            rules={[{ required: true}]}>
                            <Select
                                showSearch
                                onChange={guardarID}
                                placeholder="Ingrese usuario"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.dni ?? '').toLowerCase().localeCompare((optionB?.dni ?? '').toLowerCase())}
                            >    
                                {usuarios.map(u => (
                                    <Select.Option key={u._id} value={JSON.stringify(u)}>
                                        {`${u.dni} - ${u.fullName} (${u.role.name})`}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
                            <Link to = "../usuarios" className = "botonLink">
                                Volver
                            </Link>
                            <Button type="primary" htmlType="button" onClick={() => { setModif(!modif) }}>
                                Modificar
                            </Button>
                            <Button danger 
                                type="primary"
                                onClick={() => setModalB(true)}
                            >
                                Borrar usuario
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
                                {usuarioM && 
                                    <>
                                        DNI: <b>{usuarioM.dni}</b>  <br />
                                        Nombre completo: <b>{usuarioM.fullName}</b>  <br />
                                        Nombre de usuario: <b>{usuarioM.usr}</b>  <br />
                                        Correo electrónico: <b>{usuarioM.email}</b>  <br />
                                        Teléfono: <b>{usuarioM.phone || "no tiene"}</b>  <br />
                                        Rol: <b>{usuarioM.role? usuarioM.role.name : "no tiene"}</b> <br />
                                        Fecha de nacimiento: <b>{dayjs(usuarioM.bornDate).format("DD/MM/YYYY") || "no tiene"}</b> <br />
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
                            name="dni" 
                            label={<b>Número de DNI</b>}>
                            <Input placeholder={usuarioM.dni} />
                        </Form.Item>
                        <Form.Item 
                            name="fullName" 
                            label={<b>Nombre completo</b>} 
                        >
                            <Input placeholder= {usuarioM.fullName}/>
                        </Form.Item>
                        <Form.Item 
                            name="usr" 
                            label={<b>Nombre de usuario</b>} 
                        >
                            <Input placeholder= {usuarioM.usr}/>
                        </Form.Item>                    
                        <Form.Item 
                            name="phone" 
                            label={<b>Teléfono</b>} >
                            <Input placeholder={usuarioM.phone || "Ingrese teléfono"}/>
                        </Form.Item>
                        <Form.Item 
                            name="email" 
                            label={<b>Correo electrónico</b>}
                            >
                            <Input placeholder={usuarioM.email}/>
                        </Form.Item>
                        <Form.Item 
                            name="pwd" 
                            label={<b>Contraseña</b>} 
                            >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item 
                            name="bornDate" 
                            label={<b>Fecha de nacimiento</b>}
                            >                            
                            <DatePicker needConfirm
                                maxDate = {dayjs()}
                                format = "DD/MM/YYYY" 
                                placeholder={dayjs(usuarioM.bornDate).format("DD/MM/YYYY") || "Ingrese fecha"}
                            />                            
                        </Form.Item>
                        {usuarioM.role.name === "Socio" && 
                        <>
                            <Form.Item 
                                name="penalizadoHasta" 
                                label={<b>Penalizado hasta</b>}
                                >                            
                                <DatePicker needConfirm                                    
                                    format = "DD/MM/YYYY"
                                    disabled = {despenalizar} 
                                    placeholder={
                                        usuarioM.penalizadoHasta ? 
                                        dayjs(usuarioM.penalizadoHasta).format("DD/MM/YYYY") 
                                        : 
                                        "Ingrese fecha"
                                    }
                                />                            
                            </Form.Item>
                            <Form.Item
                                name= "despenalizar"
                                label = {<b>Despenalizar usuario</b>}
                                >
                                <Checkbox                                    
                                    onChange = {() => setDespenalizar(!despenalizar)}                                    
                                >
                                </Checkbox>
                            </Form.Item>
                        </>
                        }
                        <Form.Item 
                            name="role" 
                            label={<b>Rol</b>} 
                            >
                            <Select
                                showSearch
                                placeholder={usuarioM.role.name}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.cod ?? '').toLowerCase().localeCompare((optionB?.cod ?? '').toLowerCase())}
                            >    
                                {roles.map(r => (
                                    <Select.Option key={r._id} value = {JSON.stringify(r)}>
                                        {r.cod + ' - ' + r.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>                        
                        <Form.Item wrapperCol={{ offset: 3, span: 5, }}>
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
                                onOk={formModif.submit}
                            >
                                <>
                                    {formModif.getFieldValue("dni") && 
                                        <>Número de DNI nuevo: <b>{formModif.getFieldValue("dni")}</b><br/></>} 
                                    {formModif.getFieldValue("fullName") && 
                                        <>Nombre completo nuevo: <b>{formModif.getFieldValue("fullName")}</b><br/></>} 
                                    {formModif.getFieldValue("usr") && 
                                        <>Nombre de usuario nuevo: <b>{formModif.getFieldValue("usr")}</b><br/></>} 
                                    {formModif.getFieldValue("email") && 
                                        <>Correo electrónico nuevo: <b>{formModif.getFieldValue("email")}</b><br/></>} 
                                    {formModif.getFieldValue("phone") && 
                                        <>Teléfono nuevo: <b>{formModif.getFieldValue("phone")}</b><br/></>}
                                    {formModif.getFieldValue("role") && 
                                        <>Rol nuevo: <b>{JSON.parse(formModif.getFieldValue("role")).name}</b><br/></>}
                                    {formModif.getFieldValue("bornDate") && 
                                        <>Fecha de nacimiento nueva: <b>{dayjs(formModif.getFieldValue("bornDate")).format("DD/MM/YYYY")}</b><br/></>}
                                    {formModif.getFieldValue("pwd") &&
                                        <b>Se modificará la contraseña</b>}
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

export { Usuarios, AltaUsuario, BajaUsuario }