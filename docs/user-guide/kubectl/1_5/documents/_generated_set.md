------------

# set



Configure application resources 

These commands help you make changes to existing application resources.

### Usage

`$ set SUBCOMMAND`



------------

## <em>image</em>

>bdocs-tab:example Set a deployment's nginx container image to 'nginx:1.9.1', and its busybox container image to 'busybox'.

```bdocs-tab:example_shell
kubectl set image deployment/nginx busybox=busybox nginx=nginx:1.9.1
```

>bdocs-tab:example Update all deployments' and rc's nginx container's image to 'nginx:1.9.1'

```bdocs-tab:example_shell
kubectl set image deployments,rc nginx=nginx:1.9.1 --all
```

>bdocs-tab:example Update image of all containers of daemonset abc to 'nginx:1.9.1'

```bdocs-tab:example_shell
kubectl set image daemonset abc *=nginx:1.9.1
```

>bdocs-tab:example Print result (in yaml format) of updating nginx container image from local file, without hitting the server

```bdocs-tab:example_shell
kubectl set image -f path/to/file.yaml nginx=nginx:1.9.1 --local -o yaml
```


Update existing container image(s) of resources. 

Possible resources include (case insensitive): 

  pod (po), replicationcontroller (rc), deployment (deploy), daemonset (ds), job, replicaset (rs)

### Usage

`$ image (-f FILENAME | TYPE NAME) CONTAINER_NAME_1=CONTAINER_IMAGE_1 ... CONTAINER_NAME_N=CONTAINER_IMAGE_N`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | select all resources in the namespace of the specified resource types 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
local |  | false | If true, set image will NOT contact api-server but run locally. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
selector | l |  | Selector (label query) to filter on 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 



------------

## <em>resources</em>

>bdocs-tab:example Set a deployments nginx container cpu limits to "200m" and memory to "512Mi"

```bdocs-tab:example_shell
kubectl set resources deployment nginx -c=nginx --limits=cpu=200m,memory=512Mi
```

>bdocs-tab:example Set the resource request and limits for all containers in nginx

```bdocs-tab:example_shell
kubectl set resources deployment nginx --limits=cpu=200m,memory=512Mi --requests=cpu=100m,memory=256Mi
```

>bdocs-tab:example Remove the resource requests for resources on containers in nginx

```bdocs-tab:example_shell
kubectl set resources deployment nginx --limits=cpu=0,memory=0 --requests=cpu=0,memory=0
```

>bdocs-tab:example Print the result (in yaml format) of updating nginx container limits from a local, without hitting the server

```bdocs-tab:example_shell
kubectl set resources -f path/to/file.yaml --limits=cpu=200m,memory=512Mi --local -o yaml
```


Specify compute resource requirements (cpu, memory) for any resource that defines a pod template.  If a pod is successfully scheduled, it is guaranteed the amount of resource requested, but may burst up to its specified limits. 

for each compute resource, if a limit is specified and a request is omitted, the request will default to the limit. 

Possible resources include (case insensitive): replicationcontroller, deployment, daemonset, job, replicaset.

### Usage

`$ resources (-f FILENAME | TYPE NAME)  ([--limits=LIMITS & --requests=REQUESTS]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all |  | false | select all resources in the namespace of the specified resource types 
containers | c | * | The names of containers in the selected pod templates to change, all containers are selected by default - may use wildcards 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
filename | f | [] | Filename, directory, or URL to files identifying the resource to get from a server. 
limits |  |  | The resource requirement requests for this container.  For example, 'cpu=100m,memory=256Mi'.  Note that server side components may assign requests depending on the server configuration, such as limit ranges. 
local |  | false | If true, set resources will NOT contact api-server but run locally. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
requests |  |  | The resource requirement requests for this container.  For example, 'cpu=100m,memory=256Mi'.  Note that server side components may assign requests depending on the server configuration, such as limit ranges. 
selector | l |  | Selector (label query) to filter on 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 



