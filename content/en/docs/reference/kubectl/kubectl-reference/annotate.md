---
title: annotate
content_template: templates/tool-reference
---

### Overview
Update the annotations on one or more resources

 All Kubernetes objects support the ability to store additional data with the object as annotations. Annotations are key/value pairs that can be larger than labels and include arbitrary string values such as structured JSON. Tools and system extensions may use annotations to store their own data.

 Attempting to set an annotation that already exists will fail unless --overwrite is set. If --resource-version is specified and does not match the current resource version on the server the command will fail.

Use "kubectl api-resources" for a complete list of supported resources.

### Usage

`$ annotate [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]`


### Example

 Update pod 'foo' with the annotation 'description' and the value 'my frontend'. # If the same annotation is set multiple times, only the last value will be applied

```shell
kubectl annotate pods foo description='my frontend'
```

 Update a pod identified by type and name in "pod.json"

```shell
kubectl annotate -f pod.json description='my frontend'
```

 Update pod 'foo' with the annotation 'description' and the value 'my frontend running nginx', overwriting any existing value.

```shell
kubectl annotate --overwrite pods foo description='my frontend running nginx'
```

 Update all pods in the namespace

```shell
kubectl annotate pods --all description='my frontend running nginx'
```

 Update pod 'foo' only if the resource is unchanged from version 1.

```shell
kubectl annotate pods foo description='my frontend running nginx' --resource-version=1
```

 Update pod 'foo' by removing an annotation named 'description' if it exists. # Does not require the --overwrite flag.

```shell
kubectl annotate pods foo description-
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
    <td>all</td><td></td><td>false</td><td>Select all resources, including uninitialized ones, in the namespace of the specified resource types.</td>
    </tr>
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>field-selector</td><td></td><td></td><td>Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector key1=value1,key2=value2). The server only supports a limited number of field queries per type.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to update the annotation</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>local</td><td></td><td>false</td><td>If true, annotation will NOT contact api-server but run locally.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>overwrite</td><td></td><td>false</td><td>If true, allow annotations to be overwritten, otherwise reject annotation updates that overwrite existing annotations.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>resource-version</td><td></td><td></td><td>If non-empty, the annotation update will only succeed if this is the current resource-version for the object. Only valid when specifying a single resource.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, not including uninitialized ones, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2).</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>



