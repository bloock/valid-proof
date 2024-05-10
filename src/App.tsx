import { ConfigProvider, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { AliasToken } from "antd/es/theme/interface";
import backgroundImage from "./assets/images/fondoVP.svg";
import validProofLogo from "./assets/images/logo-ValidProf.svg";
import { VerificationProvider } from "./providers/VerificationProvider";

function App() {
  const styleToken: Partial<AliasToken> = {
    colorPrimary: import.meta.env.VITE_PRIMARY_COLOR || "#0084B8",
    fontFamily: import.meta.env.VITE_FONT_FAMILY || "Montserrat, sans-serif",
  };

  const componentToken = {
    Steps: {},
  };

  return (
    <ConfigProvider
      theme={{
        token: styleToken,
        components: componentToken,
      }}
    >
      <Layout
        className="relative flex flex-col bg-cover bg-fixed"
        style={{
          backgroundImage: `url(${
            import.meta.env.VITE_BACKGROUND_IMAGE
              ? import.meta.env.VITE_BACKGROUND_IMAGE
              : backgroundImage
          })`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header
          className="absolute w-full bg-transparent"
          style={{ height: 64, paddingInline: 50 }}
        >
          <img
            className="py-8 px-4 z-0"
            src={
              import.meta.env.VITE_LOGO
                ? import.meta.env.VITE_LOGO
                : validProofLogo
            }
          />
        </Header>
        <Content className="min-h-screen bg-transparent">
          <VerificationProvider />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
