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

>bdocs-tab:example Delete a pod immediately (no graceful shutdown)

```bdocs-tab:example_shell
kubectl delete pod foo --now
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

JSON and YAML formats are accepted.

Only one type of the arguments may be specified: filenames, resources and names, or resources and label selector

Note that the delete command does NOT do resource version checks, so if someone
submits an update to a resource right when you submit a delete, their update
will be lost along with the rest of the resource.

### Usage

`$ delete ([-f FILENAME] | TYPE [(NAME | -l label | --all)])`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | [-all] to select all the specified resources. 
cascade |  | true | If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController).  Default true. 
filename | f | [] | Filename, directory, or URL to files containing the resource to delete. 
grace-period |  | -1 | Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. 
ignore-not-found |  | false | Treat "resource not found" as a successful delete. Defaults to "true" when --all is specified. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
now |  | false | If true, resources are force terminated without graceful deletion (same as --grace-period=0). 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
selector | l |  | Selector (label query) to filter on. 
timeout |  | 0s | The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object 


