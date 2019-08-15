import React, { useState } from 'react';
import { Collapse,Navbar,NavbarToggler,
    NavbarBrand,Nav, NavItem } from 'reactstrap';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';


const Menu = () => {

    const [isOpen, setIsOpen] = useState(false);

    const cookDel = (e) => {
        e.preventDefault();
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' })
        cookies.remove('name', { path: '/' })
        document.location.reload();
    }
    
    return ( 
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/admin">Мастер и Модель</NavbarBrand>
          <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link  onClick={(e)=> cookDel(e)} className='nav-link' to="/login">Выйти</Link>
              </NavItem>
              <NavItem>
                <Link className='nav-link' to="/profile/">Профиль</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
     );
}
 
export default Menu;