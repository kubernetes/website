---
title: Pod 使用鏡像卷
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
本頁展示瞭如何使用鏡像卷配置 Pod。此特性允許你在容器內掛載來自 OCI 鏡像倉庫的內容。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
- The container runtime needs to support the image volumes feature
- You need to exec commands in the host
- You need to be able to exec into pods
- You need to enable the `ImageVolume` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
-->
- 容器運行時需要支持鏡像卷特性
- 你需要能夠在主機上執行命令
- 你需要能夠進入 Pod 執行命令
- 你需要啓用 `ImageVolume`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)

<!-- steps -->

<!--
## Run a Pod that uses an image volume {#create-pod}

An image volume for a pod is enabled setting the `volumes.[*].image` field of `.spec`
to a valid reference and consuming it in the `volumeMounts` of the container. For example:
-->
## 運行使用鏡像卷的 Pod   {#create-pod}

爲 Pod 啓用鏡像卷的方式是：在 `.spec` 中將 `volumes.[*].image`
字段設置爲一個有效的鏡像並在容器的 `volumeMounts` 中消費此鏡像。例如：

{{% code_sample file="pods/image-volumes.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1. 在你的集羣上創建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes.yaml
   ```

<!--
1. Attach to the container:
-->
2. 掛接到容器：

   ```shell
   kubectl attach -it image-volume bash
   ```

<!--
1. Check the content of a file in the volume:
-->
3. 查看卷中某個文件的內容：

   ```shell
   cat /volume/dir/file
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```none
   1
   ```

   <!--
   You can also check another file in a different path:
   -->
   你還可以查看不同路徑中的另一個文件：

   ```shell
   cat /volume/file
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```none
   2
   ```

<!--
## Further reading

- [`image` volumes](/docs/concepts/storage/volumes/#image)
-->
## 進一步閱讀

- [`image` 卷](/zh-cn/docs/concepts/storage/volumes/#image)

<!--
## Use `subPath` (or `subPathExpr`)

It is possible to utilize
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) or
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment)
from Kubernetes v1.33 when using the image volume feature.
-->
## 使用 `subPath`（或 `subPathExpr`）

從 Kubernetes v1.33 開始，使用 `image` 卷特性時，可以利用
[`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath) 或
[`subPathExpr`](/zh-cn/docs/concepts/storage/volumes/#using-subpath-expanded-environment)。

{{% code_sample file="pods/image-volumes-subpath.yaml" %}}

<!--
1. Create the pod on your cluster:
-->
1. 在你的集羣上創建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes-subpath.yaml
   ```

<!--
1. Attach to the container:
-->
2. 掛接到容器：

   ```shell
   kubectl attach -it image-volume bash
   ```

<!--
1. Check the content of the file from the `dir` sub path in the volume:
-->
3. 檢查卷中 `dir` 子路徑下的文件的內容：

   ```shell
   cat /volume/file
   ```

  <!--
  The output is similar to:
  -->

  輸出類似於：

   ```none
   1
   ```
