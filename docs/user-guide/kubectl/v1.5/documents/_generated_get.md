------------

# get

>bdocs-tab:example List all pods in ps output format.

```bdocs-tab:example_shell
kubectl get pods
```

>bdocs-tab:example List all pods in ps output format with more information (such as node name).

```bdocs-tab:example_shell
kubectl get pods -o wide
```

>bdocs-tab:example List a single replication controller with specified NAME in ps output format.

```bdocs-tab:example_shell
kubectl get replicationcontroller web
```

>bdocs-tab:example List a single pod in JSON output format.

```bdocs-tab:example_shell
kubectl get -o json pod web-pod-13je7
```

>bdocs-tab:example List a pod identified by type and name specified in "pod.yaml" in JSON output format.

```bdocs-tab:example_shell
kubectl get -f pod.yaml -o json
```

>bdocs-tab:example Return only the phase value of the specified pod.

```bdocs-tab:example_shell
kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}
```

>bdocs-tab:example List all replication controllers and services together in ps output format.

```bdocs-tab:example_shell
kubectl get rc,services
```

>bdocs-tab:example List one or more resources by their type and names.

```bdocs-tab:example_shell
kubectl get rc/web service/frontend pods/web-pod-13je7
```


Display one or many resources. 

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

This command will hide resources that have completed. For instance, pods that are in the Succeeded or Failed phases. You can see the full results for any resource by providing the '--show-all' flag. 

By specifying the output as 'template' and providing a Go template as the value of the --template flag, you can filter the attributes of the fetched resource(s).

### Usage

`$ get [(-o|--output=)json|yaml|wide|custom-columns=...|custom-columns-file=...|go-template=...|go-template-file=...|jsonpath=...|jsonpath-file=...] (TYPE [NAME | -l label] | TYPE/NAME ...) [flags]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all-namespaces |  | false | If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace. 
export |  | false | If true, use 'export' for the resources.  Exported resources are stripped of cluster-specific information. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
label-columns | L | [] | Accepts a comma separated list of labels that are going to be presented as columns. Names are case-sensitive. You can also use multiple flag options like -L label1 -L label2... 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
raw |  |  | Raw URI to request from the server.  Uses the transport specified by the kubeconfig file. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
selector | l |  | Selector (label query) to filter on 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-kind |  | false | If present, list the resource type for the requested object(s). 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
watch | w | false | After listing/getting the requested object, watch for changes. 
watch-only |  | false | Watch for changes to the requested object(s), without listing/getting first. 


