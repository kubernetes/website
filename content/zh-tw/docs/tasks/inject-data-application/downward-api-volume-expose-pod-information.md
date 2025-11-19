---
title: 通過文件將 Pod 信息呈現給容器
content_type: task
weight: 40
---
<!--
title: Expose Pod Information to Containers Through Files
content_type: task
weight: 40
-->

<!-- overview -->

<!--
This page shows how a Pod can use a
[`downwardAPI` volume](/docs/concepts/storage/volumes/#downwardapi),
to expose information about itself to containers running in the Pod.
A `downwardAPI` volume can expose Pod fields and container fields.
-->
此頁面描述 Pod 如何使用
[`downwardAPI` 卷](/zh-cn/docs/concepts/storage/volumes/#downwardapi)
把自己的信息呈現給 Pod 中運行的容器。
`downwardAPI` 卷可以呈現 Pod 和容器的字段。

<!--
In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* [Environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* Volume files, as explained in this task

Together, these two ways of exposing Pod and container fields are called the
_downward API_.
-->
在 Kubernetes 中，有兩種方式可以將 Pod 和容器字段呈現給運行中的容器：

* [環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* 本頁面所述的卷文件

這兩種呈現 Pod 和容器字段的方式都稱爲 **downward API**。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Store Pod fields

In this part of exercise, you create a Pod that has one container, and you
project Pod-level fields into the running container as files.
Here is the manifest for the Pod:
-->
## 存儲 Pod 字段   {#store-pod-fields}

在這部分的練習中，你將創建一個包含一個容器的 Pod，並將 Pod 級別的字段作爲文件投射到正在運行的容器中。
Pod 的清單如下：

{{% code_sample file="pods/inject/dapi-volume.yaml" %}}

<!--
In the manifest, you can see that the Pod has a `downwardAPI` Volume,
and the container mounts the volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array
defines a `downwardAPI` volume.
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations`
field should be stored in a file named `annotations`.
-->
在 Pod 清單中，你可以看到 Pod 有一個 `downwardAPI` 類型的卷，並且掛載到容器中的
`/etc/podinfo` 目錄。

查看 `downwardAPI` 下面的 `items` 數組。
數組的每個元素定義一個 `downwardAPI` 卷。
第一個元素指示 Pod 的 `metadata.labels` 字段的值保存在名爲 `labels` 的文件中。
第二個元素指示 Pod 的 `annotations` 字段的值保存在名爲 `annotations` 的文件中。

{{< note >}}
<!--
The fields in this example are Pod fields. They are not
fields of the container in the Pod.
-->
本示例中的字段是 Pod 字段，不是 Pod 中容器的字段。
{{< /note >}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

<!--
Verify that the container in the Pod is running:
-->
驗證 Pod 中的容器運行正常：

```shell
kubectl get pods
```

<!--
View the container's logs:
-->
查看容器的日誌：

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

<!--
The output shows the contents of the `labels` file and the `annotations` file:
-->
輸出顯示 `labels` 文件和 `annotations` 文件的內容：

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

<!--
Get a shell into the container that is running in your Pod:
-->
進入 Pod 中運行的容器，打開一個 Shell：

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

<!--
In your shell, view the `labels` file:
-->
在該 Shell中，查看 `labels` 文件：

```shell
/# cat /etc/podinfo/labels
```

<!--
The output shows that all of the Pod's labels have been written
to the `labels` file:
-->
輸出顯示 Pod 的所有標籤都已寫入 `labels` 文件：

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

<!--
Similarly, view the `annotations` file:
-->
同樣，查看 `annotations` 文件：

```shell
/# cat /etc/podinfo/annotations
```

<!--
View the files in the `/etc/podinfo` directory:
-->
查看 `/etc/podinfo` 目錄下的文件：

```shell
/# ls -laR /etc/podinfo
```

<!--
In the output, you can see that the `labels` and `annotations` files
are in a temporary subdirectory: in this example,
`..2982_06_02_21_47_53.299460680`. In the `/etc/podinfo` directory, `..data` is
a symbolic link to the temporary subdirectory. Also in the `/etc/podinfo` directory,
`labels` and `annotations` are symbolic links.
-->
在輸出中可以看到，`labels` 和 `annotations` 文件都在一個臨時子目錄中。
在這個例子中，這個臨時子目錄爲 `..2982_06_02_21_47_53.299460680`。
在 `/etc/podinfo` 目錄中，`..data` 是指向該臨時子目錄的符號鏈接。
另外在 `/etc/podinfo` 目錄中，`labels` 和 `annotations` 也是符號鏈接。

```
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

<!--
Using symbolic links enables dynamic atomic refresh of the metadata; updates are
written to a new temporary directory, and the `..data` symlink is updated
atomically using [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).
-->
用符號鏈接可實現元數據的動態原子性刷新；更新將寫入一個新的臨時目錄，
然後通過使用 [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html)
完成 `..data` 符號鏈接的原子性更新。

{{< note >}}
<!--
A container using Downward API as a
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume mount will not
receive Downward API updates.
-->
如果容器以
[subPath](/zh-cn/docs/concepts/storage/volumes/#using-subpath) 卷掛載方式來使用
Downward API，則該容器無法收到更新事件。
{{< /note >}}

<!--
Exit the shell:
-->
退出 Shell：

```shell
/# exit
```

<!--
## Store container fields

The preceding exercise, you made Pod-level fields accessible using the
downward API.
In this next exercise, you are going to pass fields that are part of the Pod
definition, but taken from the specific
[container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
rather than from the Pod overall. Here is a manifest for a Pod that again has
just one container:
-->
## 存儲容器字段   {#store-container-fields}

前面的練習中，你使用 downward API 使 Pod 級別的字段可以被 Pod 內正在運行的容器訪問。
接下來這個練習，你將只傳遞由 Pod 定義的部分的字段到 Pod 內正在運行的容器中，
但這些字段取自特定[容器](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)而不是整個 Pod。
下面是一個同樣只有一個容器的 Pod 的清單：

{{% code_sample file="pods/inject/dapi-volume-resources.yaml" %}}

<!--
In the manifest, you can see that the Pod has a
[`downwardAPI` volume](/docs/concepts/storage/volumes/#downwardapi),
and that the single container in that Pod mounts the volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array
defines a file in the downward API volume.

The first element specifies that in the container named `client-container`,
the value of the `limits.cpu` field in the format specified by `1m` should be
published as a file named `cpu_limit`. The `divisor` field is optional and has the
default value of `1`. A divisor of 1 means cores for `cpu` resources, or
bytes for `memory` resources.

Create the Pod:
-->
在這個清單中，你可以看到 Pod 有一個
[`downwardAPI` 卷](/zh-cn/docs/concepts/storage/volumes/#downwardapi)，
並且這個卷會掛載到 Pod 內的單個容器的 `/etc/podinfo` 目錄。

查看 `downwardAPI` 下面的 `items` 數組。
數組的每個元素定義一個 `downwardAPI` 卷。

第一個元素指定在名爲 `client-container` 的容器中，
以 `1m` 所指定格式的 `limits.cpu` 字段的值應推送到名爲 `cpu_limit` 的文件中。
`divisor` 字段是可選的，默認值爲 `1`。1 的除數表示 CPU 資源的核數或內存資源的字節數。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

<!--
Get a shell into the container that is running in your Pod:
-->
打開一個 Shell，進入 Pod 中運行的容器：

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

<!--
In your shell, view the `cpu_limit` file:
-->
在 Shell 中，查看 `cpu_limit` 文件：

```shell
# 在容器內的 Shell 中運行
cat /etc/podinfo/cpu_limit
```

<!--
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.
-->
你可以使用同樣的命令查看 `cpu_request`、`mem_limit` 和 `mem_request` 文件。

<!-- discussion -->

<!--
## Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. For more information, see
[Secrets](/docs/concepts/configuration/secret/).
-->
## 投射鍵名到指定路徑並且指定文件權限   {#project-keys-to-specific-paths-and-file-permissions}

你可以將鍵名投射到指定路徑並且指定每個文件的訪問權限。
更多信息，請參閱 [Secret](/zh-cn/docs/concepts/configuration/secret/)。

## {{% heading "whatsnext" %}}

<!--
* Read the [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API definition for Pod. This includes the definition of Container (part of Pod).
* Read the list of [available fields](/docs/concepts/workloads/pods/downward-api/#available-fields) that you
  can expose using the downward API.

Read about volumes in the legacy API reference:
* Check the [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
  API definition which defines a generic volume in a Pod for containers to access.
* Check the [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
  API definition which defines a volume that contains Downward API information.
* Check the [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
  API definition which contains references to object or resource fields for
  populating a file in the Downward API volume.
* Check the [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
  API definition which specifies the container resources and their output format.
-->
* 參閱 Pod [`spec`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API 的定義，其中包括了容器（Pod 的一部分）的定義。
* 參閱你可以使用 downward API 公開的[可用字段](/zh-cn/docs/concepts/workloads/pods/downward-api/#available-fields)列表。

閱讀舊版的 API 參考中關於卷的內容：
* 參閱
  [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
  API 定義，該 API 在 Pod 中定義通用卷以供容器訪問。
* 參閱
  [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
  API 定義，該 API 定義包含 Downward API 信息的卷。
* 參閱
  [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
  API 定義，該 API 包含對對象或資源字段的引用，用於在 Downward API 卷中填充文件。
* 參閱
  [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
  API 定義，該 API 指定容器資源及其輸出格式。
