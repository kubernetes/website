---
assignees:
- mikedanese
- thockin
title: 使用 kubeconfig 进行跨集群认证
redirect_from:
- "/docs/user-guide/kubeconfig-file/"
- "/docs/user-guide/kubeconfig-file.html"
- "/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/"
- "/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- shidrdn
---


<!-- title: Authenticate Across Clusters with kubeconfig -->

<!--

Authentication in Kubernetes can differ for different individuals.

- A running kubelet might have one way of authenticating (i.e. certificates).
- Users might have a different way of authenticating (i.e. tokens).
- Administrators might have a list of certificates which they provide individual users.
- There may be multiple clusters, and we may want to define them all in one place - giving users the ability to use their own certificates and reusing the same global configuration.

So in order to easily switch between multiple clusters, for multiple users, a kubeconfig file was defined.

This file contains a series of authentication mechanisms and cluster connection information associated with nicknames.  It also introduces the concept of a tuple of authentication information (user) and cluster connection information called a context that is also associated with a nickname.

Multiple kubeconfig files are allowed, if specified explicitly.  At runtime they are loaded and merged along with override options specified from the command line (see [rules](#loading-and-merging-rules) below).

-->

Kubernetes 的认证方式对于不同的人来说可能有所不同。

- 运行 kubelet 可能有一种认证方式（即证书）。
- 用户可能有不同的认证方式（即令牌）。
- 管理员可能具有他们为个人用户提供的证书列表。
- 我们可能有多个集群，并希望在同一个地方将其全部定义——这样用户就能使用自己的证书并重用相同的全局配置。

所以为了能够让用户轻松地在多个集群之间切换，对于多个用户的情况下，我们将其定义在了一个 kubeconfig 文件中。

此文件包含一系列与昵称相关联的身份验证机制和集群连接信息。它还引入了一个（用户）认证信息元组和一个被称为上下文的与昵称相关联的集群连接信息的概念。

如果明确指定，则允许使用多个 kubeconfig 文件。在运行时，它们与命令行中指定的覆盖选项一起加载并合并（参见下面的 [规则](#loading-and-merging-rules)）。

<!--

## Related discussion

-->

## 相关讨论

[http://issue.k8s.io/1755](http://issue.k8s.io/1755)

<!--

## Components of a kubeconfig file

### Example kubeconfig file

-->

## Kubeconfig 文件的组成


### Kubeconifg 文件示例

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

<!--

### Breakdown/explanation of components

#### cluster

-->

### 各个组件的拆解/释意

#### Cluster

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

<!--

A `cluster` contains endpoint data for a kubernetes cluster. This includes the fully
qualified url for the kubernetes apiserver, as well as the cluster's certificate
authority or `insecure-skip-tls-verify: true`, if the cluster's serving
certificate is not signed by a system trusted certificate authority.
A `cluster` has a name (nickname) which acts as a dictionary key for the cluster
within this kubeconfig file. You can add or modify `cluster` entries using
[`kubectl config set-cluster`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-cluster-em-).

-->

`cluster` 中包含 kubernetes 集群的端点数据，包括 kubernetes apiserver 的完整 url 以及集群的证书颁发机构或者当集群的服务证书未被系统信任的证书颁发机构签名时，设置`insecure-skip-tls-verify: true`。

`cluster` 的名称（昵称）作为该 kubeconfig 文件中的集群字典的 key。 您可以使用 [`kubectl config set-cluster`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-cluster-em-) 添加或修改 `cluster` 条目。

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

<!--

A `user` defines client credentials for authenticating to a kubernetes cluster. A
`user` has a name (nickname) which acts as its key within the list of user entries
after kubeconfig is loaded/merged. Available credentials are `client-certificate`,
`client-key`, `token`, and `username/password`. `username/password` and `token`
are mutually exclusive, but client certs and keys can be combined with them.
You can add or modify `user` entries using
[`kubectl config set-credentials`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-credentials-em-).

-->

`user` 定义用于向 kubernetes 集群进行身份验证的客户端凭据。在加载/合并 kubeconfig 之后，`user` 将有一个名称（昵称）作为用户条目列表中的 key。 可用凭证有 `client-certificate`、`client-key`、`token` 和 `username/password`。 `username/password` 和 `token` 是二者只能选择一个，但 client-certificate 和 client-key 可以分别与它们组合。

您可以使用 [`kubectl config set-credentials`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-credentials-em-) 添加或者修改 `user` 条目。

#### context

```yaml
contexts:
- context:
    cluster: horse-cluster
    namespace: chisel-ns
    user: green-user
  name: federal-context
```

<!--

A `context` defines a named [`cluster`](#cluster),[`user`](#user),[`namespace`](/docs/user-guide/namespaces) tuple
which is used to send requests to the specified cluster using the provided authentication info and
namespace. Each of the three is optional; it is valid to specify a context with only one of `cluster`,
`user`,`namespace`, or to specify none. Unspecified values, or named values that don't have corresponding
entries in the loaded kubeconfig (e.g. if the context specified a `pink-user` for the above kubeconfig file)
will be replaced with the default. See [Loading and merging rules](#loading-and-merging) below for override/merge behavior.
You can add or modify `context` entries with [`kubectl config set-context`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-context-em-).

-->

`context` 定义了一个命名的 [`cluster`](#cluster)、[`user`](#user)、[`namespace`](/docs/user-guide/namespaces) 元组，用于使用提供的认证信息和命名空间将请求发送到指定的集群。 三个都是可选的；仅使用 `cluster`、`user`、`namespace` 之一指定上下文，或指定 none。 未指定的值或在加载的 kubeconfig 中没有相应条目的命名值（例如，如果为上述 kubeconfig 文件指定了 `pink-user` 的上下文）将被替换为默认值。 有关覆盖/合并行为，请参阅下面的 [加载和合并规则](#loading-and-merging)。

您可以使用 [`kubectl config set-context`](/docs/user-guide/kubectl/{{page.version}}/#-em-set-context-em-) 添加或修改上下文条目。

#### current-context

```yaml
current-context: federal-context
```

`current-context` is the nickname or 'key' for the cluster,user,namespace tuple that kubectl
will use by default when loading config from this file. You can override any of the values in kubectl
from the commandline, by passing `--context=CONTEXT`, `--cluster=CLUSTER`, `--user=USER`, and/or `--namespace=NAMESPACE` respectively.
You can change the `current-context` with [`kubectl config use-context`](/docs/user-guide/kubectl/{{page.version}}/#-em-use-context-em-).

`current-context` 是昵称或者说是作为 `cluster`、`user`、`namespace` 元组的 ”key“，当 kubectl  从该文件中加载配置的时候会被默认使用。您可以在 kubectl 命令行里覆盖这些值，通过分别传入 `—context=CONTEXT`、 `—cluster=CLUSTER`、`--user=USER` 和 `--namespace=NAMESPACE` 。

您可以使用 [`kubectl config use-context`](/docs/user-guide/kubectl/{{page.version}}/#-em-use-context-em-) 更改 `current-context`。

<!--

#### miscellaneous

-->

```yaml
apiVersion: v1
kind: Config
preferences:
  colors: true
```

#### 杂项

<!--

`apiVersion` and `kind` identify the version and schema for the client parser and should not
be edited manually.

`preferences` specify optional (and currently unused) kubectl preferences.

-->

`apiVersion` 和 `kind` 标识客户端解析器的版本和模式，不应手动编辑。
`preferences` 指定可选（和当前未使用）的 kubectl 首选项。

<!--

## Viewing kubeconfig files

`kubectl config view` will display the current kubeconfig settings. By default
it will show you all loaded kubeconfig settings; you can filter the view to just
the settings relevant to the `current-context` by passing `--minify`. See
[`kubectl config view`](/docs/user-guide/kubectl/{{page.version}}/#-em-view-em-) for other options.

-->

## 查看 kubeconfig 文件

`kubectl config view` 命令可以展示当前的 kubeconfig 设置。默认将为您展示所有的 kubeconfig 设置；您可以通过传入 `—minify` 参数，将视图过滤到与 `current-context` 有关的配额设置。有关其他选项，请参阅 [`kubectl config view`](/docs/user-guide/kubectl/{{page.version}}/#-em-view-em-)。

<!--


## Building your own kubeconfig file

You can use the [sample kubeconfig file](#example-kubeconfig-file) above as a template for your own kubeconfig files.

**Note:** If you're deploying Kubernetes with `kube-up.sh`, you don't need to create your own kubeconfig files—the script does it for you.
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

-->

## 构建您自己的 kubeconfig 文件

您可以使用上文 [示例 kubeconfig 文件](#example-kubeconfig-file) 作为

**注意：** 如果您是通过 `kube-up.sh` 脚本部署的 kubernetes 集群，不需要自己创建 kubeconfig 文件——该脚本已经为您创建过了。

{:.note}

当 api server 启动的时候使用了 `—token-auth-file=tokens.csv` 选项时，上述文件将会与 [API server](https://kubernetes.io/docs/admin/kube-apiserver/) 相关联，`tokens.csv ` 文件看起来会像这个样子：

```
blue-user,blue-user,1
mister-red,mister-red,2
```

**注意：** 启动 API server 时有很多 [可用选项](https://kubernetes.io/docs/admin/kube-apiserver/)。请您一定要确保理解您使用的选项。

上述示例 kubeconfig 文件提供了 `green-user` 的客户端凭证。因为用户的 `current-user` 是 `green-user` ，任何该 API server 的客户端使用该示例 kubeconfig 文件时都可以成功登录。同样，我们可以通过修改 `current-context` 的值以 `blue-user` 的身份操作。

在上面的示例中，`green-user` 通过提供凭据登录，`blue-user` 使用的是 token。使用 `kubectl config set-credentials`  指定登录信息。想了解更多信息，请访问 "[示例文件相关操作命令](#commands-for-the-example-file)"。

<!--

## Loading and merging rules

The rules for loading and merging the kubeconfig files are straightforward, but there are a lot of them.  The final config is built in this order:

    1.  Get the kubeconfig  from disk.  This is done with the following hierarchy and merge rules:


     If the `CommandLineLocation` (the value of the `kubeconfig` command line option) is set, use this file only.  No merging.  Only one instance of this flag is allowed.


      Else, if `EnvVarLocation` (the value of `$KUBECONFIG`) is available, use it as a list of files that should be merged.
      Merge files together based on the following rules.
      Empty filenames are ignored.  Files with non-deserializable content produced errors.
      The first file to set a particular value or map key wins and the value or map key is never changed.
      This means that the first file to set `CurrentContext` will have its context preserved.  It also means that if two files specify a "red-user", only values from the first file's red-user are used.  Even non-conflicting entries from the second file's "red-user" are discarded.


      Otherwise, use HomeDirectoryLocation (`~/.kube/config`) with no merging.
    1.  Determine the context to use based on the first hit in this chain
      1.  command line argument - the value of the `context` command line option
      2.  `current-context` from the merged kubeconfig file
      3.  Empty is allowed at this stage
    2.  Determine the cluster info and user to use.  At this point, we may or may not have a context.  They are built based on the first hit in this chain.  (run it twice, once for user, once for cluster)
      1.  command line argument - `user` for user name and `cluster` for cluster name
      2.  If context is present, then use the context's value
      3.  Empty is allowed
    3.  Determine the actual cluster info to use.  At this point, we may or may not have a cluster info.  Build each piece of the cluster info based on the chain (first hit wins):
      1.  command line arguments - `server`, `api-version`, `certificate-authority`, and `insecure-skip-tls-verify`
      2.  If cluster info is present and a value for the attribute is present, use it.
      3.  If you don't have a server location, error.
    4.  Determine the actual user info to use. User is built using the same rules as cluster info, EXCEPT that you can only have one authentication technique per user.
      1. Load precedence is 1) command line flag, 2) user fields from kubeconfig
      2. The command line flags are: `client-certificate`, `client-key`, `username`, `password`, and `token`.
      3. If there are two conflicting techniques, fail.
    5.  For any information still missing, use default values and potentially prompt for authentication information
    6.  All file references inside of a kubeconfig file are resolved relative to the location of the kubeconfig file itself.  When file references are presented on the command line
      they are resolved relative to the current working directory.  When paths are saved in the ~/.kube/config, relative paths are stored relatively while absolute paths are stored absolutely.

Any path in a kubeconfig file is resolved relative to the location of the kubeconfig file itself.

-->

## 加载和合并规则

加载和合并 kubeconfig 文件的规则很简单，但有很多。最终的配置按照以下顺序构建：

1. 从磁盘中获取 kubeconfig。这将通过以下层次结构和合并规则完成：

   如果设置了 `CommandLineLocation` （`kubeconfig` 命令行参数的值），将会只使用该文件，而不会进行合并。该参数在一条命令中只允许指定一次。

   或者，如果设置了 `EnvVarLocation` （`$KUBECONFIG` 的值），其将会被作为应合并的文件列表，并根据以下规则合并文件。空文件名被忽略。非串行内容的文件将产生错误。设置特定值或 map key 的第一个文件将优先使用，并且值或 map key 也永远不会更改。 这意味着设置 CurrentContext 的第一个文件将保留其上下文。 这也意味着如果两个文件同时指定一个 `red-user`，那么将只使用第一个文件中的 `red-user` 的值。 即使第二个文件的 `red-user` 中有非冲突条目也被丢弃。

   另外，使用 Home 目录位置（`~/.kube/config`）将不会合并。

2. 根据此链中的第一个命中确定要使用的上下文

   1. 命令行参数——`context` 命令行选项的值

   2. 来自合并后的 `kubeconfig` 文件的 `current-context`

   3. 在这个阶段允许空

3. 确定要使用的群集信息和用户。此时，我们可能有也可能没有上下文。他们是基于这个链中的第一次命中。 （运行两次，一次为用户，一次为集群）

   1. 命令行参数——`user` 指定用户，`cluster` 指定集群名称
   2. 如果上下文存在，则使用上下文的值
   3. 允许空

4. 确定要使用的实际群集信息。此时，我们可能有也可能没有集群信息。根据链条构建每个集群信息（第一次命中胜出）：

   1. 命令行参数——`server`，`api-version`，`certificate-authority` 和 `insecure-skip-tls-verify`
   2. 如果存在集群信息，并且存在该属性的值，请使用它。
   3. 如果没有服务器位置，则产生错误。

5. 确定要使用的实际用户信息。用户使用与集群信息相同的规则构建，除非，您的每个用户只能使用一种认证技术。

   1. 负载优先级为1）命令行标志 2）来自 kubeconfig 的用户字段
   2. 命令行标志是：`client-certificate`、`client-key`、`username`、`password` 和 `token`
   3. 如果有两种冲突的技术，则失败。

6. 对于任何仍然缺少的信息，将使用默认值，并可能会提示验证信息

7. Kubeconfig 文件中的所有文件引用都相对于 kubeconfig 文件本身的位置进行解析。当命令行上显示文件引用时，它们将相对于当前工作目录进行解析。当路径保存在 `~/.kube/config` 中时，相对路径使用相对存储，绝对路径使用绝对存储。

Kubeconfig 文件中的任何路径都相对于 kubeconfig 文件本身的位置进行解析。


<!--
## Manipulation of kubeconfig via `kubectl config <subcommand>`

In order to more easily manipulate kubeconfig files, there are a series of subcommands to `kubectl config` to help.
See [kubectl/kubectl_config](/docs/user-guide/kubectl/{{page.version}}/#config) for help.

### Example
-->

## 使用 `kubectl config <subcommand>` 操作 kubeconfig

`kubectl config` 有一些列的子命令可以帮助我们更方便的操作 kubeconfig 文件。

请参阅 [kubectl/kubectl_config](/docs/user-guide/kubectl/{{page.version}}/#config)。

### Example

```shell
$ kubectl config set-credentials myself --username=admin --password=secret
$ kubectl config set-cluster local-server --server=http://localhost:8080
$ kubectl config set-context default-context --cluster=local-server --user=myself
$ kubectl config use-context default-context
$ kubectl config set contexts.default-context.namespace the-right-prefix
$ kubectl config view
```
<!--
produces this output
-->

产生如下输出：


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

<!--
and a kubeconfig file that looks like this
-->

Kubeconfig 文件会像这样子：


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

<!--
#### Commands for the example file
-->

#### 示例文件相关操作命令

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

<!--
### Final notes for tying it all together
So, tying this all together, a quick start to create your own kubeconfig file:

- Take a good look and understand how your api-server is being launched: You need to know YOUR security requirements and policies before you can design a kubeconfig file for convenient authentication.
- Replace the snippet above with information for your cluster's api-server endpoint.
- Make sure your api-server is launched in such a way that at least one user (i.e. green-user) credentials are provided to it.  You will of course have to look at api-server documentation in order to determine the current state-of-the-art in terms of providing authentication details.

-->

### 最后将它们捆绑在一起

所以，将这一切绑在一起，快速创建自己的 kubeconfig 文件：

- 仔细看一下，了解您的 api-server 的启动方式：在设计 kubeconfig 文件以方便身份验证之前，您需要知道您自己的安全要求和策略。
- 将上面的代码段替换为您的集群的 api-server 端点的信息。
- 确保您的 api-server 至少能够以提供一个用户（即 `green-user`）凭据的方式启动。 当然您必须查看 api-server 文档，以了解当前关于身份验证细节方面的最新技术。
