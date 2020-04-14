import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Dropdown,
  Menu,
} from 'semantic-ui-react';
import 'semantic-ui-react/dist/semantic.min.css'
const FixedMenuLayout = () => (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          IRC
        </Menu.Item>
        <Menu.Item as={ Link } to= "/upload" >Create Material</Menu.Item>
        <Menu.Item as={ Link } to= "/assign-material" >Assign Material</Menu.Item>
        <Menu.Item as={ Link } to= "/create-group">Create Group</Menu.Item>
        <Menu.Item as={ Link } to= "/assign-doctor">Assign Group</Menu.Item>
        <hr />
        <Dropdown item simple text='Name of Logged In User'>
          <Dropdown.Menu>
            <Dropdown.Item>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Menu>

  </div>
)

export default FixedMenuLayout