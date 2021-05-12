import { StringParams } from "./type";
export const URL_PREFIX: string = process.env.PUBLIC_URL || "";
export const ROUTES: StringParams = {
  API: `${URL_PREFIX}/api_list`,
  SCENE: `${URL_PREFIX}/scene_list`,
  DOCUMENT: `${URL_PREFIX}/document`,
};
