#!/usr/bin/env python

import re
from subprocess import check_output

import click


def last_commit(path, git):
    """
    Find the hash of the last commit that touched a file.
    """
    cmd = [git, "log", "-n", "1", "--pretty=format:%H", "--", path]
    try:
        return check_output(cmd)
    except Exception as exc:
        raise exc


def diff(reference_commit_hash, translation_commit_hash, reference_path, git):
    """
    Returns the diff between two hashes on a specific file
    """
    cmd = [git, "diff",
           "%s...%s" % (translation_commit_hash, reference_commit_hash),
           "--",
           reference_path]
    try:
        return check_output(cmd)
    except Exception as exc:
        raise exc


def find_full_path(path, git):
    cmd = [git, "ls-tree",
           "--name-only", "--full-name", "HEAD",
           path]
    try:
        return check_output(cmd).strip()
    except Exception as exc:
        raise exc


def find_reference(path, git):
    abs_path = find_full_path(path, git=git)
    return re.sub('content/(\w{2})/', 'content/en/', abs_path)


@click.command()
@click.argument("path")
@click.option("--reference", "reference",
              help="Specify the reference version of the file. Default to the English one.",
              default=None)
@click.option("--git-path",
              "git",
              help="Specify git path",
              default="git")
def main(path, reference, git):
    """
    Find what changes occurred between two versions

    ex:
    ./upstream_changes.py content/fr/_index.html
    """
    if reference is None:
        reference = find_reference(path, git=git)
    reference_commit_hash = last_commit(path=reference, git=git)
    translation_commit_hash = last_commit(path=path, git=git)

    print(diff(
        reference_commit_hash=reference_commit_hash,
        translation_commit_hash=translation_commit_hash,
        reference_path=reference,
        git=git
    ))

if __name__ == '__main__':
    main()
