---
title: 在 emptyDir 卷上设置权限
content_type: task
weight: 215
min-kubernetes-server-version: v1.37
---
<!--
title: Set Permissions on an emptyDir Volume
content_type: task
weight: 215
min-kubernetes-server-version: v1.37
-->

<!-- overview -->

{{< feature-state feature_gate_name="EmptyDirVolumeMode" >}}

<!--
This page shows how to set Unix permission bits on an `emptyDir` volume directory
using the `mode` field.
-->
本页介绍如何使用 `mode` 字段在 `emptyDir` 卷目录上设置 Unix 权限位。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need to have the `EmptyDirVolumeMode`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled
on the API server **and** the kubelet.
-->
你需要在 API 服务器**和** kubelet 上启用 `EmptyDirVolumeMode`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!-- steps -->

<!--
## Create a Pod that uses an emptyDir volume with custom permissions {#create-pod}
-->
## 创建使用带自定义权限 emptyDir 卷的 Pod {#create-pod}

<!--
The `emptyDir.mode` field lets you set Unix permission bits (from `0000` to `01777` in octal)
on the volume directory. If not specified, the directory is created with the default `0777`
permissions.
-->
`emptyDir.mode` 字段允许你在卷目录上设置 Unix 权限位
（八进制范围从 `0000` 到 `01777`）。如果未指定，目录将以默认的
`0777` 权限创建。

<!--
For example, to create a shared `/tmp` directory with the sticky bit set so that only file
owners can delete their own files:
-->
例如，要创建一个设置了粘滞位（sticky bit）的共享 `/tmp` 目录，
使得只有文件所有者可以删除自己的文件：

{{% code_sample file="pods/emptydir-volume-mode.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1.  在你的集群上创建 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/emptydir-volume-mode.yaml
    ```

<!--
1. Verify the pod is running:
-->
2.  验证 Pod 正在运行：

    ```shell
    kubectl get pod emptydir-mode-demo
    ```

<!--
1. Check the permissions on the mounted volume:
-->
3.  检查已挂载卷的权限：

    ```shell
    kubectl exec emptydir-mode-demo -- ls -ld /tmp
    ```

    <!--
   The output is similar to:
    -->
    输出类似于：

    ```none
    drwxrwxrwt 2 root root 4096 Jul 28 00:00 /tmp
    ```

    <!--
   The `t` at the end confirms the sticky bit is set.
    -->
    末尾的 `t` 确认粘滞位已设置。

<!--
1. Delete the Pod that you created for this exercise:
-->
4.  删除你为这个练习创建的 Pod：

    ```shell
    kubectl delete pod emptydir-mode-demo
    ```

## {{% heading "whatsnext" %}}

<!--
- Learn more about [`emptyDir` volumes](/docs/concepts/storage/volumes/#emptydir)
-->
- 了解更多关于 [`emptyDir` 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的信息
