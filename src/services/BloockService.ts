import {
  AccessControl,
  Bloock,
  BloockClient,
  Encrypter,
  IpfsLoader,
  KeyType,
  LocalCertificate,
  LocalKey,
  ManagedCertificate,
  ManagedKey,
  Network,
  Record,
} from "@bloock/sdk";
import { RecordDetails } from "@bloock/sdk/dist/entity/record/record-details";
import { RcFile } from "antd/es/upload";
import {
  AuthenticityDetails,
  AvailabilityDetails,
  EncryptionDetails,
  IntegrityDetails,
  IntegrityNetwork,
} from "../models/VerificationResult";
import {
  convertAnchorNetworkToNetwork,
  getAlgType,
  getEncryptionMode,
  parseCertificateSubject,
  readBlob,
  waitRandomTime,
} from "../utils/utils";
import { IPFSCid } from "../models/ReadDirectory";

export default class BloockService {
  private bloockClient: BloockClient;

  constructor() {
    const apiHost = import.meta.env.VITE_API_HOST;
    if (apiHost && apiHost.includes("api.bloock.dev")) {
      Bloock.setApiHost(apiHost);
    }

    this.bloockClient = new BloockClient(import.meta.env.VITE_API_KEY);
  }

  public async loadFile(bytes: Uint8Array): Promise<Record> {
    return await this.bloockClient.RecordClient.fromFile(bytes).build();
  }

  public async getDetails(bytes: Uint8Array): Promise<RecordDetails> {
    return this.bloockClient.RecordClient.fromFile(bytes).getDetails();
  }

  public async readCID(input: IPFSCid): Promise<AvailabilityDetails> {
    return this.bloockClient.RecordClient.fromLoader(
      new IpfsLoader(input.cidString)
    )
      .build()
      .then((cidData: any) => this.readBuffer(cidData.payload));
  }

  public async checkIntegrity(bytes: Uint8Array): Promise<IntegrityDetails> {
    await waitRandomTime(500, 800);

    let recordDetails: RecordDetails;
    let details: IntegrityDetails = {
      enabled: false,
      hash: "",
      valid: false,
    };

    try {
      recordDetails = await this.getDetails(bytes);
      details.hash = recordDetails.integrity?.hash;
    } catch (err) {
      details.error = this.parseError(err);
      return details;
    }

    try {
      const record = await this.loadFile(bytes);
      const proof = await this.bloockClient.IntegrityClient.getProof([record]);
      if (proof) {
        details.enabled = true;
      }
      const root = await this.bloockClient.IntegrityClient.verifyProof(proof);

      const networks: IntegrityNetwork[] = [];
      for (let i = 0; i < proof.anchor.networks.length; i++) {
        const network = proof.anchor.networks[i];
        const timestamp = await this.bloockClient.IntegrityClient.validateRoot(
          network.root || root,
          convertAnchorNetworkToNetwork(network)
        );
        networks.push({
          name: network.name,
          status: network.state,
          timestamp,
          txHash: network.txHash,
          anchorId: proof.anchor.anchorID,
          root: network.root,
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
      const recordDetails = await this.getDetails(bytes);

      if (recordDetails.authenticity?.signatures) {
        details.enabled = true;
        details.signatures = recordDetails.authenticity.signatures.map(
          (signature) => {
            return {
              alg: signature.alg,
              kid: signature.kid,
              signature: signature.signature,
              subject: signature.subject
                ? parseCertificateSubject(signature.subject)
                : undefined,
            };
          }
        );

        const subject = recordDetails.authenticity.signatures.filter(
          (s) => !!s.subject
        )[0]?.subject;
        if (subject) {
          details.subject = parseCertificateSubject(subject);
        }

        const record = await this.loadFile(bytes);
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
      const recordDetails = await this.getDetails(bytes);
      console.log(recordDetails);
      return {
        ...details,
        enabled: !!recordDetails.encryption,
        type: getAlgType(recordDetails.encryption?.alg),
        mode: getEncryptionMode(recordDetails.encryption?.alg),
        alg: recordDetails.encryption?.alg?.toString(),
        key: recordDetails.encryption?.key,
        subject: recordDetails.encryption?.subject
          ? parseCertificateSubject(recordDetails.encryption?.subject)
          : undefined,
      };
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
    key: LocalKey | LocalCertificate | ManagedKey | ManagedCertificate,
    accessControl?: AccessControl
  ): Promise<Uint8Array> {
    await waitRandomTime(500, 800);

    let record = await this.bloockClient.RecordClient.fromFile(bytes)
      .withDecrypter(new Encrypter(key, accessControl))
      .build();
    return record.retrieve();
  }

  public async loadLocalKey(key: string): Promise<LocalKey> {
    return await this.bloockClient.KeyClient.loadLocalKey(KeyType.Aes256, key);
  }

  public async loadLocalCertificate(
    file: RcFile,
    password?: string
  ): Promise<LocalCertificate> {
    let certificate = await readBlob(file);
    console.log(certificate);
    return await this.bloockClient.KeyClient.loadLocalCertificate(
      certificate,
      password || ""
    );
  }

  public async loadManagedKey(keyId: string): Promise<ManagedKey> {
    return await this.bloockClient.KeyClient.loadManagedKey(keyId);
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
      return {
        buffer: new Uint8Array(),
        error: "Couldn't retrieve file from provided URL",
      };
    }

    let filename = url.pathname.split("/").pop();
    if (!filename) {
      filename = url.pathname;
    }

    const buffer = new Uint8Array(await response.arrayBuffer());
    return this.readBuffer(buffer, {
      filename: filename,
      link: url.toString(),
    });
  }

  public async readBuffer(
    buffer: Uint8Array,
    defaults?: Partial<AvailabilityDetails>
  ): Promise<AvailabilityDetails> {
    await waitRandomTime(500, 800);
    const recordDetails = await this.getDetails(buffer);

    let details = {
      ...defaults,
      buffer,
      size: buffer.byteLength,
      type: recordDetails.availability?.contentType,
    };
    if (!recordDetails.encryption) {
      const record = await this.loadFile(buffer);
      const payload = await record.getPayload();
      details.payload = payload;
    }

    return details;
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
