import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import i18n from "../../i18n";
import logo from "../../images/validProof_logo.jpg";
import "../../styles.css";

const Header = () => {
  const languages = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
  ];

  const [language, setLanguage] = useState(languages[0].label);

  const changeLanguageHandler = (lang: any) => {
    i18n.changeLanguage(lang);
    languages.filter((language) => {
      if (language.value === lang) {
        setLanguage(language.label);
      }
    });
  };

  return (
    <>
      <Navbar
        bg="white"
        style={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 7%)",
        }}
      >
        <div className="d-flex justify-content-between py-2 px-3 w-100 container-md">
          <Navbar.Brand href="#">
            <img alt="Card" src={logo} style={{ width: "140px" }} />
          </Navbar.Brand>

          <Nav>
            <NavDropdown title={language} id="basic-nav-dropdown">
              {languages.map((language) => {
                return (
                  <NavDropdown.Item
                    href="#"
                    onClick={() => changeLanguageHandler(language?.value)}
                  >
                    {language?.label}
                  </NavDropdown.Item>
                );
              })}
            </NavDropdown>
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
