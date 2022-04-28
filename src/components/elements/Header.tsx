import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import i18n from "../../i18n";
import logo from "../../images/validProof_logo.jpg";
import "../../styles.css";

type ILanguage = {
  label: string;
  value: string;
};

const Header = () => {
  const languagesArray: ILanguage[] = [
    { label: "English", value: "en" },
    { label: "Español", value: "es" },
  ];

  const envLanguage = (window as any).env.LANGUAGE;

  let defaultLanguage = languagesArray[0];
  languagesArray.filter((language) => {
    if (language.value === envLanguage) {
      defaultLanguage = language;
    }
  });
  const [selectedLanguage, setSelectedLanguage] =
    useState<any>(defaultLanguage);

  const changeLanguageHandler = (lang: any) => {
    i18n.changeLanguage(lang.value);
    languagesArray.filter((item) => {
      if (item?.value === lang.value) {
        setSelectedLanguage(item);
      }
    });
  };

  return (
    <>
      <Navbar
        bg="white"
        className="fixed-top"
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
            <NavDropdown title={selectedLanguage.label} id="basic-nav-dropdown">
              {languagesArray.map((lang) => {
                return (
                  <NavDropdown.Item
                    href="#"
                    onClick={() => changeLanguageHandler(lang)}
                  >
                    {lang?.label}
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
