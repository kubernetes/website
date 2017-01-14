------------

# stop

>bdocs-tab:example Shut down foo.

```bdocs-tab:example_shell
kubectl stop replicationcontroller foo
```

>bdocs-tab:example Stop pods and services with label name=myLabel.

```bdocs-tab:example_shell
kubectl stop pods,services -l name=myLabel
```

>bdocs-tab:example Shut down the service defined in service.json

```bdocs-tab:example_shell
kubectl stop -f service.json
```

>bdocs-tab:example Shut down all resources in the path/to/resources directory

```bdocs-tab:example_shell
kubectl stop -f path/to/resources
```


Deprecated: This command is deprecated, all its functionalities are covered by "kubectl delete"

### Usage

`$ stop (-f FILENAME | TYPE (NAME | -l label | --all))`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | [-all] to select all the specified resources. 
filename | f | [] | Filename, directory, or URL to files of resource(s) to be stopped. 
grace-period |  | -1 | Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. 
ignore-not-found |  | false | Treat "resource not found" as a successful stop. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
selector | l |  | Selector (label query) to filter on. 
timeout |  | 0s | The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the object 


