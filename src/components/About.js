import React, { Component } from 'react';
import {useHistory} from 'react-router-dom'
const modalStyle = {
    position: "absolute",
    background: "#fff",
    top: 5,
    height:"268px",
    left: "10%",
    right: "10%",
    padding: 15,
    border: "2px solid #444"
  };
function Modal(){
    let history=useHistory();
    let back = e => {
      
        e.stopPropagation();
        history.goBack();
      };
    return(

        <div
        style={modalStyle}
      >
        Edit Profile Modal!
        <button type="button" onClick={back}>
      Close
    </button>
      </div>
    );
}

class About extends Component {
  
    render() {
        return (
           <Modal/>
        );
    }
}

export default About;
