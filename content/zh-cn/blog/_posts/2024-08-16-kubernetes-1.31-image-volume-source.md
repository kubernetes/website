---
layout: blog
title: "Kubernetes 1.31：基于 OCI 工件的只读卷 (Alpha)"
date: 2024-08-16
slug: kubernetes-1-31-image-volume-source
author: Sascha Grunert
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.31: Read Only Volumes Based On OCI Artifacts (alpha)"
date: 2024-08-16
slug: kubernetes-1-31-image-volume-source
author: Sascha Grunert
-->

<!--
The Kubernetes community is moving towards fulfilling more Artificial
Intelligence (AI) and Machine Learning (ML) use cases in the future. While the
project has been designed to fulfill microservice architectures in the past,
it’s now time to listen to the end users and introduce features which have a
stronger focus on AI/ML.
-->
Kubernetes 社区正朝着在未来满足更多人工智能（AI）和机器学习（ML）使用场景的方向发展。
虽然此项目在过去设计为满足微服务架构，但现在是时候听听最终用户的声音并引入更侧重于 AI/ML 的特性了。

<!--
One of these requirements is to support [Open Container Initiative (OCI)](https://opencontainers.org)
compatible images and artifacts (referred as OCI objects) directly as a native
volume source. This allows users to focus on OCI standards as well as enables
them to store and distribute any content using OCI registries. A feature like
this gives the Kubernetes project a chance to grow into use cases which go
beyond running particular images.
-->
其中一项需求是直接支持与[开放容器倡议（OCI）](https://opencontainers.org)
兼容的镜像和工件（称为 OCI 对象）作为原生卷源。
这使得用户能够专注于 OCI 标准，且能够使用 OCI 镜像仓库存储和分发任何内容。
与此类似的特性让 Kubernetes 项目有机会扩大其使用场景，不再局限于运行特定镜像。

<!--
Given that, the Kubernetes community is proud to present a new alpha feature
introduced in v1.31: The Image Volume Source
([KEP-4639](https://kep.k8s.io/4639)). This feature allows users to specify an
image reference as volume in a pod while reusing it as volume mount within
containers:
-->
在这一背景下，Kubernetes 社区自豪地展示在 v1.31 中引入的一项新的 Alpha 特性：
镜像卷源（[KEP-4639](https://kep.k8s.io/4639)）。
此特性允许用户在 Pod 中指定一个镜像引用作为卷，并在容器内将其作为卷挂载进行复用：

```yaml
…
kind: Pod
spec:
  containers:
    - …
      volumeMounts:
        - name: my-volume
          mountPath: /path/to/directory
  volumes:
    - name: my-volume
      image:
        reference: my-image:tag
```

<!--
The above example would result in mounting `my-image:tag` to
`/path/to/directory` in the pod’s container.
-->
上述示例的结果是将 `my-image:tag` 挂载到 Pod 的容器中的 `/path/to/directory`。

<!--
## Use cases

The goal of this enhancement is to stick as close as possible to the existing
[container image](/docs/concepts/containers/images/) implementation within the
kubelet, while introducing a new API surface to allow more extended use cases.
-->
## 使用场景

此增强特性的目标是在尽可能贴近 kubelet 中现有的[容器镜像](/zh-cn/docs/concepts/containers/images/)实现的同时，
引入新的 API 接口以支持更广泛的使用场景。

<!--
For example, users could share a configuration file among multiple containers in
a pod without including the file in the main image, so that they can minimize
security risks and the overall image size. They can also package and distribute
binary artifacts using OCI images and mount them directly into Kubernetes pods,
so that they can streamline their CI/CD pipeline as an example.
-->
例如，用户可以在 Pod 中的多个容器之间共享一个配置文件，而无需将此文件包含在主镜像中，
这样用户就可以将安全风险最小化和并缩减整体镜像大小。用户还可以使用 OCI 镜像打包和分发二进制工件，
并直接将它们挂载到 Kubernetes Pod 中，例如用户这样就可以简化其 CI/CD 流水线。

<!--
Data scientists, MLOps engineers, or AI developers, can mount large language
model weights or machine learning model weights in a pod alongside a
model-server, so that they can efficiently serve them without including them in
the model-server container image. They can package these in an OCI object to
take advantage of OCI distribution and ensure efficient model deployment. This
allows them to separate the model specifications/content from the executables
that process them.
-->
数据科学家、MLOps 工程师或 AI 开发者可以与模型服务器一起在 Pod 中挂载大语言模型权重或机器学习模型权重数据，
从而可以更高效地提供服务，且无需将这些模型包含在模型服务器容器镜像中。
他们可以将这些模型打包在 OCI 对象中，以利用 OCI 分发机制，还可以确保高效的模型部署。
这一新特性允许他们将模型规约/内容与处理它们的可执行文件分开。

<!--
Another use case is that security engineers can use a public image for a malware
scanner and mount in a volume of private (commercial) malware signatures, so
that they can load those signatures without baking their own combined image
(which might not be allowed by the copyright on the public image). Those files
work regardless of the OS or version of the scanner software.
-->
另一个使用场景是安全工程师可以使用公共镜像作为恶意软件扫描器，并将私有的（商业的）恶意软件签名挂载到卷中，
这样他们就可以加载这些签名且无需制作自己的组合镜像（公共镜像的版权要求可能不允许这样做）。
签名数据文件与操作系统或扫描器软件版本无关，总是可以被使用。

<!--
But in the long term it will be up to **you** as an end user of this project to
outline further important use cases for the new feature.
[SIG Node](https://github.com/kubernetes/community/blob/54a67f5/sig-node/README.md)
is happy to retrieve any feedback or suggestions for further enhancements to
allow more advanced usage scenarios. Feel free to provide feedback by either
using the [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
channel or the [SIG Node mailinglist](https://groups.google.com/g/kubernetes-sig-node).
-->
但就长期而言，作为此项目的最终用户的你要负责为这一新特性的其他重要使用场景给出规划。
[SIG Node](https://github.com/kubernetes/community/blob/54a67f5/sig-node/README.md)
乐于接收与进一步增强此特性以适应更高级的使用场景有关的所有反馈或建议。你可以通过使用
[Kubernetes Slack（#sig-node）](https://kubernetes.slack.com/messages/sig-node)
频道或 [SIG Node 邮件列表](https://groups.google.com/g/kubernetes-sig-node)提供反馈。

<!--
## Detailed example {#example}

The Kubernetes alpha feature gate [`ImageVolume`](/docs/reference/command-line-tools-reference/feature-gates)
needs to be enabled on the [API Server](/docs/reference/command-line-tools-reference/kube-apiserver)
as well as the [kubelet](/docs/reference/command-line-tools-reference/kubelet)
to make it functional. If that’s the case and the [container runtime](/docs/setup/production-environment/container-runtimes)
has support for the feature (like CRI-O ≥ v1.31), then an example `pod.yaml`
like this can be created:
-->
## 详细示例 {#example}

你需要在 [API 服务器](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver)以及
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet) 上启用
Kubernetes Alpha 特性门控 [`ImageVolume`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)，
才能使其正常工作。如果启用了此特性，
并且[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes)支持此特性
（如 CRI-O ≥ v1.31），那就可以创建这样一个示例 `pod.yaml`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
    - name: test
      image: registry.k8s.io/e2e-test-images/echoserver:2.3
      volumeMounts:
        - name: volume
          mountPath: /volume
  volumes:
    - name: volume
      image:
        reference: quay.io/crio/artifact:v1
        pullPolicy: IfNotPresent
```

<!--
The pod declares a new volume using the `image.reference` of
`quay.io/crio/artifact:v1`, which refers to an OCI object containing two files.
The `pullPolicy` behaves in the same way as for container images and allows the
following values:
-->
此 Pod 使用值为 `quay.io/crio/artifact:v1` 的 `image.reference` 声明一个新卷，
该字段值引用了一个包含两个文件的 OCI 对象。`pullPolicy` 的行为与容器镜像相同，允许以下值：

<!--
- `Always`: the kubelet always attempts to pull the reference and the container
  creation will fail if the pull fails.
- `Never`: the kubelet never pulls the reference and only uses a local image or
  artifact. The container creation will fail if the reference isn’t present.
- `IfNotPresent`: the kubelet pulls if the reference isn’t already present on
  disk. The container creation will fail if the reference isn’t present and the
  pull fails.
-->
- `Always`：kubelet 总是尝试拉取引用，如果拉取失败，容器创建将失败。
- `Never`：kubelet 从不拉取引用，只使用本地镜像或工件。如果引用不存在，容器创建将失败。
- `IfNotPresent`：kubelet 会在引用已不在磁盘上时进行拉取。如果引用不存在且拉取失败，容器创建将失败。

<!--
The `volumeMounts` field is indicating that the container with the name `test`
should mount the volume under the path `/volume`.

If you now create the pod:
-->
`volumeMounts` 字段表示名为 `test` 的容器应将卷挂载到 `/volume` 路径下。

如果你现在创建 Pod：

```shell
kubectl apply -f pod.yaml
```

<!--
And exec into it:
-->
然后通过 exec 进入此 Pod：

```shell
kubectl exec -it pod -- sh
```

<!--
Then you’re able to investigate what has been mounted:
-->
那么你就能够查看已挂载的内容：

```console
/ # ls /volume
dir   file
/ # cat /volume/file
2
/ # ls /volume/dir
file
/ # cat /volume/dir/file
1
```

<!--
**You managed to consume an OCI artifact using Kubernetes!**

The container runtime pulls the image (or artifact), mounts it to the
container and makes it finally available for direct usage. There are a bunch of
details in the implementation, which closely align to the existing image pull
behavior of the kubelet. For example:
-->
**你已经成功地使用 Kubernetes 访问了 OCI 工件！**

容器运行时拉取镜像（或工件），将其挂载到容器中，并最终使其可被直接使用。
在实现中有很多细节，这些细节与 kubelet 现有的镜像拉取行为密切相关。例如：

<!--
- If a `:latest` tag as `reference` is provided, then the `pullPolicy` will
  default to `Always`, while in any other case it will default to `IfNotPresent`
  if unset.
- The volume gets re-resolved if the pod gets deleted and recreated, which means
  that new remote content will become available on pod recreation. A failure to
  resolve or pull the image during pod startup will block containers from
  starting and may add significant latency. Failures will be retried using
  normal volume backoff and will be reported on the pod reason and message.
-->
- 如果提供给 `reference` 的值包含 `:latest` 标签，`pullPolicy` 将默认为 `Always`，
  而在任何其他情况下，`pullPolicy` 在未被设置的情况下都默认为 `IfNotPresent`。
- 如果 Pod 被删除并重新创建，卷将被重新解析，这意味着在 Pod 重新创建时将可以访问新的远端内容。
  如果在 Pod 启动期间未能解析或未能拉取镜像，将会容器启动会被阻止，并可能显著增加延迟。
  如果拉取镜像失败，将使用正常的卷回退机制进行重试，并将在 Pod 的原因和消息中报告出错原因。
<!--
- Pull secrets will be assembled in the same way as for the container image by
  looking up node credentials, service account image pull secrets, and pod spec
  image pull secrets.
- The OCI object gets mounted in a single directory by merging the manifest
  layers in the same way as for container images.
- The volume is mounted as read-only (`ro`) and non-executable files
  (`noexec`).
-->
- 拉取 Secret 的组装方式与容器镜像所用的方式相同，也是通过查找节点凭据、服务账户镜像拉取 Secret
  和 Pod 规约中的镜像拉取 Secret 来完成。
- OCI 对象被挂载到单个目录中，清单层的合并方式与容器镜像相同。
- 卷以只读（`ro`）和非可执行文件（`noexec`）的方式被挂载。
<!--
- Sub-path mounts for containers are not supported
  (`spec.containers[*].volumeMounts.subpath`).
- The field `spec.securityContext.fsGroupChangePolicy` has no effect on this
  volume type.
- The feature will also work with the [`AlwaysPullImages` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  if enabled.
-->
- 容器的子路径挂载不被支持（`spec.containers[*].volumeMounts.subpath`）。
- 字段 `spec.securityContext.fsGroupChangePolicy` 对这种卷类型没有影响。
- 如果已启用，此特性也将与
  [`AlwaysPullImages` 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)一起工作。

<!--
Thank you for reading through the end of this blog post! SIG Node is proud and
happy to deliver this feature as part of Kubernetes v1.31.

As writer of this blog post, I would like to emphasize my special thanks to
**all** involved individuals out there! You all rock, let’s keep on hacking!
-->
感谢你阅读到这篇博客文章的结尾！对于将此特性作为 Kubernetes v1.31
的一部分交付，SIG Node 感到很高兴也很自豪。

作为这篇博客的作者，我想特别感谢所有参与者！你们都很棒，让我们继续开发之旅！

<!--
## Further reading

- [Use an Image Volume With a Pod](/docs/tasks/configure-pod-container/image-volumes)
- [`image` volume overview](/docs/concepts/storage/volumes/#image)
-->
## 进一步阅读

- [在 Pod 中使用镜像卷](/zh-cn/docs/tasks/configure-pod-container/image-volumes)
- [`image` 卷概览](/zh-cn/docs/concepts/storage/volumes/#image)
