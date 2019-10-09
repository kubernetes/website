---
title: 使用 kubeconfig 文件组织集群访问
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

<!--
Use kubeconfig files to organize information about clusters, users, namespaces, and
authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to
find the information it needs to choose a cluster and communicate with the API server
of a cluster.
--->
使用 kubeconfig 文件来组织有关集群、用户、命名空间和身份认证机制的信息。`kubectl` 命令行工具使用 kubeconfig 文件来查找选择集群所需的信息，并与集群的 API 服务器进行通信。

<!--
{{< note >}}
A file that is used to configure access to clusters is called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
{{< /note >}}
--->
{{< note >}}
注意：用于配置集群访问的文件称为 *kubeconfig 文件*。这是引用配置文件的通用方法。这并不意味着有一个名为 `kubeconfig` 的文件
{{< /note >}}

<!--
By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other kubeconfig files by setting the `KUBECONFIG` environment
variable or by setting the
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/) flag.
--->
默认情况下，`kubectl` 在 `$HOME/.kube` 目录下查找名为 `config` 的文件。您可以通过设置 `KUBECONFIG` 环境变量或者设置[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/)参数来指定其他 kubeconfig 文件。

<!--
For step-by-step instructions on creating and specifying kubeconfig files, see
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).
--->
有关创建和指定 kubeconfig 文件的分步说明，请参阅[配置对多集群的访问](/docs/tasks/access-application-cluster/configure-access-multiple-clusters)。

{{% /capture %}}


{{% capture body %}}

<!--
## Supporting multiple clusters, users, and authentication mechanisms
--->
## 支持多集群、用户和身份认证机制

<!--
Suppose you have several clusters, and your users and components authenticate
in a variety of ways. For example:
--->
假设您有多个集群，并且您的用户和组件以多种方式进行身份认证。比如：

<!--
- A running kubelet might authenticate using certificates.
- A user might authenticate using tokens.
- Administrators might have sets of certificates that they provide to individual users.
--->
- 正在运行的 kubelet 可能使用证书在进行认证。
- 用户可能通过令牌进行认证。
- 管理员可能拥有多个证书集合提供给各用户。

<!--
With kubeconfig files, you can organize your clusters, users, and namespaces.
You can also define contexts to quickly and easily switch between
clusters and namespaces.
--->
使用 kubeconfig 文件，您可以组织集群、用户和命名空间。您还可以定义上下文，以便在集群和命名空间之间快速轻松地切换。

<!--
## Context
--->
## 上下文（Context）

<!--
A *context* element in a kubeconfig file is used to group access parameters
under a convenient name. Each context has three parameters: cluster, namespace, and user.
By default, the `kubectl` command-line tool uses parameters from
the *current context* to communicate with the cluster. 
--->
通过 kubeconfig 文件中的 *context* 元素，使用简便的名称来对访问参数进行分组。每个上下文都有三个参数：cluster、namespace 和 user。默认情况下，`kubectl` 命令行工具使用 *当前上下文* 中的参数与集群进行通信。

<!--
To choose the current context:
--->
选择当前上下文
```
kubectl config use-context
```

<!--
## The KUBECONFIG environment variable
--->
## KUBECONFIG 环境变量

<!--
The `KUBECONFIG` environment variable holds a list of kubeconfig files.
For Linux and Mac, the list is colon-delimited. For Windows, the list
is semicolon-delimited. The `KUBECONFIG` environment variable is not
required. If the `KUBECONFIG` environment variable doesn't exist,
`kubectl` uses the default kubeconfig file, `$HOME/.kube/config`.
--->
`KUBECONFIG` 环境变量包含一个 kubeconfig 文件列表。对于 Linux 和 Mac，列表以冒号分隔。对于 Windows，列表以分号分隔。`KUBECONFIG` 环境变量不是必要的。如果 `KUBECONFIG` 环境变量不存在，`kubectl` 使用默认的 kubeconfig 文件，`$HOME/.kube/config`。

<!--
If the `KUBECONFIG` environment variable does exist, `kubectl` uses
an effective configuration that is the result of merging the files
listed in the `KUBECONFIG` environment variable.
--->
如果 `KUBECONFIG` 环境变量存在，`kubectl` 使用 `KUBECONFIG` 环境变量中列举的文件合并后的有效配置。

<!--
## Merging kubeconfig files
--->
## 合并 kubeconfig 文件

<!--
To see your configuration, enter this command:
--->

要查看配置，输入以下命令：
```shell
kubectl config view
```

<!--
As described previously, the output might be from a single kubeconfig file,
or it might be the result of merging several kubeconfig files.
--->
如前所述，输出可能来自 kubeconfig 文件，也可能是合并多个 kubeconfig 文件的结果。

<!--
Here are the rules that `kubectl` uses when it merges kubeconfig files:
--->
以下是 `kubectl` 在合并 kubeconfig 文件时使用的规则。

<!--
1. If the `--kubeconfig` flag is set, use only the specified file. Do not merge.
   Only one instance of this flag is allowed.

   Otherwise, if the `KUBECONFIG` environment variable is set, use it as a
   list of files that should be merged.
   Merge the files listed in the `KUBECONFIG` environment variable
   according to these rules:

   * Ignore empty filenames.
   * Produce errors for files with content that cannot be deserialized.
   * The first file to set a particular value or map key wins.
   * Never change the value or map key.
     Example: Preserve the context of the first file to set `current-context`.
     Example: If two files specify a `red-user`, use only values from the first file's `red-user`.
     Even if the second file has non-conflicting entries under `red-user`, discard them.
--->
1. 如果设置了 `--kubeconfig` 参数，则仅使用指定的文件。不进行合并。此参数只能使用一次。
   
   否则，如果设置了 `KUBECONFIG` 环境变量，将它用作应合并的文件列表。根据以下规则合并 `KUBECONFIG` 环境变量中列出的文件：

   * 忽略空文件名。
   * 对于内容无法反序列化的文件，产生错误信息。
   * 第一个设置特定值或者映射键的文件将生效。
   * 永远不会更改值或者映射键。示例：保留第一个文件的上下文以设置 `current-context`。示例：如果两个文件都指定了 `red-user`，则仅使用第一个文件的 `red-user` 中的值。即使第二个文件在 `red-user` 下有非冲突条目，也要丢弃它们。

<!--
   For an example of setting the `KUBECONFIG` environment variable, see
   [Setting the KUBECONFIG environment variable](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).
--->
   有关设置 `KUBECONFIG` 环境变量的示例，请参阅[设置 KUBECONFIG 环境变量](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)。

<!--
   Otherwise, use the default kubeconfig file, `$HOME/.kube/config`, with no merging.
--->
   否则，使用默认的 kubeconfig 文件， `$HOME/.kube/config`，不进行合并。

<!--
1. Determine the context to use based on the first hit in this chain:

    1. Use the `--context` command-line flag if it exists.
    1. Use the `current-context` from the merged kubeconfig files.
--->
1. 根据此链中的第一个匹配确定要使用的上下文。

    1. 如果存在，使用 `--context` 命令行参数。
    1. 使用合并的 kubeconfig 文件中的 `current-context`。

<!--
   An empty context is allowed at this point.
--->
   这种场景下允许空上下文。

<!--
1. Determine the cluster and user. At this point, there might or might not be a context.
   Determine the cluster and user based on the first hit in this chain,
   which is run twice: once for user and once for cluster:

   1. Use a command-line flag if it exists: `--user` or `--cluster`.
   1. If the context is non-empty, take the user or cluster from the context.
--->
1. 确定集群和用户。此时，可能有也可能没有上下文。根据此链中的第一个匹配确定集群和用户，这将运行两次：一次用于用户，一次用于集群。

   1. 如果存在，使用命令行参数：`--user` 或者 `--cluster`。
   1. 如果上下文非空，从上下文中获取用户或集群。

<!--
   The user and cluster can be empty at this point.
--->
   这种场景下用户和集群可以为空。

<!--
1. Determine the actual cluster information to use. At this point, there might or
   might not be cluster information.
   Build each piece of the cluster information based on this chain; the first hit wins:

   1. Use command line flags if they exist: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
   1. If any cluster information attributes exist from the merged kubeconfig files, use them.
   1. If there is no server location, fail.
--->
1. 确定要使用的实际集群信息。此时，可能有也可能没有集群信息。基于此链构建每个集群信息；第一个匹配项会被采用：

   1. 如果存在：`--server`、`--certificate-authority` 和 `--insecure-skip-tls-verify`，使用命令行参数。
   1. 如果合并的 kubeconfig 文件中存在集群信息属性，则使用它们。
   1. 如果没有 server 配置，则配置无效。

<!--
1. Determine the actual user information to use. Build user information using the same
   rules as cluster information, except allow only one authentication
   technique per user:

   1. Use command line flags if they exist: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
   1. Use the `user` fields from the merged kubeconfig files.
   1. If there are two conflicting techniques, fail.
--->
1. 确定要使用的实际用户信息。使用与集群信息相同的规则构建用户信息，但每个用户只允许一种身份认证技术：

   1. 如果存在：`--client-certificate`、`--client-key`、`--username`、`--password` 和 `--token`，使用命令行参数。
   1. 使用合并的 kubeconfig 文件中的 `user` 字段。
   1. 如果存在两种冲突技术，则配置无效。

<!--
1. For any information still missing, use default values and potentially
   prompt for authentication information.
--->
1. 对于仍然缺失的任何信息，使用其对应的默认值，并可能提示输入身份认证信息。

<!--
## File references
--->
## 文件引用

<!--
File and path references in a kubeconfig file are relative to the location of the kubeconfig file.
File references on the command line are relative to the current working directory.
In `$HOME/.kube/config`, relative paths are stored relatively, and absolute paths
are stored absolutely.
--->
kubeconfig 文件中的文件和路径引用是相对于 kubeconfig 文件的位置。命令行上的文件引用是相当对于当前工作目录的。在 `$HOME/.kube/config` 中，相对路径按相对路径存储，绝对路径按绝对路径存储。

{{% /capture %}}


{{% capture whatsnext %}}

<!--
* [Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)
--->
* [配置对多集群的访问](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)

{{% /capture %}}


