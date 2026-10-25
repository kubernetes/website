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

# Usage: verify-spelling.sh [DIRECTORY|FILE]...
# If no argument is given, the current directory is checked.

TARGET_WORDS=(
	# incorrect_word_with_regex:correct_word
	"コンテナー:コンテナ"
	"アーキテクチャー:アーキテクチャ"
	"コントローラ[^ー]:コントローラー"
	"オペレータ[^ー]:オペレーター"
	"パラメータ[^ー]:パラメーター"
	"レイヤ[^ー]:レイヤー"
	"クラスタ[^ーリ]:クラスター" # クラスタリングは除外
	"バイナリー:バイナリ"
)

if [ $# -eq 0 ]; then
	set -- .
fi

EXIT_CODE=0

for word_pair in "${TARGET_WORDS[@]}"
do
	incorrect_word_with_regex="${word_pair%%:*}"
	correct_word="${word_pair#*:}"
	incorrect_word="${incorrect_word_with_regex%%\[*}"
	grep -EHRn "${incorrect_word_with_regex}|${incorrect_word}$" "$@"
	if [ $? -eq 0 ]; then
		echo "Incorrect word ${incorrect_word} is contained."
		echo "Please replace ${incorrect_word} with ${correct_word}."
		echo
		EXIT_CODE=1
	fi
done

exit "${EXIT_CODE}"
