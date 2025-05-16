interface AutoUploadResult {
  result: string;
  timestamp: string;
  filename: string;
}


let latestAutoUploadResult: AutoUploadResult | null = null;

export function setLatestAutoUploadResult(result: string, filename: string): void {
  const newResult = {
    result,
    timestamp: new Date().toISOString(),
    filename,
  };


  latestAutoUploadResult = newResult;
}

export function getLatestAutoUploadResult(): AutoUploadResult | null {
  return latestAutoUploadResult;
}
