import { Card, List } from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import { useTranslation } from "react-i18next";
import { fileTypeImage } from "../utils/utils";
import { ArrowDownRightCircle, ArrowRightCircle } from "iconoir-react";

function DirectoryPreview() {
  const { t } = useTranslation();

  const { directoryResponse, onInputChange } = useVerification();

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
          >
            <h2 className="text-center mb-4">{t("directory.title")}</h2>
            <List>
              {directoryResponse?.Links.map((item, key) => (
                <List.Item
                  onClick={() => onInputChange(item.Hash["/"])}
                  key={key}
                >
                  <Card
                    hoverable
                    className="w-full"
                    bodyStyle={{ padding: 12 }}
                  >
                    <div className="flex">
                      <img
                        width={20}
                        className="mr-4"
                        src={`src/assets/images/file-types/${fileTypeImage(
                          item.Name.split(".", -1)[1]
                        )}.png`}
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
            </List>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default DirectoryPreview;
