import React, {  useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { Modal, message,Row,Col } from "antd";

import './index.css'
import {
  LoginOutlined,
  FileAddOutlined,
  ExclamationCircleOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import ClickOutside from "react-click-outside";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import routes from "./routes";
function Home() {
  const [expanded, setexpanded] = useState(false);
  const [style, setstyle] = useState(80);
  const [selectKey,setselectKey]=useState('add');
  const [footer,setfooter]=useState('none');
  let showRouter = (routes) => {
    var result = null;

    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        );
      });
    }
    return result;
  };

  const NavHeader = styled.div`
    display: ${(props) => (props.expanded ? "block" : "none")};
    white-space: nowrap;
    background-color: #225cc3;
    color: #fff;

    > * {
      color: inherit;
      background-color: inherit;
    }
  `;

  // height: 20px + 10px + 10px = 40px
  const NavTitle = styled.div`
    font-size: 1.5em;
    line-height: 20px;
    padding: 10px 0;
  `;

  // height: 20px + 4px = 24px;
  const NavSubTitle = styled.div`
    font-size: 1em;
    line-height: 20px;
    padding-bottom: 4px;
  `;
  const NavFooter = styled.div`
   font-size: 1.2em;
    line-height: 20px;
  position: fixed;
  margin-bottom: 10px;
    margin-left: 70px;
  bottom: 0;
  display:${footer}
`;
console.log(window.location.pathname.split('/')[1])
  const NavInfoPane = styled.div`
    float: left;
    width: 100%;
    padding: 10px 20px;
    background-color: #225cc3;
  `;

 
  function cancel(e) {
    console.log(e);
    message.error("Click on No");
  }
  function confirm() {
    Modal.confirm({
      title: "Đăng xuất",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có muốn đăng xuất hay không ? ...",
      okText: "Có",
      cancelText: "Không",
      cancelButtonProps: { type: "danger" },
      onOk() {
       window.location.pathname='/login'
      },
      onCancel() {
      },
    });
  }
  return (
    <div className="dvModal">
      <ClickOutside
        onClickOutside={() => {
          setexpanded(false);
          setstyle(80);
        }}
      >
        <Router>
          <Route
            render={({ location, history }) => (
              <React.Fragment>
                <SideNav
                  style={{
                    display:
                      window.location.pathname == "/login" ? "none" : "block",
                  }}
                  expanded={expanded}
                  onToggle={(expanded) => {
                    setexpanded(expanded);
                    if (expanded) {
                      setfooter('block')
                      setstyle(250);
                    } else {
                      setfooter('none')
                      setstyle(80);
                    }
                  }}
                  onSelect={(selected) => {
                 setselectKey(selected);
                 console.log(selected)
                    const to = "/" + selected;
                    if(selected==='login')
                    {
                      confirm();
                    }
                    if (location.pathname !== to && selected!='login') {
                      history.push(to);
                    }
                  }}
                >
                  <SideNav.Toggle />
                  <NavHeader expanded={expanded}>
                    <NavTitle>Side Navigation</NavTitle>
                    <NavSubTitle>Styled Side Navigation</NavSubTitle>
                  </NavHeader>
                  {expanded && (
                    <NavInfoPane>
                     
                    </NavInfoPane>
                  )}
                  <NavFooter>Version 2020</NavFooter>
                  <SideNav.Nav defaultSelected={window.location.pathname.split('/')[1]}>
                    <NavItem eventKey="add">
                      <NavIcon>
                        <FileAddOutlined style={{ fontSize: "1.25em" }} />
                      </NavIcon>
                      <NavText>Thêm báo cáo công việc</NavText>
                    </NavItem>
                    <NavItem eventKey="view">
                      <NavIcon>
                        <FolderViewOutlined style={{ fontSize: "1.25em" }} />
                      </NavIcon>
                      <NavText>Xem báo cáo công việc</NavText>
                    </NavItem>

                    <NavItem eventKey="login">
                      <NavIcon>
                        <LoginOutlined style={{ fontSize: "1.25em" }} />
                      </NavIcon>
                      <NavText>Đăng xuất</NavText>
                    </NavItem>
                  </SideNav.Nav>
                
                </SideNav>
                {" "}
                <main  style={{marginLeft:style}}>
                  <Row>
                    <Col span={24}>
                      
                    </Col>
                  </Row>
                  {showRouter(routes)}
                </main>
              </React.Fragment>
            )}
          />
        </Router>
      </ClickOutside>
    </div>
  );
}
export default Home;
