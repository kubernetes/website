---
title: delete
content_template: templates/tool-reference
---

### Overview
Delete resources by filenames, stdin, resources and names, or by resources and label selector.

 JSON and YAML formats are accepted. Only one type of the arguments may be specified: filenames, resources and names, or resources and label selector.

 Some resources, such as pods, support graceful deletion. These resources define a default period before they are forcibly terminated (the grace period) but you may override that value with the --grace-period flag, or pass --now to set a grace-period of 1. Because these resources often represent entities in the cluster, deletion may not be acknowledged immediately. If the node hosting a pod is down or cannot reach the API server, termination may take significantly longer than the grace period. To force delete a resource, you must pass a grace period of 0 and specify the --force flag.

 IMPORTANT: Force deleting pods does not wait for confirmation that the pod's processes have been terminated, which can leave those processes running until the node detects the deletion and completes graceful deletion. If your processes use shared storage or talk to a remote API and depend on the name of the pod to identify themselves, force deleting those pods may result in multiple processes running on different machines using the same identification which may lead to data corruption or inconsistency. Only force delete pods when you are sure the pod is terminated, or if your application can tolerate multiple copies of the same pod running at once. Also, if you force delete pods the scheduler may place new pods on those nodes before the node has released those resources and causing those pods to be evicted immediately.

 Note that the delete command does NOT do resource version checks, so if someone submits an update to a resource right when you submit a delete, their update will be lost along with the rest of the resource.

### Usage

`delete ([-f FILENAME] | [-k DIRECTORY] | TYPE [(NAME | -l label | --all)])`


### Example

 Delete a pod using the type and name specified in pod.json.

```shell
kubectl delete -f ./pod.json
```

 Delete resources from a directory containing kustomization.yaml - e.g. dir/kustomization.yaml.

```shell
kubectl delete -k dir
```

 Delete a pod based on the type and name in the JSON passed into stdin.

```shell
cat pod.json | kubectl delete -f -
```

 Delete pods and services with same names "baz" and "foo"

```shell
kubectl delete pod,service baz foo
```

 Delete pods and services with label name=myLabel.

```shell
kubectl delete pods,services -l name=myLabel
```

 Delete a pod with minimal delay

```shell
kubectl delete pod foo --now
```

 Force delete a pod on a dead node

```shell
kubectl delete pod foo --grace-period=0 --force
```

 Delete all pods

```shell
kubectl delete pods --all
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
    <td>all</td><td></td><td>false</td><td>Delete all resources, including uninitialized ones, in the namespace of the specified resource types.</td>
    </tr>
    <tr>
    <td>all-namespaces</td><td>A</td><td>false</td><td>If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.</td>
    </tr>
    <tr>
    <td>cascade</td><td></td><td>true</td><td>If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController).  Default true.</td>
    </tr>
    <tr>
    <td>field-selector</td><td></td><td></td><td>Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector key1=value1,key2=value2). The server only supports a limited number of field queries per type.</td>
    </tr>
    <tr>
    <td>filename</td><td>f</td><td>[]</td><td>containing the resource to delete.</td>
    </tr>
    <tr>
    <td>force</td><td></td><td>false</td><td>Only used when grace-period=0. If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of some resources may result in inconsistency or data loss and requires confirmation.</td>
    </tr>
    <tr>
    <td>grace-period</td><td></td><td>-1</td><td>Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for immediate shutdown. Can only be set to 0 when --force is true (force deletion).</td>
    </tr>
    <tr>
    <td>ignore-not-found</td><td></td><td>false</td><td>Treat "resource not found" as a successful delete. Defaults to "true" when --all is specified.</td>
    </tr>
    <tr>
    <td>include-uninitialized</td><td></td><td>false</td><td>If true, the kubectl command applies to uninitialized objects. If explicitly set to false, this flag overrides other flags that make the kubectl commands apply to uninitialized objects, e.g., "--all". Objects with empty metadata.initializers are regarded as initialized.</td>
    </tr>
    <tr>
    <td>kustomize</td><td>k</td><td></td><td>Process a kustomization directory. This flag can't be used together with -f or -R.</td>
    </tr>
    <tr>
    <td>now</td><td></td><td>false</td><td>If true, resources are signaled for immediate shutdown (same as --grace-period=1).</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output mode. Use "-o name" for shorter output (resource/name).</td>
    </tr>
    <tr>
    <td>recursive</td><td>R</td><td>false</td><td>Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on, not including uninitialized ones.</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>0s</td><td>The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object</td>
    </tr>
    <tr>
    <td>wait</td><td></td><td>true</td><td>If true, wait for resources to be gone before returning. This waits for finalizers.</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

