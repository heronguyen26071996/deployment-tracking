import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { useHistory } from 'react-router-dom'
import { Table, Popconfirm,Tag } from 'antd'
function Report () {
  let dataParse = JSON.parse(localStorage.getItem('data'))
  let localUser = JSON.parse(localStorage.getItem('email'))
  let data = []
  if (localUser[0].email == 'admin@gmail.com') {
    data = dataParse
  } else {
    data = dataParse.filter(item => item.reporter == localUser[0].email)
  }
  let history = useHistory()
  const handleDelete = key => {
    console.log(key)
    history.push({ pathname: `/edt/${key}` })
  }
  var tempDate = new Date();
  var date = tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear()
  
  const currDate = "Current Date= "+date;
  console.log(date)
  console.log(data)
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      width:180
    },
    {
      title: 'Người báo cáo',
      dataIndex: 'reportername',
      width:320
    },
    {
      title: 'Nội dung báo cáo',
      dataIndex: 'projectHistory',
      render:(record)=>{
          
         // console.log(record,record.split(','));
          return record.split(',').map(project=>{
              return<Tag color="cyan">{project}</Tag>
          })
      }
    },

    {
      title: '',
      dataIndex: 'operation',
        width:120,
      render: (text, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title='Sure to edit?'
            onConfirm={() => handleDelete(record.key)}>
            <a>Chỉnh sửa</a>
          </Popconfirm>
        ) : null
    
    },
    
  ]  
  

  return (
    <div className='dv' style={{marginTop:40,marginLeft:40,marginRight:40}}>
    <h2>Thông tin báo cáo</h2>
      <Table columns={columns} dataSource={data} size='small' bordered />
    </div>
  )
}
export default Report
