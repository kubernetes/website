---
reviewers:
- jpeeler
- pmorie
title: 配置 Pod 使用投射卷作存储
content_template: templates/task
weight: 70
---

<!--
---
reviewers:
- jpeeler
- pmorie
title: Configure a Pod to Use a Projected Volume for Storage
content_template: templates/task
weight: 70
---
-->

{{% capture overview %}}
<!--
This page shows how to use a [`projected`](/docs/concepts/storage/volumes/#projected) volume to mount
several existing volume sources into the same directory. Currently, `secret`, `configMap`, `downwardAPI`,
and `serviceAccountToken` volumes can be projected.
-->

本文介绍怎样通过[`投射`](/docs/concepts/storage/volumes/#projected) 卷将现有的多个卷资源挂载到相同的目录。
当前，`secret`、`configMap`、`downwardAPI` 和 `serviceAccountToken` 卷可以被投射。

{{< note >}}
<!--
`serviceAccountToken` is not a volume type.
-->
`serviceAccountToken` 不是一种卷类型
{{< /note >}}
{{% /capture %}}

{{% capture prerequisites %}}
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
{{% /capture %}}

{{% capture steps %}}

<!--
## Configure a projected volume for a pod

In this exercise, you create username and password Secrets from local files. You then create a Pod that runs one Container, using a [`projected`](/docs/concepts/storage/volumes/#projected) Volume to mount the Secrets into the same shared directory.

Here is the configuration file for the Pod:
-->

## 为 Pod 配置投射卷

本练习中，您将从本地文件来创建包含有用户名和密码的 Secret。然后创建运行一个容器的 Pod，该 Pod 使用[`投射`](/docs/concepts/storage/volumes/#projected) 卷将 Secret 挂载到相同的路径下。

下面是 Pod 的配置文件：

{{< codenew file="pods/storage/projected.yaml" >}}

1. <!--Create the Secrets:-->创建 Secrets:
```shell
    <!--# Create files containing the username and password:--># 创建包含用户名和密码的文件:
       echo -n "admin" > ./username.txt
       echo -n "1f2d1e2e67df" > ./password.txt-->

    <!--# Package these files into secrets:--># 将上述文件引用到 Secret：
       kubectl create secret generic user --from-file=./username.txt
       kubectl create secret generic pass --from-file=./password.txt
```

1. <!--Create the Pod:-->创建 Pod：

```shell
       kubectl create -f https://k8s.io/examples/pods/storage/projected.yaml
```

<!--Verify that the Pod's Container is running, and then watch for changes to
the Pod:-->确认 Pod 中的容器运行正常，然后监视 Pod 的变化：

```shell
       kubectl get --watch pod test-projected-volume
```

    <!--The output looks like this:-->输出结果和下面类似：
       NAME                    READY     STATUS    RESTARTS   AGE
       test-projected-volume   1/1       Running   0          14s

1. <!--In another terminal, get a shell to the running Container:-->在另外一个终端中，打开容器的 shell：
```shell
       kubectl exec -it test-projected-volume -- /bin/sh
```

1. <!--In your shell, verify that the `projected-volume` directory contains your projected sources:-->在 shell 中，确认 `projected-volume` 目录包含你的投射源：
```shell
       ls /projected-volume/
```
{{% /capture %}}

{{% capture whatsnext %}}

<!--
* Learn more about [`projected`](/docs/concepts/storage/volumes/#projected) volumes.
* Read the [all-in-one volume](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/node/all-in-one-volume.md) design document.
-->

* 进一步了解[`投射`](/docs/concepts/storage/volumes/#projected) 卷。
* 阅读[一体卷](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/node/all-in-one-volume.md)设计文档。
{{% /capture %}}

