import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🎾 Gerenciamento de Quadras de Tênis
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;

