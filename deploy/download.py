# -*- coding: utf-8 -*-

import json
import os
import shutil
import traceback
from typing import Union
from urllib.parse import urlencode, urljoin
from urllib.request import Request, urlopen


class Download:
    def __init__(
        self,
        tb_token: str,
        cookie2: str,
        data_folder: str,
        is_only_online: bool = False,
    ) -> None:
        self.host = "https://qimen.taobao.com"
        self.cookie2 = cookie2
        self.tb_token = tb_token
        self.data_folder = data_folder
        self.is_only_online = is_only_online

    def request(self, api: str, params: dict, method: str = "GET") -> dict:
        params = {"_tb_token_": self.tb_token, **params}
        url = f"{urljoin(self.host, api)}?{urlencode(params)}"
        headers = {"Cookie": f"cookie2={self.cookie2}"}
        req = Request(url, method=method, headers=headers)
        with urlopen(req) as f:
            content = f.read().decode("utf-8")
            try:
                data = json.loads(content)
            except json.decoder.JSONDecodeError as e:
                print(traceback.format_exc())
                os._exit(1)
        if data["success"] and data["code"] == 200:
            return data
        os._exit(1)

    def get_scene_list(self) -> list:
        api = "/rpc/scene/getSceneList.json"
        params = {"key": "all"}
        data = self.request(api, params)
        return [
            {
                "id": scene["id"],
                "key": scene["id"],
                "name": scene["sceneName"],
                "domin_name": scene["dominName"],
            }
            for scene in data["data"]["list"]
        ]

    def get_api_list(self, scene_id: int) -> list:
        api = "/rpc/api/getApiList.json"
        params = {"sceneId": scene_id, "status": "all"}
        data = self.request(api, params)
        return [
            {
                "id": managed["id"],
                "key": managed["id"],
                "name": managed["apiName"],
                "description": managed["functionName"],
            }
            for managed in data["data"]["list"]
            if not self.is_only_online
            or self.is_only_online
            and managed["status"]["sign"] == 4
            and managed["status"]["online"] is True
        ]

    def get_api_document(self, scene_id: int, app_id: int) -> dict:
        api = "/rpc/apidoc/getApiDocument.json"
        params = {"apiId": app_id, "apiName": "", "apiGroupId": scene_id}
        data = self.request(api, params)
        return data

    def write(self, filename: str, data: Union[list, dict]) -> str:
        file_path = os.path.join(self.data_folder, filename)
        with open(file_path, "w+") as f:
            f.write(json.dumps(data, ensure_ascii=False, indent=2))
        return file_path

    def initialize(self):
        if os.path.exists(self.data_folder):
            shutil.rmtree(self.data_folder)
        os.makedirs(self.data_folder)

    def run(self) -> None:
        self.initialize()
        scene_list = self.get_scene_list()
        self.write("scene_list.json", scene_list)
        for scene in scene_list:
            scene_id = scene["id"]
            api_list = self.get_api_list(scene_id)
            self.write(f"api_list_{scene_id}.json", api_list)

            os.makedirs(os.path.join(self.data_folder, str(scene_id)))
            for api in api_list:
                api_id = api["id"]
                data = self.get_api_document(scene_id, api_id)
                filename = os.path.join(str(scene_id), f"{api_id}.json")
                self.write(filename, data)


def main() -> None:
    token = os.getenv("QIMEN_DOWNLOAD_TOKEN")
    cookie2 = os.getenv("QIMEN_DOWNLOAD_COOKIE")
    data_folder = os.getenv("QIMEN_DOWNLOAD_FOLDER", "./public/data")
    is_only_online = os.getenv("QIMEN_DOWNLOAD_ONLY_ONLINE_DOC", "") == "2"
    if not (token or not cookie2):
        os._exit(-1)
    d = Download(token, cookie2, data_folder, is_only_online)
    d.run()


if __name__ == "__main__":
    main()
