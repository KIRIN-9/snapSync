interface AutoUploadResult {
  result: string;
  timestamp: string;
  filename: string;
}

// Use a module-scoped variable for server-side
let latestAutoUploadResult: AutoUploadResult | null = null;

export function setLatestAutoUploadResult(result: string, filename: string): void {
  const newResult = {
    result,
    timestamp: new Date().toISOString(),
    filename,
  };

  // Update in-memory storage
  latestAutoUploadResult = newResult;
}

export function getLatestAutoUploadResult(): AutoUploadResult | null {
  return latestAutoUploadResult;
}
