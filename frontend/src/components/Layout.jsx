import React from 'react';
import { Navbar, Nav, NavItem, Container } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

import {client} from "@inc/AxiosInterceptor.js";

function Layout()
{
    return (<div className="container-fluid">
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Lachesis</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/character" className="nav-link">Character</Link>
                        </Nav>
                        <Nav className="ml-auto">
                            User links
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
        <main>
            <Outlet />
        </main>
    </div>);
}

export default Layout;