------------

# config



Modify kubeconfig files using subcommands like "kubectl config set current-context my-context" 

The loading order follows these rules: 

  1. If the --kubeconfig flag is set, then only that file is loaded.  The flag may only be set once and no merging takes place.  
  2. If $KUBECONFIG environment variable is set, then it is used a list of paths (normal path delimitting rules for your system).  These paths are merged.  When a value is modified, it is modified in the file that defines the stanza.  When a value is created, it is created in the first file that exists.  If no files in the chain exist, then it creates the last file in the list.  
  3. Otherwise, ${HOME}/.kube/config is used and no merging takes place.

### Usage

`$ config SUBCOMMAND`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
kubeconfig |  |  | use a particular kubeconfig file 


------------

## <em>current-context</em>

>bdocs-tab:example Display the current-context

```bdocs-tab:example_shell
kubectl config current-context
```


Displays the current-context

### Usage

`$ current-context`




------------

## <em>delete-cluster</em>





### Usage

`$ delete-cluster NAME`




------------

## <em>delete-context</em>





### Usage

`$ delete-context NAME`




------------

## <em>get-clusters</em>





### Usage

`$ get-clusters`




------------

## <em>get-contexts</em>

>bdocs-tab:example List all the contexts in your kubeconfig file

```bdocs-tab:example_shell
kubectl config get-contexts
```

>bdocs-tab:example Describe one context in your kubeconfig file.

```bdocs-tab:example_shell
kubectl config get-contexts my-context
```


Displays one or many contexts from the kubeconfig file.

### Usage

`$ get-contexts [(-o|--output=)name)]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 



------------

## <em>set</em>



Sets an individual value in a kubeconfig file 

PROPERTY _NAME is a dot delimited name where each token represents either an attribute name or a map key.  Map keys may not contain dots. 

PROPERTY _VALUE is the new value you wish to set. Binary fields such as 'certificate-authority-data' expect a base64 encoded string unless the --set-raw-bytes flag is used.

### Usage

`$ set PROPERTY_NAME PROPERTY_VALUE`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
set-raw-bytes |  | false | When writing a []byte PROPERTY_VALUE, write the given string directly without base64 decoding. 



------------

## <em>set-cluster</em>

>bdocs-tab:example Set only the server field on the e2e cluster entry without touching other values.

```bdocs-tab:example_shell
kubectl config set-cluster e2e --server=https://1.2.3.4
```

>bdocs-tab:example Embed certificate authority data for the e2e cluster entry

```bdocs-tab:example_shell
kubectl config set-cluster e2e --certificate-authority=~/.kube/e2e/kubernetes.ca.crt
```

>bdocs-tab:example Disable cert checking for the dev cluster entry

```bdocs-tab:example_shell
kubectl config set-cluster e2e --insecure-skip-tls-verify=true
```


Sets a cluster entry in kubeconfig. 

Specifying a name that already exists will merge new fields on top of existing values for those fields.

### Usage

`$ set-cluster NAME [--server=server] [--certificate-authority=path/to/certificate/authority] [--insecure-skip-tls-verify=true]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
api-version |  |  | api-version for the cluster entry in kubeconfig 
certificate-authority |  |  | path to certificate-authority file for the cluster entry in kubeconfig 
embed-certs |  | false | embed-certs for the cluster entry in kubeconfig 
insecure-skip-tls-verify |  | false | insecure-skip-tls-verify for the cluster entry in kubeconfig 
server |  |  | server for the cluster entry in kubeconfig 



------------

## <em>set-context</em>

>bdocs-tab:example Set the user field on the gce context entry without touching other values

```bdocs-tab:example_shell
kubectl config set-context gce --user=cluster-admin
```


Sets a context entry in kubeconfig 

Specifying a name that already exists will merge new fields on top of existing values for those fields.

### Usage

`$ set-context NAME [--cluster=cluster_nickname] [--user=user_nickname] [--namespace=namespace]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
cluster |  |  | cluster for the context entry in kubeconfig 
namespace |  |  | namespace for the context entry in kubeconfig 
user |  |  | user for the context entry in kubeconfig 



------------

## <em>set-credentials</em>

>bdocs-tab:example Set only the "client-key" field on the "cluster-admin" # entry, without touching other values:

```bdocs-tab:example_shell
kubectl config set-credentials cluster-admin --client-key=~/.kube/admin.key
```

>bdocs-tab:example Set basic auth for the "cluster-admin" entry

```bdocs-tab:example_shell
kubectl config set-credentials cluster-admin --username=admin --password=uXFGweU9l35qcif
```

>bdocs-tab:example Embed client certificate data in the "cluster-admin" entry

```bdocs-tab:example_shell
kubectl config set-credentials cluster-admin --client-certificate=~/.kube/admin.crt --embed-certs=true
```

>bdocs-tab:example Enable the Google Compute Platform auth provider for the "cluster-admin" entry

```bdocs-tab:example_shell
kubectl config set-credentials cluster-admin --auth-provider=gcp
```

>bdocs-tab:example Enable the OpenID Connect auth provider for the "cluster-admin" entry with additional args

```bdocs-tab:example_shell
kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-id=foo --auth-provider-arg=client-secret=bar
```

>bdocs-tab:example Remove the "client-secret" config value for the OpenID Connect auth provider for the "cluster-admin" entry

```bdocs-tab:example_shell
kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-secret-
```


Sets a user entry in kubeconfig 

Specifying a name that already exists will merge new fields on top of existing values. 

  Client-certificate flags:
  --client-certificate=certfile --client-key=keyfile
  
  Bearer token flags:
    --token=bearer_token
  
  Basic auth flags:
    --username=basic_user --password=basic_password
  
Bearer token and basic auth are mutually exclusive.

### Usage

`$ set-credentials NAME [--client-certificate=path/to/certfile] [--client-key=path/to/keyfile] [--token=bearer_token] [--username=basic_user] [--password=basic_password] [--auth-provider=provider_name] [--auth-provider-arg=key=value]`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
auth-provider |  |  | auth provider for the user entry in kubeconfig 
auth-provider-arg |  | [] | 'key=value' arugments for the auth provider 
client-certificate |  |  | path to client-certificate file for the user entry in kubeconfig 
client-key |  |  | path to client-key file for the user entry in kubeconfig 
embed-certs |  | false | embed client cert/key for the user entry in kubeconfig 
password |  |  | password for the user entry in kubeconfig 
token |  |  | token for the user entry in kubeconfig 
username |  |  | username for the user entry in kubeconfig 



------------

## <em>unset</em>



Unsets an individual value in a kubeconfig file 

PROPERTY _NAME is a dot delimited name where each token represents either an attribute name or a map key.  Map keys may not contain dots.

### Usage

`$ unset PROPERTY_NAME`




------------

## <em>use-context</em>



Sets the current-context in a kubeconfig file

### Usage

`$ use-context CONTEXT_NAME`




------------

## <em>view</em>

>bdocs-tab:example Show Merged kubeconfig settings.

```bdocs-tab:example_shell
kubectl config view
```

>bdocs-tab:example Get the password for the e2e user

```bdocs-tab:example_shell
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'
```


Display merged kubeconfig settings or a specified kubeconfig file. 

You can use --output jsonpath={...} to extract specific values using a jsonpath expression.

### Usage

`$ view`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
flatten |  | false | flatten the resulting kubeconfig file into self-contained output (useful for creating portable kubeconfig files) 
merge |  | true | merge the full hierarchy of kubeconfig files 
minify |  | false | remove all information not used by current-context from the output 
no-headers |  | false | When using the default or custom-column output format, don't print headers. 
output | o |  | Output format. One of: json&#124;yaml&#124;wide&#124;name&#124;custom-columns=...&#124;custom-columns-file=...&#124;go-template=...&#124;go-template-file=...&#124;jsonpath=...&#124;jsonpath-file=... See custom columns [http://kubernetes.io/docs/user-guide/kubectl-overview/#custom-columns], golang template [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template [http://kubernetes.io/docs/user-guide/jsonpath]. 
output-version |  |  | Output the formatted object with the given group version (for ex: 'extensions/v1beta1'). 
raw |  | false | display raw byte data 
show-all | a | false | When printing, show all resources (default hide terminated pods.) 
show-labels |  | false | When printing, show all labels as the last column (default hide labels column) 
sort-by |  |  | If non-empty, sort list types using this field specification.  The field specification is expressed as a JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath expression must be an integer or a string. 
template |  |  | Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]. 



