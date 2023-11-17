import { Card } from "antd";
import React from "react";
import type { FormInstance } from "antd";
import { Button, Form, Input, Space } from "antd";

function DecryptFilePassword() {
  const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    React.useEffect(() => {
      form.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
    }, [values]);

    return (
      <Button type="primary" htmlType="submit" disabled={!submittable}>
        Submit
      </Button>
    );
  };

  const [form] = Form.useForm();

  return (
    <div>
      <div className=" p-4">
        <div className="text-center text-white text-custom-size font-montserrat p-4">
          <p>- DecryptFile -</p>
        </div>
        <div className="flex flex-wrap justify-center">
          <Card
            className="m-10 sm:w-72 md:w-80 lg:w-96 xl:w-2/4 sm:h-64 md:h-72 lg:h-80 xl:h-96"
            style={{
              width: "1000px",
              height: "400px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
          >
            <div className="flex flex-col justify-center p-12">
              <p className="text-left font-bold text-xl mb-4">Decrypt File</p>
              <p className="text-left text-lg text-gray-500">
                Please, introduce your{" "}
                <strong className="font-bold">password</strong>, <br />
                to decrypt the file and continue with the validation process.
              </p>

              <Form
                className="mb-4 w-full p-2 py-8"
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  className="mb-4 w-full"
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                  style={{
                    width: "750px",
                    height: "50px",
                  }}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <SubmitButton form={form} />
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DecryptFilePassword;
