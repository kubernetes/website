------------

# create

>bdocs-tab:example Create a pod using the data in pod.json.

```bdocs-tab:example_shell
kubectl create -f ./pod.json
```

>bdocs-tab:example Create a pod based on the JSON passed into stdin.

```bdocs-tab:example_shell
cat pod.json | kubectl create -f -
```

>bdocs-tab:example Edit the data in docker-registry.yaml in JSON using the v1 API format then create the resource using the edited data.

```bdocs-tab:example_shell
kubectl create -f docker-registry.yaml --edit --output-version=v1 -o json
```


Create a resource by filename or stdin. 

JSON and YAML formats are accepted.

### Usage

`$ create -f FILENAME`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
edit |  | false | Edit the API resource before creating 
filename | f | [] | Filename, directory, or URL to files to use to create the resource 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
record |  | false | Record current kubectl command in the resource annotation. If set to false, do not record the command. If set to true, record the command. If not set, default to updating the existing annotation value only if one already exists. 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 
windows-line-endings |  | false | Only relevant if --edit=true. Use Windows line-endings (default Unix line-endings) 


------------

## <em>configmap</em>

>bdocs-tab:example Create a new configmap named my-config with keys for each file in folder bar

```bdocs-tab:example_shell
kubectl create configmap my-config --from-file=path/to/bar
```

>bdocs-tab:example Create a new configmap named my-config with specified keys instead of names on disk

```bdocs-tab:example_shell
kubectl create configmap my-config --from-file=key1=/path/to/bar/file1.txt --from-file=key2=/path/to/bar/file2.txt
```

>bdocs-tab:example Create a new configmap named my-config with key1=config1 and key2=config2

```bdocs-tab:example_shell
kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2
```


Create a configmap based on a file, directory, or specified literal value. 

A single configmap may package one or more key/value pairs. 

When creating a configmap based on a file, the key will default to the basename of the file, and the value will default to the file content.  If the basename is an invalid key, you may specify an alternate key. 

When creating a configmap based on a directory, each file whose basename is a valid key in the directory will be packaged into the configmap.  Any directory entries except regular files are ignored (e.g. subdirectories, symlinks, devices, pipes, etc).

### Usage

`$ configmap NAME [--from-file=[key=]source] [--from-literal=key1=value1] [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
from-file |  | [] | Key files can be specified using their file path, in which case a default name will be given to them, or optionally with a name and file path, in which case the given name will be used.  Specifying a directory will iterate each named file in the directory that is a valid configmap key. 
from-literal |  | [] | Specify a key and literal value to insert in configmap (i.e. mykey=somevalue) 
generator |  | configmap/v1 | The name of the API generator to use. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>deployment</em>

>bdocs-tab:example Create a new deployment named my-dep that runs the busybox image.

```bdocs-tab:example_shell
kubectl create deployment my-dep --image=busybox
```


Create a deployment with the specified name.

### Usage

`$ deployment NAME --image=image [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | deployment-basic/v1beta1 | The name of the API generator to use. 
image |  | [] | Image name to run. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>namespace</em>

>bdocs-tab:example Create a new namespace named my-namespace

```bdocs-tab:example_shell
kubectl create namespace my-namespace
```


Create a namespace with the specified name.

### Usage

`$ namespace NAME [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | namespace/v1 | The name of the API generator to use. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>quota</em>

>bdocs-tab:example Create a new resourcequota named my-quota

```bdocs-tab:example_shell
$ kubectl create quota my-quota --hard=cpu=1,memory=1G,pods=2,services=3,replicationcontrollers=2,resourcequotas=1,secrets=5,persistentvolumeclaims=10
```

>bdocs-tab:example Create a new resourcequota named best-effort

```bdocs-tab:example_shell
$ kubectl create quota best-effort --hard=pods=100 --scopes=BestEffort
```


Create a resourcequota with the specified name, hard limits and optional scopes

### Usage

`$ quota NAME [--hard=key1=value1,key2=value2] [--scopes=Scope1,Scope2] [--dry-run=bool]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | resourcequotas/v1 | The name of the API generator to use. 
hard |  |  | A comma-delimited set of resource=quantity pairs that define a hard limit. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
scopes |  |  | A comma-delimited set of quota scopes that must all match each object tracked by the quota. 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>secret</em>



Create a secret using specified subcommand.

### Usage

`$ secret`




------------

## <em>secret docker-registry</em>

>bdocs-tab:example If you don't already have a .dockercfg file, you can create a dockercfg secret directly by using:

```bdocs-tab:example_shell
kubectl create secret docker-registry my-secret --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```


Create a new secret for use with Docker registries. 

Dockercfg secrets are used to authenticate against Docker registries. 

When using the Docker command line to push images, you can authenticate to a given registry by running 

  $ docker login DOCKER_REGISTRY_SERVER --username=DOCKER_USER --password=DOCKER_PASSWORD --email=DOCKER_EMAIL'.
  
That produces a ~/.dockercfg file that is used by subsequent 'docker push' and 'docker pull' commands to authenticate to the registry. 

When creating applications, you may have a Docker registry that requires authentication.  In order for the nodes to pull images on your behalf, they have to have the credentials.  You can provide this information by creating a dockercfg secret and attaching it to your service account.

### Usage

`$ docker-registry NAME --docker-username=user --docker-password=password --docker-email=email [--docker-server=string] [--from-literal=key1=value1] [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
docker-email |  |  | Email for Docker registry 
docker-password |  |  | Password for Docker registry authentication 
docker-server |  | https://index.docker.io/v1/ | Server location for Docker registry 
docker-username |  |  | Username for Docker registry authentication 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | secret-for-docker-registry/v1 | The name of the API generator to use. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>secret generic</em>

>bdocs-tab:example Create a new secret named my-secret with keys for each file in folder bar

```bdocs-tab:example_shell
kubectl create secret generic my-secret --from-file=path/to/bar
```

>bdocs-tab:example Create a new secret named my-secret with specified keys instead of names on disk

```bdocs-tab:example_shell
kubectl create secret generic my-secret --from-file=ssh-privatekey=~/.ssh/id_rsa --from-file=ssh-publickey=~/.ssh/id_rsa.pub
```

>bdocs-tab:example Create a new secret named my-secret with key1=supersecret and key2=topsecret

```bdocs-tab:example_shell
kubectl create secret generic my-secret --from-literal=key1=supersecret --from-literal=key2=topsecret
```


Create a secret based on a file, directory, or specified literal value. 

A single secret may package one or more key/value pairs. 

When creating a secret based on a file, the key will default to the basename of the file, and the value will default to the file content.  If the basename is an invalid key, you may specify an alternate key. 

When creating a secret based on a directory, each file whose basename is a valid key in the directory will be packaged into the secret.  Any directory entries except regular files are ignored (e.g. subdirectories, symlinks, devices, pipes, etc).

### Usage

`$ generic NAME [--type=string] [--from-file=[key=]source] [--from-literal=key1=value1] [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
from-file |  | [] | Key files can be specified using their file path, in which case a default name will be given to them, or optionally with a name and file path, in which case the given name will be used.  Specifying a directory will iterate each named file in the directory that is a valid secret key. 
from-literal |  | [] | Specify a key and literal value to insert in secret (i.e. mykey=somevalue) 
generator |  | secret/v1 | The name of the API generator to use. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
type |  |  | The type of secret to create 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>secret tls</em>

>bdocs-tab:example Create a new TLS secret named tls-secret with the given key pair:

```bdocs-tab:example_shell
kubectl create secret tls tls-secret --cert=path/to/tls.cert --key=path/to/tls.key
```


Create a TLS secret from the given public/private key pair. 

The public/private key pair must exist before hand. The public key certificate must be .PEM encoded and match the given private key.

### Usage

`$ tls NAME --cert=path/to/cert/file --key=path/to/key/file [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
cert |  |  | Path to PEM encoded public key certificate. 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | secret-for-tls/v1 | The name of the API generator to use. 
key |  |  | Path to private key associated with given certificate. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>service</em>



Create a service using specified subcommand.

### Usage

`$ service`




------------

## <em>service clusterip</em>

>bdocs-tab:example Create a new clusterIP service named my-cs

```bdocs-tab:example_shell
kubectl create service clusterip my-cs --tcp=5678:8080
```

>bdocs-tab:example Create a new clusterIP service named my-cs (in headless mode)

```bdocs-tab:example_shell
kubectl create service clusterip my-cs --clusterip="None"
```


Create a clusterIP service with the specified name.

### Usage

`$ clusterip NAME [--tcp=<port>:<targetPort>] [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
clusterip |  |  | Assign your own ClusterIP or set to 'None' for a 'headless' service (no loadbalancing). 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | service-clusterip/v1 | The name of the API generator to use. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
tcp |  | [] | Port pairs can be specified as '<port>:<targetPort>'. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>service loadbalancer</em>

>bdocs-tab:example Create a new LoadBalancer service named my-lbs

```bdocs-tab:example_shell
kubectl create service loadbalancer my-lbs --tcp=5678:8080
```


Create a LoadBalancer service with the specified name.

### Usage

`$ loadbalancer NAME [--tcp=port:targetPort] [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | service-loadbalancer/v1 | The name of the API generator to use. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
tcp |  | [] | Port pairs can be specified as '<port>:<targetPort>'. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>service nodeport</em>

>bdocs-tab:example Create a new nodeport service named my-ns

```bdocs-tab:example_shell
kubectl create service nodeport my-ns --tcp=5678:8080
```


Create a nodeport service with the specified name.

### Usage

`$ nodeport NAME [--tcp=port:targetPort] [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | service-nodeport/v1 | The name of the API generator to use. 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
node-port |  | 0 | Port used to expose the service on each node in a cluster. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
tcp |  | [] | Port pairs can be specified as '<port>:<targetPort>'. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



------------

## <em>serviceaccount</em>

>bdocs-tab:example Create a new service account named my-service-account

```bdocs-tab:example_shell
$ kubectl create serviceaccount my-service-account
```


Create a service account with the specified name.

### Usage

`$ serviceaccount NAME [--dry-run]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
dry-run |  | false | If true, only print the object that would be sent, without sending it. 
generator |  | serviceaccount/v1 | The name of the API generator to use. 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
save-config |  | false | If true, the configuration of current object will be saved in its annotation. This is useful when you want to perform kubectl apply on this object in the future. 
schema-cache-dir |  | ~/.kube/schema | If non-empty, load/store cached API schemas in this directory, default is '$HOME/.kube/schema' 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 
validate |  | true | If true, use a schema to validate the input before sending it 



