interface DirectoryResponse {
  Data: Data;
  Links: Link[];
}
interface Data {
  "/": {
    bytes: string;
  };
}

interface Link {
  Hash: {
    "/": string;
  };
  Name: string;
  Tsize: number;
}
