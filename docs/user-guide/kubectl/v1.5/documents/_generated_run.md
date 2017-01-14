------------

# run

>bdocs-tab:example Start a single instance of nginx.

```bdocs-tab:example_shell
kubectl run nginx --image=nginx
```

>bdocs-tab:example Start a single instance of hazelcast and let the container expose port 5701 .

```bdocs-tab:example_shell
kubectl run hazelcast --image=hazelcast --port=5701
```

>bdocs-tab:example Start a single instance of hazelcast and set environment variables "DNS_DOMAIN=cluster" and "POD_NAMESPACE=default" in the container.

```bdocs-tab:example_shell
kubectl run hazelcast --image=hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
```

>bdocs-tab:example Start a replicated instance of nginx.

```bdocs-tab:example_shell
kubectl run nginx --image=nginx --replicas=5
```

>bdocs-tab:example Dry run. Print the corresponding API objects without creating them.

```bdocs-tab:example_shell
kubectl run nginx --image=nginx --dry-run
```

>bdocs-tab:example Start a single instance of nginx, but overload the spec of the deployment with a partial set of values parsed from JSON.

```bdocs-tab:example_shell
kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
```

>bdocs-tab:example Start a pod of busybox and keep it in the foreground, don't restart it if it exits.

```bdocs-tab:example_shell
kubectl run -i -t busybox --image=busybox --restart=Never
```

>bdocs-tab:example Start the nginx container using the default command, but use custom arguments (arg1 .. argN) for that command.

```bdocs-tab:example_shell
kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
```

>bdocs-tab:example Start the nginx container using a different command and custom arguments.

```bdocs-tab:example_shell
kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
```

>bdocs-tab:example Start the perl container to compute π to 2000 places and print it out.

```bdocs-tab:example_shell
kubectl run pi --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
```

>bdocs-tab:example Start the cron job to compute π to 2000 places and print it out every 5 minutes.

```bdocs-tab:example_shell
kubectl run pi --schedule="0/5 * * * ?" --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
```


Create and run a particular image, possibly replicated. 

Creates a deployment or job to manage the created container(s).

### Usage

`$ run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [--command] -- [COMMAND] [args...]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
attach |  | false | If true, wait for the Pod to start running, and then attach to the Pod as if 'kubectl attach ...' were called.  Default false, unless '-i/--stdin' is set, in which case the default is true. With '--restart=Never' the exit code of the container process is returned. 
command |  | false | If true and extra arguments are present, use them as the 'command' field in the container, rather than the 'args' field which is the default. 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
env |  | [] | Environment variables to set in the container 
expose |  | false | If true, a public, external service is created for the container(s) which are run 
generator |  |  | The name of the API generator to use, see http://kubernetes.io/docs/user-guide/kubectl-conventions/#generators for a list. 
hostport |  | -1 | The host port mapping for the container port. To demonstrate a single-machine container. 
image |  |  | The image for the container to run. 
image-pull-policy |  |  | The image pull policy for the container. If left empty, this value will not be specified by the client and defaulted by the server 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
labels | l |  | Labels to apply to the pod(s). 
leave-stdin-open |  | false | If the pod is started in interactive mode or with stdin, leave stdin open after the first attach completes. By default, stdin will be closed after the first attach completes. 
limits |  |  | The resource requirement limits for this container.  For example, 'cpu=200m,memory=512Mi'.  Note that server side components may assign limits depending on the server configuration, such as limit ranges. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
overrides |  |  | An inline JSON override for the generated object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field. 
port |  |  | The port that this container exposes.  If --expose is true, this is also the port used by the service that is created. 
quiet |  | false | If true, suppress prompt messages. 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
replicas | r | 1 | Number of replicas to create for this container. Default is 1. 
requests |  |  | The resource requirement requests for this container.  For example, 'cpu=100m,memory=256Mi'.  Note that server side components may assign requests depending on the server configuration, such as limit ranges. 
restart |  | Always | The restart policy for this Pod.  Legal values [Always, OnFailure, Never].  If set to 'Always' a deployment is created, if set to 'OnFailure' a job is created, if set to 'Never', a regular pod is created. For the latter two --replicas must be 1.  Default 'Always', for ScheduledJobs `Never`. 
rm |  | false | If true, delete resources created in this command for attached containers. 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schedule |  |  | A schedule in the Cron format the job should be run with. 
service-generator |  | service/v2 | The name of the generator to use for creating a service.  Only used if --expose is true 
service-overrides |  |  | An inline JSON override for the generated service object. If this is non-empty, it is used to override the generated object. Requires that the object supply a valid apiVersion field.  Only used if --expose is true. 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
stdin | i | false | Keep stdin open on the container(s) in the pod, even if nothing is attached. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
tty | t | false | Allocated a TTY for each container in the pod. 


