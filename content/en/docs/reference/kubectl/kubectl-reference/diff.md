---
title: diff
content_template: templates/tool-reference
---

### Overview
Diff configurations specified by filename or stdin between the current online configuration, and the configuration as it would be if applied.

 Output is always YAML.

 KUBECTL_EXTERNAL_DIFF environment variable can be used to select your own diff command. By default, the "diff" command available in your path will be run with "-u" (unicode) and "-N" (treat new files as empty) options.

### Usage

`$ diff -f FILENAME`


### Example

 Diff resources included in pod.json.

```shell
kubectl diff -f pod.json
```

 Diff file read from stdin

```shell
cat service.yaml | kubectl diff -f -
```




### Flags

<div class="table-responsive"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>experimental-field-manager</td><td></td><td>kubectl</td><td>Name of the manager used to track field ownership. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>experimental-force-conflicts</td><td></td><td>false</td><td>If true, server-side apply will force the changes against conflicts. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>experimental-server-side</td><td></td><td>false</td><td>If true, apply runs in the server instead of the client. This is an alpha feature and flag.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files contains the configuration to diff</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
</tbody>
</table></div>



