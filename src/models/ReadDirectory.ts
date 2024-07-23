export type DirectoryResponse = {
  Data: Data;
  Links: Link[];
};
export type Data = {
  "/": {
    bytes: string;
  };
};

export type Link = {
  Hash: {
    "/": string;
  };
  Name: string;
  Tsize: number;
};
