------------

# apply

>bdocs-tab:example Apply the configuration in pod.json to a pod.

```bdocs-tab:example_shell
kubectl apply -f ./pod.json
```

>bdocs-tab:example Apply the JSON passed into stdin to a pod.

```bdocs-tab:example_shell
cat pod.json | kubectl apply -f -
```



Apply a configuration to a resource by filename or stdin.
This resource will be created if it doesn't exist yet.
To use 'apply', always create the resource initially with either 'apply' or 'create --save-config'.

JSON and YAML formats are accepted.

Alpha Disclaimer: the --prune functionality is not yet complete. Do not use unless you are aware of what the current state is. See https://issues.k8s.io/34274.

### Usage

`$ apply -f FILENAME`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | [-all] to select all the specified resources. 
cascade |  | true | Only relevant during a prune. If true, cascade the deletion of the resources managed by pruned resources (e.g. Pods created by a ReplicationController). 
filename | f | [] | Filename, directory, or URL to files that contains the configuration to apply 
grace-period |  | -1 | Period of time in seconds given to pruned resources to terminate gracefully. Ignored if negative. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
overwrite |  | true | Automatically resolve conflicts between the modified and live configuration by using values from the modified configuration 
prune |  | false | Automatically delete resource objects that do not appear in the configs 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
selector | l |  | Selector (label query) to filter on 
validate |  | true | If true, use a schema to validate the input before sending it 


