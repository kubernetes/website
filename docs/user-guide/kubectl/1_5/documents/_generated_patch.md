------------

# patch

>bdocs-tab:example Partially update a node using strategic merge patch

```bdocs-tab:example_shell
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'
```

>bdocs-tab:example Partially update a node identified by the type and name specified in "node.json" using strategic merge patch

```bdocs-tab:example_shell
kubectl patch -f node.json -p '{"spec":{"unschedulable":true}}'
```

>bdocs-tab:example Update a container's image; spec.containers[*].name is required because it's a merge key

```bdocs-tab:example_shell
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'
```

>bdocs-tab:example Update a container's image using a json patch with positional arrays

```bdocs-tab:example_shell
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'
```


Update field(s) of a resource using strategic merge patch 

JSON and YAML formats are accepted. 

Please refer to the models in https://htmlpreview.github.io/?https://github.com/kubernetes/kubernetes/blob/HEAD/docs/api-reference/v1/definitions.html to find if a field is mutable.

### Usage

`$ patch (-f FILENAME | TYPE NAME) -p PATCH`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files identifying the resource to update 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
local |  | false | If true, patch will operate on the content of the file, not the server-side resource. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
patch | p |  | The patch to be applied to the resource JSON file. 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
type |  | strategic | The type of patch being provided; one of [json merge strategic] 


