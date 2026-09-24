const originVariable = "COMBRIC_DOCS_SITE_URL";

export function configuredSiteOrigin(value = process.env[originVariable]) {
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${originVariable} must be an absolute http(s) URL`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`${originVariable} must use http:// or https://`);
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      `${originVariable} must be an origin without credentials, query, or hash`,
    );
  }
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
}

export function siteUrl(path: string, origin = configuredSiteOrigin()) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return origin
    ? new URL(normalizedPath, `${origin}/`).toString()
    : normalizedPath;
}
