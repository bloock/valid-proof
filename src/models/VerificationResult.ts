import { EncryptionAlg } from "@bloock/sdk";

export type VerificationInput = {
  name: string;
  bytes: Uint8Array;
};

export type IntegrityNetwork = {
  name: string;
  status: string;
  timestamp: number;
  txHash: string;
  anchorId: number;
  root: string;
};

export type IntegrityDetails = {
  enabled: boolean;
  hash: string;
  valid: boolean;
  timestamp?: number;
  networks?: IntegrityNetwork[];
  error?: string;
};

export type AuthenticitySignature = {
  signAlg?: string;
  key?: string;
  signature?: string;
};

export type AuthenticityDetails = {
  enabled: boolean;
  valid: boolean;
  signatures: AuthenticitySignature[];
  error?: string;
};

export type EncryptionDetails = {
  enabled: boolean;
  encryptionAlg?: EncryptionAlg;
  key?: string;
  error?: string;
};

export type AvailabilityDetails = {
  filename?: string;
  link?: string;
  size?: number;
  type?: string;
  buffer: Uint8Array;
  error?: string;
};
