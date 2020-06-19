#!/usr/bin/env python3
#
# Lists the `en` intra-site links on a localized Markdown page.
# Checks if a localized page exists. Reports results.
# Next step: modify the links on the page by prefixing the link with the <lang> and add/commit changes.
# If there is no localized version of the page, validate the `en` link. Report results.
# A temporary results file is created which lists the localized pages and the validated links.
# To generate the file, run the script from the website/script directory with a <lang> parameter.
#
# Usage: python3 find-links-localize.py zh

import argparse
import glob
import os
import platform
import re
import sys
import tempfile
from pathlib import Path

DIRS = ["concepts", "contribute", "home", "reference", "setup", "tasks", "tutorials"]
TEST_DIRS = ["concepts"]
tmp_file_output = {}

def write_to_tmp():
    """Write validation results to a temporary file."""
    #count = 0
    try:
        fd, path = tempfile.mkstemp(
            dir='/tmp' if platform.system() == 'Darwin' else tempfile.gettempdir(),
            text=True
        )
        with open(fd, 'w') as f:
            for path, path_output in tmp_file_output.items():
                f.write("\n**File:**\n" + path + "\n")
                for p in path_output:
                    f.write(p)
                    #count = count + 1
    except OSError as ose:
        print("[Error] Unable to create temp results file {}; error: {}"
              .format(result_file, ose))
        return -2
    except IOError as e:
        print(e)

    #print(count)

def find_site_links(content_dir, lang, sub_path):
    """Find and validate intra-site links on a content page.
       Look for all en links in localized page.
       Links such as [...](/docs/...)
       Check if a localized version exists
       Replace the en version with the localized file
       Report en links that are invalid
       Investigating: Report localized links that are invalid
    """

    page_and_links = []

    try:
        with open(sub_path, "r") as mdFile:
            content = mdFile.read()
    except Exception as ex:
        print("[Error] failed in reading markdown file: ".format(ex))

    # Single results: searches for pattern: ](docs paths)
    # remote_regex = re.compile(r"\]\(\/docs[\/\w\-\#\/]+\)")

    # Single results: searches for pattern: []()
    remote_regex = re.compile(r"(\[[\w\s\.-]*\])(\(\/docs[\/\w\-\#\/]+\))")
    matches = remote_regex.findall(content)

    for m in matches:
        page_and_links.append("\nMatch link:" + m[0] + m[1])
        # clean up path and split
        subpaths = m[1][1:-1].split("/")

        # create path to file under localized content directory
        locale_file = content_dir + "/" + lang
        for p in subpaths:
            locale_file = os.path.realpath(os.path.join(locale_file, p)) 

        # some paths may have intra page anchors
        # strip of #<path-string>, check for page
        # TODO: check for heading on localized page
        # default adds .md to path
        if locale_file.find("#") >= 0:
            locale_file = locale_file.split("#")[0]

        #check if localized version of file exists
        locale_file = locale_file + ".md"
        page_and_links.append("\nLooking for localized file:" + locale_file + "\n")

        if Path(locale_file).is_file():
            page_and_links.append("\nLocalized file exists, replace EN version with: \n")
            page_and_links.append(locale_file + "\n")
        else:
            # Validate en link
            locale_file = content_dir + "/en"

            for p in subpaths:
                locale_file = os.path.realpath(os.path.join(locale_file, p)) 

            if locale_file.find("#") >= 0:
                locale_file = locale_file.split("#")[0]

            locale_file = locale_file + ".md"
            if Path(locale_file).is_file():
                page_and_links.append("\nVALID en link: \n")
                page_and_links.append(locale_file)
            else:
                page_and_links.append("\nNo localized file and INVALID en link:\n")
                page_and_links.append(locale_file + "\n")

    # add path and array of output to map
    tmp_file_output[sub_path] = page_and_links

def main():
    """The main entry of the program."""

    parser = argparse.ArgumentParser()
    parser.add_argument('lang', type=str,
                        help="provide two letter language code"
                        )
    in_args = parser.parse_args()
    lang = in_args.lang
    print("Localization is {}".format(lang))

    curr_dir = os.path.dirname(os.path.abspath(__file__))
    print("Curent directory {}".format(curr_dir))
    content_dir = os.path.realpath(os.path.join(curr_dir, '../content'))
    print("Docs website/content directory {}".format(content_dir))

    lang_docs_dir = os.path.realpath(os.path.join(content_dir, lang))
    content_dir_with_lang = lang_docs_dir
    lang_docs_dir = os.path.realpath(os.path.join(lang_docs_dir, 'docs'))

    # Ex: content/<lang>/docs/concepts
    for d in TEST_DIRS:
        doc_dir = os.path.realpath(os.path.join(lang_docs_dir, d))
        folders = [f for f in glob.glob(doc_dir + '/**/*.md', recursive=True)]
        for subpath in folders:
            print("subpath:" + subpath)
            find_site_links(content_dir, lang, subpath)

    # write out result file
    write_to_tmp()

    # Review result file.
    print("Completed link validation.")


if __name__ == '__main__':
    sys.exit(main())
