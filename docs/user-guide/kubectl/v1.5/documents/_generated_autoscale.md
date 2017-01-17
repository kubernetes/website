------------

# autoscale

>bdocs-tab:example Auto scale a deployment "foo", with the number of pods between 2 and 10, target CPU utilization specified so a default autoscaling policy will be used:

```bdocs-tab:example_shell
kubectl autoscale deployment foo --min=2 --max=10
```

>bdocs-tab:example Auto scale a replication controller "foo", with the number of pods between 1 and 5, target CPU utilization at 80%:

```bdocs-tab:example_shell
kubectl autoscale rc foo --max=5 --cpu-percent=80
```


Creates an autoscaler that automatically chooses and sets the number of pods that run in a kubernetes cluster. 

Looks up a Deployment, ReplicaSet, or ReplicationController by name and creates an autoscaler that uses the given resource as a reference. An autoscaler can automatically increase or decrease number of pods deployed within the system as needed.

### Usage

`$ autoscale (-f FILENAME | TYPE NAME | TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
cpu-percent |  | -1 | The target average CPU utilization (represented as a percent of requested CPU) over all the pods. If it's not specified or negative, a default autoscaling policy will be used. 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to autoscale. 
generator |  | horizontalpodautoscaler/v1 | The name of the API generator to use. Currently there is only 1 generator. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
max |  | -1 | The upper limit for the number of pods that can be set by the autoscaler. Required. 
min |  | -1 | The lower limit for the number of pods that can be set by the autoscaler. If it's not specified or negative, the server will apply a default value. 
name |  |  | The name for the newly created object. If not specified, the name of the input resource will be used. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 


