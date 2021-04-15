export function getQueryParams() {
  return window.location.search
    .replace("?", "")
    .split("&")
    .reduce((r, e) => {
      const p = e.split("=");
      r[p[0]] = decodeURIComponent(p[1]);
      return r;
    }, {});
}
