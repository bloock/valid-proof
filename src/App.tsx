import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import backgroundImage from "./assets/background.jpg";
import Main from "./Main";
import Information from "./Information";
import validProofLogo from "./assets/valid-proof.png";
import { DownOutlined } from "@ant-design/icons";

function App() {
  return (
    <Layout
      className="relative flex flex-col bg-cover bg-fixed overflow-auto snap-mandatory snap-y scroll-smooth"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Header
        className="absolute w-full bg-transparent"
        style={{ height: 64, paddingInline: 50 }}
      >
        <img className="py-4 px-4 z-0" src={validProofLogo} />
      </Header>
      <Content className="h-screen snap-center bg-transparent">
        <div className="relative h-full">
          <Main />
          <DownOutlined
            className="absolute bottom-4 left-1/2 cursor-pointer p-4 text-xl"
            onClick={() => {
              document.querySelector(`#info-section`)?.scrollIntoView();
            }}
          />
        </div>
      </Content>
      <Content className="snap-center min-h-screen bg-transparent">
        <Information />
      </Content>
    </Layout>
  );
}

export default App;
