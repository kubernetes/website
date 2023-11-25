---
title: 配置 Pod 使用投射卷作存储
content_type: task
weight: 100
---

<!--
reviewers:
- jpeeler
- pmorie
title: Configure a Pod to Use a Projected Volume for Storage
content_type: task
weight: 100
-->

<!-- overview -->
<!--
This page shows how to use a [`projected`](/docs/concepts/storage/volumes/#projected) Volume to mount
several existing volume sources into the same directory. Currently, `secret`, `configMap`, `downwardAPI`,
and `serviceAccountToken` volumes can be projected.
-->

本文介绍怎样通过 [`projected`](/zh-cn/docs/concepts/storage/volumes/#projected) 卷将现有的多个卷资源挂载到相同的目录。
当前，`secret`、`configMap`、`downwardAPI` 和 `serviceAccountToken` 卷可以被投射。

<!--
`serviceAccountToken` is not a volume type.
-->
{{< note >}}
`serviceAccountToken` 不是一种卷类型。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Configure a projected volume for a pod

In this exercise, you create username and password {{< glossary_tooltip text="Secrets" term_id="secret" >}} from local files. You then create a Pod that runs one container, using a [`projected`](/docs/concepts/storage/volumes/#projected) Volume to mount the Secrets into the same shared directory.

Here is the configuration file for the Pod:
-->

## 为 Pod 配置投射卷

本练习中，你将使用本地文件来创建用户名和密码 {{< glossary_tooltip text="Secret" term_id="secret" >}}，
然后创建运行一个容器的 Pod，
该 Pod 使用[`projected`](/zh-cn/docs/concepts/storage/volumes/#projected) 卷将 Secret 挂载到相同的路径下。

下面是 Pod 的配置文件：

{{% code_sample file="pods/storage/projected.yaml" %}}

1. <!--Create the Secrets:-->
   创建 Secret：

   ```shell
   # 创建包含用户名和密码的文件：
   echo -n "admin" > ./username.txt
   echo -n "1f2d1e2e67df" > ./password.txt

   # 在 Secret 中引用上述文件
   kubectl create secret generic user --from-file=./username.txt
   kubectl create secret generic pass --from-file=./password.txt
   ```

2. <!--Create the Pod:-->
   创建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
   ```

3. <!--
   Verify that the Pod's Container is running, and then watch for changes to
   the Pod:
   -->
   确认 Pod 中的容器运行正常，然后监视 Pod 的变化：

   ```shell
   kubectl get --watch pod test-projected-volume
   ```

   <!--The output looks like this:-->
   输出结果和下面类似：

   ```
   NAME                    READY     STATUS    RESTARTS   AGE
   test-projected-volume   1/1       Running   0          14s
   ```

4. <!--In another terminal, get a shell to the running Container:-->
   在另外一个终端中，打开容器的 shell：

   ```shell
   kubectl exec -it test-projected-volume -- /bin/sh
   ```

5. <!--In your shell, verify that the `projected-volume` directory contains your projected sources:-->
   在 shell 中，确认 `projected-volume` 目录包含你的投射源：

   ```shell
   ls /projected-volume/
   ```
<!--
## Clean up
-->
## 清理

<!--
Delete the Pod and the Secrets:
-->
删除 Pod 和 Secret：

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [`projected`](/docs/concepts/storage/volumes/#projected) volumes.
* Read the [all-in-one volume](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md) design document.
-->

* 进一步了解 [`projected`](/zh-cn/docs/concepts/storage/volumes/#projected) 卷。
* 阅读[一体卷](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md)设计文档。
