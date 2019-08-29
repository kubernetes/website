---
title: top
content_template: templates/tool-reference
---

### Overview
Display Resource (CPU/Memory/Storage) usage.

 The top command allows you to see the resource consumption for nodes or pods.

 This command requires Heapster to be correctly configured and working on the server.

### Usage

`top`






<hr>

## node


### Overview
Display Resource (CPU/Memory/Storage) usage of nodes.

 The top-node command allows you to see the resource consumption of nodes.

### Usage

`node [NAME | -l label]`


### Example
 Show metrics for all nodes

```shell
kubectl top node
```

 Show metrics for a given node

```shell
kubectl top node NODE_NAME
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>heapster-namespace</td><td></td><td>kube-system</td><td>Namespace Heapster service is located in</td>
    </tr>
    <tr>
    <td>heapster-port</td><td></td><td></td><td>Port name in service to use</td>
    </tr>
    <tr>
    <td>heapster-scheme</td><td></td><td>http</td><td>Scheme (http or https) to connect to Heapster as</td>
    </tr>
    <tr>
    <td>heapster-service</td><td></td><td>heapster</td><td>Name of Heapster service</td>
    </tr>
    <tr>
    <td>no-headers</td><td></td><td>false</td><td>If present, print output without headers</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>sort-by</td><td></td><td></td><td>If non-empty, sort nodes list using specified field. The field can be either 'cpu' or 'memory'.</td>
    </tr>
</tbody>
</table></div>



<hr>

## pod


### Overview
Display Resource (CPU/Memory/Storage) usage of pods.

 The 'top pod' command allows you to see the resource consumption of pods.

 Due to the metrics pipeline delay, they may be unavailable for a few minutes since pod creation.

### Usage

`pod [NAME | -l label]`


### Example
 Show metrics for all pods in the default namespace

```shell
kubectl top pod
```

 Show metrics for all pods in the given namespace

```shell
kubectl top pod --namespace=NAMESPACE
```

 Show metrics for a given pod and its containers

```shell
kubectl top pod POD_NAME --containers
```

 Show metrics for the pods defined by label name=myLabel

```shell
kubectl top pod -l name=myLabel
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
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
    <td>containers</td><td></td><td>false</td><td>If present, print usage of containers within a pod.</td>
    </tr>
    <tr>
    <td>heapster-namespace</td><td></td><td>kube-system</td><td>Namespace Heapster service is located in</td>
    </tr>
    <tr>
    <td>heapster-port</td><td></td><td></td><td>Port name in service to use</td>
    </tr>
    <tr>
    <td>heapster-scheme</td><td></td><td>http</td><td>Scheme (http or https) to connect to Heapster as</td>
    </tr>
    <tr>
    <td>heapster-service</td><td></td><td>heapster</td><td>Name of Heapster service</td>
    </tr>
    <tr>
    <td>no-headers</td><td></td><td>false</td><td>If present, print output without headers.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)</td>
    </tr>
    <tr>
    <td>sort-by</td><td></td><td></td><td>If non-empty, sort pods list using specified field. The field can be either 'cpu' or 'memory'.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

