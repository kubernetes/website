---
title: replace
content_template: templates/tool-reference
---

### Overview
Replace a resource by filename or stdin.

 JSON and YAML formats are accepted. If replacing an existing resource, the complete resource spec must be provided. This can be obtained by

  $ kubectl get TYPE NAME -o yaml

### Usage

`$ replace -f FILENAME`


### Example

 Replace a pod using the data in pod.json.

```shell
kubectl replace -f ./pod.json
```

 Replace a pod based on the JSON passed into stdin.

```shell
cat pod.json | kubectl replace -f -
```

 Update a single-container pod's image version (tag) to v4

```shell
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -
```

 Force replace, delete and then re-create the resource

```shell
kubectl replace --force -f ./pod.json
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
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>cascade</td><td></td><td>true</td><td>If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController).  Default true.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>to use to replace the resource.</td>
    </tr>
    <tr>
    <td>force</td><td></td><td>false</td><td>Only used when grace-period=0. If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of some resources may result in inconsistency or data loss and requires confirmation.</td>
    </tr>
    <tr>
    <td>grace-period</td><td></td><td>-1</td><td>Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for immediate shutdown. Can only be set to 0 when --force is true (force deletion).</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process a kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>save-config</td><td></td><td>false</td><td>If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>0s</td><td>The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object</td>
    </tr>
    <tr>
    <td>validate</td><td></td><td>true</td><td>If true, use a schema to validate the input before sending it</td>
    </tr>
    <tr>
    <td>wait</td><td></td><td>false</td><td>If true, wait for resources to be gone before returning. This waits for finalizers.</td>
    </tr>
</tbody>
</table></div>



