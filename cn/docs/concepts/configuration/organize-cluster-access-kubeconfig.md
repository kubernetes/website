---
title: 使用 kubeconfig 文件组织集群访问
cn-approvers:
- chentao1596
---
<!--
---
title: Organizing Cluster Access Using kubeconfig Files
---
-->

{% capture overview %}

<!--
Use kubeconfig files to organize information about clusters, users, namespaces, and
authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to
find the information it needs to choose a cluster and communicate with the API server
of a cluster.
-->
kubeconfig 文件用于组织关于集群、用户、命名空间和认证机制的信息。命令行工具 `kubectl` 从 kubeconfig 文件中得到它要选择的集群以及跟集群 API server 交互的信息。

<!--
**Note:** A file that is used to configure access to clusters is called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
-->
**注意：** 用于配置集群访问信息的文件叫作 *kubeconfig 文件*，这是一种引用配置文件的通用方式，并不是说它的文件名就是 `kubeconfig`。
{: .note}

<!--
By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other kubeconfig files by setting the `KUBECONFIG` environment
variable or by setting the
[`--kubeconfig`](/docs/user-guide/kubectl/{{page.version}}/) flag.
-->
默认情况下，`kubectl` 会从 `$HOME/.kube` 目录下查找文件名为 `config` 的文件。您可以通过设置环境变量 `KUBECONFIG` 或者通过设置 [`--kubeconfig`](/docs/user-guide/kubectl/{{page.version}}/) 去指定其它 kubeconfig 文件。

<!--
For step-by-step instructions on creating and specifying kubeconfig files, see
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).
-->
关于怎么样一步一步去创建和配置 kubeconfig 文件，请查看 [配置访问多个集群](/docs/tasks/access-application-cluster/configure-access-multiple-clusters)。

{% endcapture %}


{% capture body %}

<!--
## Supporting multiple clusters, users, and authentication mechanisms
-->
## 支持多个集群、用户和身份验证机制

<!--
Suppose you have several clusters, and your users and components authenticate
in a variety of ways. For example:
-->
假设您有几个集群，并且用户和组件以多种方式进行身份验证。例如：

<!--
- A running kubelet might authenticate using certificates.
- A user might authenticate using tokens.
- Administrators might have sets of certificates that they provide to individual users.
-->
- 运行中的 kubelet 可能使用证书进行身份认证。
- 用户可能使用令牌进行身份验证。
- 管理员可能有一组提供给各个用户的证书。

<!--
With kubeconfig files, you can organize your clusters, users, and namespaces.
And you can define contexts that enable users to quickly and easily switch between
clusters and namespaces.
-->
使用 kubeconfig 文件，可以组织您的集群、用户和命名空间的信息。并且，您还可以定义 context，以便快速轻松地在集群和命名空间之间进行切换。

## Context

<!--
A kubeconfig file can have *context* elements. Each context is a triple
(cluster, namespace, user). You can use `kubectl config use-context` to set
the current context. The `kubectl` command-line tool communicates with the
cluster and namespace listed in the current context. And it uses the
credentials of the user listed in the current context.
-->
kubeconfig 文件可以包含 *context* 元素，每个 context 都是一个由（集群、命名空间、用户）描述的三元组。您可以使用 `kubectl config use-context` 去设置当前的 context。命令行工具 `kubectl` 与当前 context 中指定的集群和命名空间进行通信，并且使用当前 context 中包含的用户凭证。

<!--
## The KUBECONFIG environment variable
-->
## 环境变量 KUBECONFIG

<!--
The `KUBECONFIG` environment variable holds a list of kubeconfig files.
For Linux and Mac, the list is colon-delimited. For Windows, the list
is semicolon-delimited. The `KUBECONFIG` environment variable is not
required. If the `KUBECONFIG` environment variable doesn't exist,
`kubectl` uses the default kubeconfig file, `$HOME/.kube/config`.
-->
环境变量 `KUBECONFIG` 保存一个 kubeconfig 文件列表。对于 Linux 和 Mac 系统，列表使用冒号将文件名进行分隔；对于 Windows 系统，则以分号分隔。环境变量 `KUBECONFIG` 不是必需的，如果它不存在，`kubectl` 就使用默认的 kubeconfig 文件 `$HOME/.kube/config`。

<!--
If the `KUBECONFIG` environment variable does exist, `kubectl` uses
an effective configuration that is the result of merging the files
listed in the `KUBECONFIG` evironment variable.
-->
如果环境变量 `KUBECONFIG` 存在，那么 `kubectl` 使用的有效配置，是环境变量 `KUBECONFIG` 中列出的所有文件融合之后的结果。

<!--
## Merging kubeconfig files
-->
## 融合 kubeconfig 文件

<!--
To see your configuration, enter this command:
-->
想要查看您的配置，请输入命令：

```shell
kubectl config view
```

<!--
As described previously, the output might be from a single kubeconfig file,
or it might be the result of merging several kubeconfig files.
-->
如前所述，输出的内容可能来自单个 kubeconfig 文件，也可能是多个 kubeconfig 文件融合之后的结果。

<!--
Here are the rules that `kubectl` uses when it merges kubeconfig files:
-->
当配置是由多个 kubeconfig 文件融合而成时，`kubectl` 使用的规则如下：

<!--
1. If the `--kubeconfig` flag is set, use only the specified file. Do not merge.
   Only one instance of this flag is allowed.

   Otherwise, if the `KUBECONFIG` environment variable is set, use it as a
   list of files that should be merged.
   Merge the files listed in the `KUBECONFIG` envrionment variable
   according to these rules:

   * Ignore empty filenames.
   * Produce errors for files with content that cannot be deserialized.
   * The first file to set a particular value or map key wins.
   * Never change the value or map key.
     Example: Preserve the context of the first file to set `current-context`.
     Example: If two files specify a `red-user`, use only values from the first file's `red-user`.
     Even if the second file has non-conflicting entries under `red-user`, discard them.

   For an example of setting the `KUBECONFIG` environment variable, see
   [Setting the KUBECONFIG environment variable](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).

   Otherwise, use the default kubeconfig file, `$HOME/.kube/config`, with no merging.
-->
1. 如果设置了 `--kubeconfig`，那么只使用指定的文件，不需要融合。该标志只允许设置一次。
	
   如果设置了环境变量 `KUBECONFIG`，那么应该融合文件之后再来使用。
   根据如下规则融合环境变量 `KUBECONFIG` 中列出的文件：
   
   * 忽略空的文件名。
   * 文件内容存在不能反序列化的情况时，融合出错。
   * 多个文件设置了特定的值或者映射键时，以第一个查找到的文件中的内容为准。
   * 永远不要更改值或映射键。
     例如：保存第一个文件的 context，将其设置为 `current-context`。
	 例如：如果两个文件中都指定了 `red-user`，那么只使用第一个指定的 `red-user`。
     即使第二个文件的 `red-user` 下的条目跟第一个文件中指定的没有冲突，也丢弃它们。
	 
   设置环境变量 `KUBECONFIG` 的例子，请查看 [设置环境变量 KUBECONFIG](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)。

   如果 `--kubeconfig` 和环境变量 `KUBECONFIG` 都没有设置，则使用默认的 kubeconfig 文件：`$HOME/.kube/config`，不需要融合。
   
<!--
1. Determine the context to use based on the first hit in this chain:

    1. Use the `--context` command-line flag if it exits.
    1. Use the `current-context` from the merged kubeconfig files.

   An empty context is allowed at this point.
-->
1. 确定要使用的 context 时按照以下顺序查找，直到找到一个可用的context：
    1. 如果命令行参数 `--context` 存在的话，使用它指定的值。
	1. 使用融合 kubeconfig 文件之后的 `current-context` 。
	
   如果还未找到可用的 context，此时允许使用空的 context。	

<!--
1. Determine the cluster and user. At this point, there might or might not be a context.
   Determine the cluster and user based on the first hit in this chain,
   which is run twice: once for user and once for cluster:

   1. Use a command-line flag if it exists: `--user` or `--cluster`.
   1. If the context is non-empty, take the user or cluster from the context.

   The user and cluster can be empty at this point.
-->
1. 确定集群和用户。此时，可能存在 context，也可能没有。
   按照以下顺序查找，直到找到一个可用的集群或用户。该链查找过程运行两次：一次用于查找用户，另一次用于查找集群：
   
   1. 如果存在命令行参数：`--user` 或者 `--cluster`，则使用它们指定的值。
   1. 如果 context 非空，则从 context 中取用户或者集群。
   
   如果还未找到可用的用户或者集群，此时用户和集群可以为空。

<!--
1. Determine the actual cluster information to use. At this point, there might or
   might not be cluster information.
   Build each piece of the cluster information based on this chain; the first hit wins:

   1. Use command line flags if they exist: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
   1. If any cluster information attributes exist from the merged kubeconfig files, use them.
   1. If there is no server location, fail.
-->
1. 确定要使用的实际集群信息。此时，集群信息可能存在，也可能不存在。
   按照以下顺序查找，选择第一个查找到的内容：
   
   1. 如果存在命令行参数：`--server`、`--certificate-authority` 和 `--insecure-skip-tls-verify`，则使用它们指定的值。
   1. 融合 kubeconfig 文件后，如果有任何集群属性存在，都使用它们。
   1. 如果没有指定服务位置，则确定集群信息失败。

<!--
1. Determine the actual user information to use. Build user information using the same
   rules as cluster information, except allow only one authentication
   technique per user:

   1. Use command line flags if they exist: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
   1. Use the `user` fields from the merged kubeconfig files.
   1. If there are two conflicting techniques, fail.
-->
1. 确定要使用的实际用户信息。除了每个用户只能使用一个身份验证技术之外，使用与构建集群信息相同的规则来构建用户信息：

   1. 如果存在命令行参数：`--client-certificate`、`--client-key`、`--username`、`--password` 和 `--token`，使用它们指定的值。
   1. 融合 kubeconfig 文件后，使用 `user` 字段。
   1. 如果存在两种矛盾的身份验证技术，则确定用户信息失败。

<!--
1. For any information still missing, use default values and potentially
   prompt for authentication information.
-->
1. 对于仍然缺失的任何信息，使用默认值，并潜在地提示身份验证信息。

<!--
## File references
-->
## 文件引用

<!--
File and path references in a kubeconfig file are relative to the location of the kubeconfig file.
File references on the command line are relative to the current working directory.
In `$HOME/.kube/config`, relative paths are stored relatively, and absolute paths
are stored absolutely.
-->

kubeconfig 文件中的文件和路径引用，都是相对 kubeconfig 文件存在的。命令行中的文件引用则是相对于当前工作目录。在文件 `$HOME/.kube/config` 中，相对路径按照相对关系存储，绝对路径按照绝对关系存储。

{% endcapture %}


{% capture whatsnext %}

<!--
* [Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [kubectl config](/docs/user-guide/kubectl/{{page.version}}/)
-->
* [配置访问多个集群](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [kubectl 配置](/docs/user-guide/kubectl/{{page.version}}/)

{% endcapture %}

{% include templates/concept.md %}

