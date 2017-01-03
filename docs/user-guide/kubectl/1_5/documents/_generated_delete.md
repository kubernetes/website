------------

# delete

>bdocs-tab:example Delete a pod using the type and name specified in pod.json.

```bdocs-tab:example_shell
kubectl delete -f ./pod.json
```

>bdocs-tab:example Delete a pod based on the type and name in the JSON passed into stdin.

```bdocs-tab:example_shell
cat pod.json | kubectl delete -f -
```

>bdocs-tab:example Delete pods and services with same names "baz" and "foo"

```bdocs-tab:example_shell
kubectl delete pod,service baz foo
```

>bdocs-tab:example Delete pods and services with label name=myLabel.

```bdocs-tab:example_shell
kubectl delete pods,services -l name=myLabel
```

>bdocs-tab:example Delete a pod with minimal delay

```bdocs-tab:example_shell
kubectl delete pod foo --now
```

>bdocs-tab:example Force delete a pod on a dead node

```bdocs-tab:example_shell
kubectl delete pod foo --grace-period=0 --force
```

>bdocs-tab:example Delete a pod with UID 1234-56-7890-234234-456456.

```bdocs-tab:example_shell
kubectl delete pod 1234-56-7890-234234-456456
```

>bdocs-tab:example Delete all pods

```bdocs-tab:example_shell
kubectl delete pods --all
```


Delete resources by filenames, stdin, resources and names, or by resources and label selector. 

JSON and YAML formats are accepted. Only one type of the arguments may be specified: filenames, resources and names, or resources and label selector. 

Some resources, such as pods, support graceful deletion. These resources define a default period before they are forcibly terminated (the grace period) but you may override that value with the --grace-period flag, or pass --now to set a grace-period of 1. Because these resources often represent entities in the cluster, deletion may not be acknowledged immediately. If the node hosting a pod is down or cannot reach the API server, termination may take significantly longer than the grace period. To force delete a resource,  you must pass a grace   period of 0 and specify the --force flag. 

IMPORTANT: Force deleting pods does not wait for confirmation that the pod's processes have been terminated, which can leave those processes running until the node detects the deletion and completes graceful deletion. If your processes use shared storage or talk to a remote API and depend on the name of the pod to identify themselves, force deleting those pods may result in multiple processes running on different machines using the same identification which may lead to data corruption or inconsistency. Only force delete pods when you are sure the pod is terminated, or if your application can tolerate multiple copies of the same pod running at once. Also, if you force delete pods the scheduler may place new pods on those nodes before the node has released those resources and causing those pods to be evicted immediately. 

Note that the delete command does NOT do resource version checks, so if someone submits an update to a resource right when you submit a delete, their update will be lost along with the rest of the resource.

### Usage

`$ delete ([-f FILENAME] | TYPE [(NAME | -l label | --all)])`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | [-all] to select all the specified resources. 
cascade |  | true | If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController).  Default true. 
filename | f | [] | Filename, directory, or URL to files containing the resource to delete. 
force |  | false | Immediate deletion of some resources may result in inconsistency or data loss and requires confirmation. 
grace-period |  | -1 | Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. 
ignore-not-found |  | false | Treat "resource not found" as a successful delete. Defaults to "true" when --all is specified. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
now |  | false | If true, resources are signaled for immediate shutdown (same as --grace-period=1). 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
selector | l |  | Selector (label query) to filter on. 
timeout |  | 0s | The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object 


