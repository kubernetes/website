---
title: 为卷挂载设置绑定挂载选项
content_type: task
weight: 216
min-kubernetes-server-version: v1.37
---
<!--
title: Set Bind Mount Options on Volume Mounts
content_type: task
weight: 216
min-kubernetes-server-version: v1.37
-->

<!-- overview -->

{{< feature-state feature_gate_name="VolumeBindMountOptions" >}}

<!--
This page shows how to apply security-related bind mount options (`noexec`,
`nodev`, `nosuid`) to volume mounts in a Pod.
-->
本页展示如何为 Pod 中的卷挂载应用与安全相关的绑定挂载选项（`noexec`、
`nodev`、`nosuid`）。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need to have the `VolumeBindMountOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled
on the API server **and** the kubelet. The container runtime must also support
the `mount_options` field in the CRI `Mount` message.
-->
你需要在 API 服务器**和** kubelet 上启用 `VolumeBindMountOptions`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。容器运行时还必须支持
CRI `Mount` 消息中的 `mount_options` 字段。

<!-- steps -->

## 创建带绑定挂载选项的 Pod {#create-pod}

<!--
The `.spec.containers[*].volumeMounts[*].bindMountOptions` field accepts a list of bind mount flags.
The allowed values are `noexec`, `nodev`, and `nosuid`.
-->
`.spec.containers[*].volumeMounts[*].bindMountOptions` 字段接受一组绑定挂载标志。
允许的取值为 `noexec`、`nodev` 和 `nosuid`。

<!--
For example, to mount an emptyDir volume at `/tmp` with `noexec` and `nosuid`
so that binaries cannot be executed and set-user-ID bits are ignored:
-->
例如，要在 `/tmp` 处挂载一个带有 `noexec` 和 `nosuid` 的 emptyDir 卷，
使得二进制文件无法被执行，并且忽略 set-user-ID 位：

{{% code_sample file="pods/bind-mount-options.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1. 在你的集群上创建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/bind-mount-options.yaml
   ```

<!--
1. Verify the pod is running:
-->
2. 验证 Pod 正在运行：

   ```shell
   kubectl get pod bind-mount-options-demo
   ```

<!--
1. Check the mount options on the volume:
-->
3. 检查该卷的挂载选项：

   ```shell
   kubectl exec bind-mount-options-demo -- mount | grep /tmp
   ```

   <!--
   The output should include `noexec` and `nosuid` in the mount options.
   -->
   输出的挂载选项中应包含 `noexec` 和 `nosuid`。

<!--
1. Verify that executing a binary on the mount fails:
-->
4. 验证在该挂载上执行二进制文件会失败：

   ```shell
   kubectl exec bind-mount-options-demo -- sh -c 'cp /bin/ls /tmp/ls && /tmp/ls'
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   sh: /tmp/ls: Permission denied
   ```

<!--
1. Delete the Pod that you created for this exercise:
-->
5. 删除你在本练习中创建的 Pod：

   ```shell
   kubectl delete pod bind-mount-options-demo
   ```

## {{% heading "whatsnext" %}}

<!--
- Learn more about [bind mount options](/docs/concepts/storage/volumes/#bind-mount-options) for volumes
-->
- 进一步了解卷的[绑定挂载选项](/docs/concepts/storage/volumes/#bind-mount-options)
