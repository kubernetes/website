---
title: cp
noedit: true
layout: kuberef
---

### Overview
Copy files and directories to and from containers.

### Usage

`cp <file-spec-src> <file-spec-dest>`


### Example

 !!!Important Note!!! # Requires that the 'tar' binary is present in your container # image.  If 'tar' is not present, 'kubectl cp' will fail. # Copy /tmp/foo_dir local directory to /tmp/bar_dir in a remote pod in the default namespace

```shell
kubectl cp /tmp/foo_dir <some-pod>:/tmp/bar_dir
```

 Copy /tmp/foo local file to /tmp/bar in a remote pod in a specific container

```shell
kubectl cp /tmp/foo <some-pod>:/tmp/bar -c <specific-container>
```

 Copy /tmp/foo local file to /tmp/bar in a remote pod in namespace <some-namespace>

```shell
kubectl cp /tmp/foo <some-namespace>/<some-pod>:/tmp/bar
```

 Copy /tmp/foo from a remote pod to /tmp/bar locally

```shell
kubectl cp <some-namespace>/<some-pod>:/tmp/foo /tmp/bar
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
    <td>container</td><td>c</td><td></td><td>Container name. If omitted, the first container in the pod will be chosen</td>
    </tr>
    <tr>
    <td>no-preserve</td><td></td><td>false</td><td>The copied file/directory's ownership and permissions will not be preserved in the container</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

