---
title: Pod 使用镜像卷
reviewers:
content_type: task
weight: 210
min-kubernetes-server-version: v1.31
---
<!--
title: Use an Image Volume With a Pod
reviewers:
content_type: task
weight: 210
min-kubernetes-server-version: v1.31
-->

<!-- overview -->

{{< feature-state feature_gate_name="ImageVolume" >}}

<!--
This page shows how to configure a pod using image volumes. This allows you to
mount content from OCI registries inside containers.
-->
本页展示了如何使用镜像卷配置 Pod。此特性允许你在容器内挂载来自 OCI 镜像仓库的内容。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
- The container runtime needs to support the image volumes feature
- You need to exec commands in the host
- You need to be able to exec into pods
- You need to enable the `ImageVolume` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
-->
- 容器运行时需要支持镜像卷特性
- 你需要能够在主机上执行命令
- 你需要能够进入 Pod 执行命令
- 你需要启用 `ImageVolume`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

<!-- steps -->

<!--
## Run a Pod that uses an image volume {#create-pod}

An image volume for a pod is enabled setting the `volumes.[*].image` field of `.spec`
to a valid reference and consuming it in the `volumeMounts` of the container. For example:
-->
## 运行使用镜像卷的 Pod   {#create-pod}

为 Pod 启用镜像卷的方式是：在 `.spec` 中将 `volumes.[*].image`
字段设置为一个有效的镜像并在容器的 `volumeMounts` 中消费此镜像。例如：

{{% code_sample file="pods/image-volumes.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1. 在你的集群上创建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes.yaml
   ```

<!--
1. Attach to the container:
-->
2. 挂接到容器：

   ```shell
   kubectl attach -it image-volume bash
   ```

<!--
1. Check the content of a file in the volume:
-->
3. 查看卷中某个文件的内容：

   ```shell
   cat /volume/dir/file
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   1
   ```

   <!--
   You can also check another file in a different path:
   -->
   你还可以查看不同路径中的另一个文件：

   ```shell
   cat /volume/file
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```none
   2
   ```

<!--
## Further reading

- [`image` volumes](/docs/concepts/storage/volumes/#image)
-->
## 进一步阅读

- [`image` 卷](/zh-cn/docs/concepts/storage/volumes/#image)
