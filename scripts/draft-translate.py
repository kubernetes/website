#!/usr/bin/env python3

import click

from googletrans import Translator  # https://github.com/ssut/py-googletrans

SKIP_PREFIXES = [
    "<!--",
    "## {{% heading",
    "{{< feature-state",
    "{{< comment",
    "{{< /comment",
    "{{< glossary_definition",
    "{{< note",
    "{{< /note",
    "{{< caution",
    "{{< /caution",
    "{{< table",
    "{{< /table",
    "{{% thirdparty",
    "{{< codenew",
    "<table>",
    "</table>",
]

@click.command()
@click.option('--lang', '-t', required=True, help='Target language code, such as `ko`.')
@click.option('--file', '-f', required=True, help='Source file path')
@click.option("--src-lang", '-s', required=False, help='Source language, default to `en`.', default="en")
def main(lang, file, src_lang):
    """Create a draft file for localization using Google Translation."""

    target_lang = lang
    src_file = file
    num = 0

    # define target file path and name
    target_file = src_file.replace(f"/{src_lang}/", f"/{target_lang}/", 1)

    translator = Translator()
    is_code_block = False
    with open(src_file, "r", encoding="UTF-8") as source:
        with open(target_file, "w", encoding="UTF-8") as target:
            for line in source:
                num += 1
                # condition as stripped_line
                stripped_line = line.strip()

                # check code block or header block start/end
                if stripped_line.startswith("```") or stripped_line.startswith("---"):
                    print("## Code or header block start/end (do not translate)")
                    print(f"[{num}:{src_lang}={target_lang}] {line.strip()}")
                    is_code_block = not is_code_block
                    target.write(line)
                    continue

                # if it's in code or header block, do not translate
                if is_code_block:
                    print("["+str(num)+":"+src_lang+"="+target_lang+"] " + line.strip())
                    target.write(line)
                    continue

                # if empty string, do not translate
                if not stripped_line:
                    print("["+str(num)+":"+src_lang+"="+target_lang+"] " + line.strip())
                    target.write(line)
                    continue

                # if starts with a certain string, do not translate
                if stripped_line.startswith(tuple(SKIP_PREFIXES)):
                    print("\n## Line start with a skip-prefix (do not translate)")
                    print("["+str(num)+":"+src_lang+"="+target_lang+"] " + stripped_line + "\n")
                    target.write(line)
                    continue

                # translate
                try:
                    translated = translator.translate(line, src=src_lang, dest=target_lang).text
                    print("["+str(num)+":"+src_lang+"] "+ line.strip())
                    print("["+str(num)+":"+target_lang+"] " + translated + "\n")
                    target.write(translated + "\n")
                except Exception as e:
                    print("Translated with error=", e)
                    target.write(line)
            target.close()

            print("\n\n[Complete: update the draft] " + target_file + "\n\n")
            result = open(target_file, "r")
            output = result.read()
            print(output)
            result.close()


if __name__ == "__main__":
    main()
