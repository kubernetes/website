---
title: scale
content_template: templates/tool-reference
---

### Overview
Set a new size for a Deployment, ReplicaSet, Replication Controller, or StatefulSet.

 Scale also allows users to specify one or more preconditions for the scale action.

 If --current-replicas or --resource-version is specified, it is validated before the scale is attempted, and it is guaranteed that the precondition holds true when the scale is sent to the server.

### Usage

`scale [--resource-version=version] [--current-replicas=count] --replicas=COUNT (-f FILENAME | TYPE NAME)`


### Example

 Scale a replicaset named 'foo' to 3.

```shell
kubectl scale --replicas=3 rs/foo
```

 Scale a resource identified by type and name specified in "foo.yaml" to 3.

```shell
kubectl scale --replicas=3 -f foo.yaml
```

 If the deployment named mysql's current size is 2, scale mysql to 3.

```shell
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql
```

 Scale multiple replication controllers.

```shell
kubectl scale --replicas=5 rc/foo rc/bar rc/baz
```

 Scale statefulset named 'web' to 3.

```shell
kubectl scale --replicas=3 statefulset/web
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
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>current-replicas</td><td></td><td>-1</td><td>Precondition for current size. Requires that the current size of the resource match this value in order to scale.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files identifying the resource to set a new size</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>record</td><td></td><td>false</td><td>Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>replicas</td><td></td><td>0</td><td>The new desired number of replicas. Required.</td>
    </tr>
    <tr>
    <td>resource-version</td><td></td><td></td><td>Precondition for resource version. Requires that the current resource version match this value in order to scale.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>0s</td><td>The length of time to wait before giving up on a scale operation, zero means don't wait. Any other values should contain a corresponding time unit (e.g. 1s, 2m, 3h).</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

