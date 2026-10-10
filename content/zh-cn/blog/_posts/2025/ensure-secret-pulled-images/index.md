---
layout: blog
title: "Kubernetes v1.33：镜像拉取策略终于按你的预期工作了！"
date:  2025-05-12T10:30:00-08:00
slug: kubernetes-v1-33-ensure-secret-pulled-images-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft),
  [Stanislav Láznička](https://github.com/stlaz) (Microsoft)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Image Pull Policy the way you always thought it worked!"
date:  2025-05-12T10:30:00-08:00
slug: kubernetes-v1-33-ensure-secret-pulled-images-alpha
author: >
  [Ben Petersen](https://github.com/benjaminapetersen) (Microsoft),
  [Stanislav Láznička](https://github.com/stlaz) (Microsoft)
-->

<!--
## Image Pull Policy the way you always thought it worked!

Some things in Kubernetes are surprising, and the way `imagePullPolicy` behaves might
be one of them. Given Kubernetes is all about running pods, it may be peculiar
to learn that there has been a caveat to restricting pod access to authenticated images for
over 10 years in the form of [issue 18787](https://github.com/kubernetes/kubernetes/issues/18787)!
It is an exciting release when you can resolve a ten-year-old issue.
-->
## 镜像拉取策略终于按你的预期工作了！

Kubernetes 中有些东西让人感到奇怪，`imagePullPolicy` 的行为就是其中之一。
Kubernetes 作为一个专注于运行 Pod 的平台，居然在限制 Pod 访问经认证的镜像方面，存在一个长达十余年的问题，
详见 [Issue 18787](https://github.com/kubernetes/kubernetes/issues/18787)！
v1.33 解决了这个十年前的老问题，这真是一个有纪念意义的版本。

{{< note >}}
<!--
Throughout this blog post, the term "pod credentials" will be used often. In this context,
the term generally encapsulates the authentication material that is available to a pod
to authenticate a container image pull.
-->
在本博文中，“Pod 凭据”这个术语将被频繁使用。
在这篇博文的上下文中，这一术语通常指的是 Pod 拉取容器镜像时可用于身份认证的认证材料。
{{< /note >}}

<!--
## IfNotPresent, even if I'm not supposed to have it

The gist of the problem is that the `imagePullPolicy: IfNotPresent` strategy has done
precisely what it says, and nothing more. Let's set up a scenario. To begin, *Pod A* in *Namespace X* is scheduled to *Node 1* and requires *image Foo* from a private repository.
For it's image pull authentication material, the pod references *Secret 1* in its `imagePullSecrets`. *Secret 1* contains the necessary credentials to pull from the private repository. The Kubelet will utilize the credentials from *Secret 1* as supplied by *Pod A*
and it will pull *container image Foo* from the registry.  This is the intended (and secure)
behavior.
-->
## IfNotPresent：即使我本不该有这个镜像

问题的本质在于，`imagePullPolicy: IfNotPresent` 策略正如其字面意义所示，仅此而已。
我们来设想一个场景：**Pod A** 运行在 **Namespace X** 中，被调度到 **Node 1**，
此 Pod 需要从某个私有仓库拉取**镜像 Foo**。此 Pod 在 `imagePullSecrets` 中引用
**Secret 1** 来作为镜像拉取认证材料。**Secret 1** 包含从私有仓库拉取镜像所需的凭据。
kubelet 将使用 **Pod A** 提供的 **Secret 1** 来拉取 **镜像 Foo**，这是预期的（也是安全的）行为。

<!--
But now things get curious. If *Pod B* in *Namespace Y* happens to also be scheduled to *Node 1*, unexpected (and potentially insecure) things happen. *Pod B* may reference the same private image, specifying the `IfNotPresent` image pull policy. *Pod B* does not reference *Secret 1*
(or in our case, any secret) in its `imagePullSecrets`. When the Kubelet tries to run the pod, it honors the `IfNotPresent` policy. The Kubelet sees that the *image Foo* is already present locally, and will provide *image Foo* to *Pod B*. *Pod B* gets to run the image even though it did not provide credentials authorizing it to pull the image in the first place.
-->
但现在情况变得奇怪了。如果 **Namespace Y** 中的 **Pod B** 也被调度到 **Node 1**，就会出现意外（甚至是不安全）的情况。
**Pod B** 可以引用同一个私有镜像，指定 `IfNotPresent` 镜像拉取策略。
**Pod B** 未在其 `imagePullSecrets` 中引用 **Secret 1**（甚至未引用任何 Secret）。
当 kubelet 尝试运行此 Pod 时，它会采用 `IfNotPresent` 策略。
kubelet 发现本地已存在**镜像 Foo**，会将**镜像 Foo** 提供给 **Pod B**。
即便 **Pod B** 一开始并未提供授权拉取镜像的凭据，却依然能够运行此镜像。

<!--
{{< figure
    src="ensure_secret_image_pulls.svg"
    caption="Using a private image pulled by a different pod"
    alt="Illustration of the process of two pods trying to access a private image, the first one with a pull secret, the second one without it"
>}}
-->
{{< figure
    src="ensure_secret_image_pulls.svg"
    caption="使用由另一个 Pod 拉取的私有镜像"
    alt="两个 Pod 尝试访问某个私有镜像的过程示意图，第一个 Pod 有拉取 Secret，第二个没有"
>}}

<!--
While `IfNotPresent` should not pull *image Foo* if it is already present
on the node, it is an incorrect security posture to allow all pods scheduled
to a node to have access to previously pulled private image. These pods were never
authorized to pull the image in the first place.
-->
虽然 `IfNotPresent` 不应在节点上已存在**镜像 Foo** 的情况下再拉取此镜像，
但允许将所有 Pod 调度到有权限访问之前已拉取私有镜像的节点上，这从安全态势讲是不正确的做法。
因为这些 Pod 从开始就未被授权拉取此镜像。

<!--
## IfNotPresent, but only if I am supposed to have it

In Kubernetes v1.33, we - SIG Auth and SIG Node - have finally started to address this (really old) problem and getting the verification right! The basic expected behavior is not changed. If
an image is not present, the Kubelet will attempt to pull the image. The credentials each pod supplies will be utilized for this task. This matches behavior prior to 1.33.
-->
## IfNotPresent：但前提是我有权限

在 Kubernetes v1.33 中，SIG Auth 和 SIG Node 终于开始修复这个（非常古老的）难题，并经过验证可行！
基本的预期行为没有变。如果某镜像不存在，kubelet 会尝试拉取此镜像。
利用每个 Pod 提供的凭据来完成此拉取任务。这与 v1.33 之前的行为相匹配。

<!--
If the image is present, then the behavior of the Kubelet changes. The Kubelet will now
verify the pod's credentials before allowing the pod to use the image.

Performance and service stability have been a consideration while revising the feature.
Pods utilizing the same credential will not be required to re-authenticate. This is
also true when pods source credentials from the same Kubernetes Secret object, even
when the credentials are rotated.
-->
但如果镜像存在，kubelet 的行为就变了。
kubelet 现在先要验证 Pod 的凭据，然后才会允许 Pod 使用镜像。

在修缮此特性时，我们也考虑到了性能和服务稳定性。
如果多个 Pod 使用相同的凭据，则无需重复认证。
即使这些 Pod 使用的是相同的 Kubernetes Secret 对象（即便其凭据已轮换），也同样适用。

<!--
## Never pull, but use if authorized

The `imagePullPolicy: Never` option does not fetch images. However, if the
container image is already present on the node, any pod attempting to use the private
image will be required to provide credentials, and those credentials require verification.

Pods utilizing the same credential will not be required to re-authenticate.
Pods that do not supply credentials previously used to successfully pull an
image will not be allowed to use the private image.
-->
## Never：永不拉取，但使用前仍需鉴权

采用 `imagePullPolicy: Never` 选项时，不会获取镜像。
但如果节点上已存在此容器镜像，任何尝试使用此私有镜像的 Pod 都需要提供凭据，并且这些凭据需要经过验证。

使用相同凭据的 Pod 无需重新认证。未提供之前已成功拉取镜像所用凭据的 Pod，将不允许使用此私有镜像。

<!--
## Always pull, if authorized

The `imagePullPolicy: Always` has always worked as intended. Each time an image
is requested, the request goes to the registry and the registry will perform an authentication
check.

In the past, forcing the `Always` image pull policy via pod admission was the only way to ensure
that your private container images didn't get reused by other pods on nodes which already pulled the images.
-->
## Always：鉴权通过后始终拉取

`imagePullPolicy: Always` 一直以来都能按预期工作。
每次某镜像被请求时，请求会流转到镜像仓库，镜像仓库将执行身份认证检查。

过去，为了确保你的私有容器镜像不会被节点上已拉取过镜像的其他 Pod 重复使用，
通过 Pod 准入来强制执行 `Always` 镜像拉取策略是唯一的方式。

<!--
Fortunately, this was somewhat performant. Only the image manifest was pulled, not the image. However, there was still a cost and a risk. During a new rollout, scale up, or pod restart, the image registry that provided the image MUST be available for the auth check, putting the image registry in the critical path for stability of services running inside of the cluster.
-->
幸运的是，这个过程相对高效：仅拉取镜像清单，而不是镜像本体。
但这依然带来代价与风险。每当发布新版本、扩容或重启 Pod 时，
提供镜像的镜像仓库必须可以接受认证检查，从而将镜像仓库放到关键路径中确保集群中所运行的服务的稳定性。

<!--
## How it all works

The feature is based on persistent, file-based caches that are present on each of
the nodes. The following is a simplified description of how the feature works.
For the complete version, please see [KEP-2535](https://kep.k8s.io/2535).
-->
## 工作原理

此特性基于每个节点上存在的持久化文件缓存。以下简要说明了此特性的工作原理。
完整细节请参见 [KEP-2535](https://kep.k8s.io/2535)。

<!--
The process of requesting an image for the first time goes like this:
  1. A pod requesting an image from a private registry is scheduled to a node.
  2. The image is not present on the node.
  3. The Kubelet makes a record of the intention to pull the image.
  4. The Kubelet extracts credentials from the Kubernetes Secret referenced by the pod
     as an image pull secret, and uses them to pull the image from the private registry.
-->
首次请求某镜像的流程如下：

1. 请求私有仓库中某镜像的 Pod 被调度到某节点。
2. 此镜像在节点上不存在。
3. kubelet 记录一次拉取镜像的意图。
4. kubelet 从 Pod 引用的 Kubernetes Secret 中提取凭据作为镜像拉取 Secret，并使用这些凭据从私有仓库拉取镜像。

<!--
  1. After the image has been successfully pulled, the Kubelet makes a record of
     the successful pull. This record includes details about credentials used
     (in the form of a hash) as well as the Secret from which they originated.
  2. The Kubelet removes the original record of intent.
  3. The Kubelet retains the record of successful pull for later use.
-->
5. 镜像已成功拉取后，kubelet 会记录这次成功的拉取。
   记录包括所使用的凭据细节（哈希格式）以及构成这些凭据的原始 Secret。
6. kubelet 移除原始意图记录。
7. kubelet 保留成功拉取的记录供后续使用。

<!--
When future pods scheduled to the same node request the previously pulled private image:
  1. The Kubelet checks the credentials that the new pod provides for the pull.
  2. If the hash of these credentials, or the source Secret of the credentials match
     the hash or source Secret which were recorded for a previous successful pull,
     the pod is allowed to use the previously pulled image.
  3. If the credentials or their source Secret are not found in the records of
     successful pulls for that image, the Kubelet will attempt to use
     these new credentials to request a pull from the remote registry, triggering
     the authorization flow.
-->
当以后调度到同一节点的 Pod 请求之前拉取过的私有镜像：

1. kubelet 检查新 Pod 为拉取镜像所提供的凭据。
2. 如果这些凭据的哈希或其源 Secret 与之前成功拉取记录的哈希或源 Secret 相匹配，则允许此 Pod 使用之前拉取的镜像。
3. 如果在该镜像的成功拉取记录中找不到这些凭据或其源 Secret，则
   kubelet 将尝试使用这些新的凭据从远程仓库进行拉取，同时触发认证流程。

<!--
## Try it out

In Kubernetes v1.33 we shipped the alpha version of this feature. To give it a spin,
enable the `KubeletEnsureSecretPulledImages` feature gate for your 1.33 Kubelets.

You can learn more about the feature and additional optional configuration on the
[concept page for Images](/docs/concepts/containers/images/#ensureimagepullcredentialverification)
in the official Kubernetes documentation.
-->
## 试用

在 Kubernetes v1.33 中，我们发布了此特性的 Alpha 版本。
要想试用，在 kubelet v1.33 上启用 `KubeletEnsureSecretPulledImages` 特性门控。

你可以在 Kubernetes
官方文档中的[镜像概念页](/zh-cn/docs/concepts/containers/images/#ensureimagepullcredentialverification)中了解此特性和更多可选配置的细节。

<!--
## What's next?

In future releases we are going to:
1. Make this feature work together with [Projected service account tokens for Kubelet image credential providers](https://kep.k8s.io/4412) which adds a new, workload-specific source of image pull credentials.
1. Write a benchmarking suite to measure the performance of this feature and assess the impact of
   any future changes.
1. Implement an in-memory caching layer so that we don't need to read files for each image
   pull request.
1. Add support for credential expirations, thus forcing previously validated credentials to
   be re-authenticated.
-->
## 下一步工作

在未来的版本中，我们将：

1. 使此特性与 [kubelet 镜像凭据提供程序的投射服务账号令牌](https://kep.k8s.io/4412)协同工作，
   后者能够添加新的、特定于工作负载的镜像拉取凭据源。
2. 编写基准测试套件，以评估此特性的性能并衡量后续变更的影响。
3. 实现内存中的缓存层，因此我们不需要为每个镜像拉取请求都读取文件。
4. 添加对凭据过期的支持，从而强制重新认证之前已验证过的凭据。

<!--
## How to get involved

[Reading KEP-2535](https://kep.k8s.io/2535) is a great way to understand these changes in depth.

If you are interested in further involvement, reach out to us on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) channel
on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
held every other Wednesday.
-->
## 如何参与

阅读 [KEP-2535](https://kep.k8s.io/2535) 是深入理解这些变更的绝佳方式。

如果你想进一步参与，可以加入 Kubernetes Slack 频道
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
（如需邀请链接，请访问 [https://slack.k8s.io/](https://slack.k8s.io/)）。
欢迎你参加每隔一周在星期三举行的 [SIG Auth 双周例会](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)。
