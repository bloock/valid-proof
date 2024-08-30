import { Button, Card, List } from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import { useTranslation } from "react-i18next";
import { IPFSCid } from "../models/ReadDirectory";
import { ArrowRightCircle } from "iconoir-react";
import { Icon } from "react-extension-icons";
import { CloseOutlined } from "@ant-design/icons";

function DirectoryPreview() {
  const { t } = useTranslation();

  const { directoryResponse, onInputChange, isLoading, error, reset } =
    useVerification();

  return (
    <Wrapper>
      <div className=" p-4 w-full sm:w-3/4 md:w-2/3 lg:w-2/3 xl:w-2/4">
        <div className="flex flex-wrap justify-center  ">
          <Card
            className="m-10 p-4"
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
            extra={
              <Button
                type="text"
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => reset()}
              />
            }
          >
            <h2 className="text-center mb-4">{t("directory.title")}</h2>
            <List loading={isLoading}>
              {directoryResponse?.Links.map((item, key) => (
                <List.Item
                  onClick={() => onInputChange(new IPFSCid(item.Hash["/"]))}
                  key={key}
                >
                  <Card
                    hoverable
                    className="w-full"
                    bodyStyle={{ padding: 12 }}
                  >
                    <div className="flex items-center">
                      <Icon
                        className="mr-3"
                        extension={item.Name.split(".", -1)[1]}
                        size={32}
                      />
                      <div className="w-full flex justify-between">
                        <p className="p-0 text-ellipsis overflow-hidden ">
                          {item.Name}{" "}
                        </p>
                        <ArrowRightCircle />
                      </div>
                    </div>
                  </Card>
                </List.Item>
              ))}

              {error && (
                <p className="text-center mt-10 text-red-400">
                  {t("directory.error")}
                </p>
              )}
            </List>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default DirectoryPreview;
