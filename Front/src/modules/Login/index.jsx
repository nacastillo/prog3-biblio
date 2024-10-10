//import React from 'react';
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Checkbox, Form, Input, message } from 'antd';
import { AuthContext } from "../../components/AuthContext";
import lbServ from '../../services/librapi'

async function loguear (v) {
    console.log(v);
    lbServ.login(v.email,v.pwd);
}

function Login() {

    const {login} = useContext(AuthContext);
    const nav = useNavigate();
    const [formLogin] = Form.useForm();

    async function handleSubmit (v) {
        try {
            await login(v.email, v.pwd);
            formLogin.resetFields();
            nav("/");
            /*
            console.log("v es:");
            console.log(v);
            const resp = await lbServ.login(v.email,v.pwd);
            console.log(resp);
            */
        }
        catch (err) {
            console.log(err);
            message.error(err.message);
        }
    };    

    return (
        <>
            <h1>Iniciar sesión</h1>
            <Form 
                form = {formLogin}
                name="basic" 
                labelCol={{span: 8,}}
                wrapperCol={{span: 16,}}
                style={{maxWidth: 600,}}
                onFinish={handleSubmit}
                autoComplete="off"
                >
                <Form.Item 
                label="Correo" 
                name="email" 
                rules={[{
                    required: true, 
                    message: 'Ingrese usuario',
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                label="Contraseña"
                name="pwd"
                rules={[{
                    required: true,
                    message: 'Ingrese contraseña',
                }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Iniciar sesión
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
export default Login;