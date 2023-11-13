import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

function Login() {
    const onFinish = (values) => {
        console.log('Success:', values);
        alert("Inicio de sesión correcto.");
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        alert("Problemas al iniciar sesión, por favor intente nuevamente.");
    };
    return <>
        <Form name="basic" labelCol={{span: 8,}} wrapperCol={{span: 16,}} 
              style={{maxWidth: 600,}} initialValues={{remember: true,}} 
              onFinish={onFinish} 
              onFinishFailed={onFinishFailed} 
              autoComplete="off"              
              >
            <Form.Item 
              label="Usuario" 
              name="username" 
              rules={[{
                required: true, 
                message: 'Please input your username!',
                },
            ]}>
                <Input />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{
                required: true,
                message: 'Please input your password!',
                    },
            ]}>
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Checkbox>Recordar cuenta</Checkbox>
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
}
export default Login;