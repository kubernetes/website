---
title: 镜像
content_type: concept
weight: 10
hide_summary: true # 在章节索引中单独列出
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
standalone and that make very well defined assumptions about their runtime environment.

You typically create a container image of your application and push it to a registry
before referring to it in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.

This page provides an outline of the container image concept.
-->
容器镜像（Image）所承载的是封装了应用程序及其所有软件依赖的二进制数据。
容器镜像是可执行的软件包，可以单独运行；该软件包对所处的运行时环境具有良定（Well Defined）的假定。

你通常会创建应用的容器镜像并将其推送到某仓库（Registry），然后在
{{< glossary_tooltip text="Pod" term_id="pod" >}} 中引用它。

本页概要介绍容器镜像的概念。

{{< note >}}
<!-- 
If you are looking for the container images for a Kubernetes
release (such as v{{< skew latestVersion >}}, the latest minor release),
visit [Download Kubernetes](https://kubernetes.io/releases/download/).
-->
如果你正在寻找 Kubernetes 某个发行版本（如最新次要版本 v{{< skew latestVersion >}}）
的容器镜像，请访问[下载 Kubernetes](/zh-cn/releases/download/)。
{{< /note >}}

<!-- body -->

<!--
## Image names

Container images are usually given a name such as `pause`, `example/mycontainer`, or `kube-apiserver`.
Images can also include a registry hostname; for example: `fictional.registry.example/imagename`,
and possibly a port number as well; for example: `fictional.registry.example:10443/imagename`.

If you don't specify a registry hostname, Kubernetes assumes that you mean the [Docker public registry](https://hub.docker.com/).

You can change this behaviour by setting default image registry in 
[container runtime](/docs/setup/production-environment/container-runtimes/) configuration.
-->
## 镜像名称    {#image-names}

容器镜像通常会被赋予 `pause`、`example/mycontainer` 或者 `kube-apiserver` 这类的名称。
镜像名称也可以包含所在仓库的主机名。例如：`fictional.registry.example/imagename`。
还可以包含仓库的端口号，例如：`fictional.registry.example:10443/imagename`。

如果你不指定仓库的主机名，Kubernetes 认为你在使用 [Docker 公共仓库](https://hub.docker.com/)。

你可以通过在[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)
配置中设置默认镜像仓库来更改此行为。

<!--
After the image name part you can add a _tag_ or _digest_ (in the same way you would when using with commands
like `docker` or `podman`). Tags let you identify different versions of the same series of images.
Digests are a unique identifier for a specific version of an image. Digests are hashes of the image's content,
and are immutable. Tags can be moved to point to different images, but digests are fixed.
-->

在镜像名称之后，你可以添加一个**标签（Tag）** 或 **摘要（digest）**
（与使用 `docker` 或 `podman` 等命令时的方式相同）。
使用标签能让你辨识同一镜像序列中的不同版本。
摘要是特定版本镜像的唯一标识符，是镜像内容的哈希值，不可变。

<!--
Image tags consist of lowercase and uppercase letters, digits, underscores (`_`),
periods (`.`), and dashes (`-`). It can be up to 128 characters long. And must follow the
next regex pattern: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`
You can read more about and find validation regex in the
[OCI Distribution Specification](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories).
If you don't specify a tag, Kubernetes assumes you mean the tag `latest`.
-->
镜像标签可以包含小写字母、大写字母、数字、下划线（`_`）、句点（`.`）和连字符（`-`）。
它的长度最多为 128 个字符，并且必须遵循正则表达式模式：`[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`。
你可以在 [OCI 分发规范](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories)
中阅读有关并找到验证正则表达式的更多信息。
如果你不指定标签，Kubernetes 认为你想使用标签 `latest`。

<!--
Image digests consists of a hash algorithm (such as `sha256`) and a hash value. For example:
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`
You can find more information about digests format in the 
[OCI Image Specification](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests).
-->
图像摘要由哈希算法（例如 `sha256`）和哈希值组成，例如：
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`。
你可以在 [OCI 镜像规范](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests)
中找到有关摘要格式的更多信息。

<!--
Some image name examples that Kubernetes can use are:
-->
Kubernetes 可以使用的一些镜像名称示例包括：

<!--
- `busybox` - Image name only, no tag or digest. Kubernetes will use Docker public registry and latest tag. (Same as `docker.io/library/busybox:latest`)
- `busybox:1.32.0` - Image name with tag. Kubernetes will use Docker public registry. (Same as `docker.io/library/busybox:1.32.0`)
- `registry.k8s.io/pause:latest` - Image name with a custom registry and latest tag.
- `registry.k8s.io/pause:3.5` - Image name with a custom registry and non-latest tag.
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - Image name with digest.
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - Image name with tag and digest. Only digest will be used for pulling.
-->
- `busybox` - 仅包含镜像名称，没有标签或摘要，Kubernetes 将使用 Docker 公共镜像仓库和 `latest` 标签。
  （例如 `docker.io/library/busybox:latest`）
- `busybox:1.32.0` - 带标签的镜像名称，Kubernetes 将使用 Docker 公共镜像仓库。
  （例如 `docker.io/library/busybox:1.32.0`）
- `registry.k8s.io/pause:latest` - 带有自定义镜像仓库和 `latest` 标签的镜像名称。
- `registry.k8s.io/pause:3.5` - 带有自定义镜像仓库和非 `latest` 标签的镜像名称。
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - 带摘要的镜像名称。
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - 带有标签和摘要的镜像名称，镜像拉取仅参考摘要。

<!--
## Updating images

When you first create a {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod, or other
object that includes a Pod template, then by default the pull policy of all
containers in that pod will be set to `IfNotPresent` if it is not explicitly
specified. This policy causes the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} to skip pulling an
image if it already exists.
-->
## 更新镜像  {#updating-images}

当你最初创建一个 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}、
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}、Pod
或者其他包含 Pod 模板的对象时，如果没有显式设定的话，
Pod 中所有容器的默认镜像拉取策略是 `IfNotPresent`。这一策略会使得
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
在镜像已经存在的情况下直接略过拉取镜像的操作。

<!--
### Image pull policy

The `imagePullPolicy` for a container and the tag of the image affect when the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) attempts to pull (download) the specified image.

Here's a list of the values you can set for `imagePullPolicy` and the effects
these values have:
-->
### 镜像拉取策略   {#image-pull-policy}

容器的 `imagePullPolicy` 和镜像的标签会影响
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 尝试拉取（下载）指定的镜像。

以下列表包含了 `imagePullPolicy` 可以设置的值，以及这些值的效果：

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
: 只有当镜像在本地不存在时才会拉取。

`Always`
: 每当 kubelet 启动一个容器时，kubelet 会查询容器的镜像仓库，
  将名称解析为一个镜像[摘要](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)。
  如果 kubelet 有一个容器镜像，并且对应的摘要已在本地缓存，kubelet 就会使用其缓存的镜像；
  否则，kubelet 就会使用解析后的摘要拉取镜像，并使用该镜像来启动容器。

`Never`
: kubelet 不会尝试获取镜像。如果镜像已经以某种方式存在本地，
  kubelet 会尝试启动容器；否则，会启动失败。
  更多细节见[提前拉取镜像](#pre-pulled-images)。

<!--
The caching semantics of the underlying image provider make even
`imagePullPolicy: Always` efficient, as long as the registry is reliably accessible.
Your container runtime can notice that the image layers already exist on the node
so that they don't need to be downloaded again.
-->
只要能够可靠地访问镜像仓库，底层镜像提供者的缓存语义甚至可以使 `imagePullPolicy: Always` 高效。
你的容器运行时可以注意到节点上已经存在的镜像层，这样就不需要再次下载。

{{< note >}}
<!--
You should avoid using the `:latest` tag when deploying containers in production as
it is harder to track which version of the image is running and more difficult to
roll back properly.

Instead, specify a meaningful tag such as `v1.42.0` and/or a digest.
-->
在生产环境中部署容器时，你应该避免使用 `:latest` 标签，因为这使得正在运行的镜像的版本难以追踪，并且难以正确地回滚。

相反，应指定一个有意义的标签，如 `v1.42.0`，和/或者一个摘要。
{{< /note >}}

<!--
To make sure the Pod always uses the same version of a container image, you can specify
the image's digest;
replace `<image-name>:<tag>` with `<image-name>@<digest>`
(for example, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).
-->
为了确保 Pod 总是使用相同版本的容器镜像，你可以指定镜像的摘要；
将 `<image-name>:<tag>` 替换为 `<image-name>@<digest>`，例如
`image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`。

<!--
When using image tags, if the image registry were to change the code that the tag on that image
represents, you might end up with a mix of Pods running the old and new code. An image digest
uniquely identifies a specific version of the image, so Kubernetes runs the same code every time
it starts a container with that image name and digest specified. Specifying an image by digest
fixes the code that you run so that a change at the registry cannot lead to that mix of versions.

There are third-party [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
that mutate Pods (and pod templates) when they are created, so that the
running workload is defined based on an image digest rather than a tag.
That might be useful if you want to make sure that all your workload is
running the same code no matter what tag changes happen at the registry.
-->
当使用镜像标签时，如果镜像仓库修改了代码所对应的镜像标签，可能会出现新旧代码混杂在 Pod 中运行的情况。
镜像摘要唯一标识了镜像的特定版本，因此 Kubernetes 每次启动具有指定镜像名称和摘要的容器时，都会运行相同的代码。
通过摘要指定镜像可固定你运行的代码，这样镜像仓库的变化就不会导致版本的混杂。

有一些第三方的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
在创建 Pod（和 Pod 模板）时产生变更，这样运行的工作负载就是根据镜像摘要，而不是标签来定义的。
无论镜像仓库上的标签发生什么变化，你都想确保你所有的工作负载都运行相同的代码，那么指定镜像摘要会很有用。

<!--
#### Default image pull policy {#imagepullpolicy-defaulting}

When you (or a controller) submit a new Pod to the API server, your cluster sets the
`imagePullPolicy` field when specific conditions are met:

- if you omit the `imagePullPolicy` field, and you specify the digest for the
  container image, the `imagePullPolicy` is automatically set to `IfNotPresent`.
-->
#### 默认镜像拉取策略    {#imagepullpolicy-defaulting}

当你（或控制器）向 API 服务器提交一个新的 Pod 时，你的集群会在满足特定条件时设置 `imagePullPolicy` 字段：

- 如果你省略了 `imagePullPolicy` 字段，并且你为容器镜像指定了摘要，
  那么 `imagePullPolicy` 会自动设置为 `IfNotPresent`。

<!--
- if you omit the `imagePullPolicy` field, and the tag for the container image is
  `:latest`, `imagePullPolicy` is automatically set to `Always`;
- if you omit the `imagePullPolicy` field, and you don't specify the tag for the
  container image, `imagePullPolicy` is automatically set to `Always`;
- if you omit the `imagePullPolicy` field, and you specify the tag for the
  container image that isn't `:latest`, the `imagePullPolicy` is automatically set to
  `IfNotPresent`.
-->
- 如果你省略了 `imagePullPolicy` 字段，并且容器镜像的标签是 `:latest`，
  `imagePullPolicy` 会自动设置为 `Always`。
- 如果你省略了 `imagePullPolicy` 字段，并且没有指定容器镜像的标签，
  `imagePullPolicy` 会自动设置为 `Always`。
- 如果你省略了 `imagePullPolicy` 字段，并且为容器镜像指定了非 `:latest` 的标签，
  `imagePullPolicy` 就会自动设置为 `IfNotPresent`。

{{< note >}}
<!--
The value of `imagePullPolicy` of the container is always set when the object is
first _created_, and is not updated if the image's tag or digest later changes.

For example, if you create a Deployment with an image whose tag is _not_
`:latest`, and later update that Deployment's image to a `:latest` tag, the
`imagePullPolicy` field will _not_ change to `Always`. You must manually change
the pull policy of any object after its initial creation.
-->
容器的 `imagePullPolicy` 的值总是在对象初次**创建**时设置的，
如果后来镜像的标签或摘要发生变化，则不会更新。

例如，如果你用一个**非** `:latest` 的镜像标签创建一个 Deployment，
并在随后更新该 Deployment 的镜像标签为 `:latest`，则 `imagePullPolicy` 字段**不会**变成 `Always`。
你必须手动更改已经创建的资源的拉取策略。
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
#### 必要的镜像拉取   {#required-image-pull}

如果你想总是强制执行拉取，你可以使用下述的一种方式：

- 设置容器的 `imagePullPolicy` 为 `Always`。
- 省略 `imagePullPolicy`，并使用 `:latest` 作为镜像标签；
  当你提交 Pod 时，Kubernetes 会将策略设置为 `Always`。
- 省略 `imagePullPolicy` 和镜像的标签；
  当你提交 Pod 时，Kubernetes 会将策略设置为 `Always`。
- 启用准入控制器 [AlwaysPullImages](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。

<!--
### ImagePullBackOff

When a kubelet starts creating containers for a Pod using a container runtime,
it might be possible the container is in [Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)
state because of `ImagePullBackOff`.
-->
### ImagePullBackOff

当 kubelet 使用容器运行时创建 Pod 时，容器可能因为 `ImagePullBackOff` 导致状态为
[Waiting](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)。

<!--
The status `ImagePullBackOff` means that a container could not start because Kubernetes
could not pull a container image (for reasons such as invalid image name, or pulling
from a private registry without `imagePullSecret`). The `BackOff` part indicates
that Kubernetes will keep trying to pull the image, with an increasing back-off delay.

Kubernetes raises the delay between each attempt until it reaches a compiled-in limit,
which is 300 seconds (5 minutes).
-->
`ImagePullBackOff` 状态意味着容器无法启动，
因为 Kubernetes 无法拉取容器镜像（原因包括无效的镜像名称，或从私有仓库拉取而没有 `imagePullSecret`）。
`BackOff` 部分表示 Kubernetes 将继续尝试拉取镜像，并增加回退延迟。

Kubernetes 会增加每次尝试之间的延迟，直到达到编译限制，即 300 秒（5 分钟）。

<!--
### Image pull per runtime class
-->
### 基于运行时类的镜像拉取  {#image-pull-per-runtime-class}

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}

<!--
Kubernetes includes alpha support for performing image pulls based on the RuntimeClass of a Pod.
-->
Kubernetes 包含了根据 Pod 的 RuntimeClass 来执行镜像拉取的 Alpha 支持。

<!--
If you enable the `RuntimeClassInImageCriApi` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the kubelet references container images by a tuple of (image name, runtime handler) rather than just the
image name or digest. Your {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
may adapt its behavior based on the selected runtime handler.
Pulling images based on runtime class will be helpful for VM based containers like windows hyperV containers.
-->
如果你启用了 `RuntimeClassInImageCriApi` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
kubelet 会通过一个元组（镜像名称，运行时处理程序）而不仅仅是镜像名称或镜像摘要来引用容器镜像。
你的{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}
可能会根据选定的运行时处理程序调整其行为。
基于运行时类来拉取镜像对于基于 VM 的容器（如 Windows Hyper-V 容器）会有帮助。

<!--
## Serial and parallel image pulls
-->
## 串行和并行镜像拉取  {#serial-and-parallel-image-pulls}

<!--
By default, kubelet pulls images serially. In other words, kubelet sends only
one image pull request to the image service at a time. Other image pull requests
have to wait until the one being processed is complete.
-->
默认情况下，kubelet 以串行方式拉取镜像。
也就是说，kubelet 一次只向镜像服务发送一个镜像拉取请求。
其他镜像拉取请求必须等待，直到正在处理的那个请求完成。

<!--
Nodes make image pull decisions in isolation. Even when you use serialized image
pulls, two different nodes can pull the same image in parallel.
-->
节点独立地做出镜像拉取的决策。即使你使用串行的镜像拉取，两个不同的节点也可以并行拉取相同的镜像。

<!--
If you would like to enable parallel image pulls, you can set the field
`serializeImagePulls` to false in the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
With `serializeImagePulls` set to false, image pull requests will be sent to the image service immediately,
and multiple images will be pulled at the same time.
-->
如果你想启用并行镜像拉取，可以在 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中将字段 `serializeImagePulls` 设置为 false。

当`serializeImagePulls` 设置为 false 时，kubelet 会立即向镜像服务发送镜像拉取请求，多个镜像将同时被拉动。

<!--
When enabling parallel image pulls, please make sure the image service of your
container runtime can handle parallel image pulls.
-->
启用并行镜像拉取时，请确保你的容器运行时的镜像服务可以处理并行镜像拉取。

<!--
The kubelet never pulls multiple images in parallel on behalf of one Pod. For example,
if you have a Pod that has an init container and an application container, the image
pulls for the two containers will not be parallelized. However, if you have two
Pods that use different images, the kubelet pulls the images in parallel on
behalf of the two different Pods, when parallel image pulls is enabled.
-->
kubelet 从不代表一个 Pod 并行地拉取多个镜像。

例如，如果你有一个 Pod，它有一个初始容器和一个应用容器，那么这两个容器的镜像拉取将不会并行。
但是，如果你有两个使用不同镜像的 Pod，当启用并行镜像拉取时，kubelet 会代表两个不同的 Pod 并行拉取镜像。

<!--
### Maximum parallel image pulls
-->
### 最大并行镜像拉取数量  {#maximum-parallel-image-pulls}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

<!--
When `serializeImagePulls` is set to false, the kubelet defaults to no limit on the
maximum number of images being pulled at the same time. If you would like to
limit the number of parallel image pulls, you can set the field `maxParallelImagePulls`
in kubelet configuration. With `maxParallelImagePulls` set to _n_, only _n_ images
can be pulled at the same time, and any image pull beyond _n_ will have to wait
until at least one ongoing image pull is complete.
-->
当 `serializeImagePulls` 被设置为 false 时，kubelet 默认对同时拉取的最大镜像数量没有限制。
如果你想限制并行镜像拉取的数量，可以在 kubelet 配置中设置字段 `maxParallelImagePulls`。
当 `maxParallelImagePulls` 设置为 **n** 时，只能同时拉取 **n** 个镜像，
超过 **n** 的任何镜像都必须等到至少一个正在进行拉取的镜像拉取完成后，才能拉取。

<!--
Limiting the number parallel image pulls would prevent image pulling from consuming
too much network bandwidth or disk I/O, when parallel image pulling is enabled.
-->
当启用并行镜像拉取时，限制并行镜像拉取的数量可以防止镜像拉取消耗过多的网络带宽或磁盘 I/O。

<!--
You can set `maxParallelImagePulls` to a positive number that is greater than or
equal to 1. If you set `maxParallelImagePulls` to be greater than or equal to 2, you
must set the `serializeImagePulls` to false. The kubelet will fail to start with invalid
`maxParallelImagePulls` settings.
-->
你可以将 `maxParallelImagePulls` 设置为大于或等于 1 的正数。
如果将 `maxParallelImagePulls` 设置为大于等于 2，则必须将 `serializeImagePulls` 设置为 false。
kubelet 在无效的 `maxParallelImagePulls` 设置下会启动失败。

<!--
## Multi-architecture images with image indexes

As well as providing binary images, a container registry can also serve a
[container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md).
An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
for architecture-specific versions of a container. The idea is that you can have a name for an image
(for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to
fetch the right binary image for the machine architecture they are using.

Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward
compatibility, please generate the older images with suffixes. The idea is to generate say `pause`
image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards
compatible for older configurations or YAML files which may have hard coded the images with
suffixes.
-->
## 带镜像索引的多架构镜像  {#multi-architecture-images-with-image-indexes}

除了提供二进制的镜像之外，
容器仓库也可以提供[容器镜像索引](https://github.com/opencontainers/image-spec/blob/master/image-index.md)。
镜像索引可以指向镜像的多个[镜像清单](https://github.com/opencontainers/image-spec/blob/master/manifest.md)，
提供特定于体系结构版本的容器。
这背后的理念是让你可以为镜像命名（例如：`pause`、`example/mycontainer`、`kube-apiserver`）
的同时，允许不同的系统基于它们所使用的机器体系结构取回正确的二进制镜像。

Kubernetes 自身通常在命名容器镜像时添加后缀 `-$(ARCH)`。
为了向前兼容，请在生成较老的镜像时也提供后缀。
这里的理念是为某镜像（如 `pause`）生成针对所有平台都适用的清单时，
生成 `pause-amd64` 这类镜像，以便较老的配置文件或者将镜像后缀硬编码到其中的
YAML 文件也能兼容。

<!--
## Using a private registry

Private registries may require keys to read images from them.
Credentials can be provided in several ways:
-->
## 使用私有仓库   {#using-a-private-registry}

从私有仓库读取镜像时可能需要密钥。
凭据可以用以下方式提供:

<!--
- Configuring Nodes to Authenticate to a Private Registry
  - all pods can read any configured private registries
  - requires node configuration by cluster administrator
- Kubelet Credential Provider to dynamically fetch credentials for private registries
  - kubelet can be configured to use credential provider exec plugin
    for the respective private registry.
- Pre-pulled Images
  - all pods can use any images cached on a node
  - requires root access to all nodes to set up
- Specifying ImagePullSecrets on a Pod
  - only pods which provide own keys can access the private registry
- Vendor-specific or local extensions
  - if you're using a custom node configuration, you (or your cloud
    provider) can implement your mechanism for authenticating the node
    to the container registry.
-->
- 配置节点向私有仓库进行身份验证
  - 所有 Pod 均可读取任何已配置的私有仓库
  - 需要集群管理员配置节点
- kubelet 凭据提供程序，动态获取私有仓库的凭据
  - kubelet 可以被配置为使用凭据提供程序 exec 插件来访问对应的私有镜像库
- 预拉镜像
  - 所有 Pod 都可以使用节点上缓存的所有镜像
  - 需要所有节点的 root 访问权限才能进行设置
- 在 Pod 中设置 ImagePullSecrets
  - 只有提供自己密钥的 Pod 才能访问私有仓库
- 特定于厂商的扩展或者本地扩展
  - 如果你在使用定制的节点配置，你（或者云平台提供商）可以实现让节点向容器仓库认证的机制

<!--
These options are explained in more detail below.
-->
下面将详细描述每一项。

<!--
### Configuring nodes to authenticate to a private registry

Specific instructions for setting credentials depends on the container runtime and registry you
chose to use. You should refer to your solution's documentation for the most accurate information.
-->
### 配置 Node 对私有仓库认证  {#configuring-nodes-to-authenticate-to-a-private-registry}

设置凭据的具体说明取决于你选择使用的容器运行时和仓库。
你应该参考解决方案的文档来获取最准确的信息。

<!--
For an example of configuring a private container image registry, see the
[Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)
task. That example uses a private registry in Docker Hub.
-->
有关配置私有容器镜像仓库的示例，
请参阅任务[从私有镜像库中拉取镜像](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry)。
该示例使用 Docker Hub 中的私有镜像仓库。

<!--
### Kubelet credential provider for authenticated image pulls {#kubelet-credential-provider}
-->
### 用于认证镜像拉取的 kubelet 凭据提供程序  {#kubelet-credential-provider}

{{< note >}}
<!--
This approach is especially suitable when kubelet needs to fetch registry credentials dynamically.
Most commonly used for registries provided by cloud providers where auth tokens are short-lived.
-->
此方法尤其适合 kubelet 需要动态获取仓库凭据时。
最常用于由云提供商提供的仓库，其中身份认证令牌的生命期是短暂的。
{{< /note >}}

<!--
You can configure the kubelet to invoke a plugin binary to dynamically fetch registry credentials for a container image.
This is the most robust and versatile way to fetch credentials for private registries, but also requires kubelet-level configuration to enable.

See [Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/) for more details.
-->
你可以配置 kubelet，以调用插件可执行文件的方式来动态获取容器镜像的仓库凭据。
这是为私有仓库获取凭据最稳健和最通用的方法，但也需要 kubelet 级别的配置才能启用。

有关更多细节请参见[配置 kubelet 镜像凭据提供程序](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)。

<!--
### Interpretation of config.json {#config-json}
-->
### config.json 说明 {#config-json}

<!--
The interpretation of `config.json` varies between the original Docker
implementation and the Kubernetes interpretation. In Docker, the `auths` keys
can only specify root URLs, whereas Kubernetes allows glob URLs as well as
prefix-matched paths. The only limitation is that glob patterns (`*`) have to
include the dot (`.`) for each subdomain. The amount of matched subdomains has
to be equal to the amount of glob patterns (`*.`), for example:
-->
对于 `config.json` 的解释在原始 Docker 实现和 Kubernetes 的解释之间有所不同。
在 Docker 中，`auths` 键只能指定根 URL，而 Kubernetes 允许 glob URL 以及前缀匹配的路径。
唯一的限制是 glob 模式（`*`）必须为每个子域名包括点（`.`）。
匹配的子域名数量必须等于 glob 模式（`*.`）的数量，例如：

<!--
- `*.kubernetes.io` will *not* match `kubernetes.io`, but `abc.kubernetes.io`
- `*.*.kubernetes.io` will *not* match `abc.kubernetes.io`, but `abc.def.kubernetes.io`
- `prefix.*.io` will match `prefix.kubernetes.io`
- `*-good.kubernetes.io` will match `prefix-good.kubernetes.io`
-->
- `*.kubernetes.io` **不**会匹配 `kubernetes.io`，但会匹配 `abc.kubernetes.io`
- `*.*.kubernetes.io` **不**会匹配 `abc.kubernetes.io`，但会匹配 `abc.def.kubernetes.io`
- `prefix.*.io` 将匹配 `prefix.kubernetes.io`
- `*-good.kubernetes.io` 将匹配 `prefix-good.kubernetes.io`

<!--
This means that a `config.json` like this is valid:
-->
这意味着，像这样的 `config.json` 是有效的：

```json
{
    "auths": {
        "my-registry.io/images": { "auth": "…" },
        "*.my-registry.io/images": { "auth": "…" }
    }
}
```

<!--
Image pull operations would now pass the credentials to the CRI container
runtime for every valid pattern. For example the following container image names
would match successfully:
-->
现在镜像拉取操作会将每种有效模式的凭据都传递给 CRI 容器运行时。例如下面的容器镜像名称会匹配成功：

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`

<!--
But not:
-->
但这些不会匹配成功：

- `a.sub.my-registry.io/images/my-image`
- `a.b.sub.my-registry.io/images/my-image`

<!--
The kubelet performs image pulls sequentially for every found credential. This
means, that multiple entries in `config.json` for different paths are possible, too:
-->
kubelet 为每个找到的凭据的镜像按顺序拉取。这意味着对于不同的路径在 `config.json` 中也可能有多项：

```json
{
    "auths": {
        "my-registry.io/images": {
            "auth": "…"
        },
        "my-registry.io/images/subpath": {
            "auth": "…"
        }
    }
}
```

<!--
If now a container specifies an image `my-registry.io/images/subpath/my-image`
to be pulled, then the kubelet will try to download them from both
authentication sources if one of them fails.
-->
如果一个容器指定了要拉取的镜像 `my-registry.io/images/subpath/my-image`，
并且其中一个失败，kubelet 将尝试从另一个身份验证源下载镜像。

<!--
### Pre-pulled images
-->
### 提前拉取镜像   {#pre-pulled-images}

{{< note >}}
<!--
This approach is suitable if you can control node configuration.  It
will not work reliably if your cloud provider manages nodes and replaces
them automatically.
-->
该方法适用于你能够控制节点配置的场合。
如果你的云供应商负责管理节点并自动置换节点，这一方案无法可靠地工作。
{{< /note >}}

<!--
By default, the kubelet tries to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).
-->
默认情况下，`kubelet` 会尝试从指定的仓库拉取每个镜像。
但是，如果容器属性 `imagePullPolicy` 设置为 `IfNotPresent` 或者 `Never`，
则会优先使用（对应 `IfNotPresent`）或者一定使用（对应 `Never`）本地镜像。

<!--
If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a
private registry.

All pods will have read access to any pre-pulled images.
-->
如果你希望使用提前拉取镜像的方法代替仓库认证，就必须保证集群中所有节点提前拉取的镜像是相同的。

这一方案可以用来提前载入指定的镜像以提高速度，或者作为向私有仓库执行身份认证的一种替代方案。

所有的 Pod 都可以使用节点上提前拉取的镜像。

<!--
### Specifying imagePullSecrets on a Pod
-->
### 在 Pod 上指定 ImagePullSecrets   {#specifying-imagepullsecrets-on-a-pod}

{{< note >}}
<!--
This is the recommended approach to run containers based on images
in private registries.
-->
运行使用私有仓库中镜像的容器时，建议使用这种方法。
{{< /note >}}

<!--
Kubernetes supports specifying container image registry keys on a Pod.
`imagePullSecrets` must all be in the same namespace as the Pod. The referenced
Secrets must be of type `kubernetes.io/dockercfg` or `kubernetes.io/dockerconfigjson`.
-->
Kubernetes 支持在 Pod 中设置容器镜像仓库的密钥。
`imagePullSecrets` 必须全部与 Pod 位于同一个名字空间中。
引用的 Secret 必须是 `kubernetes.io/dockercfg` 或 `kubernetes.io/dockerconfigjson` 类型。

<!--
#### Creating a Secret with a Docker config

You need to know the username, registry password and client email address for authenticating
to the registry, as well as its hostname.
Run the following command, substituting the appropriate uppercase values:
-->
#### 使用 Docker Config 创建 Secret   {#creating-a-secret-with-docker-config}

你需要知道用于向仓库进行身份验证的用户名、密码和客户端电子邮件地址，以及它的主机名。
运行以下命令，注意替换适当的大写值：

```shell
kubectl create secret docker-registry <name> \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-password=DOCKER_PASSWORD \
  --docker-email=DOCKER_EMAIL
```

<!--
If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
explains how to set this up.
-->
如果你已经有 Docker 凭据文件，则可以将凭据文件导入为 Kubernetes
{{< glossary_tooltip text="Secret" term_id="secret" >}}，
而不是执行上面的命令。
[基于已有的 Docker 凭据创建 Secret](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
解释了如何完成这一操作。

<!--
This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.
-->
如果你在使用多个私有容器仓库，这种技术将特别有用。
原因是 `kubectl create secret docker-registry` 创建的是仅适用于某个私有仓库的 Secret。

{{< note >}}
<!--
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
-->
Pod 只能引用位于自身所在名字空间中的 Secret，因此需要针对每个名字空间重复执行上述过程。
{{< /note >}}

<!--
#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a Pod definition. Each item in the `imagePullSecrets` array can only
reference a Secret in the same namespace.

For example:
-->
#### 在 Pod 中引用 ImagePullSecrets {#referring-to-an-imagepullsecrets-on-a-pod}

现在，在创建 Pod 时，可以在 Pod 定义中增加 `imagePullSecrets` 部分来引用该 Secret。
`imagePullSecrets` 数组中的每一项只能引用同一名字空间中的 Secret。

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
This needs to be done for each pod that is using a private registry.

However, setting of this field can be automated by setting the imagePullSecrets
in a [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/) resource.

Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.
-->
你需要对使用私有仓库的每个 Pod 执行以上操作。不过，
设置该字段的过程也可以通过为[服务账号](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)资源设置
`imagePullSecrets` 来自动完成。有关详细指令，
可参见[将 ImagePullSecrets 添加到服务账号](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)。

你也可以将此方法与节点级别的 `.docker/config.json` 配置结合使用。
来自不同来源的凭据会被合并。

<!--
## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.
-->
## 使用案例  {#use-cases}

配置私有仓库有多种方案，以下是一些常用场景和建议的解决方案。

<!--
1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images from a public registry
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves
       availability and reduces the time to pull images.
-->
1. 集群运行非专有镜像（例如，开源镜像）。镜像不需要隐藏。
   - 使用来自公共仓库的公共镜像
     - 无需配置
     - 某些云厂商会自动为公开镜像提供高速缓存，以便提升可用性并缩短拉取镜像所需时间

<!--
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private registry
     - Manual configuration may be required on the nodes that need to access to private registry
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Use a hosted container image registry service that controls image access
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
-->
2. 集群运行一些专有镜像，这些镜像需要对公司外部隐藏，对所有集群用户可见
   - 使用托管的私有仓库
     - 在需要访问私有仓库的节点上可能需要手动配置
   - 或者，在防火墙内运行一个组织内部的私有仓库，并开放读取权限
     - 不需要配置 Kubernetes
   - 使用控制镜像访问的托管容器镜像仓库服务
     - 与手动配置节点相比，这种方案能更好地处理集群自动扩缩容
   - 或者，在不方便更改节点配置的集群中，使用 `imagePullSecrets`

<!--
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
-->
3. 集群使用专有镜像，且有些镜像需要更严格的访问控制
   - 确保 [AlwaysPullImages 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)被启用。
     否则，所有 Pod 都可以使用所有镜像。
   - 确保将敏感数据存储在 Secret 资源中，而不是将其打包在镜像里。

<!--
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each
     tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.
-->
4. 集群是多租户的并且每个租户需要自己的私有仓库
   - 确保 [AlwaysPullImages 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。
     否则，所有租户的所有的 Pod 都可以使用所有镜像。
   - 为私有仓库启用鉴权。
   - 为每个租户生成访问仓库的凭据，放置在 Secret 中，并将 Secret 发布到各租户的名字空间下。
   - 租户将 Secret 添加到每个名字空间中的 imagePullSecrets。

<!--
If you need access to multiple registries, you can create one secret for each registry.
-->
如果你需要访问多个仓库，可以为每个仓库创建一个 Secret。

<!--
## Legacy built-in kubelet credential provider

In older versions of Kubernetes, the kubelet had a direct integration with cloud provider credentials.
This gave it the ability to dynamically fetch credentials for image registries.
-->
## 旧版的内置 kubelet 凭据提供程序    {#legacy-built-in-kubelet-credentials-provider}

在旧版本的 Kubernetes 中，kubelet 与云提供商凭据直接集成。
这使它能够动态获取镜像仓库的凭据。

<!--
There were three built-in implementations of the kubelet credential provider integration:
ACR (Azure Container Registry), ECR (Elastic Container Registry), and GCR (Google Container Registry).
-->
kubelet 凭据提供程序集成存在三个内置实现：
ACR（Azure 容器仓库）、ECR（Elastic 容器仓库）和 GCR（Google 容器仓库）。

<!--
For more information on the legacy mechanism, read the documentation for the version of Kubernetes that you
are using. Kubernetes v1.26 through to v{{< skew latestVersion >}} do not include the legacy mechanism, so
you would need to either:
- configure a kubelet image credential provider on each node
- specify image pull credentials using `imagePullSecrets` and at least one Secret
-->
有关该旧版机制的更多信息，请阅读你正在使用的 Kubernetes 版本的文档。
从 Kubernetes v1.26 到 v{{< skew latestVersion >}} 不再包含该旧版机制，因此你需要：

- 在每个节点上配置一个 kubelet 镜像凭据提供程序
- 使用 `imagePullSecrets` 和至少一个 Secret 指定镜像拉取凭据

## {{% heading "whatsnext" %}}

<!--
* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md).
* Learn about [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Learn more about [pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).
-->
* 阅读 [OCI Image Manifest 规范](https://github.com/opencontainers/image-spec/blob/master/manifest.md)。
* 了解[容器镜像垃圾收集](/zh-cn/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)。
* 了解[从私有仓库拉取镜像](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry)。
