import { Card, Flex, Upload, UploadProps } from "antd";
import { Button, Form, Input } from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import {
  LocalKey,
  LocalCertificate,
  ManagedKey,
  ManagedCertificate,
} from "@bloock/sdk";
import { RcFile } from "antd/es/upload";

function DecryptFile() {
  const { t } = useTranslation();
  const { encryptionDetails, service, onDecryptFile } = useVerification();
  const [loading, setLoading] = useState(false);
  const [certificateFile, setCertificateFile] = useState<RcFile | undefined>();
  const [showCertificatePassword, setShowCertificatePassword] = useState(false);

  const [form] = Form.useForm();

  const submit = (
    key: LocalKey | LocalCertificate | ManagedKey | ManagedCertificate
  ): Promise<boolean> => {
    setLoading(true);
    return onDecryptFile(key).finally(() => {
      setLoading(false);
    });
  };

  const inputManager = (): React.ReactNode => {
    if (encryptionDetails?.mode === "MANAGED") {
      return managedKeyInput();
    } else if (encryptionDetails?.mode === "LOCAL") {
      if (encryptionDetails?.type === "SYMMETRIC") {
        return localKeyInput();
      } else if (encryptionDetails?.type === "ASYMMETRIC") {
        return localCertificateInput();
      }
    }

    return null;
  };

  const managedKeyInput = (): React.ReactNode => {
    const onFinish = (values: any) => {
      let keyId = values["key-id"];
      service
        .loadManagedKey(keyId)
        .then((key) => {
          return submit(key);
        })
        .then((ok) => {
          if (!ok) {
            form.setFields([
              {
                name: "key-id",
                errors: [t("decrypt.error.invalid-key")],
              },
            ]);
          }
        })
        .catch(() => {
          form.setFields([
            {
              name: "key-id",
              errors: [t("decrypt.error.invalid-key")],
            },
          ]);
        });
    };

    return (
      <div className="flex flex-col justify-center p-12">
        <p className="text-left font-bold text-xl mb-4">
          {t("decrypt.managed-key.title")}
        </p>
        <p className="text-left text-lg text-gray-400">
          {t("decrypt.managed-key.subtitle")}
        </p>

        <Form
          className="flex w-full p-2 pt-8"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <div className="flex w-full">
            <Form.Item
              name="key-id"
              label={t("decrypt.managed-key.label")}
              className="w-full"
              rules={[{ required: true }]}
            >
              <Flex vertical={false} gap="small">
                <Input />
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t("decrypt.submit")}
                </Button>
              </Flex>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  const localKeyInput = (): React.ReactNode => {
    const onFinish = (values: any) => {
      let keyId = values["password"];
      service
        .loadLocalKey(keyId)
        .then((key) => {
          return submit(key);
        })
        .then((ok) => {
          if (!ok) {
            form.setFields([
              {
                name: "password",
                errors: [t("decrypt.error.invalid-key")],
              },
            ]);
          }
        })
        .catch(() => {
          form.setFields([
            {
              name: "password",
              errors: [t("decrypt.error.invalid-key")],
            },
          ]);
        });
    };

    return (
      <div className="flex flex-col justify-center p-12">
        <p className="text-left font-bold text-xl mb-4">
          {t("decrypt.local-key.title")}
        </p>
        <p className="text-left text-lg text-gray-400">
          {t("decrypt.local-key.subtitle")}
        </p>

        <Form
          className="flex w-full p-2 pt-8"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <div className="flex w-full">
            <Form.Item
              name="password"
              label={t("decrypt.local-key.label")}
              className="w-full"
              rules={[{ required: true }]}
            >
              <Flex vertical={false} gap="small">
                <Input type="password" />
                <Button type="primary" htmlType="submit" loading={loading}>
                  {t("decrypt.submit")}
                </Button>
              </Flex>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  const localCertificateInput = (): React.ReactNode => {
    const acceptedFileTypes = [
      { mime: "application/x-x509-ca-cert", extension: ".pem" },
      { mime: "application/x-pkcs12", extension: ".p12" },
      { mime: "application/x-pkcs12", extension: ".pfx" },
    ];

    const fileNeedsPassword = (file: Blob): boolean => {
      switch (file.type) {
        case "application/x-pkcs12":
          return true;
        default:
          return false;
      }
    };

    const normFile = (e: any) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const onFinish = (values: any) => {
      let password = values["password"];

      if (!certificateFile) {
        form.setFields([
          {
            name: "file",
            errors: [t("decrypt.error.no-certificate-selected")],
          },
        ]);
        return;
      }

      console.log(certificateFile, password);

      service
        .loadLocalCertificate(certificateFile, password)
        .then((key) => {
          return submit(key);
        })
        .then((ok) => {
          if (!ok) {
            form.setFields([
              {
                name: "file",
                errors: [t("decrypt.error.invalid-key")],
              },
            ]);
          }
        })
        .catch((error: any) => {
          console.log(error);
          form.setFields([
            {
              name: "file",
              errors: [t("decrypt.error.invalid-key")],
            },
          ]);
        });
    };

    const props: UploadProps = {
      accept: acceptedFileTypes.map((t) => t.extension).join(","),
      maxCount: 1,
      multiple: false,
      showUploadList: false,
      beforeUpload: (file) => {
        setCertificateFile(file);
        setShowCertificatePassword(fileNeedsPassword(file));
        return false;
      },
    };

    return (
      <div className="flex flex-col justify-center p-12">
        <p className="text-left font-bold text-xl mb-4">
          {t("decrypt.local-certificate.title")}
        </p>
        <p className="text-left text-lg text-gray-400">
          {t("decrypt.local-certificate.subtitle")}
        </p>

        <Form
          className="flex w-full p-2 pt-8"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <div className="flex flex-col w-full">
            <Form.Item
              name="file"
              label={t("decrypt.local-certificate.label")}
              className="w-full"
              rules={[{ required: true }]}
              valuePropName="file"
              getValueFromEvent={normFile}
            >
              <Upload className="pr-3" {...props}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <Button icon={<UploadOutlined />}>
                    {t("decrypt.local-certificate.select-file")}
                  </Button>
                  {certificateFile && (
                    <p className="py-3 md:px-3">{certificateFile.name}</p>
                  )}
                </div>
              </Upload>
            </Form.Item>
            {showCertificatePassword && (
              <Form.Item
                name="password"
                label={t("decrypt.local-certificate.password")}
              >
                <Input type="password" />
              </Form.Item>
            )}
            <Button type="primary" htmlType="submit" loading={loading}>
              {t("decrypt.submit")}
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className=" p-4">
        <div className="flex flex-wrap justify-center">
          <Card
            className="m-10 sm:w-72 md:w-80 lg:w-96 xl:w-2/4"
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
          >
            {inputManager()}
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default DecryptFile;
