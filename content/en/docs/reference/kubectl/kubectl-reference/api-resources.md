---
title: api-resources
noedit: true
layout: kuberef
---

### Overview
Print the supported API resources on the server

### Usage

`api-resources`


### Example

 Print the supported API Resources

```shell
kubectl api-resources
```

 Print the supported API Resources with more information

```shell
kubectl api-resources -o wide
```

 Print the supported namespaced resources

```shell
kubectl api-resources --namespaced=true
```

 Print the supported non-namespaced resources

```shell
kubectl api-resources --namespaced=false
```

 Print the supported API Resources with specific APIGroup

```shell
kubectl api-resources --api-group=extensions
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
    <td>api-group</td><td></td><td></td><td>Limit to resources in the specified API group.</td>
    </tr>
    <tr>
    <td>cached</td><td></td><td>false</td><td>Use the cached list of resources if available.</td>
    </tr>
    <tr>
    <td>namespaced</td><td></td><td>true</td><td>If false, non-namespaced resources will be returned, otherwise returning namespaced resources by default.</td>
    </tr>
    <tr>
    <td>no-headers</td><td></td><td>false</td><td>When using the default or custom-column output format, don't print headers (default print headers).</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: wide&#124;name.</td>
    </tr>
    <tr>
    <td>verbs</td><td></td><td>[]</td><td>Limit to resources that support the specified verbs.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

