import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Form,
  Select,
  DatePicker,
  Button,
  InputNumber,
  Row,
  Col,
  notification,
  Table,
} from "antd";
import { useParams } from "react-router-dom";

import "antd/dist/antd.css";
import "../index.css";
import dataProject from "../data/projectname";
import moment, { localeData } from "moment";

var Login = function () {
  const [form] = Form.useForm();
  const { Option } = Select;
  const dateFormat = "DD/MM/YYYY";
  let { id } = useParams();
  let dataParse = JSON.parse(localStorage.getItem("data"));
  const [date, setdate] = useState([]);
  const [defaultval, setdefaultval] = useState([]);
  const [dataSource, setdataSource] = useState(
    dataParse.filter((item) => item.key == id)[0].dataSource
  );
  const [is, setis] = useState(false);
  const columns = [
    {
      title: "Tên dự án",
      dataIndex: "name",

      editable: false,
    },
    {
      title: "Tiến độ trong ngày (%)",
      width: "20%",
      dataIndex: "age",
      editable: true,
    },
  ];
  dataParse.map((item) => {
    if (item.key == 1) {
      return item;
    }
  });
  const EditableContext = React.createContext();

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async (e) => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <InputNumber
            defaultValue={100}
            min={1}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData);

    setdataSource(newData);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  function onChangeDate(date, dateString) {
    setdate(dateString);
  }
  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  };

  function disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  const showNotifi = (type, title, description) => {
    notification[type]({
      message: title,
      description: description,
    });
  };
  const config = {
    rules: [{ type: "object", required: true, message: "Please select time!" }],
  };
  const clearData = () => {
    setdataSource([]);
  };
  const addDataa = (value) => {
    const push = [];
    for (const val of value) {
      push.push({
        key: val,
        name: val,
        age: 1,
      });
      push.map((item) => {
        for (let i = 0; i < dataSource.length; i++) {
          console.log();
          if (item.name == dataSource[i].name) {
            console.log("chay");
            item.age = dataSource[i].age;
          }
        }
      });
      setdataSource(push);
    }
  };
  function handleChange(value) {
    clearData();
    addDataa(value);
  }

  const onClick = () => {
    let push = [];
    var strPro = "";
    var chil = [];
    let LocalData = localStorage.getItem("data");
    let percent = 0;
    let localUser = JSON.parse(localStorage.getItem("email"));
    for (let i = 0; i < dataSource.length; i++) {
      strPro += dataSource[i].name + " - " + dataSource[i].age + "%" + ", ";
      percent += dataSource[i].age;
      chil.push(dataSource[i].name);
    }

    if (date === "") {
      return;
    }
    if (dataSource.length === 0) {
      showNotifi("error", "Chưa chọn dự án cần báo cáo", "");
      return;
    }
    if (percent < 100) {
      showNotifi("error", "Tổng tiến độ trong ngày phải đạt 100% ", "");
      return;
    }
    if (percent > 100) {
      showNotifi("error", "Tổng tiến độ không được vượt quá 100%", "");
      return;
    }

    let dataParse = JSON.parse(localStorage.getItem("data"));
    for (let i = 0; i < dataParse.length; i++) {
      push.push(dataParse[i]);
    }
    push.map((item) => {
      if (item.key == id) {
        item.projectHistory = strPro;
        item.dataSource = dataSource;
        item.proArray = chil;
      }
    });
    showNotifi("success", "Cập nhật thành công", "");
    localStorage.setItem("data", JSON.stringify(push));
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns_ = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <div className="dv">
      <Row>
        <Col span={12}>
        
          <div className="dvFrm">
          <h2>Chỉnh sửa thông tin báo cáo</h2>
            <Form {...layout} form={form}>
            
              <Form.Item name="date" {...tailLayout} label="Ngày">
                <DatePicker
                  disabled
                  format={dateFormat}
                  disabledDate={disabledDate}
                  style={{ width: "100%" }}
                  onChange={onChangeDate}
                  defaultValue={moment(
                    dataParse.filter((item) => item.key == id)[0].date,
                    dateFormat
                  )}
                  //   defaultValue={dataParse.filter(item=>item.key==id)[0].date}
                />
              </Form.Item>{" "}
              <Form.Item {...tailLayout} label="Dự án" name="select">
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="select one project"
                  defaultValue={
                    dataParse.filter((item) => item.key == id)[0].proArray
                  }
                  onChange={handleChange}
                  optionLabelProp="label"
                >
                  {dataProject.map((pro) => (
                    <Option key={pro.name}>
                      <div className="demo-option-label-item">{pro.name}</div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                scroll={{ y: 450 }}
                dataSource={dataSource}
                columns={columns_}
                style={{ width: "100%" }}
              />
              <Form.Item {...tailLayout}>
                <Button
                  style={{ marginLeft: "40%", marginTop: 20, width: 220 }}
                  className="input"
                  type="primary"
                  htmlType="submit"
                  onClick={onClick}
                >
                  Cập nhật báo cáo
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <div className="dvBg"></div>
        </Col>
      </Row>
    </div>
    // <div style={{ marginTop: '2%' }}>
    //   <Row>
    //     <Col span={10} style={{ marginLeft: '5%' }}>
    //       {' '}
    //       <Form {...layout} form={form}>
    //         <Form.Item
    //           {...tailLayout}
    //           label='Chỉnh sửa báo cáo'
    //           style={{ fontWeight: 'bold', fontSize: 24 }}
    //         ></Form.Item>
    //         <Form.Item name='date' {...tailLayout} label='Ngày'>
    //           <DatePicker disabled
    //             format={dateFormat}
    //             disabledDate={disabledDate}
    //             style={{ width: '100%' }}
    //             onChange={onChangeDate}
    //             defaultValue={moment(
    //               dataParse.filter(item => item.key == id)[0].date,
    //               dateFormat
    //             )}
    //             //   defaultValue={dataParse.filter(item=>item.key==id)[0].date}
    //           />
    //         </Form.Item>{' '}
    //         <Form.Item {...tailLayout} label='Dự án' name='select'>
    //           <Select
    //             mode='multiple'
    //             style={{ width: '100%' }}
    //             placeholder='select one project'
    //             defaultValue={
    //               dataParse.filter(item => item.key == id)[0].proArray
    //             }
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
    //             Cập nhật báo cáo
    //           </Button>
    //         </Form.Item>
    //       </Form>
    //     </Col>{' '}
    //     <Col span={8}>222222222222</Col>
    //   </Row>
    // </div>
  );
};
export default Login;
