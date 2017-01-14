------------

# rolling-update

>bdocs-tab:example Update pods of frontend-v1 using new replication controller data in frontend-v2.json.

```bdocs-tab:example_shell
kubectl rolling-update frontend-v1 -f frontend-v2.json
```

>bdocs-tab:example Update pods of frontend-v1 using JSON data passed into stdin.

```bdocs-tab:example_shell
cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -
```

>bdocs-tab:example Update the pods of frontend-v1 to frontend-v2 by just changing the image, and switching the # name of the replication controller.

```bdocs-tab:example_shell
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2
```

>bdocs-tab:example Update the pods of frontend by just changing the image, and keeping the old name.

```bdocs-tab:example_shell
kubectl rolling-update frontend --image=image:v2
```

>bdocs-tab:example Abort and reverse an existing rollout in progress (from frontend-v1 to frontend-v2).

```bdocs-tab:example_shell
kubectl rolling-update frontend-v1 frontend-v2 --rollback
```


Perform a rolling update of the given ReplicationController. 

Replaces the specified replication controller with a new replication controller by updating one pod at a time to use the new PodTemplate. The new-controller.json must specify the same namespace as the existing replication controller and overwrite at least one (common) label in its replicaSelector. 

! http://kubernetes.io/images/docs/kubectl_rollingupdate.svg

### Usage

`$ rolling-update OLD_CONTROLLER_NAME ([NEW_CONTROLLER_NAME] --image=NEW_CONTAINER_IMAGE | -f NEW_CONTROLLER_SPEC)`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
container |  |  | Container name which will have its image upgraded. Only relevant when --image is specified, ignored otherwise. Required when using --image on a multi-container pod 
deployment-label-key |  | deployment | The key to use to differentiate between two different controllers, default 'deployment'.  Only relevant when --image is specified, ignored otherwise 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
filename | f | [] | Filename or URL to file to use to create the new replication controller. 
image |  |  | Image to use for upgrading the replication controller. Must be distinct from the existing image (either new image or new image tag).  Can not be used with --filename/-f 
image-pull-policy |  |  | Explicit policy for when to pull container images. Required when --image is same as existing image, ignored otherwise. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
poll-interval |  | 3s | Time delay between polling for replication controller status after the update. Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". 
rollback |  | false | If true, this is a request to abort an existing rollout that is partially rolled out. It effectively reverses current and next and runs a rollout 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
timeout |  | 5m0s | Max time to wait for a replication controller to update before giving up. Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". 
update-period |  | 1m0s | Time to wait between updating pods. Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". 
validate |  | true | If true, use a schema to validate the input before sending it 


