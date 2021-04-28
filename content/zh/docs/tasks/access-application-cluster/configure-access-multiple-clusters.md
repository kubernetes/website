---
title: 配置对多集群的访问
content_type: task
card:
  name: tasks
  weight: 40
---

<!--
title: Configure Access to Multiple Clusters
content_type: task
weight: 30
card:
  name: tasks
  weight: 40
-->

<!-- overview -->
<!--
This page shows how to configure access to multiple clusters by using
configuration files. After your clusters, users, and contexts are defined in
one or more configuration files, you can quickly switch between clusters by using the
`kubectl config use-context` command.
-->
本文展示如何使用配置文件来配置对多个集群的访问。 
在将集群、用户和上下文定义在一个或多个配置文件中之后，用户可以使用 `kubectl config use-context` 命令快速地在集群之间进行切换。

<!--
A file that is used to configure access to a cluster is sometimes called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
-->
{{< note >}}
用于配置集群访问的文件有时被称为 *kubeconfig 文件*。
这是一种引用配置文件的通用方式，并不意味着存在一个名为 `kubeconfig` 的文件。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
To check that {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} is installed,
run `kubectl version --client`. The kubectl version should be
[within one minor version](/docs/setup/release/version-skew-policy/#kubectl) of your
cluster's API server.
-->
要检查 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 是否安装，
执行 `kubectl version --client` 命令。
kubectl 的版本应该与集群的 API 服务器
[使用同一次版本号](/zh/docs/setup/release/version-skew-policy/#kubectl)。

<!-- steps -->
<!--
## Define clusters, users, and contexts

Suppose you have two clusters, one for development work and one for scratch work.
In the `development` cluster, your frontend developers work in a namespace called `frontend`,
and your storage developers work in a namespace called `storage`. In your `scratch` cluster,
developers work in the default namespace, or they create auxiliary namespaces as they
see fit. Access to the development cluster requires authentication by certificate. Access
to the scratch cluster requires authentication by username and password.

Create a directory named `config-exercise`. In your
`config-exercise` directory, create a file named `config-demo` with this content:
-->
## 定义集群、用户和上下文

假设用户有两个集群，一个用于正式开发工作，一个用于其它临时用途（scratch）。
在 `development` 集群中，前端开发者在名为 `frontend` 的名字空间下工作，
存储开发者在名为 `storage` 的名字空间下工作。 在 `scratch` 集群中，
开发人员可能在默认名字空间下工作，也可能视情况创建附加的名字空间。 
访问开发集群需要通过证书进行认证。
访问其它临时用途的集群需要通过用户名和密码进行认证。

创建名为 `config-exercise` 的目录。 在
`config-exercise` 目录中，创建名为 `config-demo` 的文件，其内容为：

```yaml
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: scratch

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-scratch
```

<!--
A configuration file describes clusters, users, and contexts. Your `config-demo` file
has the framework to describe two clusters, two users, and three contexts.

Go to your `config-exercise` directory. Enter these commands to add cluster details to
your configuration file:
-->
配置文件描述了集群、用户名和上下文。`config-demo` 文件中含有描述两个集群、
两个用户和三个上下文的框架。

进入 `config-exercise` 目录。输入以下命令，将群集详细信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster scratch --server=https://5.6.7.8 --insecure-skip-tls-verify
```

<!--
Add user details to your configuration file:
-->
将用户详细信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

<!--
- To delete a user you can run `kubectl --kubeconfig=config-demo config unset users.<name>`
- To remove a cluster, you can run `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- To remove a context, you can run `kubectl --kubeconfig=config-demo config unset contexts.<name>`
-->

注意：
- 要删除用户，可以运行 `kubectl --kubeconfig=config-demo config unset users.<name>`
- 要删除集群，可以运行 `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- 要删除上下文，可以运行 `kubectl --kubeconfig=config-demo config unset contexts.<name>`

<!--
Add context details to your configuration file:
-->
将上下文详细信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-scratch --cluster=scratch --namespace=default --user=experimenter
```

<!--
Open your `config-demo` file to see the added details. As an alternative to opening the
`config-demo` file, you can use the `config view` command.
-->
打开 `config-demo` 文件查看添加的详细信息。 也可以使用 `config view`
命令进行查看：

```shell
kubectl config --kubeconfig=config-demo view
```

<!--
The output shows the two clusters, two users, and three contexts:
-->
输出展示了两个集群、两个用户和三个上下文：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: scratch
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: scratch
    namespace: default
    user: experimenter
  name: exp-scratch
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    password: some-password
    username: exp
```

<!--
The `fake-ca-file`, `fake-cert-file` and `fake-key-file` above are the placeholders
for the pathnames of the certificate files. You need to change these to the actual pathnames
of certificate files in your environment.

Sometimes you may want to use Base64-encoded data embedded here instead of separate
certificate files; in that case you need to add the suffix `-data` to the keys, for example,
`certificate-authority-data`, `client-certificate-data`, `client-key-data`.
-->
其中的 `fake-ca-file`、`fake-cert-file` 和 `fake-key-file` 是证书文件路径名的占位符。
你需要更改这些值，使之对应你的环境中证书文件的实际路径名。

有时你可能希望在这里使用 BASE64 编码的数据而不是一个个独立的证书文件。
如果是这样，你需要在键名上添加 `-data` 后缀。例如，
`certificate-authority-data`、`client-certificate-data` 和 `client-key-data`。

<!--
Each context is a triple (cluster, user, namespace). For example, the
`dev-frontend` context says, "Use the credentials of the `developer`
user to access the `frontend` namespace of the `development` cluster".

Set the current context:
-->
每个上下文包含三部分（集群、用户和名字空间），例如，
`dev-frontend` 上下文表明：使用 `developer` 用户的凭证来访问 `development` 集群的
`frontend` 名字空间。

设置当前上下文：

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

<!--
Now whenever you enter a `kubectl` command, the action will apply to the cluster,
and namespace listed in the `dev-frontend` context. And the command will use
the credentials of the user listed in the `dev-frontend` context.

To see only the configuration information associated with
the current context, use the `--minify` flag.
-->
现在当输入 `kubectl` 命令时，相应动作会应用于 `dev-frontend` 上下文中所列的集群和名字空间，
同时，命令会使用 `dev-frontend` 上下文中所列用户的凭证。

使用 `--minify` 参数，来查看与当前上下文相关联的配置信息。

```shell
kubectl config --kubeconfig=config-demo view --minify
```

<!--
The output shows configuration information associated with the `dev-frontend` context:
-->
输出结果展示了 `dev-frontend` 上下文相关的配置信息：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

<!--
Now suppose you want to work for a while in the scratch cluster.

Change the current context to `exp-scratch`:
-->
现在假设用户希望在其它临时用途集群中工作一段时间。

将当前上下文更改为 `exp-scratch`：

```shell
kubectl config --kubeconfig=config-demo use-context exp-scratch
```

<!--
Now any `kubectl` command you give will apply to the default namespace of
the `scratch` cluster. And the command will use the credentials of the user
listed in the `exp-scratch` context.

View configuration associated with the new current context, `exp-scratch`.
-->

现在你发出的所有 `kubectl` 命令都将应用于 `scratch` 集群的默认名字空间。
同时，命令会使用 `exp-scratch` 上下文中所列用户的凭证。

查看更新后的当前上下文 `exp-scratch` 相关的配置：

```shell
kubectl config --kubeconfig=config-demo view --minify
```

<!--
Finally, suppose you want to work for a while in the `storage` namespace of the
`development` cluster.

Change the current context to `dev-storage`:
-->
最后，假设用户希望在 `development` 集群中的 `storage` 名字空间下工作一段时间。

将当前上下文更改为 `dev-storage`：

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

<!--
View configuration associated with the new current context, `dev-storage`.
-->
查看更新后的当前上下文 `dev-storage` 相关的配置：

```shell
kubectl config --kubeconfig=config-demo view --minify
```

<!--
## Create a second configuration file

In your `config-exercise` directory, create a file named `config-demo-2` with this content:
-->

## 创建第二个配置文件

在 `config-exercise` 目录中，创建名为 `config-demo-2` 的文件，其中包含以下内容：

```yaml
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

<!--
The preceding configuration file defines a new context named `dev-ramp-up`.
-->
上述配置文件定义了一个新的上下文，名为 `dev-ramp-up`。

<!--
## Set the KUBECONFIG environment variable

See whether you have an environment variable named `KUBECONFIG`. If so, save the
current value of your `KUBECONFIG` environment variable, so you can restore it later.
For example:
-->
## 设置 KUBECONFIG 环境变量

查看是否有名为 `KUBECONFIG` 的环境变量。
如有，保存 `KUBECONFIG` 环境变量当前的值，以便稍后恢复。
例如：

### Linux
```shell
export KUBECONFIG_SAVED=$KUBECONFIG
```

### Windows PowerShell
```shell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

<!--
 The `KUBECONFIG` environment variable is a list of paths to configuration files. The list is
colon-delimited for Linux and Mac, and semicolon-delimited for Windows. If you have
a `KUBECONFIG` environment variable, familiarize yourself with the configuration files
in the list.

Temporarily append two paths to your `KUBECONFIG` environment variable. For example:
-->
`KUBECONFIG` 环境变量是配置文件路径的列表，该列表在 Linux 和 Mac 中以冒号分隔，
在 Windows 中以分号分隔。
如果有 `KUBECONFIG` 环境变量，请熟悉列表中的配置文件。

临时添加两条路径到 `KUBECONFIG` 环境变量中。 例如：

### Linux

```shell
export  KUBECONFIG=$KUBECONFIG:config-demo:config-demo-2
```

### Windows PowerShell

```shell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

<!--
In your `config-exercise` directory, enter this command:
-->
在 `config-exercise` 目录中输入以下命令：

```shell
kubectl config view
```

<!--
The output shows merged information from all the files listed in your `KUBECONFIG`
environment variable. In particular, notice that the merged information has the
`dev-ramp-up` context from the `config-demo-2` file and the three contexts from
the `config-demo` file:
-->
输出展示了 `KUBECONFIG` 环境变量中所列举的所有文件合并后的信息。
特别地，注意合并信息中包含来自 `config-demo-2` 文件的 `dev-ramp-up` 上下文和来自
`config-demo` 文件的三个上下文：

```yaml
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: scratch
    namespace: default
    user: experimenter
  name: exp-scratch
```

<!--
For more information about how kubeconfig files are merged, see
[Organizing Cluster Access Using kubeconfig Files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
-->
关于 kubeconfig 文件如何合并的更多信息，请参考
[使用 kubeconfig 文件组织集群访问](/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

<!--
## Explore the $HOME/.kube directory

If you already have a cluster, and you can use `kubectl` to interact with
the cluster, then you probably have a file named `config` in the `$HOME/.kube`
directory.

Go to `$HOME/.kube`, and see what files are there. Typically, there is a file named
`config`. There might also be other configuration files in this directory. Briefly
familiarize yourself with the contents of these files.
-->
## 探索 $HOME/.kube 目录

如果用户已经拥有一个集群，可以使用 `kubectl` 与集群进行交互，
那么很可能在 `$HOME/.kube` 目录下有一个名为 `config` 的文件。

进入 `$HOME/.kube` 目录，看看那里有什么文件。通常会有一个名为
`config` 的文件，目录中可能还有其他配置文件。请简单地熟悉这些文件的内容。

<!--
## Append $HOME/.kube/config to your KUBECONFIG environment variable

If you have a `$HOME/.kube/config` file, and it's not already listed in your
`KUBECONFIG` environment variable, append it to your `KUBECONFIG` environment variable now.
For example:
-->
## 将 $HOME/.kube/config 追加到 KUBECONFIG 环境变量中

如果有 `$HOME/.kube/config` 文件，并且还未列在 `KUBECONFIG` 环境变量中，
那么现在将它追加到 `KUBECONFIG` 环境变量中。
例如：

### Linux

```shell
export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config
```

### Windows Powershell

```shell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

<!--
View configuration information merged from all the files that are now listed
in your `KUBECONFIG` environment variable. In your config-exercise directory, enter:
-->
在配置练习目录中输入以下命令，查看当前 `KUBECONFIG` 环境变量中列举的所有文件合并后的配置信息：

```shell
kubectl config view
```

<!--
## Clean up

Return your `KUBECONFIG` environment variable to its original value. For example:
-->
## 清理

将 `KUBECONFIG` 环境变量还原为原始值。 例如：

### Linux

```shell
export KUBECONFIG=$KUBECONFIG_SAVED
```

### Windows PowerShell

```shell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

## {{% heading "whatsnext" %}}

<!--
* [Organizing Cluster Access Using kubeconfig Files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)
-->

* [使用 kubeconfig 文件组织集群访问](/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)

