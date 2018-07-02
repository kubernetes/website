# Update imported docs

This script updates the target files generated from other repos listed in the <config.yml> file, which is specified as the command line argument.

## Requirements

Imported docs must follow these guidelines:

1. Be listed somewhere in the `/_data/imported.yml` table of contents file.
1. Have `title` defined in the front matter. For example:

    ```
    ---
    title: Title Displayed in Table of Contents
    ---

    Rest of the .md file...
    ```

1. Adhere to the [Documentation Style Guide](/docs/home/contribute/style-guide/).

## Usage

From within this directory, run the following command:

```
+./update-imported-docs-[linux|macos] <config.yaml>
```

The output should look similar to the following:

```
Website root directory: /Users/someuser/git/kubernetes-website

            *   *   *

Cloning repo "community"...

            *   *   *

Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them.
```

## Config file format

Each config file may contain multiple repos, which will be imported together. You should modify the corresponding `update-imported-docs/<config.yml>` file to reflect the desired `src` and `dst` paths.

You may also create new config files for different groups of documents to import. The following is an example of the YAML file format:

```
repos:
- name: kubernetes                          #tmp directory name
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
  generate-command: hack/generate-docs.sh   #optional command to run
  files:
  - src: docs/admin/cloud-controller-manager.md
    dst: docs/reference/generated/cloud-controller-manager.md
  - src: docs/admin/kube-apiserver.md
    dst: docs/reference/generated/kube-apiserver.md
- name: community                           #tmp directory name
  remote: https://github.com/kubernetes/community.git
  branch: master
  files:
  - src: contributors/devel/README.md
    dst: docs/imported/community/devel.md
  - src: contributors/guide/README.md
    dst: docs/imported/community/guide.md
```

Note: `generate-command` is an optional entry, which can be used to run a given command to auto-generate the docs from within that repo.

## Fixing Links

To fix relative links within your imported files, set the repo config's `gen-absolute-links` value to `true`. You can see an example of this in [`community.yml`](community.yml).
