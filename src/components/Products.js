import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Form,
  Select,
  DatePicker,
  Button,
  InputNumber,
  Row,
  Col,
  notification,
  Table
} from 'antd'
import 'antd/dist/antd.css'
import '../index.css'
import dataProject from '../data/projectname'
import moment, { localeData } from 'moment'

var Login = function () {
  const [form] = Form.useForm()
  const { Option } = Select
  const dateFormat = 'DD/MM/YYYY'
  const [date, setdate] = useState('')
  const [dataSource, setdataSource] = useState([])
  const [is, setis] = useState(false)
  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',

      editable: false
    },
    {
      title: 'Tiến đô (%)',
      width: '30%',
      dataIndex: 'age',
      editable: true
    }
  ]

  const EditableContext = React.createContext()

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef()
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }

    const save = async e => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <InputNumber
            defaultValue={100}
            min={1}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
          />
        </Form.Item>
      ) : (
        <div
          className='editable-cell-value-wrap'
          style={{
            paddingRight: 24
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }
  const handleSave = row => {
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    console.log(newData)

    setdataSource(newData)
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  function onChangeDate (date, dateString) {
    setdate(dateString)
  }
  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 }
  }

  function disabledDate (current) {
    return current && current > moment().endOf('day')
  }

  const showNotifi = (type, title, description) => {
    notification[type]({
      message: title,
      description: description
    })
  }
  const config = {
    rules: [{ type: 'object', required: true, message: 'Please select time!' }]
  }
  const clearData = () => {
    setdataSource([])
  }
  const addDataa = value => {
    const push = []
    let persent = 100 / value.length>>0
    console.log(persent)
    if (value.length === 1) {
      for (const val of value) {
    
        push.push({
          key: val,
          name: val,
          age: 100
        })
        setdataSource(push)
      }
    } else {
      for (const val of value) {
        push.push({
          key: val,
          name: val,
          age: persent
        })
      }
         push.map((item,index )=> {
          if(index===push.length-1)
          {
            item.age=(100-persent*value.length)+item.age
          }
        })
      setdataSource(push)
    }
  }
  function handleChange (value) {
    clearData()
    addDataa(value)
  }

  const onClick = () => {
    let push = []
    var chil = []
    var strPro = ''
    let LocalData = localStorage.getItem('data')
    let percent = 0
    let localUser = JSON.parse(localStorage.getItem('email'))
    for (let i = 0; i < dataSource.length; i++) {
      strPro += dataSource[i].name + ' - ' + dataSource[i].age + '%' + ', '
      percent += dataSource[i].age
      chil.push(dataSource[i].name)
    }

    if (date === '') {
      return
    }
    if (dataSource.length === 0) {
      showNotifi('error', 'Chưa chọn dự án cần báo cáo', '')
      return
    }
    if (percent < 100) {
      showNotifi('error', 'Tổng tiến độ trong ngày phải đạt 100% ', '')
      return
    }
    if (percent > 100) {
      showNotifi('error', 'Tổng tiến độ không được vượt quá 100%', '')
      return
    }

    if (LocalData != null) {
      let dataParse = JSON.parse(localStorage.getItem('data'))
      for (let i = 0; i < dataParse.length; i++) {
        push.push(dataParse[i])
      }
      for (let i = 0; i < push.length; i++) {
        if (date === push[i].date && localUser[0].email === push[i].reporter) {
          console.log('trung')
          showNotifi('error', 'Dữ liệu đã tồn tại', '')
          return
        }
      }
      push.push({
        key: push.length + 1,
        date: date,
        projectHistory: strPro,
        reporter: localUser[0].email,
        reportername: localUser[0].name,
        dataSource: dataSource,
        proArray: chil
      })
      localStorage.setItem('data', JSON.stringify(push))
      showNotifi('success', 'Thêm mới thành công', '')
      setdate('')
      form.resetFields()
      setdataSource([])
    } else {
      push.push({
        key: 1,
        date: date,
        projectHistory: strPro,
        reporter: localUser[0].email,
        reportername: localUser[0].name,
        dataSource: dataSource,
        proArray: chil
      })
      showNotifi('success', 'Thêm mới thành công', '')
      setdate('')
      form.resetFields()
      localStorage.setItem('data', JSON.stringify(push))
      setdataSource([])
    }
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }
  const columns_ = columns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave
      })
    }
  })
  return (
    <div className='dv'>
      <Row>
        <Col span={12}>
          <div className='dvFrm'>
            <h2>Thêm báo cáo công việc</h2>
            <Form {...layout} form={form}>
              <Form.Item name='date' {...tailLayout} label='Ngày' {...config}>
                <DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                  onChange={onChangeDate}
                />
              </Form.Item>{' '}
              <Form.Item {...tailLayout} label='Dự án' name='select'>
                <Select
                  mode='multiple'
                  style={{ width: '100%' }}
                  placeholder='select one project'
                  //   defaultValue={["china"]}
                  onChange={handleChange}
                  optionLabelProp='label'
                >
                  {dataProject.map(pro => (
                    <Option key={pro.name}>
                      <div className='demo-option-label-item'>{pro.name}</div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                scroll={{ y: 450 }}
                dataSource={dataSource}
                columns={columns_}
                style={{ width: '100%' }}
              />
              <Form.Item {...tailLayout}>
                <Button
                  style={{ marginLeft: '40%', marginTop: 20, width: 220 }}
                  className='input'
                  type='primary'
                  htmlType='submit'
                  onClick={onClick}
                >
                  Tạo báo cáo
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <div className='dvBg'></div>
        </Col>
      </Row>
    </div>
    // <div style={{ marginTop: '2%' }}>
    //   <Row>
    //     <Col span={10} style={{ marginLeft: '5%' }}>
    //       {' '}
    //       <Form {...layout} form={form}>
    //         <Form.Item name='date' {...tailLayout} label='Ngày' {...config}>
    //           <DatePicker
    //             format={dateFormat}
    //             disabledDate={disabledDate}
    //             style={{ width: '100%' }}
    //             onChange={onChangeDate}
    //           />
    //         </Form.Item>{' '}
    //         <Form.Item {...tailLayout} label='Dự án' name='select'>
    //           <Select
    //             mode='multiple'
    //             style={{ width: '100%' }}
    //             placeholder='select one project'
    //             //   defaultValue={["china"]}
    //             onChange={handleChange}
    //             optionLabelProp='label'
    //           >
    //             {dataProject.map(pro => (
    //               <Option key={pro.name}>
    //                 <div className='demo-option-label-item'>{pro.name}</div>
    //               </Option>
    //             ))}
    //           </Select>
    //         </Form.Item>
    //         <Table
    //           components={components}
    //           rowClassName={() => 'editable-row'}
    //           bordered
    //           scroll={{ y: 450 }}
    //           dataSource={dataSource}
    //           columns={columns_}
    //           style={{ width: '100%' }}
    //         />
    //         <Form.Item {...tailLayout}>
    //           <Button
    //             style={{ marginLeft: '40%', marginTop: 20, width: 220 }}
    //             className='input'
    //             type='primary'
    //             htmlType='submit'
    //             onClick={onClick}
    //           >
    //             Tạo báo cáo
    //           </Button>
    //         </Form.Item>
    //       </Form>
    //     </Col>{' '}
    //     <Col span={13}>  <div className='dvBg'></div></Col>
    //   </Row>
    // </div>
  )
}
export default Login
