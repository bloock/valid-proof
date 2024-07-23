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

export class IPFSCid {
  cidString: string;
  constructor(cidString: string) {
    this.cidString = cidString;
  }

  toString() {
    return this.cidString;
  }
}
