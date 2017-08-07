---
title: Authenticate across clusters with kubeconfig
---

{% capture overview %}
Authentication in Kubernetes can differ for different individuals.

- A running kubelet might have one way of authenticating (i.e. certificates).
- Users might have a different way of authenticating (i.e. tokens).
- Administrators might have a list of certificates which they provide individual users.
- There may be multiple clusters, and we may want to define them all in one place - giving users the ability to use their own certificates and reusing the same global configuration.

So in order to easily switch between multiple clusters, for multiple users, a kubeconfig file was defined.

This file contains a series of authentication mechanisms and cluster connection information associated with nicknames.  It also introduces the concept of a tuple of authentication information (user) and cluster connection information called a context that is also associated with a nickname.

Multiple kubeconfig files are allowed, if specified explicitly.  At runtime they are loaded and merged along with override options specified from the command line (see [rules](#loading-and-merging-rules) below).
{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}
{% endcapture %}

{% capture steps %}
## Components of a kubeconfig file

### Example kubeconfig file

```yaml
current-context: federal-context
apiVersion: v1
clusters:
- cluster:
    api-version: v1
    server: http://cow.org:8080
  name: cow-cluster
- cluster:
    certificate-authority: path/to/my/cafile
    server: https://horse.org:4443
  name: horse-cluster
- cluster:
    insecure-skip-tls-verify: true
    server: https://pig.org:443
  name: pig-cluster
contexts:
- context:
    cluster: horse-cluster
    namespace: chisel-ns
    user: green-user
  name: federal-context
- context:
    cluster: pig-cluster
    namespace: saw-ns
    user: black-user
  name: queen-anne-context
kind: Config
preferences:
  colors: true
users:
- name: blue-user
  user:
    token: blue-token
- name: green-user
  user:
    client-certificate: path/to/my/client/cert
    client-key: path/to/my/client/key
```

### Breakdown/explanation of components

#### cluster

```yaml
clusters:
- cluster:
    certificate-authority: path/to/my/cafile
    server: https://horse.org:4443
  name: horse-cluster
- cluster:
    insecure-skip-tls-verify: true
    server: https://pig.org:443
  name: pig-cluster
```

A `cluster` contains endpoint data for a kubernetes cluster. This includes the fully
qualified url for the kubernetes apiserver, as well as the cluster's certificate
authority or `insecure-skip-tls-verify: true`, if the cluster's serving
certificate is not signed by a system trusted certificate authority.
A `cluster` has a name (nickname) which acts as a dictionary key for the cluster
within this kubeconfig file. You can add or modify `cluster` entries using
[`kubectl config set-cluster`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-cluster-em-).

#### user

```yaml
users:
- name: blue-user
  user:
    token: blue-token
- name: green-user
  user:
    client-certificate: path/to/my/client/cert
    client-key: path/to/my/client/key
```

A `user` defines client credentials for authenticating to a kubernetes cluster. A
`user` has a name (nickname) which acts as its key within the list of user entries
after kubeconfig is loaded/merged. Available credentials are `client-certificate`,
`client-key`, `token`, and `username/password`. `username/password` and `token`
are mutually exclusive, but client certs and keys can be combined with them.
You can add or modify `user` entries using
[`kubectl config set-credentials`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-credentials-em-).

#### context

```yaml
contexts:
- context:
    cluster: horse-cluster
    namespace: chisel-ns
    user: green-user
  name: federal-context
```

A `context` defines a named [`cluster`](#cluster),[`user`](#user),[`namespace`](/docs/user-guide/namespaces) tuple
which is used to send requests to the specified cluster using the provided authentication info and
namespace. Each of the three is optional; it is valid to specify a context with only one of `cluster`,
`user`,`namespace`, or to specify none. Unspecified values, or named values that don't have corresponding
entries in the loaded kubeconfig (e.g. if the context specified a `pink-user` for the above kubeconfig file)
will be replaced with the default. See [Loading and merging rules](#loading-and-merging) below for override/merge behavior.
You can add or modify `context` entries with [`kubectl config set-context`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-context-em-).

#### current-context

```yaml
current-context: federal-context
```

`current-context` is the nickname or 'key' for the cluster,user,namespace tuple that kubectl
will use by default when loading config from this file. You can override any of the values in kubectl
from the commandline, by passing `--context=CONTEXT`, `--cluster=CLUSTER`, `--user=USER`, and/or `--namespace=NAMESPACE` respectively.
You can change the `current-context` with [`kubectl config use-context`](/docs/user-guide/kubectl/{{page.version}}/#-em-use-context-em-).

#### miscellaneous

```yaml
apiVersion: v1
kind: Config
preferences:
  colors: true
```

`apiVersion` and `kind` identify the version and schema for the client parser and should not
be edited manually.

`preferences` specify optional (and currently unused) kubectl preferences.

## Viewing kubeconfig files

`kubectl config view` will display the current kubeconfig settings. By default
it will show you all loaded kubeconfig settings; you can filter the view to just
the settings relevant to the `current-context` by passing `--minify`. See
[`kubectl config view`](/docs/user-guide/kubectl/{{page.version}}/#-em-view-em-) for other options.

## Building your own kubeconfig file

You can use the [sample kubeconfig file](#example-kubeconfig-file) above as a template for your own kubeconfig files.

**Note:** If you're deploying Kubernetes with `kube-up.sh`, you don't need to create your own kubeconfig files&mdash;the script does it for you.
{: .note}

The sample file corresponds to an [API server](https://kubernetes.io/docs/admin/kube-apiserver/) launched using the `--token-auth-file=tokens.csv` option, where the `tokens.csv` file contains:

```conf
blue-user,blue-user,1
mister-red,mister-red,2
```

**Note:** There are many [options available](https://kubernetes.io/docs/admin/kube-apiserver/) for launching an API server. Make sure you understand the options you include.
{: .note}

The sample kubeconfig file provides client credentials for the user `green-user`. Because the user for `current-context` is `green-user`, any client of the API server using the sample kubeconfig file could log in successfully. Similarly, we can operate as  `blue-user` by changing the value of `current-context`.

In the example provided, `green-user` logs in by providing certificates, and `blue-user`  provides a token. Login information is specified with the `kubectl config set-credentials` command. For more information, see "[Commands for the example file](#commands-for-the-example-file)".

## Loading and merging rules

The rules for loading and merging the kubeconfig files are straightforward, but there are a lot of them.  The final config is built in this order:

  1.  Get the kubeconfig  from disk.  This is done with the following hierarchy and merge rules:


      If the `CommandLineLocation` (the value of the `kubeconfig` command line option) is set, use this file only.  No merging.  Only one instance of this flag is allowed.


      Else, if `EnvVarLocation` (the value of `$KUBECONFIG`) is available, use it as a list of files that should be merged.
      Merge files together based on the following rules.
      Empty filenames are ignored.  Files with non-deserializable content produced errors.
      The first file to set a particular value or map key wins and the value or map key is never changed.
      This means that the first file to set `CurrentContext` will have its context preserved.  It also means that if two files specify a `red-user`, only values from the first file's `red-user` are used.  Even non-conflicting entries from the second file's `red-user` are discarded.


      Otherwise, use HomeDirectoryLocation (`~/.kube/config`) with no merging.
  1.  Determine the context to use based on the first hit in this chain
      1.  command line argument - the value of the `context` command line option
      1.  `current-context` from the merged kubeconfig file
      1.  Empty is allowed at this stage
  1.  Determine the cluster info and user to use.  At this point, we may or may not have a context.  They are built based on the first hit in this chain.  (run it twice, once for user, once for cluster)
      1.  command line argument - `user` for user name and `cluster` for cluster name
      1.  If context is present, then use the context's value
      1.  Empty is allowed
  1.  Determine the actual cluster info to use.  At this point, we may or may not have a cluster info.  Build each piece of the cluster info based on the chain (first hit wins):
      1.  command line arguments - `server`, `api-version`, `certificate-authority`, and `insecure-skip-tls-verify`
      1.  If cluster info is present and a value for the attribute is present, use it.
      1.  If you don't have a server location, error.
  1.  Determine the actual user info to use. User is built using the same rules as cluster info, EXCEPT that you can only have one authentication technique per user.
      1. Load precedence is 1) command line flag, 2) user fields from kubeconfig
      1. The command line flags are: `client-certificate`, `client-key`, `username`, `password`, and `token`.
      1. If there are two conflicting techniques, fail.
  1.  For any information still missing, use default values and potentially prompt for authentication information
  1.  All file references inside of a kubeconfig file are resolved relative to the location of the kubeconfig file itself.  When file references are presented on the command line
  they are resolved relative to the current working directory.  When paths are saved in the ~/.kube/config, relative paths are stored relatively while absolute paths are stored absolutely.

Any path in a kubeconfig file is resolved relative to the location of the kubeconfig file itself.


## Manipulation of kubeconfig via `kubectl config <subcommand>`

In order to more easily manipulate kubeconfig files, there are a series of subcommands to `kubectl config` to help.
See [kubectl/kubectl_config](/docs/user-guide/kubectl/{{page.version}}/#config) for help.

### Example

```shell
$ kubectl config set-credentials myself --username=admin --password=secret
$ kubectl config set-cluster local-server --server=http://localhost:8080
$ kubectl config set-context default-context --cluster=local-server --user=myself
$ kubectl config use-context default-context
$ kubectl config set contexts.default-context.namespace the-right-prefix
$ kubectl config view
```

produces this output

```yaml
apiVersion: v1
clusters:
- cluster:
    server: http://localhost:8080
  name: local-server
contexts:
- context:
    cluster: local-server
    namespace: the-right-prefix
    user: myself
  name: default-context
current-context: default-context
kind: Config
preferences: {}
users:
- name: myself
  user:
    password: secret
    username: admin
```

and a kubeconfig file that looks like this

```yaml
apiVersion: v1
clusters:
- cluster:
    server: http://localhost:8080
  name: local-server
contexts:
- context:
    cluster: local-server
    namespace: the-right-prefix
    user: myself
  name: default-context
current-context: default-context
kind: Config
preferences: {}
users:
- name: myself
  user:
    password: secret
    username: admin
```

#### Commands for the example file

```shell
$ kubectl config set preferences.colors true
$ kubectl config set-cluster cow-cluster --server=http://cow.org:8080 --api-version=v1
$ kubectl config set-cluster horse-cluster --server=https://horse.org:4443 --certificate-authority=path/to/my/cafile
$ kubectl config set-cluster pig-cluster --server=https://pig.org:443 --insecure-skip-tls-verify=true
$ kubectl config set-credentials blue-user --token=blue-token
$ kubectl config set-credentials green-user --client-certificate=path/to/my/client/cert --client-key=path/to/my/client/key
$ kubectl config set-context queen-anne-context --cluster=pig-cluster --user=black-user --namespace=saw-ns
$ kubectl config set-context federal-context --cluster=horse-cluster --user=green-user --namespace=chisel-ns
$ kubectl config use-context federal-context
```
{% endcapture %}

{% capture discussion %}
## Final notes for tying it all together

So, tying this all together, a quick start to create your own kubeconfig file:

- Take a good look and understand how your api-server is being launched: You need to know YOUR security requirements and policies before you can design a kubeconfig file for convenient authentication.

- Replace the snippet above with information for your cluster's api-server endpoint.

- Make sure your api-server provides at least one set of credentials (for example, `green-user`) when launched.  You will of course have to look at api-server documentation in order to determine the current state-of-the-art in terms of providing authentication details.

## Related discussion
[http://issue.k8s.io/1755](http://issue.k8s.io/1755)
{% endcapture %}

{% include templates/task.md %}
