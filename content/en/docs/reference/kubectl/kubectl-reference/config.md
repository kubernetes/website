---
title: config
noedit: true
layout: kuberef
---

### Overview
Modify kubeconfig files using subcommands like "kubectl config set current-context my-context"

 The loading order follows these rules:

  1.  If the --kubeconfig flag is set, then only that file is loaded. The flag may only be set once and no merging takes place.
  2.  If $KUBECONFIG environment variable is set, then it is used as a list of paths (normal path delimiting rules for your system). These paths are merged. When a value is modified, it is modified in the file that defines the stanza. When a value is created, it is created in the first file that exists. If no files in the chain exist, then it creates the last file in the list.
  3.  Otherwise, ${HOME}/.kube/config is used and no merging takes place.

### Usage

`config SUBCOMMAND`






<hr>

## current-context


### Overview
Displays the current-context

### Usage

`current-context`


### Example
 Display the current-context

```shell
kubectl config current-context
```






<hr>

## delete-cluster


### Overview
Delete the specified cluster from the kubeconfig

### Usage

`delete-cluster NAME`


### Example
 Delete the minikube cluster

```shell
kubectl config delete-cluster minikube
```






<hr>

## delete-context


### Overview
Delete the specified context from the kubeconfig

### Usage

`delete-context NAME`


### Example
 Delete the context for the minikube cluster

```shell
kubectl config delete-context minikube
```






<hr>

## get-clusters


### Overview
Display clusters defined in the kubeconfig.

### Usage

`get-clusters`


### Example
 List the clusters kubectl knows about

```shell
kubectl config get-clusters
```






<hr>

## get-contexts


### Overview
Displays one or many contexts from the kubeconfig file.

### Usage

`get-contexts [(-o|--output=)name)]`


### Example
 List all the contexts in your kubeconfig file

```shell
kubectl config get-contexts
```

 Describe one context in your kubeconfig file.

```shell
kubectl config get-contexts my-context
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>no-headers</td><td></td><td>false</td><td>When using the default or custom-column output format, don't print headers (default print headers).</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td></td><td>Output format. One of: name</td>
    </tr>
</tbody>
</table></div>



<hr>

## rename-context


### Overview
Renames a context from the kubeconfig file.

 CONTEXT_NAME is the context name that you wish to change.

 NEW_NAME is the new name you wish to set.

 Note: In case the context being renamed is the 'current-context', this field will also be updated.

### Usage

`rename-context CONTEXT_NAME NEW_NAME`


### Example
 Rename the context 'old-name' to 'new-name' in your kubeconfig file

```shell
kubectl config rename-context old-name new-name
```






<hr>

## set


### Overview
Sets an individual value in a kubeconfig file

 PROPERTY_NAME is a dot delimited name where each token represents either an attribute name or a map key.  Map keys may not contain dots.

 PROPERTY_VALUE is the new value you wish to set. Binary fields such as 'certificate-authority-data' expect a base64 encoded string unless the --set-raw-bytes flag is used.

 Specifying a attribute name that already exists will merge new fields on top of existing values.

### Usage

`set PROPERTY_NAME PROPERTY_VALUE`


### Example
 Set server field on the my-cluster cluster to https://1.2.3.4

```shell
kubectl config set clusters.my-cluster.server https://1.2.3.4
```

 Set certificate-authority-data field on the my-cluster cluster.

```shell
kubectl config set clusters.my-cluster.certificate-authority-data $(echo "cert_data_here" | base64 -i -)
```

 Set cluster field in the my-context context to my-cluster.

```shell
kubectl config set contexts.my-context.cluster my-cluster
```

 Set client-key-data field in the cluster-admin user using --set-raw-bytes option.

```shell
kubectl config set users.cluster-admin.client-key-data cert_data_here --set-raw-bytes=true
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>set-raw-bytes</td><td></td><td>false</td><td>When writing a []byte PROPERTY_VALUE, write the given string directly without base64 decoding.</td>
    </tr>
</tbody>
</table></div>



<hr>

## set-cluster


### Overview
Sets a cluster entry in kubeconfig.

 Specifying a name that already exists will merge new fields on top of existing values for those fields.

### Usage

`set-cluster NAME [--server=server] [--certificate-authority=path/to/certificate/authority] [--insecure-skip-tls-verify=true]`


### Example
 Set only the server field on the e2e cluster entry without touching other values.

```shell
kubectl config set-cluster e2e --server=https://1.2.3.4
```

 Embed certificate authority data for the e2e cluster entry

```shell
kubectl config set-cluster e2e --certificate-authority=~/.kube/e2e/kubernetes.ca.crt
```

 Disable cert checking for the dev cluster entry

```shell
kubectl config set-cluster e2e --insecure-skip-tls-verify=true
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>embed-certs</td><td></td><td>false</td><td>embed-certs for the cluster entry in kubeconfig</td>
    </tr>
</tbody>
</table></div>



<hr>

## set-context


### Overview
Sets a context entry in kubeconfig

 Specifying a name that already exists will merge new fields on top of existing values for those fields.

### Usage

`set-context [NAME | --current] [--cluster=cluster_nickname] [--user=user_nickname] [--namespace=namespace]`


### Example
 Set the user field on the gce context entry without touching other values

```shell
kubectl config set-context gce --user=cluster-admin
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>current</td><td></td><td>false</td><td>Modify the current context</td>
    </tr>
</tbody>
</table></div>



<hr>

## set-credentials


### Overview
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

`set-credentials NAME [--client-certificate=path/to/certfile] [--client-key=path/to/keyfile] [--token=bearer_token] [--username=basic_user] [--password=basic_password] [--auth-provider=provider_name] [--auth-provider-arg=key=value] [--exec-command=exec_command] [--exec-api-version=exec_api_version] [--exec-arg=arg] [--exec-env=key=value]`


### Example
 Set only the "client-key" field on the "cluster-admin" # entry, without touching other values:

```shell
kubectl config set-credentials cluster-admin --client-key=~/.kube/admin.key
```

 Set basic auth for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --username=admin --password=uXFGweU9l35qcif
```

 Embed client certificate data in the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --client-certificate=~/.kube/admin.crt --embed-certs=true
```

 Enable the Google Compute Platform auth provider for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --auth-provider=gcp
```

 Enable the OpenID Connect auth provider for the "cluster-admin" entry with additional args

```shell
kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-id=foo --auth-provider-arg=client-secret=bar
```

 Remove the "client-secret" config value for the OpenID Connect auth provider for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --auth-provider=oidc --auth-provider-arg=client-secret-
```

 Enable new exec auth plugin for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --exec-command=/path/to/the/executable --exec-api-version=client.authentication.k8s.io/v1beta
```

 Define new exec auth plugin args for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --exec-arg=arg1 --exec-arg=arg2
```

 Create or update exec auth plugin environment variables for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --exec-env=key1=val1 --exec-env=key2=val2
```

 Remove exec auth plugin environment variables for the "cluster-admin" entry

```shell
kubectl config set-credentials cluster-admin --exec-env=var-to-remove-
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>auth-provider</td><td></td><td></td><td>Auth provider for the user entry in kubeconfig</td>
    </tr>
    <tr>
    <td>auth-provider-arg</td><td></td><td>[]</td><td>'key=value' arguments for the auth provider</td>
    </tr>
    <tr>
    <td>embed-certs</td><td></td><td>false</td><td>Embed client cert/key for the user entry in kubeconfig</td>
    </tr>
    <tr>
    <td>exec-api-version</td><td></td><td></td><td>API version of the exec credential plugin for the user entry in kubeconfig</td>
    </tr>
    <tr>
    <td>exec-arg</td><td></td><td>[]</td><td>New arguments for the exec credential plugin command for the user entry in kubeconfig</td>
    </tr>
    <tr>
    <td>exec-command</td><td></td><td></td><td>Command for the exec credential plugin for the user entry in kubeconfig</td>
    </tr>
    <tr>
    <td>exec-env</td><td></td><td>[]</td><td>'key=value' environment values for the exec credential plugin</td>
    </tr>
</tbody>
</table></div>



<hr>

## unset


### Overview
Unsets an individual value in a kubeconfig file

 PROPERTY_NAME is a dot delimited name where each token represents either an attribute name or a map key.  Map keys may not contain dots.

### Usage

`unset PROPERTY_NAME`


### Example
 Unset the current-context.

```shell
kubectl config unset current-context
```

 Unset namespace in foo context.

```shell
kubectl config unset contexts.foo.namespace
```






<hr>

## use-context


### Overview
Sets the current-context in a kubeconfig file

### Usage

`use-context CONTEXT_NAME`


### Example
 Use the context for the minikube cluster

```shell
kubectl config use-context minikube
```






<hr>

## view


### Overview
Display merged kubeconfig settings or a specified kubeconfig file.

 You can use --output jsonpath={...} to extract specific values using a jsonpath expression.

### Usage

`view`


### Example
 Show merged kubeconfig settings.

```shell
kubectl config view
```

 Show merged kubeconfig settings and raw certificate data.

```shell
kubectl config view --raw
```

 Get the password for the e2e user

```shell
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'
```




### Flags

<div class="table-responsive kubectl-flags-table"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>allow-missing-template-keys</td><td></td><td>true</td><td>If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.</td>
    </tr>
    <tr>
    <td>flatten</td><td></td><td>false</td><td>Flatten the resulting kubeconfig file into self-contained output (useful for creating portable kubeconfig files)</td>
    </tr>
    <tr>
    <td>merge</td><td></td><td>true</td><td>Merge the full hierarchy of kubeconfig files</td>
    </tr>
    <tr>
    <td>minify</td><td></td><td>false</td><td>Remove all information not used by current-context from the output</td>
    </tr>
    <tr>
    <td>output</td><td>o</td><td>yaml</td><td>Output format. One of: json&#124;yaml&#124;name&#124;go-template&#124;go-template-file&#124;template&#124;templatefile&#124;jsonpath&#124;jsonpath-file.</td>
    </tr>
    <tr>
    <td>raw</td><td></td><td>false</td><td>Display raw byte data</td>
    </tr>
    <tr>
    <td>template</td><td></td><td></td><td>Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].</td>
    </tr>
</tbody>
</table></div>




<hr>


### Version

<div class="kubectl-reference-copyright">

<a href="https://github.com/kubernetes/kubernetes">Kubectl Reference Docs  
{{< param "fullversion" >}}   &#xa9;Copyright 2019 The Kubernetes Authors</a>

</div>

