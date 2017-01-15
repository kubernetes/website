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

>bdocs-tab:example Note: --prune is still in Alpha # Apply the configuration in manifest.yaml that matches label app=nginx and delete all the other resources that are not in the file and match label app=nginx.

```bdocs-tab:example_shell
kubectl apply --prune -f manifest.yaml -l app=nginx
```

>bdocs-tab:example Apply the configuration in manifest.yaml and delete all the other configmaps that are not in the file.

```bdocs-tab:example_shell
kubectl apply --prune -f manifest.yaml --all --prune-whitelist=core/v1/ConfigMap
```


Apply a configuration to a resource by filename or stdin. This resource will be created if it doesn't exist yet. To use 'apply', always create the resource initially with either 'apply' or 'create --save-config'. 

JSON and YAML formats are accepted. 

Alpha Disclaimer: the --prune functionality is not yet complete. Do not use unless you are aware of what the current state is. See https://issues.k8s.io/34274.

### Usage

`$ apply -f FILENAME`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | [-all] to select all the specified resources. 
cascade |  | true | Only relevant during a prune or a force apply. If true, cascade the deletion of the resources managed by pruned or deleted resources (e.g. Pods created by a ReplicationController). 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
filename | f | [] | Filename, directory, or URL to files that contains the configuration to apply 
force |  | false | Delete and re-create the specified resource, when PATCH encounters conflict and has retried for 5 times. 
grace-period |  | -1 | Only relevant during a prune or a force apply. Period of time in seconds given to pruned or deleted resources to terminate gracefully. Ignored if negative. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
overwrite |  | true | Automatically resolve conflicts between the modified and live configuration by using values from the modified configuration 
prune |  | false | Automatically delete resource objects that do not appear in the configs and are created by either apply or create --save-config. Should be used with either -l or --all. 
prune-whitelist |  | [] | Overwrite the default whitelist with <group/version/kind> for --prune 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
selector | l |  | Selector (label query) to filter on 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
timeout |  | 0s | Only relevant during a force apply. The length of time to wait before giving up on a delete of the old resource, zero means determine a timeout from the size of the object. Any other values should contain a corresponding time unit (e.g. 1s, 2m, 3h). 
validate |  | true | If true, use a schema to validate the input before sending it 


