#!/usr/bin/env bash
set -xe

ROOT_DIR="$( cd "$( dirname "$BASH_SOURCE[0]" )" && pwd )"
export ROOT_DIR="${ROOT_DIR}"

source ${ROOT_DIR}/env.sh

docker-compose -p qimen-docs -f "${ROOT_DIR}/docker-compose.yml" $*
