---
title: describe
content_template: templates/tool-reference
---

### Overview
Show details of a specific resource or group of resources

 Print a detailed description of the selected resources, including related resources such as events or controllers. You may select a single object by name, all objects of that type, provide a name prefix, or label selector. For example:

  $ kubectl describe TYPE NAME_PREFIX
  
 will first check for an exact match on TYPE and NAME_PREFIX. If no such resource exists, it will output details for every resource that has a name prefixed with NAME_PREFIX.

Use "kubectl api-resources" for a complete list of supported resources.

### Usage

`describe (-f FILENAME | TYPE [NAME_PREFIX | -l label] | TYPE/NAME)`


### Example

 Describe a node

```shell
kubectl describe nodes kubernetes-node-emt8.c.myproject.internal
```

 Describe a pod

```shell
kubectl describe pods/nginx
```

 Describe a pod identified by type and name in "pod.json"

```shell
kubectl describe -f pod.json
```

 Describe all pods

```shell
kubectl describe pods
```

 Describe pods by label name=myLabel

```shell
kubectl describe po -l name=myLabel
```

 Describe all pods managed by the 'frontend' replication controller (rc-created pods # get the name of the rc as a prefix in the pod the name).

```shell
kubectl describe pods frontend
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
    <td>all-namespaces</td><td>A</td><td>false</td><td>If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>Filename, directory, or URL to files containing the resource to describe</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process the kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>show-events</td><td></td><td>true</td><td>If true, display events related to the described object.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version
<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs version 1.15 &#xa9;Copyright 2019 The Kubernetes Authors</a>
</div>

