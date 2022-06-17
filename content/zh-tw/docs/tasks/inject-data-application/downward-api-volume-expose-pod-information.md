---
title: 透過檔案將 Pod 資訊呈現給容器
content_type: task
weight: 40
---

<!-- overview -->

<!--
This page shows how a Pod can use a
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
to expose information about itself to Containers running in the Pod.
A `DownwardAPIVolumeFile` can expose Pod fields and Container fields.
-->
此頁面描述 Pod 如何使用
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
把自己的資訊呈現給 Pod 中執行的容器。
`DownwardAPIVolumeFile` 可以呈現 Pod 和容器的欄位。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## The Downward API

There are two ways to expose Pod and Container fields to a running Container:

* [Environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* Volume files

Together, these two ways of exposing Pod and Container fields are called the
"Downward API".
-->
## Downward API   {#the-downward-api}

有兩種方式可以將 Pod 和 Container 欄位呈現給執行中的容器：

* [環境變數](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* 卷檔案

這兩種呈現 Pod 和 Container 欄位的方式都稱為 "Downward API"。

<!--
## Store Pod fields

In this exercise, you create a Pod that has one Container.
Here is the configuration file for the Pod:
-->
## 儲存 Pod 欄位   {#store-pod-fields}

在這個練習中，你將建立一個包含一個容器的 Pod。Pod 的配置檔案如下：

{{< codenew file="pods/inject/dapi-volume.yaml" >}}

<!--
In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core).
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations`
field should be stored in a file named `annotations`.
-->
在配置檔案中，你可以看到 Pod 有一個 `downwardAPI` 型別的卷，並且掛載到容器中的
`/etc/podinfo` 目錄。

檢視 `downwardAPI` 下面的 `items` 陣列。
每個陣列元素都是一個
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
物件。
第一個元素指示 Pod 的 `metadata.labels` 欄位的值儲存在名為 `labels` 的檔案中。
第二個元素指示 Pod 的 `annotations` 欄位的值儲存在名為 `annotations` 的檔案中。

<!--
The fields in this example are Pod fields. They are not
fields of the Container in the Pod.
-->
{{< note >}}
本示例中的欄位是Pod欄位，不是Pod中容器的欄位。
{{< /note >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

<!--
Verify that the container in the Pod is running:
-->
驗證Pod中的容器執行正常：

```shell
kubectl get pods
```

<!--
View the container's logs:
-->
檢視容器的日誌：

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

<!--
The output shows the contents of the `labels` file and the `annotations` file:
-->
輸出顯示 `labels` 和 `annotations` 檔案的內容：

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
進入 Pod 中執行的容器，開啟一個 Shell：

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

<!--
In your shell, view the `labels` file:
-->
在該 Shell中，檢視 `labels` 檔案：

```shell
/# cat /etc/podinfo/labels
```

<!--
The output shows that all of the Pod's labels have been written
to the `labels` file:
-->
輸出顯示 Pod 的所有標籤都已寫入 `labels` 檔案。

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

<!--
Similarly, view the `annotations` file:
-->
同樣，檢視 `annotations` 檔案：

```shell
/# cat /etc/podinfo/annotations
```

<!--
View the files in the `/etc/podinfo` directory:
-->
檢視 `/etc/podinfo` 目錄下的檔案：

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
在輸出中可以看到，`labels` 和 `annotations` 檔案都在一個臨時子目錄中。
在這個例子，`..2982_06_02_21_47_53.299460680`。
在 `/etc/podinfo` 目錄中，`..data` 是一個指向臨時子目錄
的符號連結。`/etc/podinfo` 目錄中，`labels` 和 `annotations` 也是符號連結。

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
用符號連結可實現元資料的動態原子性重新整理；更新將寫入一個新的臨時目錄，
然後透過使用 [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html)
完成 `..data` 符號連結的原子性更新。

<!--
A container using Downward API as a
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume mount will not
receive Downward API updates.
-->
{{< note >}}
如果容器以
[subPath](/zh-cn/docs/concepts/storage/volumes/#using-subpath)卷掛載方式來使用
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
## Store Container fields

The preceding exercise, you stored Pod fields in a
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)..
In this next exercise, you store Container fields. Here is the configuration
file for a Pod that has one Container:
-->
## 儲存容器欄位   {#store-container-fields}

前面的練習中，你將 Pod 欄位儲存到
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
中。
接下來這個練習，你將儲存 Container 欄位。這裡是包含一個容器的 Pod 的配置檔案：

{{< codenew file="pods/inject/dapi-volume-resources.yaml" >}}

<!--
In the configuration file, you can see that the Pod has a
[`downwardAPI` volume](/docs/concepts/storage/volumes/#downwardapi),
and the Container mounts the volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core).

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field in the format specified by `1m` should be
stored in a file named `cpu_limit`. The `divisor` field is optional and has the
default value of `1` which means cores for cpu and bytes for memory.

Create the Pod:
-->
在這個配置檔案中，你可以看到 Pod 有一個
[`downwardAPI` 卷](/zh-cn/docs/concepts/storage/volumes/#downwardapi)，
並且掛載到容器的 `/etc/podinfo` 目錄。

檢視 `downwardAPI` 下面的 `items` 陣列。每個陣列元素都是一個
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)。

第一個元素指定在名為 `client-container` 的容器中，
以 `1m` 所指定格式的 `limits.cpu` 欄位的值應儲存在名為 `cpu_limit` 的檔案中。
`divisor` 欄位是可選的，預設值為 `1`，表示 CPU 的核心和記憶體的位元組。

建立Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

<!--
Get a shell into the container that is running in your Pod:
-->
開啟一個 Shell，進入 Pod 中執行的容器：

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

<!--
In your shell, view the `cpu_limit` file:
-->
在 Shell 中，檢視 `cpu_limit` 檔案：

```shell
/# cat /etc/podinfo/cpu_limit
```

<!--
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.
-->
你可以使用同樣的命令檢視 `cpu_request`、`mem_limit` 和 `mem_request` 檔案.

<!-- discussion -->

<!-- TODO: This section should be extracted out of the task page. -->
<!--
## Capabilities of the Downward API
-->
## Downward API 的能力   {#capabilities-of-the-downward-api}

<!--
The following information is available to containers through environment
variables and `downwardAPI` volumes:

* Information available via `fieldRef`:

  * `metadata.name` - the pod's name
  * `metadata.namespace` - the pod's namespace
  * `metadata.uid` - the pod's UID
  * `metadata.labels['<KEY>']` - the value of the pod's label `<KEY>`
    (for example, `metadata.labels['mylabel']`)
  * `metadata.annotations['<KEY>']` - the value of the pod's annotation `<KEY>`
    (for example, `metadata.annotations['myannotation']`)
-->
下面這些資訊可以透過環境變數和 `downwardAPI` 卷提供給容器：

* 能透過 `fieldRef` 獲得的：

  * `metadata.name` - Pod 名稱
  * `metadata.namespace` - Pod 名字空間
  * `metadata.uid` - Pod 的 UID
  * `metadata.labels['<KEY>']` - Pod 標籤 `<KEY>` 的值
    （例如：`metadata.labels['mylabel']`）
  * `metadata.annotations['<KEY>']` - Pod 的註解 `<KEY>` 的值
    （例如：`metadata.annotations['myannotation']`）

<!--
* Information available via `resourceFieldRef`:

  * A Container's CPU limit
  * A Container's CPU request
  * A Container's memory limit
  * A Container's memory request
  * A Container's hugepages limit (provided that the `DownwardAPIHugePages`
    [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled)
  * A Container's hugepages request (provided that the `DownwardAPIHugePages`
    [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled)
  * A Container's ephemeral-storage limit
  * A Container's ephemeral-storage request
-->
* 能透過 `resourceFieldRef` 獲得的：
  * 容器的 CPU 約束值
  * 容器的 CPU 請求值
  * 容器的記憶體約束值
  * 容器的記憶體請求值
  * 容器的巨頁限制值（前提是啟用了 `DownwardAPIHugePages`
    [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)）
  * 容器的巨頁請求值（前提是啟用了 `DownwardAPIHugePages`
    [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)）
  * 容器的臨時儲存約束值
  * 容器的臨時儲存請求值

<!--
In addition, the following information is available through
`downwardAPI` volume `fieldRef`:
-->
此外，以下資訊可透過 `downwardAPI` 卷從 `fieldRef` 獲得：

<!--
* `metadata.labels` - all of the pod's labels, formatted as `label-key="escaped-label-value"`
  with one label per line
* `metadata.annotations` - all of the pod's annotations, formatted as
  `annotation-key="escaped-annotation-value"` with one annotation per line
-->
* `metadata.labels` - Pod 的所有標籤，以
  `label-key="escaped-label-value"` 格式顯示，每行顯示一個標籤
* `metadata.annotations` - Pod 的所有註解，以
  `annotation-key="escaped-annotation-value"` 格式顯示，每行顯示一個標籤

<!--
The following information is available through environment variables:

* `status.podIP` - the pod's IP address
* `spec.serviceAccountName` - the pod's service account name
* `spec.nodeName` - the name of the node to which the scheduler always attempts to
  schedule the pod
* `status.hostIP` - the IP of the node to which the Pod is assigned
-->
以下資訊可透過環境變數獲得：

* `status.podIP` - Pod IP 地址
* `spec.serviceAccountName` - Pod 服務帳號名稱
* `spec.nodeName` - 排程器總是嘗試將 Pod 排程到的節點的名稱
* `status.hostIP` - Pod 分配到的節點的 IP

<!--
If CPU and memory limits are not specified for a Container, the
Downward API defaults to the node allocatable value for CPU and memory.
-->
{{< note >}}
如果容器未指定 CPU 和記憶體限制，則 Downward API 預設將節點可分配值
視為容器的 CPU 和記憶體限制。
{{< /note >}}

<!--
## Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. For more information, see
[Secrets](/docs/concepts/configuration/secret/).
-->
## 投射鍵名到指定路徑並且指定檔案許可權   {#project-keys-to-specific-paths-and-file-permissions}

你可以將鍵名投射到指定路徑並且指定每個檔案的訪問許可權。
更多資訊，請參閱 [Secret](/zh-cn/docs/concepts/configuration/secret/)。

<!--
## Motivation for the Downward API

It is sometimes useful for a container to have information about itself, without
being overly coupled to Kubernetes. The Downward API allows containers to consume
information about themselves or the cluster without using the Kubernetes client
or API server.

An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.
-->
## Downward API 的動機   {#motivation-for-the-downward-api}

對於容器來說，有時候擁有自己的資訊是很有用的，可避免與 Kubernetes 過度耦合。
Downward API 使得容器使用自己或者叢集的資訊，而不必透過 Kubernetes 客戶端或
API 伺服器來獲得。

一個例子是有一個現有的應用假定要用一個非常熟悉的環境變數來儲存一個唯一標識。
一種可能是給應用增加處理層，但這樣是冗餘和易出錯的，而且它違反了低耦合的目標。
更好的選擇是使用 Pod 名稱作為標識，把 Pod 名稱注入這個環境變數中。

## {{% heading "whatsnext" %}}

<!--
* Check the [`PodSpec`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
  API definition which defines the desired state of a Pod.
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
* 參閱
  [`PodSpec`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
  API 定義，該 API 定義 Pod 所需狀態。
* 參閱
  [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
  API 定義，該 API 在 Pod 中定義通用卷以供容器訪問。
* 參閱
  [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
  API 定義，該 API 定義包含 Downward API 資訊的卷。
* 參閱
  [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
  API 定義，該 API 包含對物件或資源欄位的引用，用於在 Downward API 卷中填充檔案。
* 參閱
  [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
  API 定義，該 API 指定容器資源及其輸出格式。

