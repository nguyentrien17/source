export function antdFileListToUrls(fileList = []) {
  return (fileList || [])
    .map((f) => {
      if (f?.url) return f.url;
      if (f?.thumbUrl) return f.thumbUrl;
      if (f?.originFileObj) return URL.createObjectURL(f.originFileObj);
      return null;
    })
    .filter(Boolean);
}

export function urlsToAntdFileList(urls = [], uidPrefix = "init") {
  return (urls || []).filter(Boolean).map((url, idx) => ({
    uid: `${uidPrefix}-${idx}`,
    name: `image-${idx + 1}`,
    status: "done",
    url,
  }));
}
