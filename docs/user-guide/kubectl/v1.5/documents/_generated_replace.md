------------

# replace

>bdocs-tab:example Replace a pod using the data in pod.json.

```bdocs-tab:example_shell
kubectl replace -f ./pod.json
```

>bdocs-tab:example Replace a pod based on the JSON passed into stdin.

```bdocs-tab:example_shell
cat pod.json | kubectl replace -f -
```

>bdocs-tab:example Update a single-container pod's image version (tag) to v4

```bdocs-tab:example_shell
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -
```

>bdocs-tab:example Force replace, delete and then re-create the resource

```bdocs-tab:example_shell
kubectl replace --force -f ./pod.json
```


Replace a resource by filename or stdin. 

JSON and YAML formats are accepted. If replacing an existing resource, the complete resource spec must be provided. This can be obtained by 

  $ kubectl get TYPE NAME -o yaml
  
Please refer to the models in https://htmlpreview.github.io/?https://github.com/kubernetes/kubernetes/blob/HEAD/docs/api-reference/v1/definitions.html to find if a field is mutable.

### Usage

`$ replace -f FILENAME`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
cascade |  | false | Only relevant during a force replace. If true, cascade the deletion of the resources managed by this resource (e.g. Pods created by a ReplicationController). 
filename | f | [] | Filename, directory, or URL to files to use to replace the resource. 
force |  | false | Delete and re-create the specified resource 
grace-period |  | -1 | Only relevant during a force replace. Period of time in seconds given to the old resource to terminate gracefully. Ignored if negative. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
timeout |  | 0s | Only relevant during a force replace. The length of time to wait before giving up on a delete of the old resource, zero means determine a timeout from the size of the object. Any other values should contain a corresponding time unit (e.g. 1s, 2m, 3h). 
validate |  | true | If true, use a schema to validate the input before sending it 


