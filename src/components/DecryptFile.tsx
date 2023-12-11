import { Card, Flex } from "antd";
import { Button, Form, Input } from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function DecryptFile() {
  const { t } = useTranslation();
  const { onDecryptFile } = useVerification();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    setLoading(true);
    onDecryptFile(values["password"])
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
      .finally(() => {
        setLoading(false);
      });
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
            <div className="flex flex-col justify-center p-12">
              <p className="text-left font-bold text-xl mb-4">
                {t("decrypt.title")}
              </p>
              <p className="text-left text-lg text-gray-400">
                {t("decrypt.subtitle")}
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
                    label={t("decrypt.password")}
                    className="w-full"
                    rules={[{ required: true }]}
                  >
                    <Flex vertical={false} gap="small">
                      <Input type="password" />
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        {t("decrypt.submit")}
                      </Button>
                    </Flex>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default DecryptFile;
