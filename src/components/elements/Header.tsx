import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import logo from "../../images/validProof_logo.jpg";
import "../../styles.css";

const Header = () => {
  return (
    <>
      <div className="fixed-top bg-white">
        <div className="container-md px-4 py-2 pt-4 d-flex align-items-center justify-content-between">
          <img alt="Card" src={logo} />
        </div>

        <Divider
          className="mb-0"
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 15%)",
          }}
        />
      </div>
    </>
  );
};

export default Header;
