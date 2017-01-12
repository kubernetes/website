------------

# annotate

>bdocs-tab:example Update pod 'foo' with the annotation 'description' and the value 'my frontend'. # If the same annotation is set multiple times, only the last value will be applied

```bdocs-tab:example_shell
kubectl annotate pods foo description='my frontend'
```

>bdocs-tab:example Update a pod identified by type and name in "pod.json"

```bdocs-tab:example_shell
kubectl annotate -f pod.json description='my frontend'
```

>bdocs-tab:example Update pod 'foo' with the annotation 'description' and the value 'my frontend running nginx', overwriting any existing value.

```bdocs-tab:example_shell
kubectl annotate --overwrite pods foo description='my frontend running nginx'
```

>bdocs-tab:example Update all pods in the namespace

```bdocs-tab:example_shell
kubectl annotate pods --all description='my frontend running nginx'
```

>bdocs-tab:example Update pod 'foo' only if the resource is unchanged from version 1.

```bdocs-tab:example_shell
kubectl annotate pods foo description='my frontend running nginx' --resource-version=1
```

>bdocs-tab:example Update pod 'foo' by removing an annotation named 'description' if it exists. # Does not require the --overwrite flag.

```bdocs-tab:example_shell
kubectl annotate pods foo description-
```


Update the annotations on one or more resources. 

  * An annotation is a key/value pair that can hold larger (compared to a label), and possibly not human-readable, data.  
  * It is intended to store non-identifying auxiliary data, especially data manipulated by tools and system extensions.  
  * If --overwrite is true, then existing annotations can be overwritten, otherwise attempting to overwrite an annotation will result in an error.  
  * If --resource-version is specified, then updates will use this resource version, otherwise the existing resource-version will be used.  

Valid resource types include: 

  * clusters (valid only for federation apiservers)  
  * componentstatuses (aka 'cs')  
  * configmaps (aka 'cm')  
  * daemonsets (aka 'ds')  
  * deployments (aka 'deploy')  
  * endpoints (aka 'ep')  
  * events (aka 'ev')  
  * horizontalpodautoscalers (aka 'hpa')  
  * ingresses (aka 'ing')  
  * jobs  
  * limitranges (aka 'limits')  
  * namespaces (aka 'ns')  
  * networkpolicies  
  * nodes (aka 'no')  
  * persistentvolumeclaims (aka 'pvc')  
  * persistentvolumes (aka 'pv')  
  * pods (aka 'po')  
  * podsecuritypolicies (aka 'psp')  
  * podtemplates  
  * replicasets (aka 'rs')  
  * replicationcontrollers (aka 'rc')  
  * resourcequotas (aka 'quota')  
  * secrets  
  * serviceaccounts (aka 'sa')  
  * services (aka 'svc')  
  * statefulsets  
  * storageclasses  
  * thirdpartyresources

### Usage

`$ annotate [--overwrite] (-f FILENAME | TYPE NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | select all resources in the namespace of the specified resource types 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to update the annotation 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
local |  | false | If true, annotation will NOT contact api-server but run locally. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
overwrite |  | false | If true, allow annotations to be overwritten, otherwise reject annotation updates that overwrite existing annotations. 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
resource-version |  |  | If non-empty, the annotation update will only succeed if this is the current resource-version for the object. Only valid when specifying a single resource. 
selector | l |  | Selector (label query) to filter on 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 


