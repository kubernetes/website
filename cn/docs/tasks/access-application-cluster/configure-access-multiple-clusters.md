---
title: 配置对多集群的访问
---


{% capture overview %}

本文展示如何使用配置文件来配置对多个集群的访问。 在将集群、用户和上下文定义在一个或多个配置文件中之后，用户可以使用 `kubectl config use-context` 命令快速地在集群之间进行切换。

**注意：** 用于配置集群访问的文件有时被称为 *kubeconfig 文件*。
这是一种引用配置文件的通用方式，并不意味着存在一个名为 `kubeconfig` 的文件。
{: .note}

{% endcapture %}

{% capture prerequisites %}

需要安装 [`kubectl`](/docs/tasks/tools/install-kubectl/) 命令行工具。

{% endcapture %}

{% capture steps %}

## 定义集群、用户和上下文

假设用户有两个集群，一个用于正式开发工作，一个用于其它临时用途（scratch）。
在 `development` 集群中，前端开发者在名为 `frontend` 的名字空间下工作，
存储开发者在名为 `storage` 的名字空间下工作。 在 `scratch` 集群中，
开发人员可能在默认名字空间下工作，也可能视情况创建附加的名字空间。 访问开发集群需要通过证书进行认证。 访问其它临时用途的集群需要通过用户名和密码进行认证。

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

配置文件描述了集群、用户名和上下文。  `config-demo` 文件中含有描述两个集群、两个用户和三个上下文的框架。

进入 `config-exercise` 目录。 输入以下命令，将群集详细信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster scratch --server=https://5.6.7.8 --insecure-skip-tls-verify
```

将用户详细信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

将上下文详细信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-scratch --cluster=scratch --namespace=default --user=experimenter
```

打开 `config-demo` 文件查看添加的详细信息。 也可以使用 `config view` 命令进行查看：

```shell
kubectl config --kubeconfig=config-demo view
```

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

每个上下文包含三部分（集群、用户和名字空间），例如，
`dev-frontend` 上下文表明：使用 `developer` 用户的凭证来访问 `development` 集群的 `frontend` 名字空间。

设置当前上下文：

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

现在当输入 `kubectl` 命令时，相应动作会应用于 `dev-frontend` 上下文中所列的集群和名字空间，同时，命令会使用 `dev-frontend` 上下文中所列用户的凭证。

使用 `--minify` 参数，来查看与当前上下文相关联的配置信息。

```shell
kubectl config --kubeconfig=config-demo view --minify
```

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

现在假设用户希望在其它临时用途集群中工作一段时间。

将当前上下文更改为 `exp-scratch`：

```shell
kubectl config --kubeconfig=config-demo use-context exp-scratch
```

现在用户 `kubectl` 下达的任何命令都将应用于 `scratch` 集群的默认名字空间。 同时，命令会使用 `exp-scratch` 上下文中所列用户的凭证。

查看更新后的当前上下文 `exp-scratch` 相关的配置：

```shell
kubectl config --kubeconfig=config-demo view --minify
```

最后，假设用户希望在 `development` 集群中的 `storage` 名字空间下工作一段时间。

将当前上下文更改为 `dev-storage`：

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

查看更新后的当前上下文 `dev-storage` 相关的配置：


```shell
kubectl config --kubeconfig=config-demo view --minify
```

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

上述配置文件定义了一个新的上下文，名为 `dev-ramp-up`。

## 设置 KUBECONFIG 环境变量

查看是否有名为 `KUBECONFIG` 的环境变量。 如有，保存 `KUBECONFIG` 环境变量当前的值，以便稍后恢复。
例如，在 Linux 中：

```shell
export  KUBECONFIG_SAVED=$KUBECONFIG
```

`KUBECONFIG` 环境变量是配置文件路径的列表，该列表在 Linux 和 Mac 中以冒号分隔，在 Windows 中以分号分隔。 如果有 `KUBECONFIG` 环境变量，请熟悉列表中的配置文件。

临时添加两条路径到 `KUBECONFIG` 环境变量中。 例如，在 Linux 中：

```shell
export  KUBECONFIG=$KUBECONFIG:config-demo:config-demo-2
```

在 `config-exercise` 目录中输入以下命令：

```shell
kubectl config view
```

输出展示了 `KUBECONFIG` 环境变量中所列举的所有文件合并后的信息。 特别地， 注意合并信息中包含来自 `config-demo-2` 文件的 `dev-ramp-up` 上下文和来自 `config-demo` 文件的三个上下文：

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

更多关于 kubeconfig 文件如何合并的信息，请参考
[使用 kubeconfig 文件组织集群访问](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

## 探索 $HOME/.kube 目录

如果用户已经拥有一个集群，可以使用 `kubectl` 与集群进行交互。 那么很可能在 `$HOME/.kube` 目录下有一个名为 `config` 的文件。

进入 `$HOME/.kube` 目录， 看看那里有什么文件。 通常会有一个名为
`config` 的文件，目录中可能还有其他配置文件。 请简单地熟悉这些文件的内容。

## 将 $HOME/.kube/config 追加到 KUBECONFIG 环境变量中

如果有 `$HOME/.kube/config` 文件，并且还未列在 `KUBECONFIG` 环境变量中，
那么现在将它追加到 `KUBECONFIG` 环境变量中。
例如，在 Linux 中：

```shell
export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config
```

在配置练习目录中输入以下命令，来查看当前 `KUBECONFIG` 环境变量中列举的所有文件合并后的配置信息：

```shell
kubectl config view
```

## 清理

将 `KUBECONFIG` 环境变量还原为原始值。 例如，在 Linux 中：

```shell
export KUBECONFIG=$KUBECONFIG_SAVED
```

{% endcapture %}

{% capture whatsnext %}

* [使用 kubeconfig 文件组织集群访问](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl 配置](/docs/user-guide/kubectl/{{page.version}}/)

{% endcapture %}

{% include templates/task.md %}

