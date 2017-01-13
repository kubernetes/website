------------

# convert

>bdocs-tab:example Convert 'pod.yaml' to latest version and print to stdout.

```bdocs-tab:example_shell
kubectl convert -f pod.yaml
```

>bdocs-tab:example Convert the live state of the resource specified by 'pod.yaml' to the latest version # and print to stdout in json format.

```bdocs-tab:example_shell
kubectl convert -f pod.yaml --local -o json
```

>bdocs-tab:example Convert all files under current directory to latest version and create them all.

```bdocs-tab:example_shell
kubectl convert -f . | kubectl create -f -
```


Convert config files between different API versions. Both YAML and JSON formats are accepted. 

The command takes filename, directory, or URL as input, and convert it into format of version specified by --output-version flag. If target version is not specified or not supported, convert to latest version. 

The default output will be printed to stdout in YAML format. One can use -o option to change to output destination.

### Usage

`$ convert -f FILENAME`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
filename | f | [] | Filename, directory, or URL to files to need to get converted. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
local |  | true | If true, convert will NOT try to contact api-server but run locally. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 


