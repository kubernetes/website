# Update imported docs

This script updates the docs files that are generated from other repos.
It accepts a YAML file name as its input which can be customized on a per-repo
basis.

## Requirements

Imported docs must follow these guidelines:

1. Adhere to the [Documentation Style Guide](/docs/home/contribute/style-guide/).

1. Have `title` defined in the front matter. For example:

    ```
    ---
    title: Title Displayed in Table of Contents
    ---

    Rest of the .md file...
    ```
1. Be listed somewhere in a file under the `data` subdirectory, for example,
   the `data/imported.yml` file.

1. Make sure the `PyYAML` package is installed:

```
sudo apt-get install python-pip
pip install PyYAML
```

## Usage

From within this directory, run the following command:

```
+./update-imported-docs <CONFIG-FILE>
```

where `<CONFIG-FILE>` can be any YAML configuration file in this directory.

## Configuration file format

Each config file may contain multiple repos that will be imported together.
When necessary, you can customize the configuration file by manually editing
it. You may create new config files for importing other groups of documents.
The following is an example of the YAML configuration file:

```
repos:
- name: community
  remote: https://github.com/kubernetes/community.git
  branch: master
  files:
  - src: contributors/devel/README.md
    dst: docs/imported/community/devel.md
  - src: contributors/guide/README.md
    dst: docs/imported/community/guide.md
```

Note: `generate-command` is an optional entry, which can be used to run a
given command or a short script to generate the docs from within a repo.

## Fixing Links

To fix relative links within your imported files, set the repo config's
`gen-absolute-links` property to `true`. You can find an example of this in
[`release.yml`](release.yml).
