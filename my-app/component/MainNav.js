import { useState } from "react";
import { useRouter } from "next/router";
import { Navbar, Nav, Form, FormControl, Button,Container,NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { removeToken, readToken } from "@/lib/authenticate";
import { user } from "pg/lib/defaults";

export default function MainNav(){
    const router = useRouter();
    const [searchField, setSearchField] = useState("");
    const [isExpanded,setIsExpanded]=useState(false);
    const [searchHistory,setSearchHistory]=useAtom(searchHistoryAtom);
    let token = readToken();

  async function handleSubmit(event){
    event.preventDefault();
    if(searchField){
    router.push(`/artwork?title=true&q=${searchField}`);
    }
    setIsExpanded(false);
    setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
  };

  const handleClose=()=>{
    setIsExpanded(false);
  }

  const handleToggle=()=>{
    setIsExpanded(!isExpanded);
  }

  function logout(){
    setIsExpanded(false);
    removeToken();
    router.push(`/login`);
  }

    return(
        <>
        <Navbar className="fixed-top navbar-dark bg-dark" expand="lg" expanded={isExpanded}>
      <Container>
        <Navbar.Brand >Loveneet Kaur</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"onClick={handleClose}>
          <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} >Home</Nav.Link></Link>
          {token && (
            <>
            <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>
          
          <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Control
              type="text"
              placeholder="Search"
              className="me-2"
              value={searchField}
              onChange={(event)=>setSearchField(event.target.value)}
            />
          
            <Button type="submit" >Search</Button>
          </Form> 
          
          <NavDropdown title={`User Name`} id="basic-nav-dropdown">
          <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={handleClose} active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
          <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={handleClose} active={router.pathname === "/history"}>Search History</NavDropdown.Item></Link>
          <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
            </>
          )}
          </Nav>
          {!token && (
        <Nav>
          <Nav.Link href="/register" onClick={() => setExpanded(false)} active={router.pathname === '/register'}>Register</Nav.Link>
          <Nav.Link href="/login" onClick={() => setExpanded(false)} active={router.pathname === '/login'}>Login</Nav.Link>
        </Nav>
      )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br />
    <br />
        </>
    );
}