import {
  AccessControl,
  IpfsLoader,
  LocalCertificate,
  LocalKey,
  ManagedCertificate,
  ManagedKey,
  RecordClient,
} from "@bloock/sdk";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import DecryptFile from "../components/DecryptFile";
import FileLoader from "../components/FileLoader";
import Results from "../components/Results";
import Stepper from "../components/Stepper";
import {
  AuthenticityDetails,
  AvailabilityDetails,
  EncryptionDetails,
  IntegrityDetails,
} from "../models/VerificationResult";
import BloockService from "../services/BloockService";
import DirectoryPreview from "../components/DirectoryPreview";
import { DirectoryResponse } from "../models/ReadDirectory";
import { IPFSCid } from "../models/ReadDirectory";

export type VerificationState = {
  onInputChange: (input: File | URL | IPFSCid) => void;
  onDirectory: (directory: URL) => void;
  onDecryptFile: (
    key: LocalKey | LocalCertificate | ManagedKey | ManagedCertificate,
    accessControl?: AccessControl
  ) => Promise<boolean>;
  isFileValid: boolean | undefined;
  integrityDetails: IntegrityDetails | undefined;
  authenticityDetails: AuthenticityDetails | undefined;
  encryptionDetails: EncryptionDetails | undefined;
  availabilityDetails: AvailabilityDetails | undefined;
  service: BloockService;
  directoryResponse: DirectoryResponse | undefined;
  isLoading: boolean;
  error: boolean;
  reset: () => void;
};

const VerificationContext = createContext<VerificationState | undefined>(
  undefined
);

export const useVerification = () => {
  const ctxt = useContext(VerificationContext);
  if (!ctxt) {
    throw new Error(
      "useVerification returned `undefined`, maybe you forgot to wrap the component?"
    );
  }

  return ctxt;
};

export const steps = {
  loader: {
    Contents: FileLoader,
  },
  directory: {
    Contents: DirectoryPreview,
  },
  decrypt: {
    Contents: DecryptFile,
  },
  stepper: {
    Contents: Stepper,
  },
  details: {
    Contents: Results,
  },
};

export const VerificationProvider: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [isFileValid, setIsFileValid] = useState<boolean | undefined>();
  const [integrityDetails, setIntegrityDetails] = useState<
    IntegrityDetails | undefined
  >();
  const [authenticityDetails, setAuthenticityDetails] = useState<
    AuthenticityDetails | undefined
  >();
  const [encryptionDetails, setEncryptionDetails] = useState<
    EncryptionDetails | undefined
  >();
  const [availabilityDetails, setAvailabilityDetails] = useState<
    AvailabilityDetails | undefined
  >();

  const [component, setComponent] = useState(steps.loader);

  const [directoryResponse, setDirectoryResponse] =
    useState<DirectoryResponse>();

  const bloockService = useMemo(() => {
    return new BloockService();
  }, []);

  useEffect(() => {
    if (!integrityDetails?.enabled && !authenticityDetails?.enabled) return;

    let verification = [];
    if (integrityDetails?.enabled) {
      verification.push(integrityDetails.valid);
    }

    if (authenticityDetails?.enabled) {
      verification.push(authenticityDetails.valid);
    }

    const valid =
      verification.length > 0
        ? verification.every((v) => v === true)
        : undefined;

    if (isFileValid != valid) {
      setIsFileValid(valid);
    }
  }, [integrityDetails, authenticityDetails]);

  const processFile = (availabilityDetails: AvailabilityDetails) => {
    setAvailabilityDetails(availabilityDetails);

    return bloockService
      .checkEncryption(availabilityDetails.buffer)
      .then((_encryptionDetails) => {
        if (_encryptionDetails.error) {
          setComponent(steps.details);
          return;
        }

        if (encryptionDetails?.enabled !== true) {
          setEncryptionDetails(_encryptionDetails);
        }

        if (_encryptionDetails.enabled) {
          setComponent(steps.decrypt);
        } else {
          return bloockService.checkAuthenticity(availabilityDetails.buffer);
        }
      })
      .then((authenticityDetails) => {
        if (authenticityDetails) {
          setAuthenticityDetails(authenticityDetails);

          if (authenticityDetails.error) {
            setComponent(steps.details);
            return;
          }

          return bloockService.checkIntegrity(availabilityDetails.buffer);
        }
      })
      .then((integrityDetails) => {
        if (integrityDetails) {
          if (integrityDetails.error) {
            setComponent(steps.details);
            return;
          }

          setIntegrityDetails(integrityDetails);
          setComponent(steps.details);
        }
      });
  };

  const onDecryptFile = (
    key: LocalKey | LocalCertificate | ManagedKey | ManagedCertificate,
    accessControl?: AccessControl
  ): Promise<boolean> => {
    if (!availabilityDetails) {
      throw new Error("Unknown error");
    }

    return bloockService
      .decryptFile(availabilityDetails.buffer, key, accessControl)
      .then((decryptedFile) => {
        onInputChange(decryptedFile);
        return true;
      });
  };

  const onInputChange = (input: File | URL | Uint8Array | IPFSCid) => {
    let readPromise: Promise<AvailabilityDetails>;
    if (input instanceof URL) {
      readPromise = bloockService.readUrl(input);
    } else if (input instanceof File) {
      readPromise = bloockService.readFile(input);
    } else if (input instanceof Uint8Array) {
      readPromise = bloockService.readBuffer(input, availabilityDetails);
    } else if (input instanceof IPFSCid) {
      readPromise = bloockService.readCID(input);
    } else {
      return;
    }

    setComponent(steps.stepper);

    readPromise
      .then((availabilityDetails) => {
        return processFile(availabilityDetails);
      })
      .catch(console.error);
  };

  const onDirectory = async (directory: URL) => {
    let readDirectory: DirectoryResponse;
    setComponent(steps.directory);

    if (directory) {
      setIsLoading(true);
      readDirectory = await fetch(`${directory.href}?format=dag-json`)
        .then((response) => {
          return response.json();
        })
        .catch(() => {
          return setError(true);
        });
      setDirectoryResponse(readDirectory);
      setIsLoading(false);
    }
  };

  const reset = () => {
    ["url", "dir"].forEach((param) => {
      if (searchParams.has(param)) {
        searchParams.delete(param);
        setSearchParams(searchParams);
      }
    });

    setIsFileValid(undefined);
    setIntegrityDetails(undefined);
    setAuthenticityDetails(undefined);
    setEncryptionDetails(undefined);
    setAvailabilityDetails(undefined);
    setDirectoryResponse(undefined);
    setComponent(steps.loader);

    window.scrollTo(0, 0);
  };

  const value: VerificationState = {
    onDirectory,
    onInputChange,
    onDecryptFile,
    directoryResponse,
    isFileValid,
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
    service: bloockService,
    isLoading,
    error,

    reset,
  };

  return (
    <VerificationContext.Provider value={value}>
      <component.Contents></component.Contents>
    </VerificationContext.Provider>
  );
};
