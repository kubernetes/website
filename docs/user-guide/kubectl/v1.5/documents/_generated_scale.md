------------

# scale

>bdocs-tab:example Scale a replicaset named 'foo' to 3.

```bdocs-tab:example_shell
kubectl scale --replicas=3 rs/foo
```

>bdocs-tab:example Scale a resource identified by type and name specified in "foo.yaml" to 3.

```bdocs-tab:example_shell
kubectl scale --replicas=3 -f foo.yaml
```

>bdocs-tab:example If the deployment named mysql's current size is 2, scale mysql to 3.

```bdocs-tab:example_shell
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql
```

>bdocs-tab:example Scale multiple replication controllers.

```bdocs-tab:example_shell
kubectl scale --replicas=5 rc/foo rc/bar rc/baz
```

>bdocs-tab:example Scale job named 'cron' to 3.

```bdocs-tab:example_shell
kubectl scale --replicas=3 job/cron
```


Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job. 

Scale also allows users to specify one or more preconditions for the scale action. 

If --current-replicas or --resource-version is specified, it is validated before the scale is attempted, and it is guaranteed that the precondition holds true when the scale is sent to the server.

### Usage

`$ scale [--resource-version=version] [--current-replicas=count] --replicas=COUNT (-f FILENAME | TYPE NAME)`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
current-replicas |  | -1 | Precondition for current size. Requires that the current size of the resource match this value in order to scale. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to set a new size 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
output | o |  | Output mode. Use "-o name" for shorter output (resource/name). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
replicas |  | -1 | The new desired number of replicas. Required. 
resource-version |  |  | Precondition for resource version. Requires that the current resource version match this value in order to scale. 
timeout |  | 0s | The length of time to wait before giving up on a scale operation, zero means don't wait. Any other values should contain a corresponding time unit (e.g. 1s, 2m, 3h). 


