---
title: wait
content_template: templates/tool-reference
---

### Overview
Experimental: Wait for a specific condition on one or many resources.

 The command takes multiple resources and waits until the specified condition is seen in the Status field of every given resource.

 Alternatively, the command can wait for the given set of resources to be deleted by providing the "delete" keyword as the value to the --for flag.

 A successful message will be printed to stdout indicating when the specified condition has been met. One can use -o option to change to output destination.

### Usage

`$ wait ([-f FILENAME] | resource.group/resource.name | resource.group [(-l label | --all)]) [--for=delete|--for condition=available]`


### Example

 Wait for the pod "busybox1" to contain the status condition of type "Ready".

```shell
kubectl wait --for=condition=Ready pod/busybox1
```

 Wait for the pod "busybox1" to be deleted, with a timeout of 60s, after having issued the "delete" command.

```shell
kubectl delete pod/busybox1
kubectl wait --for=delete pod/busybox1 --timeout=60s
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
    <td>all</td><td></td><td>false</td><td>Select all resources in the namespace of the specified resource types</td>
    </tr>
    <tr>
    <td>all-namespaces</td><td>A</td><td>false</td><td>If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>field-selector</td><td></td><td></td><td>Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector key1=value1,key2=value2). The server only supports a limited number of field queries per type.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>identifying the resource.</td>
    </tr>
    <tr>
    <td>for</td><td></td><td></td><td>The condition to wait on: [delete&#124;condition=condition-name].</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, annotation will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>true</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>30s</td><td>The length of time to wait before giving up.  Zero means check once and don't wait, negative means wait for a week.</td>
    </tr>
</tbody>
</table></div>



