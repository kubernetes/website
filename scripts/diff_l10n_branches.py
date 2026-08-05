#!/usr/bin/env python

import os
import subprocess
import jinja2
import click

DEVNULL = open(os.devnull, 'w')
ISSUE_TEMPLATE = """\
# This is a Bug Report
## Problem
Outdated files in the {{ r_commit }} branch.

### {{ files_to_be_modified | count }} files to be modified 
{% for m_file in files_to_be_modified -%}
  1. [ ] {{ m_file.fileindex }} `{{ m_file.filepath }}` {{ m_file.stat }}
{% endfor %}

### {{ files_to_be_renamed | count }} files to be renamed  
{% for r_file in files_to_be_renamed -%}
  1. [ ] {{ r_file.fileindex }} {{ r_file.diff_status_letter }} `{{ r_file.src_filepath }}` -> `{{ r_file.dest_filepath }}`
{% endfor %}

### {{ files_to_be_deleted | count }} files to be deleted 
{% for d_file in files_to_be_deleted -%}
  1. [ ] {{ d_file.fileindex }} `{{ d_file.filepath }}`
{% endfor %}

## Proposed Solution

{% if files_to_be_modified %}

Use `git diff` to check what is changed in the upstream. And apply the upstream changes manually 
to the `{{ l10n_lang_path }}` of `{{ r_commit }}` branch.

For example:
```
# checkout `{{ r_commit }}`
...
# check what is updated in the upstream 
git diff {{ l_commit }} {{ r_commit }} -- {{ files_to_be_modified.0.filepath }}
# apply changes to {{ l10n_lang_path }}
vi {{ files_to_be_modified.0.filepath | replace(src_lang_path, l10n_lang_path) }}
...
# commit and push
...
# make PR to `{{ r_commit }}`
```

{% endif %}

## Pages to Update

Pages in {{ l10n_lang_path }}

"""

files_to_be_deleted = []
files_to_be_renamed = []
files_to_be_modified = []

index_to_be_deleted = 0
index_to_be_renamed = 0
index_to_be_modified = 0

def git_diff(filepath, l_commit, r_commit, stat=False):
    cmd = ["git", "diff", l_commit, r_commit, "--", filepath]

    if stat:
        cmd = ["git", "diff", l_commit, r_commit, "--stat", "--", filepath]

    return subprocess.check_output(cmd).decode("UTF-8").strip()


def git_exists(path, filepath):
    cmd = ["git", "cat-file", "-e", "{}:{}".format(path, filepath)]
    ret_code = subprocess.call(cmd, stderr=DEVNULL)
    return ret_code == 0


def process_diff_status(diff_status, l_commit, r_commit, src_lang_path,
                        l10n_lang_path):
    status_letter = diff_status[0]
    filepath = diff_status[1]

    size_xs = 10
    size_s = 30
    size_m = 100
    size_l = 500
    size_xl = 1000

    if git_exists(r_commit, filepath.replace(src_lang_path, l10n_lang_path)):
        if status_letter == 'D':
            global index_to_be_deleted
            index_to_be_deleted += 1
            fileindex = "D" + str(index_to_be_deleted) + '. '
            deleted = {"fileindex": fileindex,
                        "filepath": filepath }
            files_to_be_deleted.append(deleted)
        elif status_letter.startswith('R'):
            global index_to_be_renamed
            index_to_be_renamed += 1
            fileindex = "R" + str(index_to_be_renamed) + '. '
            replaced = {"fileindex": fileindex,
                        "diff_status_letter": diff_status[0],
                        "src_filepath": diff_status[1],
                        "dest_filepath": diff_status[2]}
            files_to_be_renamed.append(replaced)
        elif status_letter == 'M':
            global index_to_be_modified
            index_to_be_modified += 1
            diff_string = git_diff(filepath, l_commit, r_commit, stat=True)
            diff_string_tmp= diff_string.split("|") 
            diff_string_r = diff_string_tmp[1]

            res = [int(i) for i in diff_string_r.split() if i.isdigit()] 
            if len(res) < 4 :
                res.append(0)

            insertions = res[2]
            deletions = res[3]

            bold_condition = size_m
            if insertions < size_xs :
                insertion_size = "XS"
            elif insertions < size_s :
                insertion_size = "S"
            elif insertions < size_m :
                insertion_size = "M"
            elif insertions < size_l :
                insertion_size = "L"
            elif insertions < size_xl :
                insertion_size = "XL"
            else :
                insertion_size = "XXL"

            stat_output =  str(insertions) + "(+" + insertion_size + ") "  + str(deletions) + "(-)"

            if insertions >= bold_condition :
                fileindex = "**M" + str(index_to_be_modified)  + ".** "
                stat_output = "**" + stat_output + "**"
            else :
                fileindex = "M" + str(index_to_be_modified)  + ". "
                
            stat_output =  " | " + stat_output

            modified = {"fileindex": fileindex,
                        "filepath": filepath,
                        "stat": stat_output,
                        "diff": git_diff(filepath, l_commit, r_commit)}
            files_to_be_modified.append(modified)


def git_diff_name_status(l_commit, r_commit, src_lang_path, l10n_lang_path):
    cmd = ["git", "diff", l_commit, r_commit, "--name-status", "--",
           src_lang_path]
    name_status_output = subprocess.check_output(cmd).strip()
    for line in name_status_output.decode('utf-8').splitlines():
        diff_status = line.split()
        process_diff_status(diff_status, l_commit, r_commit, src_lang_path,
                            l10n_lang_path)


@click.command()
@click.argument("l10n-lang")
@click.argument("l-commit")
@click.argument("r-commit")
@click.option("--src-lang", help="Source language", default="en")
def main(l10n_lang, src_lang, l_commit, r_commit):
    """
    This script generates a report of outdated contents in `content/<l10n-lang>`
    directory by comparing two l10n team milestone branches.

    L10n team owners can open a GitHub issue with the report generated by this
    script when they start a new team milestone.

    ex: `scripts/diff_l10n_branches.py ko dev-1.15-ko.3 dev-1.15-ko.4`
    """
    l10n_lang_path = "content/" + l10n_lang
    src_lang_path = "content/" + src_lang
    git_diff_name_status(l_commit, r_commit, src_lang_path,
                         l10n_lang_path)
    issue_template = jinja2.Template(ISSUE_TEMPLATE)
    ret = issue_template.render(l_commit=l_commit, r_commit=r_commit,
                                src_lang_path=src_lang_path,
                                l10n_lang_path=l10n_lang_path,
                                files_to_be_deleted=files_to_be_deleted,
                                files_to_be_modified=files_to_be_modified,
                                files_to_be_renamed=files_to_be_renamed)
    print(ret)


if __name__ == "__main__":
    main()
