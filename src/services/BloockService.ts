import { AesDecrypter, BloockClient, Record } from "@bloock/sdk";
import { convertAnchorNetworkToNetwork, waitRandomTime } from "../utils/utils";
import {
  IntegrityDetails,
  AuthenticityDetails,
  EncryptionDetails,
  IntegrityNetwork,
  AvailabilityDetails,
} from "../models/VerificationResult";
import { filetypemime } from "magic-bytes.js";

export default class BloockService {
  private bloockClient: BloockClient;

  constructor() {
    this.bloockClient = new BloockClient(import.meta.env.VITE_API_KEY);
  }

  public async loadFile(bytes: Uint8Array): Promise<Record> {
    return await this.bloockClient.RecordClient.fromFile(bytes).build();
  }

  public async checkIntegrity(bytes: Uint8Array): Promise<IntegrityDetails> {
    await waitRandomTime(500, 800);

    let record: Record;
    let details: IntegrityDetails = {
      enabled: false,
      hash: "",
      valid: false,
    };

    try {
      record = await this.loadFile(bytes);
      const hash = await record.getHash();

      details.hash = hash;
    } catch (err) {
      details.error = this.parseError(err);
      return details;
    }

    try {
      const proof = await this.bloockClient.IntegrityClient.getProof([record]);
      if (proof) {
        details.enabled = true;
      }
      const root = await this.bloockClient.IntegrityClient.verifyProof(proof);

      const networks: IntegrityNetwork[] = [];
      for (let i = 0; i < proof.anchor.networks.length; i++) {
        const network = proof.anchor.networks[i];
        const timestamp = await this.bloockClient.IntegrityClient.validateRoot(
          root,
          convertAnchorNetworkToNetwork(network)
        );
        networks.push({
          name: network.name,
          status: network.state,
          timestamp,
          txHash: network.txHash,
          anchorId: proof.anchor.anchorID,
          root: proof.anchor.root,
        });
      }

      details.networks = networks;

      const globalTimetamp = networks.reduce((prev, curr) => {
        if (prev < curr.timestamp) {
          return curr.timestamp;
        }
        return prev;
      }, 0);

      details.timestamp = globalTimetamp;

      const valid = networks.some((n) => n.timestamp > 0);
      details.valid = valid;

      return details;
    } catch (err) {
      return details;
    }
  }

  public async checkAuthenticity(
    bytes: Uint8Array
  ): Promise<AuthenticityDetails> {
    await waitRandomTime(500, 800);

    let details: AuthenticityDetails = {
      enabled: false,
      valid: false,
      signatures: [],
    };

    try {
      const record = await this.loadFile(bytes);
      const signatures =
        await this.bloockClient.AuthenticityClient.getSignatures(record);

      if (signatures.length > 0) {
        details.enabled = true;
        details.signatures = signatures.map((signature) => {
          return {
            signAlg: signature.alg,
            key: signature.kid,
            signature: signature.signature,
          };
        });

        const valid = await this.bloockClient.AuthenticityClient.verify(record);
        details.valid = valid;
      }

      return details;
    } catch (err) {
      details.error = this.parseError(err);
      return details;
    }
  }

  public async checkEncryption(bytes: Uint8Array): Promise<EncryptionDetails> {
    await waitRandomTime(500, 800);

    let details: EncryptionDetails = {
      enabled: false,
    };

    try {
      await this.loadFile(bytes);
      return details;
    } catch (err) {
      let error = this.parseError(err);
      if (error.includes("Cannot create record from an encrypted document")) {
        details.enabled = true;
        return details;
      } else {
        details.error = error;
        return details;
      }
    }
  }

  public async decryptFile(
    bytes: Uint8Array,
    key: string
  ): Promise<Uint8Array> {
    await waitRandomTime(500, 800);

    let record = await this.bloockClient.RecordClient.fromFile(bytes)
      .withDecrypter(new AesDecrypter(key))
      .build();
    return record.retrieve();
  }

  public async readFile(file: File): Promise<AvailabilityDetails> {
    await waitRandomTime(500, 800);
    let buffer: Uint8Array = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(new Uint8Array(event.target.result as ArrayBuffer));
        } else {
          reject(new Error("Failed to read file."));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });

    return this.readBuffer(buffer, {
      filename: file.name,
    });
  }

  public async readUrl(url: URL): Promise<AvailabilityDetails> {
    await waitRandomTime(500, 800);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const buffer = new Uint8Array(await response.arrayBuffer());
    return this.readBuffer(buffer, {
      filename: url.pathname,
      link: url.toString(),
    });
  }

  public async readBuffer(
    buffer: Uint8Array,
    defaults?: Partial<AvailabilityDetails>
  ): Promise<AvailabilityDetails> {
    await waitRandomTime(500, 800);
    const fileType = await filetypemime(buffer);

    return {
      ...defaults,
      buffer,
      size: buffer.byteLength,
      type: fileType.length > 0 ? fileType[0] : undefined,
    };
  }

  private parseError(err: any): string {
    let error = err as any;
    if (typeof error == "string") {
      return error;
    }
    if (error && error.message) {
      return error.message as string;
    }

    return "Unknown error";
  }
}
