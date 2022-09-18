#!/bin/bash python3

from googletrans import Translator  # https://github.com/ssut/py-googletrans

BASE_PATH = "../.."
SOURCE_LANG="en"
TARGET_LANG="ko"
SOURCE_DOC=f"{BASE_PATH}/content/en/docs/tasks/debug/debug-cluster/crictl.md"
TARGET_DOG=f"{BASE_PATH}/content/ko/docs/tasks/debug/debug-cluster/crictl.draft.md"
BASE_DIR="../../"

SKIP_PREFIXES = [
    "---",
    "<!--",
    "id:",
    "title:",
    "date:",
    "full_link:",
    "short_description:",
    "aka:",
    "tags:",
    "reviewers:",
    "approvers:",
    "content_type:",
    "#",
    "{{",
]

if __name__ == '__main__':
    translator = Translator()
    is_code_block = False
    with open(SOURCE_DOC, "r", encoding="UTF-8") as source:
        with open(TARGET_DOG, "w", encoding="UTF-8") as target:
            for line in source:
                # condition as stripped_line
                stripped_line = line.strip()

                # check code block start/end
                if stripped_line.startswith("```"):
                    is_code_block = not is_code_block
                    target.write(line)
                    continue

                # if it's in code block, do not translate
                if is_code_block:
                    print("It's code block, do not translate")
                    target.write(line)
                    continue

                # if empty string, do not translate
                if not stripped_line:
                    print("It's empty string, do not translate")
                    target.write(line)
                    continue

                # if starts with certain string, do not translate
                if stripped_line.startswith(tuple(SKIP_PREFIXES)):
                    print("do not translate!")
                    print("stripped_line=", stripped_line)
                    target.write(line)
                    continue

                # try translate
                print("Try translation")
                try:
                    translated = translator.translate(line, src=SOURCE_LANG, dest=TARGET_LANG).text
                    target.write(translated + "\n")
                    print("Translated Success")
                except Exception as e:
                    print("Translated with error=", e)
                    target.write(line)
