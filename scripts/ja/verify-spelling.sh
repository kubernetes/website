#!/usr/bin/env bash

# Copyright 2022 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
##########

# cd to the root path
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd -P)"
CONTENT_DIR="content/ja"
cd "${ROOT}/${CONTENT_DIR}"

TARGET_WORDS=""               # invalid:valid
TARGET_WORDS="${TARGET_WORDS} コンテナー:コンテナ"
TARGET_WORDS="${TARGET_WORDS} アーキテクチャー:アーキテクチャ"
TARGET_WORDS="${TARGET_WORDS} コントローラ[^ー]:コントローラー"
TARGET_WORDS="${TARGET_WORDS} オペレータ[^ー]:オペレーター"
TARGET_WORDS="${TARGET_WORDS} パラメータ[^ー]:パラメーター"
TARGET_WORDS="${TARGET_WORDS} レイヤ[^ー]:レイヤー"
TARGET_WORDS="${TARGET_WORDS} クラスタ[^ーリ]:クラスター" # 例外的にクラスタリングはクラスターリングにしない
TARGET_WORDS="${TARGET_WORDS} バイナリー:バイナリ"

INVALID_CONTAINED=""

for word_set in $(echo ${TARGET_WORDS})
do
	invalid=$(echo ${word_set} | awk -F: '{print $1}')
	valid=$(echo ${word_set} | awk -F: '{print $2}')
	grep -E "${invalid}" * -R
	if [ $? -eq 0 ]; then
		echo "Invalid word ${invalid} is contained under ${CONTENT_DIR}."
		echo "Please replace ${invalid} with ${valid}."
		echo
		INVALID_CONTAINED="TRUE"
	fi
done

if [ "${INVALID_CONTAINED}" != "" ]; then
	exit 1
fi
