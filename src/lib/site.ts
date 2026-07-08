export const SITE_URL = "https://yoanfreelancedev.netlify.app";

export const SITE_NAME = "Yoan Soussand";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
