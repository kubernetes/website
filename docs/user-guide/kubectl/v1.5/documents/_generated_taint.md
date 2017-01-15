------------

# taint

>bdocs-tab:example Update node 'foo' with a taint with key 'dedicated' and value 'special-user' and effect 'NoSchedule'. # If a taint with that key and effect already exists, its value is replaced as specified.

```bdocs-tab:example_shell
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

>bdocs-tab:example Remove from node 'foo' the taint with key 'dedicated' and effect 'NoSchedule' if one exists.

```bdocs-tab:example_shell
kubectl taint nodes foo dedicated:NoSchedule-
```

>bdocs-tab:example Remove from node 'foo' all the taints with key 'dedicated'

```bdocs-tab:example_shell
kubectl taint nodes foo dedicated-
```


Update the taints on one or more nodes. 

  * A taint consists of a key, value, and effect. As an argument here, it is expressed as key=value:effect.  
  * The key must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to  253 characters.  
  * The value must begin with a letter or number, and may contain letters, numbers, hyphens, dots, and underscores, up to  253 characters.  
  * The effect must be NoSchedule or PreferNoSchedule.  
  * Currently taint can only apply to node.

### Usage

`$ taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | select all nodes in the cluster 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
overwrite |  | false | If true, allow taints to be overwritten, otherwise reject taint updates that overwrite existing taints. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
selector | l |  | Selector (label query) to filter on 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 


