import { StringParams as Params } from "./type";

export function getQueryParams(): Params {
  return window.location.search
    .replace("?", "")
    .split("&")
    .reduce((r: Params, e: string) => {
      const [key, value] = e.split("=");
      r[key] = decodeURIComponent(value);
      return r;
    }, {} as Params);
}
