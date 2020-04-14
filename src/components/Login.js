import React, {  useState } from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Form, Input, Button, Row, Col, notification,Spin,Alert } from 'antd'
import 'antd/dist/antd.css'
import '../index.css'
import { useHistory } from 'react-router-dom'
import datauser from '../data/user'
const axios = require('axios');
var Login = function () {
  let history = useHistory()
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [loading,setloading]=useState(false);

  const onFinish = values => {
    console.log('Success:', values)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  let back = e => {
    e.stopPropagation()
    history.goBack()
  }
  const showNotifi = (type, title, description) => {
    notification[type]({
      message: title,
      description: description
    })
  }
  const onLogin = () => {
    setloading(true)
    let uRL = `http://localhost:3002/api/user/${email}/${password}`
    axios
      .get(uRL)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setloading(false)
          showNotifi('success', 'Đăng nhập thành công', '');
          history.push({ pathname: '/home' });
              let user=[]
        user.push({email:email,password:password});
        localStorage.setItem('email', JSON.stringify(user))
        localStorage.setItem('show', true)
        } else {
          showNotifi('error', 'Tài khoản hoặc mật khẩu không đúng', '');
          setloading(false)
        }
        // console.log(response.data.statusCode);
      })
      .catch(function (error) {
        showNotifi('error', 'Lỗi server', 'Không thể kết nối tới server')
        setloading(false)
      })
    // const isLogin = false
    // localStorage.removeItem('email')
    // localStorage.removeItem('password')

    // var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    // if (!filter.test(email)) {
    //   return false
    // }
    // datauser.map(data => {
    //   if (data.email === email && data.password === password) {
    //     let user=[]
    //     user.push({email:email,password:password,name:data.name,permission:data.permission});
    //     history.push({ pathname: '/home' })
    //     localStorage.setItem('email', JSON.stringify(user))
    //     localStorage.setItem('show', true)
    //     return true;
    //   }
    // })
    // if (localStorage.getItem('email') === null) {
    //   showNotifi(
    //     'error',
    //     'Đăng nhập thất bại',
    //     'Email hoặc password không đúng'
    //   )
    // } else {
    //   showNotifi('success', 'Đăng nhập thành công', '')
    // }
  }
  return (
    <div className='dv'>
        <Spin tip="Loading..."  spinning={loading}>
      <Row>
        <Col span={12}  >

          <div className='dvFrmLogin'>
            <Form
              name='normal_login'
              className='login-form'
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item>
                <div className='frmTitle'> Đăng nhập</div>
              </Form.Item>
              <Form.Item
                name='username'
                rules={[
                  { required: true, message: 'Email không được trống' },
                  { type: 'email', message: 'Email không đúng định dạng' }
                ]}
               className="input"
              >
                <Input
                 size="large" 
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='Email'
                  style={{widows:220}}
                  onChange={e => {
                    setemail(e.target.value)
                  }}
                />
              </Form.Item>
              <Form.Item
                name='password'
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password
                 size="large" 
                  prefix={<LockOutlined className='site-form-item-icon' />}
                  type='password'
                  placeholder='Password'
                  onChange={e => {
                    setpassword(e.target.value)
                  }}
                />
              </Form.Item> <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='login-form-button'
                  onClick={onLogin}
                >
                  Log in
                </Button>
            
              </Form.Item>
        

           
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <div className='dvBg'></div>
        </Col>
      </Row>
      </Spin>
    </div>
  )
}
export default Login
