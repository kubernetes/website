---
title: 映像檔
content_type: concept
weight: 10
hide_summary: true # 在章節索引中單獨列出
---
<!--
reviewers:
- erictune
- thockin
title: Images
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
-->

<!-- overview -->

<!--
A container image represents binary data that encapsulates an application and all its
software dependencies. Container images are executable software bundles that can run
standalone and that make very well-defined assumptions about their runtime environment.

You typically create a container image of your application and push it to a registry
before referring to it in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.

This page provides an outline of the container image concept.
-->
容器映像檔（Image）所承載的是封裝了應用程序及其所有軟件依賴的二進制數據。
容器映像檔是可執行的軟件包，可以單獨運行；該軟件包對所處的運行時環境具有明確定義的運行時環境假定。

你通常會創建應用的容器映像檔並將其推送到某倉庫（Registry），然後在
{{< glossary_tooltip text="Pod" term_id="pod" >}} 中引用它。

本頁概要介紹容器映像檔的概念。

{{< note >}}
<!-- 
If you are looking for the container images for a Kubernetes
release (such as v{{< skew latestVersion >}}, the latest minor release),
visit [Download Kubernetes](https://kubernetes.io/releases/download/).
-->
如果你正在尋找 Kubernetes 某個發行版本（如最新次要版本 v{{< skew latestVersion >}}）
的容器映像檔，請訪問[下載 Kubernetes](/zh-cn/releases/download/)。
{{< /note >}}

<!-- body -->

<!--
## Image names

Container images are usually given a name such as `pause`, `example/mycontainer`, or `kube-apiserver`.
Images can also include a registry hostname; for example: `fictional.registry.example/imagename`,
and possibly a port number as well; for example: `fictional.registry.example:10443/imagename`.

If you don't specify a registry hostname, Kubernetes assumes that you mean the [Docker public registry](https://hub.docker.com/).
You can change this behavior by setting a default image registry in the
[container runtime](/docs/setup/production-environment/container-runtimes/) configuration.
-->
## 映像檔名稱    {#image-names}

容器映像檔通常會被賦予 `pause`、`example/mycontainer` 或者 `kube-apiserver` 這類的名稱。
映像檔名稱也可以包含所在倉庫的主機名。例如：`fictional.registry.example/imagename`。
還可以包含倉庫的端口號，例如：`fictional.registry.example:10443/imagename`。

如果你不指定倉庫的主機名，Kubernetes 認爲你在使用 [Docker 公共倉庫](https://hub.docker.com/)。
你可以通過在[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
設定中設置默認映像檔倉庫來更改此行爲。

<!--
After the image name part you can add a _tag_ or _digest_ (in the same way you would when using with commands
like `docker` or `podman`). Tags let you identify different versions of the same series of images.
Digests are a unique identifier for a specific version of an image. Digests are hashes of the image's content,
and are immutable. Tags can be moved to point to different images, but digests are fixed.
-->
在映像檔名稱之後，你可以添加一個**標籤（Tag）** 或 **摘要（digest）**
（與使用 `docker` 或 `podman` 等命令時的方式相同）。
使用標籤能讓你辨識同一映像檔序列中的不同版本。
摘要是特定版本映像檔的唯一標識符，是映像檔內容的哈希值，不可變。

<!--
Image tags consist of lowercase and uppercase letters, digits, underscores (`_`),
periods (`.`), and dashes (`-`). A tag can be up to 128 characters long, and must
conform to the following regex pattern: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`.
You can read more about it and find the validation regex in the
[OCI Distribution Specification](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories).
If you don't specify a tag, Kubernetes assumes you mean the tag `latest`.
-->
映像檔標籤可以包含小寫字母、大寫字母、數字、下劃線（`_`）、句點（`.`）和連字符（`-`）。
標籤的長度最多爲 128 個字符，並且必須遵循正則表達式模式：`[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`。
你可以在 [OCI 分發規範](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories)
中閱讀有關並找到驗證正則表達式的更多信息。
如果你不指定標籤，Kubernetes 認爲你想使用標籤 `latest`。

<!--
Image digests consists of a hash algorithm (such as `sha256`) and a hash value. For example:
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`.
You can find more information about the digest format in the
[OCI Image Specification](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests).
-->
映像檔摘要由哈希算法（例如 `sha256`）和哈希值組成，例如：
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`。
你可以在 [OCI 映像檔規範](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests)
中找到有關摘要格式的更多信息。

<!--
Some image name examples that Kubernetes can use are:
-->
Kubernetes 可以使用的一些映像檔名稱示例包括：

<!--
- `busybox` &mdash; Image name only, no tag or digest. Kubernetes will use the Docker
    public registry and latest tag. Equivalent to `docker.io/library/busybox:latest`.
- `busybox:1.32.0` &mdash; Image name with tag. Kubernetes will use the Docker
    public registry. Equivalent to `docker.io/library/busybox:1.32.0`.
- `registry.k8s.io/pause:latest` &mdash; Image name with a custom registry and latest tag.
- `registry.k8s.io/pause:3.5` &mdash; Image name with a custom registry and non-latest tag.
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash;
    Image name with digest.
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash;
    Image name with tag and digest. Only the digest will be used for pulling.
-->
- `busybox` - 僅包含映像檔名稱，沒有標籤或摘要，Kubernetes 將使用 Docker 公共映像檔倉庫和 `latest` 標籤。
  （例如 `docker.io/library/busybox:latest`）
- `busybox:1.32.0` - 帶標籤的映像檔名稱，Kubernetes 將使用 Docker 公共映像檔倉庫。
  （例如 `docker.io/library/busybox:1.32.0`）
- `registry.k8s.io/pause:latest` - 帶有自定義映像檔倉庫和 `latest` 標籤的映像檔名稱。
- `registry.k8s.io/pause:3.5` - 帶有自定義映像檔倉庫和非 `latest` 標籤的映像檔名稱。
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - 帶摘要的映像檔名稱。
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - 帶有標籤和摘要的映像檔名稱，映像檔拉取僅參考摘要。

<!--
## Updating images

When you first create a {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod, or other
object that includes a PodTemplate, and a pull policy was not explicitly specified,
then by default the pull policy of all containers in that Pod will be set to
`IfNotPresent`. This policy causes the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} to skip pulling an
image if it already exists.
-->
## 更新映像檔  {#updating-images}

當你最初創建一個 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}、
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}、Pod
或者其他包含 PodTemplate 的對象，且沒有顯式指定拉取策略時，
Pod 中所有容器的默認映像檔拉取策略將被設置爲 `IfNotPresent`。這一策略會使得
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
在映像檔已經存在的情況下直接略過拉取映像檔的操作。

<!--
### Image pull policy

The `imagePullPolicy` for a container and the tag of the image both affect _when_ the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) attempts to pull
(download) the specified image.

Here's a list of the values you can set for `imagePullPolicy` and the effects
these values have:
-->
### 映像檔拉取策略   {#image-pull-policy}

容器的 `imagePullPolicy` 和映像檔的標籤會影響
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
嘗試拉取（下載）指定的映像檔。

以下列表包含了 `imagePullPolicy` 可以設置的值，以及這些值的效果：

<!--
`IfNotPresent`
: the image is pulled only if it is not already present locally.

`Always`
: every time the kubelet launches a container, the kubelet queries the container
  image registry to resolve the name to an image
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier).
  If the kubelet has a container image with that exact digest cached locally, the kubelet uses its
  cached image; otherwise, the kubelet pulls the image with the resolved digest, and uses that image
  to launch the container.

`Never`
: the kubelet does not try fetching the image. If the image is somehow already present
  locally, the kubelet attempts to start the container; otherwise, startup fails.
  See [pre-pulled images](#pre-pulled-images) for more details.
-->
`IfNotPresent`
: 只有當映像檔在本地不存在時纔會拉取。

`Always`
: 每當 kubelet 啓動一個容器時，kubelet 會查詢容器的映像檔倉庫，
  將名稱解析爲一個映像檔[摘要](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)。
  如果 kubelet 有一個容器映像檔，並且對應的摘要已在本地緩存，kubelet 就會使用其緩存的映像檔；
  否則，kubelet 就會使用解析後的摘要拉取映像檔，並使用該映像檔來啓動容器。

`Never`
: kubelet 不會嘗試獲取映像檔。如果映像檔已經以某種方式存在本地，
  kubelet 會嘗試啓動容器；否則，會啓動失敗。
  更多細節見[提前拉取映像檔](#pre-pulled-images)。

<!--
The caching semantics of the underlying image provider make even
`imagePullPolicy: Always` efficient, as long as the registry is reliably accessible.
Your container runtime can notice that the image layers already exist on the node
so that they don't need to be downloaded again.
-->
只要能夠可靠地訪問映像檔倉庫，底層映像檔提供者的緩存語義甚至可以使 `imagePullPolicy: Always` 高效。
你的容器運行時可以注意到節點上已經存在的映像檔層，這樣就不需要再次下載。

{{< note >}}
<!--
You should avoid using the `:latest` tag when deploying containers in production as
it is harder to track which version of the image is running and more difficult to
roll back properly.

Instead, specify a meaningful tag such as `v1.42.0` and/or a digest.
-->
在生產環境中部署容器時，你應該避免使用 `:latest` 標籤，
因爲這使得正在運行的映像檔的版本難以追蹤，並且難以正確地回滾。

相反，應指定一個有意義的標籤，如 `v1.42.0`，和/或者一個摘要。
{{< /note >}}

<!--
To make sure the Pod always uses the same version of a container image, you can specify
the image's digest;
replace `<image-name>:<tag>` with `<image-name>@<digest>`
(for example, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).
-->
爲了確保 Pod 總是使用相同版本的容器映像檔，你可以指定映像檔的摘要；
將 `<image-name>:<tag>` 替換爲 `<image-name>@<digest>`，例如
`image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`。

<!--
When using image tags, if the image registry were to change the code that the tag on that image
represents, you might end up with a mix of Pods running the old and new code. An image digest
uniquely identifies a specific version of the image, so Kubernetes runs the same code every time
it starts a container with that image name and digest specified. Specifying an image by digest
pins the code that you run so that a change at the registry cannot lead to that mix of versions.

There are third-party [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
that mutate Pods (and PodTemplates) when they are created, so that the
running workload is defined based on an image digest rather than a tag.
That might be useful if you want to make sure that your entire workload is
running the same code no matter what tag changes happen at the registry.
-->
當使用映像檔標籤時，如果映像檔倉庫修改了代碼所對應的映像檔標籤，可能會出現新舊代碼混雜在 Pod 中運行的情況。
映像檔摘要唯一標識了映像檔的特定版本，因此 Kubernetes 每次啓動具有指定映像檔名稱和摘要的容器時，都會運行相同的代碼。
通過摘要指定映像檔可固定你運行的代碼，這樣映像檔倉庫的變化就不會導致版本的混雜。

有一些第三方的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
在創建 Pod（和 PodTemplate）時產生變更，這樣運行的工作負載就是根據映像檔摘要，而不是標籤來定義的。
無論映像檔倉庫上的標籤發生什麼變化，你都想確保你的整個工作負載都運行相同的代碼，那麼指定映像檔摘要會很有用。

<!--
#### Default image pull policy {#imagepullpolicy-defaulting}

When you (or a controller) submit a new Pod to the API server, your cluster sets the
`imagePullPolicy` field when specific conditions are met:
-->
#### 默認映像檔拉取策略    {#imagepullpolicy-defaulting}

當你（或控制器）向 API 伺服器提交一個新的 Pod 時，你的叢集會在滿足特定條件時設置 `imagePullPolicy` 字段：

<!--
- if you omit the `imagePullPolicy` field, and you specify the digest for the
  container image, the `imagePullPolicy` is automatically set to `IfNotPresent`.
- if you omit the `imagePullPolicy` field, and the tag for the container image is
  `:latest`, `imagePullPolicy` is automatically set to `Always`.
- if you omit the `imagePullPolicy` field, and you don't specify the tag for the
  container image, `imagePullPolicy` is automatically set to `Always`.
- if you omit the `imagePullPolicy` field, and you specify a tag for the container
  image that isn't `:latest`, the `imagePullPolicy` is automatically set to
  `IfNotPresent`.
-->
- 如果你省略了 `imagePullPolicy` 字段，並且你爲容器映像檔指定了摘要，
  那麼 `imagePullPolicy` 會自動設置爲 `IfNotPresent`。
- 如果你省略了 `imagePullPolicy` 字段，並且容器映像檔的標籤是 `:latest`，
  `imagePullPolicy` 會自動設置爲 `Always`。
- 如果你省略了 `imagePullPolicy` 字段，並且沒有指定容器映像檔的標籤，
  `imagePullPolicy` 會自動設置爲 `Always`。
- 如果你省略了 `imagePullPolicy` 字段，並且爲容器映像檔指定了非 `:latest` 的標籤，
  `imagePullPolicy` 就會自動設置爲 `IfNotPresent`。

{{< note >}}
<!--
The value of `imagePullPolicy` of the container is always set when the object is
first _created_, and is not updated if the image's tag or digest later changes.

For example, if you create a Deployment with an image whose tag is _not_
`:latest`, and later update that Deployment's image to a `:latest` tag, the
`imagePullPolicy` field will _not_ change to `Always`. You must manually change
the pull policy of any object after its initial creation.
-->
容器的 `imagePullPolicy` 的值總是在對象初次**創建**時設置的，
如果後來映像檔的標籤或摘要發生變化，則不會更新。

例如，如果你用一個**非** `:latest` 的映像檔標籤創建一個 Deployment，
並在隨後更新該 Deployment 的映像檔標籤爲 `:latest`，則 `imagePullPolicy` 字段**不會**變成 `Always`。
你必須手動更改已經創建的資源的拉取策略。
{{< /note >}}

<!--
#### Required image pull

If you would like to always force a pull, you can do one of the following:

- Set the `imagePullPolicy` of the container to `Always`.
- Omit the `imagePullPolicy` and use `:latest` as the tag for the image to use;
  Kubernetes will set the policy to `Always` when you submit the Pod.
- Omit the `imagePullPolicy` and the tag for the image to use;
  Kubernetes will set the policy to `Always` when you submit the Pod.
- Enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  admission controller.
-->
#### 必要的映像檔拉取   {#required-image-pull}

如果你想總是強制執行拉取，你可以使用下述的一種方式：

- 設置容器的 `imagePullPolicy` 爲 `Always`。
- 省略 `imagePullPolicy`，並使用 `:latest` 作爲映像檔標籤；
  當你提交 Pod 時，Kubernetes 會將策略設置爲 `Always`。
- 省略 `imagePullPolicy` 和映像檔的標籤；
  當你提交 Pod 時，Kubernetes 會將策略設置爲 `Always`。
- 啓用准入控制器 [AlwaysPullImages](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。

<!--
### ImagePullBackOff

When a kubelet starts creating containers for a Pod using a container runtime,
it might be possible the container is in [Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)
state because of `ImagePullBackOff`.
-->
### ImagePullBackOff

當 kubelet 使用容器運行時創建 Pod 時，容器可能因爲 `ImagePullBackOff` 導致狀態爲
[Waiting](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)。

<!--
The status `ImagePullBackOff` means that a container could not start because Kubernetes
could not pull a container image (for reasons such as invalid image name, or pulling
from a private registry without `imagePullSecret`). The `BackOff` part indicates
that Kubernetes will keep trying to pull the image, with an increasing back-off delay.

Kubernetes raises the delay between each attempt until it reaches a compiled-in limit,
which is 300 seconds (5 minutes).
-->
`ImagePullBackOff` 狀態意味着容器無法啓動，
因爲 Kubernetes 無法拉取容器映像檔（原因包括無效的映像檔名稱，或從私有倉庫拉取而沒有 `imagePullSecret`）。
`BackOff` 部分表示 Kubernetes 將繼續嘗試拉取映像檔，並增加回退延遲。

Kubernetes 會增加每次嘗試之間的延遲，直到達到編譯限制，即 300 秒（5 分鐘）。

<!--
### Image pull per runtime class
-->
### 基於運行時類的映像檔拉取  {#image-pull-per-runtime-class}

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}
<!--
Kubernetes includes alpha support for performing image pulls based on the RuntimeClass of a Pod.
-->
Kubernetes 包含了根據 Pod 的 RuntimeClass 來執行映像檔拉取的 Alpha 支持。

<!--
If you enable the `RuntimeClassInImageCriApi` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the kubelet references container images by a tuple of image name and runtime handler
rather than just the image name or digest. Your
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
may adapt its behavior based on the selected runtime handler.
Pulling images based on runtime class is useful for VM-based containers, such as
Windows Hyper-V containers.
-->
如果你啓用了 `RuntimeClassInImageCriApi`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
kubelet 會通過一個由映像檔名稱和運行時處理程序構成的元組而不僅僅是映像檔名稱或映像檔摘要來引用容器映像檔。
你的{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}可能會根據選定的運行時處理程序調整其行爲。
基於運行時類來拉取映像檔對於 Windows Hyper-V 容器這類基於 VM 的容器會有幫助。

<!--
## Serial and parallel image pulls
-->
## 串行和並行映像檔拉取  {#serial-and-parallel-image-pulls}

<!--
By default, the kubelet pulls images serially. In other words, the kubelet sends
only one image pull request to the image service at a time. Other image pull
requests have to wait until the one being processed is complete.
-->
默認情況下，kubelet 以串行方式拉取映像檔。
也就是說，kubelet 一次只向映像檔服務發送一個映像檔拉取請求。
其他映像檔拉取請求必須等待，直到正在處理的那個請求完成。

<!--
Nodes make image pull decisions in isolation. Even when you use serialized image
pulls, two different nodes can pull the same image in parallel.
-->
節點獨立地做出映像檔拉取的決策。即使你使用串行的映像檔拉取，兩個不同的節點也可以並行拉取相同的映像檔。

<!--
If you would like to enable parallel image pulls, you can set the field
`serializeImagePulls` to false in the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
With `serializeImagePulls` set to false, image pull requests will be sent to the image service immediately,
and multiple images will be pulled at the same time.
-->
如果你想啓用並行映像檔拉取，可以在 [kubelet 設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中將字段 `serializeImagePulls` 設置爲 false。
當 `serializeImagePulls` 設置爲 false 時，kubelet 會立即向映像檔服務發送映像檔拉取請求，多個映像檔將同時被拉動。

<!--
When enabling parallel image pulls, ensure that the image service of your container
runtime can handle parallel image pulls.
-->
啓用並行映像檔拉取時，確保你的容器運行時的映像檔服務可以處理並行映像檔拉取。

<!--
The kubelet never pulls multiple images in parallel on behalf of one Pod. For example,
if you have a Pod that has an init container and an application container, the image
pulls for the two containers will not be parallelized. However, if you have two
Pods that use different images, and the parallel image pull feature is enabled,
the kubelet will pull the images in parallel on behalf of the two different Pods.
-->
kubelet 從不代表一個 Pod 並行地拉取多個映像檔。
例如，如果你有一個 Pod，它有一個初始容器和一個應用容器，那麼這兩個容器的映像檔拉取將不會並行。
但是，如果你有兩個使用不同映像檔的 Pod，且啓用並行映像檔拉取特性時，kubelet 會代表兩個不同的 Pod 並行拉取映像檔。

<!--
### Maximum parallel image pulls
-->
### 最大並行映像檔拉取數量  {#maximum-parallel-image-pulls}

{{< feature-state for_k8s_version="v1.32" state="beta" >}}

<!--
When `serializeImagePulls` is set to false, the kubelet defaults to no limit on
the maximum number of images being pulled at the same time. If you would like to
limit the number of parallel image pulls, you can set the field `maxParallelImagePulls`
in the kubelet configuration. With `maxParallelImagePulls` set to _n_, only _n_
images can be pulled at the same time, and any image pull beyond _n_ will have to
wait until at least one ongoing image pull is complete.
-->
當 `serializeImagePulls` 被設置爲 false 時，kubelet 默認對同時拉取的最大映像檔數量沒有限制。
如果你想限制並行映像檔拉取的數量，可以在 kubelet 設定中設置字段 `maxParallelImagePulls`。
當 `maxParallelImagePulls` 設置爲 **n** 時，只能同時拉取 **n** 個映像檔，
超過 **n** 的任何映像檔都必須等到至少一個正在進行拉取的映像檔拉取完成後，才能拉取。

<!--
Limiting the number of parallel image pulls prevents image pulling from consuming
too much network bandwidth or disk I/O, when parallel image pulling is enabled.
-->
當啓用並行映像檔拉取時，限制並行映像檔拉取的數量來防止映像檔拉取消耗過多的網路帶寬或磁盤 I/O。

<!--
You can set `maxParallelImagePulls` to a positive number that is greater than or
equal to 1. If you set `maxParallelImagePulls` to be greater than or equal to 2,
you must set `serializeImagePulls` to false. The kubelet will fail to start
with an invalid `maxParallelImagePulls` setting.
-->
你可以將 `maxParallelImagePulls` 設置爲大於或等於 1 的正數。
如果將 `maxParallelImagePulls` 設置爲大於等於 2，則必須將 `serializeImagePulls` 設置爲 false。
kubelet 在無效的 `maxParallelImagePulls` 設置下會啓動失敗。

<!--
## Multi-architecture images with image indexes

As well as providing binary images, a container registry can also serve a
[container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md).
An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
for architecture-specific versions of a container. The idea is that you can have
a name for an image (for example: `pause`, `example/mycontainer`, `kube-apiserver`)
and allow different systems to fetch the right binary image for the machine
architecture they are using.
-->
## 帶映像檔索引的多架構映像檔  {#multi-architecture-images-with-image-indexes}

除了提供二進制的映像檔之外，
容器倉庫也可以提供[容器映像檔索引](https://github.com/opencontainers/image-spec/blob/master/image-index.md)。
映像檔索引可以指向映像檔的多個[映像檔清單](https://github.com/opencontainers/image-spec/blob/master/manifest.md)，
提供特定於體系結構版本的容器。
這背後的理念是讓你可以爲映像檔命名（例如：`pause`、`example/mycontainer`、`kube-apiserver`）
的同時，允許不同的系統基於它們所使用的機器體系結構獲取正確的二進制映像檔。

<!--
The Kubernetes project typically creates container images for its releases with
names that include the suffix `-$(ARCH)`. For backward compatibility, generate
older images with suffixes. For instance, an image named as `pause` would be a
multi-architecture image containing manifests for all supported architectures,
while `pause-amd64` would be a backward-compatible version for older configurations,
or for YAML files with hardcoded image names containing suffixes.
-->
Kubernetes 項目通常在命名容器映像檔時添加後綴 `-$(ARCH)`。
爲了向前兼容，在生成較老的映像檔時也提供後綴。
例如，名爲 `pause` 的映像檔是一個多架構映像檔，包含所有受支持架構的映像檔清單；
而 `pause-amd64` 是一個向後兼容的版本，用於舊的設定，
或用於 YAML 文件中硬編碼了帶後綴映像檔名稱的情況。

<!--
## Using a private registry

Private registries may require authentication to be able to discover and/or pull
images from them.
Credentials can be provided in several ways:
-->
## 使用私有倉庫   {#using-a-private-registry}

從私有倉庫讀取映像檔時可能需要發現和/或拉取映像檔的身份認證。憑據可以用以下方式提供:

<!--
- [Specifying `imagePullSecrets` when you define a Pod](#specifying-imagepullsecrets-on-a-pod)

  Only Pods which provide their own keys can access the private registry.

- [Configuring Nodes to Authenticate to a Private Registry](#configuring-nodes-to-authenticate-to-a-private-registry)
  - All Pods can read any configured private registries.
  - Requires node configuration by cluster administrator.
- Using a _kubelet credential provider_ plugin to [dynamically fetch credentials for private registries](#kubelet-credential-provider)

  The kubelet can be configured to use credential provider exec plugin for the
  respective private registry.
-->
- [當你定義 Pod 時指定 `imagePullSecrets`](#specifying-imagepullsecrets-on-a-pod)

  只有提供自己密鑰的 Pod 才能訪問私有倉庫。

- [設定節點向私有倉庫進行身份驗證](#configuring-nodes-to-authenticate-to-a-private-registry)
  - 所有 Pod 均可讀取任何已設定的私有倉庫。
  - 需要叢集管理員設定節點。
- 使用 **kubelet 憑據提供程序** [動態獲取私有倉庫的憑據](#kubelet-credential-provider)
  
  kubelet 可以被設定爲使用憑據提供程序 exec 插件來訪問對應的私有映像檔庫。

<!--
- [Pre-pulled Images](#pre-pulled-images)
  - All Pods can use any images cached on a node.
  - Requires root access to all nodes to set up.
- Vendor-specific or local extensions

  If you're using a custom node configuration, you (or your cloud provider) can
  implement your mechanism for authenticating the node to the container registry.
-->
- [預拉映像檔](#pre-pulled-images)
  - 所有 Pod 都可以使用節點上緩存的所有映像檔。
  - 需要所有節點的 root 訪問權限才能進行設置。
- 特定於廠商的擴展或者本地擴展
  
  如果你在使用定製的節點設定，你（或者雲平臺提供商）可以實現讓節點向容器倉庫認證的機制。

<!--
These options are explained in more detail below.
-->
下面將詳細描述每一項。

<!--
### Specifying `imagePullSecrets` on a Pod
-->
### 在 Pod 上指定 `imagePullSecrets`   {#specifying-imagepullsecrets-on-a-pod}

{{< note >}}
<!--
This is the recommended approach to run containers based on images
in private registries.
-->
運行使用私有倉庫中映像檔的容器時，建議使用這種方法。
{{< /note >}}

<!--
Kubernetes supports specifying container image registry keys on a Pod.
All `imagePullSecrets` must be Secrets that exist in the same
{{< glossary_tooltip term_id="namespace" >}} as the
Pod. These Secrets must be of type `kubernetes.io/dockercfg` or `kubernetes.io/dockerconfigjson`.
-->
Kubernetes 支持在 Pod 中設置容器映像檔倉庫的密鑰。所有 `imagePullSecrets`
必須全部與 Pod 位於同一個{{< glossary_tooltip text="名字空間" term_id="namespace" >}}中。
這些 Secret 必須是 `kubernetes.io/dockercfg` 或 `kubernetes.io/dockerconfigjson` 類型。

<!--
### Configuring nodes to authenticate to a private registry

Specific instructions for setting credentials depends on the container runtime and registry you
chose to use. You should refer to your solution's documentation for the most accurate information.
-->
### 設定 Node 對私有倉庫認證  {#configuring-nodes-to-authenticate-to-a-private-registry}

設置憑據的具體說明取決於你選擇使用的容器運行時和倉庫。
你應該參考解決方案的文檔來獲取最準確的信息。

<!--
For an example of configuring a private container image registry, see the
[Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)
task. That example uses a private registry in Docker Hub.
-->
有關設定私有容器映像檔倉庫的示例，
請參閱任務[從私有映像檔庫中拉取映像檔](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry)。
該示例使用 Docker Hub 中的私有映像檔倉庫。

<!--
### Kubelet credential provider for authenticated image pulls {#kubelet-credential-provider}
-->
### 用於認證映像檔拉取的 kubelet 憑據提供程序  {#kubelet-credential-provider}

<!--
You can configure the kubelet to invoke a plugin binary to dynamically fetch
registry credentials for a container image. This is the most robust and versatile
way to fetch credentials for private registries, but also requires kubelet-level
configuration to enable.

This technique can be especially useful for running {{< glossary_tooltip term_id="static-pod" text="static Pods" >}}
that require container images hosted in a private registry.
Using a {{< glossary_tooltip term_id="service-account" >}} or a
{{< glossary_tooltip term_id="secret" >}} to provide private registry credentials
is not possible in the specification of a static Pod, because it _cannot_
have references to other API resources in its specification.

See [Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/) for more details.
-->
你可以設定 kubelet，以調用插件可執行文件的方式來動態獲取容器映像檔的倉庫憑據。
這是爲私有倉庫獲取憑據最穩健和最通用的方法，但也需要 kubelet 級別的設定才能啓用。

這種技術在運行依賴私有倉庫中容器映像檔的{{< glossary_tooltip term_id="static-pod" text="靜態 Pod" >}}
時尤其有用。在靜態 Pod 的規約中，不能使用 {{< glossary_tooltip term_id="service-account" >}}
或 {{< glossary_tooltip term_id="secret" >}} 來提供私有映像檔倉庫的憑據，因爲它**不能**在規約中引用其他 API 資源。

有關更多細節請參見[設定 kubelet 映像檔憑據提供程序](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)。

<!--
### Interpretation of config.json {#config-json}
-->
### config.json 說明 {#config-json}

<!--
The interpretation of `config.json` varies between the original Docker
implementation and the Kubernetes interpretation. In Docker, the `auths` keys
can only specify root URLs, whereas Kubernetes allows glob URLs as well as
prefix-matched paths. The only limitation is that glob patterns (`*`) have to
include the dot (`.`) for each subdomain. The amount of matched subdomains has
to be equal to the amount of glob patterns (`*.`), for example:
-->
對於 `config.json` 的解釋在原始 Docker 實現和 Kubernetes 的解釋之間有所不同。
在 Docker 中，`auths` 鍵只能指定根 URL，而 Kubernetes 允許 glob URL 以及前綴匹配的路徑。
唯一的限制是 glob 模式（`*`）必須爲每個子域名包括點（`.`）。
匹配的子域名數量必須等於 glob 模式（`*.`）的數量，例如：

<!--
- `*.kubernetes.io` will *not* match `kubernetes.io`, but will match
    `abc.kubernetes.io`.
- `*.*.kubernetes.io` will *not* match `abc.kubernetes.io`, but will match
    `abc.def.kubernetes.io`.
- `prefix.*.io` will match `prefix.kubernetes.io`.
- `*-good.kubernetes.io` will match `prefix-good.kubernetes.io`.
-->
- `*.kubernetes.io` **不**會匹配 `kubernetes.io`，但會匹配 `abc.kubernetes.io`。
- `*.*.kubernetes.io` **不**會匹配 `abc.kubernetes.io`，但會匹配 `abc.def.kubernetes.io`。
- `prefix.*.io` 將匹配 `prefix.kubernetes.io`。
- `*-good.kubernetes.io` 將匹配 `prefix-good.kubernetes.io`。

<!--
This means that a `config.json` like this is valid:
-->
這意味着，像這樣的 `config.json` 是有效的：

```json
{
    "auths": {
        "my-registry.example/images": { "auth": "…" },
        "*.my-registry.example/images": { "auth": "…" }
    }
}
```

<!--
Image pull operations pass the credentials to the CRI container runtime for every
valid pattern. For example, the following container image names would match
successfully:
-->
映像檔拉取操作將每種有效模式的憑據都傳遞給 CRI 容器運行時。例如下面的容器映像檔名稱會匹配成功：

- `my-registry.example/images`
- `my-registry.example/images/my-image`
- `my-registry.example/images/another-image`
- `sub.my-registry.example/images/my-image`

<!--
However, these container image names would *not* match:
-->
但這些容器映像檔名稱**不會**匹配成功：

- `a.sub.my-registry.example/images/my-image`
- `a.b.sub.my-registry.example/images/my-image`

<!--
The kubelet performs image pulls sequentially for every found credential. This
means that multiple entries in `config.json` for different paths are possible, too:
-->
kubelet 爲每個找到的憑據的映像檔按順序拉取。這意味着對於不同的路徑在 `config.json` 中也可能有多項：

```json
{
    "auths": {
        "my-registry.example/images": {
            "auth": "…"
        },
        "my-registry.example/images/subpath": {
            "auth": "…"
        }
    }
}
```

<!--
If now a container specifies an image `my-registry.example/images/subpath/my-image`
to be pulled, then the kubelet will try to download it using both authentication
sources if one of them fails.
-->
如果一個容器指定了要拉取的映像檔 `my-registry.io/images/subpath/my-image`，
並且其中一個失敗，kubelet 將嘗試同時使用兩個身份驗證源下載映像檔。

<!--
### Pre-pulled images
-->
### 提前拉取映像檔   {#pre-pulled-images}

{{< note >}}
<!--
This approach is suitable if you can control node configuration.  It
will not work reliably if your cloud provider manages nodes and replaces
them automatically.
-->
該方法適用於你能夠控制節點設定的場合。
如果你的雲供應商負責管理節點並自動置換節點，這一方案無法可靠地工作。
{{< /note >}}

<!--
By default, the kubelet tries to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).
-->
默認情況下，`kubelet` 會嘗試從指定的倉庫拉取每個映像檔。
但是，如果容器屬性 `imagePullPolicy` 設置爲 `IfNotPresent` 或者 `Never`，
則會優先使用（對應 `IfNotPresent`）或者一定使用（對應 `Never`）本地映像檔。

<!--
If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to
authenticating to a private registry.
-->
如果你希望使用提前拉取映像檔的方法代替倉庫認證，就必須保證叢集中所有節點提前拉取的映像檔是相同的。

這一方案可以用來提前載入指定的映像檔以提高速度，或者作爲向私有倉庫執行身份認證的一種替代方案。

<!--
Similar to the usage of the [kubelet credential provider](#kubelet-credential-provider),
pre-pulled images are also suitable for launching
{{< glossary_tooltip text="static Pods" term_id="static-pod" >}} that depend
on images hosted in a private registry.
-->
與使用 [kubelet 憑據提供程序](#kubelet-credential-provider)類似，
預拉取映像檔也適用於啓動依賴私有倉庫中映像檔的{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}}。

{{< note >}}
{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}
<!--
Access to pre-pulled images may be authorized according to [image pull credential verification](#ensureimagepullcredentialverification).
-->
對預拉取映像檔的訪問可能需要根據[映像檔拉取憑據驗證](#ensureimagepullcredentialverification)進行授權。
{{< /note >}}

<!--
#### Ensure image pull credential verification {#ensureimagepullcredentialverification}
-->
#### 映像檔拉取憑據驗證   {#ensureimagepullcredentialverification}

{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}

<!--
If the `KubeletEnsureSecretPulledImages` feature gate is enabled for your cluster,
Kubernetes will validate image credentials for every image that requires credentials
to be pulled, even if that image is already present on the node. This validation
ensures that images in a Pod request which have not been successfully pulled
with the provided credentials must re-pull the images from the registry.
Additionally, image pulls that re-use the same credentials
which previously resulted in a successful image pull will not need to re-pull from
the registry and are instead validated locally without accessing the registry
(provided the image is available locally).
This is controlled by the`imagePullCredentialsVerificationPolicy` field in the
[Kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-ImagePullCredentialsVerificationPolicy).
-->
如果爲你的叢集啓用了 `KubeletEnsureSecretPulledImages` 特性門控，Kubernetes
將驗證每個需要憑據才能拉取的映像檔的憑據，即使該映像檔已經存在於節點上。
此驗證確保了在 Pod 請求中未成功使用提供的憑據拉取的映像檔必須從映像檔倉庫重新拉取。
此外，若之前使用相同的憑據已成功拉取過映像檔，
則再次使用這些憑據的映像檔拉取操作將不需要從映像檔倉庫重新拉取，
而是通過本地驗證（前提是映像檔在本地可用）而無需訪問映像檔倉庫。這由
[kubelet 設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-ImagePullCredentialsVerificationPolicy)中的
`imagePullCredentialsVerificationPolicy` 字段控制。

<!--
This configuration controls when image pull credentials must be verified if the
image is already present on the node:
-->
此設定控制在映像檔已經存在於節點上時，何時必須驗證映像檔拉取憑據：

<!--
 * `NeverVerify`: Mimics the behavior of having this feature gate disabled.
   If the image is present locally, image pull credentials are not verified.
 * `NeverVerifyPreloadedImages`: Images pulled outside the kubelet are not verified,
 but all other images will have their credentials verified. This is the default behavior.
 * `NeverVerifyAllowListedImages`: Images pulled outside the kubelet and mentioned within the
   `preloadedImagesVerificationAllowlist` specified in the kubelet config are not verified.
 * `AlwaysVerify`: All images will have their credentials verified
   before they can be used.
-->
* `NeverVerify`：模仿關閉此特性門控的行爲。
  如果映像檔本地存在，則不會驗證映像檔拉取憑據。

* `NeverVerifyPreloadedImages`：在 kubelet 外部拉取的映像檔不會被驗證，
  但所有其他映像檔都將驗證其憑據。這是默認行爲。

* `NeverVerifyAllowListedImages`：在 kubelet 外部拉取且列在
  kubelet 設定中的 `preloadedImagesVerificationAllowlist` 裏的映像檔不會被驗證。

* `AlwaysVerify`：所有映像檔在使用前都必須驗證其憑據。

<!--
This verification applies to [pre-pulled images](#pre-pulled-images),
images pulled using node-wide secrets, and images pulled using Pod-level secrets.
-->
這種驗證適用於[預拉取映像檔](#pre-pulled-images)、
使用節點範圍的密鑰拉取的映像檔以及使用 Pod 級別密鑰拉取的映像檔。

{{< note >}}
<!--
In the case of credential rotation, the credentials previously used to pull the image
will continue to verify without the need to access the registry. New or rotated credentials
will require the image to be re-pulled from the registry.
-->
在憑據輪換的情況下，之前用於拉取映像檔的憑據將繼續驗證，
而無需訪問映像檔倉庫新的或已輪換的憑據將要求從映像檔倉庫重新拉取映像檔。
{{< /note >}}

<!--
#### Creating a Secret with a Docker config

You need to know the username, registry password and client email address for authenticating
to the registry, as well as its hostname.
Run the following command, substituting placeholders with the appropriate values:
-->
#### 使用 Docker Config 創建 Secret   {#creating-a-secret-with-docker-config}

你需要知道用於向倉庫進行身份驗證的使用者名、密碼和客戶端電子郵件地址，以及它的主機名。
運行以下命令，注意用合適的值替換佔位符：

```shell
kubectl create secret docker-registry <name> \
  --docker-server=<docker-registry-server> \
  --docker-username=<docker-user> \
  --docker-password=<docker-password> \
  --docker-email=<docker-email>
```

<!--
If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secret" term_id="secret" >}}.
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
explains how to set this up.
-->
如果你已經有 Docker 憑據文件，則可以將憑據文件導入爲 Kubernetes
{{< glossary_tooltip text="Secret" term_id="secret" >}}，
而不是執行上面的命令。
[基於已有的 Docker 憑據創建 Secret](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
解釋瞭如何完成這一操作。

<!--
This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.
-->
如果你在使用多個私有容器倉庫，這種技術將特別有用。
原因是 `kubectl create secret docker-registry` 創建的是僅適用於某個私有倉庫的 Secret。

{{< note >}}
<!--
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
-->
Pod 只能引用位於自身所在名字空間中的 Secret，因此需要針對每個名字空間重複執行上述過程。
{{< /note >}}

<!--
#### Referring to `imagePullSecrets` on a Pod

Now, you can create pods which reference that secret by adding the `imagePullSecrets`
section to a Pod definition. Each item in the `imagePullSecrets` array can only
reference one Secret in the same namespace.

For example:
-->
#### 在 Pod 中引用 `ImagePullSecrets` {#referring-to-imagepullsecrets-on-a-pod}

現在，在創建 Pod 時，可以在 Pod 定義中增加 `imagePullSecrets` 部分來引用該 Secret。
`imagePullSecrets` 數組中的每一項只能引用同一名字空間中的一個 Secret。

例如：

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
This needs to be done for each Pod that is using a private registry.

However, you can automate this process by specifying the `imagePullSecrets` section
in a [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)
resource. See [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`. The credentials
will be merged.
-->
你需要對使用私有倉庫的每個 Pod 執行以上操作。

不過，設置該字段的過程也可以通過爲[服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)資源設置
`imagePullSecrets` 來自動完成。有關詳細指令，
可參見[將 ImagePullSecrets 添加到服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)。

你也可以將此方法與節點級別的 `.docker/config.json` 設定結合使用。
來自不同來源的憑據會被合併。

<!--
## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.
-->
## 使用案例  {#use-cases}

設定私有倉庫有多種方案，以下是一些常用場景和建議的解決方案。

<!--
1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images from a public registry
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves
       availability and reduces the time to pull images.
-->
1. 叢集運行非專有映像檔（例如，開源映像檔）。映像檔不需要隱藏。
   - 使用來自公共倉庫的公共映像檔
     - 無需設定
     - 某些雲廠商會自動爲公開映像檔提供高速緩存，以便提升可用性並縮短拉取映像檔所需時間

<!--
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private registry
     - Manual configuration may be required on the nodes that need to access to private registry.
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Use a hosted container image registry service that controls image access
     - It will work better with Node autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
-->
2. 叢集運行一些專有映像檔，這些映像檔需要對公司外部隱藏，對所有叢集使用者可見
   - 使用託管的私有倉庫
     - 在需要訪問私有倉庫的節點上可能需要手動設定
   - 或者，在防火牆內運行一個組織內部的私有倉庫，並開放讀取權限
     - 不需要設定 Kubernetes
   - 使用控制映像檔訪問的託管容器映像檔倉庫服務
     - 與手動設定節點相比，這種方案能更好地處理節點自動擴縮容
   - 或者，在不方便更改節點設定的叢集中，使用 `imagePullSecrets`

<!--
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a Secret resource, instead of packaging it in an image.
-->
3. 叢集使用專有映像檔，且有些映像檔需要更嚴格的訪問控制
   - 確保 [AlwaysPullImages 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)被啓用。
     否則，所有 Pod 都可以使用所有映像檔。
   - 確保將敏感數據存儲在 Secret 資源中，而不是將其打包在映像檔裏。

<!--
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credentials for each tenant, store into a Secret, and propagate
     the Secret to every tenant namespace.
   - The tenant then adds that Secret to `imagePullSecrets` of each namespace.
-->
4. 叢集是多租戶的並且每個租戶需要自己的私有倉庫
   - 確保 [AlwaysPullImages 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。
     否則，所有租戶的所有的 Pod 都可以使用所有映像檔。
   - 爲私有倉庫啓用鑑權。
   - 爲每個租戶生成訪問倉庫的憑據，存放在 Secret 中，並將 Secret 發佈到各租戶的名字空間下。
   - 租戶將 Secret 添加到每個名字空間中的 imagePullSecrets。

<!--
If you need access to multiple registries, you can create one Secret per registry.
-->
如果你需要訪問多個倉庫，可以爲每個倉庫創建一個 Secret。

<!--
## Legacy built-in kubelet credential provider

In older versions of Kubernetes, the kubelet had a direct integration with cloud
provider credentials. This provided the ability to dynamically fetch credentials
for image registries.
-->
## 舊版的內置 kubelet 憑據提供程序    {#legacy-built-in-kubelet-credentials-provider}

在舊版本的 Kubernetes 中，kubelet 與雲提供商憑據直接集成。
這使它能夠動態獲取映像檔倉庫的憑據。

<!--
There were three built-in implementations of the kubelet credential provider
integration: ACR (Azure Container Registry), ECR (Elastic Container Registry),
and GCR (Google Container Registry).
-->
kubelet 憑據提供程序集成存在三個內置實現：
ACR（Azure 容器倉庫）、ECR（Elastic 容器倉庫）和 GCR（Google 容器倉庫）。

<!--
Starting with version 1.26 of Kubernetes, the legacy mechanism has been removed,
so you would need to either:
- configure a kubelet image credential provider on each node; or
- specify image pull credentials using `imagePullSecrets` and at least one Secret.
-->
從 Kubernetes v1.26 開始，舊版機制已被移除，因此你需要：

- 在每個節點上設定一個 kubelet 映像檔憑據提供程序；或
- 使用 `imagePullSecrets` 和至少一個 Secret 指定映像檔拉取憑據。

## {{% heading "whatsnext" %}}

<!--
* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/main/manifest.md).
* Learn about [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Learn more about [pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).
-->
* 閱讀 [OCI Image Manifest 規範](https://github.com/opencontainers/image-spec/blob/main/manifest.md)。
* 瞭解[容器映像檔垃圾收集](/zh-cn/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)。
* 瞭解[從私有倉庫拉取映像檔](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry)。
