import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import backgroundImage from "./assets/fondoVP.svg";
import Main from "./Main";
import Information from "./Information";
import DecryptFilePassword from "./DecryptFilePassword";
import validProofLogo from "./assets/logo-ValidProf.svg";
import { DownOutlined } from "@ant-design/icons";
import DecryptFileUpload from "./DecryptFileUpload";
import VerifiedDocument from "./verifiedDocument";
import IntegrityDetails from "./IntegrityDetails";

function App() {
  return (
    <Layout
      className="relative flex flex-col bg-cover bg-fixed overflow-auto snap-mandatory snap-y scroll-smooth"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header
        className="absolute w-full bg-transparent"
        style={{ height: 64, paddingInline: 50 }}
      >
        <img className="py-8 px-4 z-0" src={validProofLogo} />
      </Header>
      <Content className="h-screen snap-center bg-transparent">
        <div className="relative h-full">
          <Main />
          <DownOutlined
            className="absolute bottom-4 left-1/2 cursor-pointer p-4 text-xl text-white"
            onClick={() => {
              document.querySelector(`#info-section`)?.scrollIntoView();
            }}
          />
        </div>
      </Content>
      <Content className="snap-center min-h-screen bg-transparent">
        <Information />
        <DecryptFilePassword />
        <DecryptFileUpload />
        <VerifiedDocument />
        <IntegrityDetails />
      </Content>
    </Layout>
  );
}

export default App;
