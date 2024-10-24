//import React from 'react';
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Checkbox, Form, Input, message } from 'antd';
import { AuthContext } from "../../components/AuthContext";

function Login() {

    const {login} = useContext(AuthContext);
    const nav = useNavigate();
    const [formLogin] = Form.useForm();

    async function handleSubmit (v) {
        try {
            await login(v.usr, v.pwd);
            formLogin.resetFields();
            nav("/");            
        }
        catch (err) {
            console.log(err);
            message.error(err.message);
        }
    };    

    return (
        <div>
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
                label="Usuario" 
                name="usr" 
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
        </div>
    )
}
export default Login;