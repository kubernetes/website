---
layout: blog
title: "Kubernetes v1.33：鏡像拉取策略終於按你的預期工作了！"
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
## 鏡像拉取策略終於按你的預期工作了！

Kubernetes 中有些東西讓人感到奇怪，`imagePullPolicy` 的行爲就是其中之一。
Kubernetes 作爲一個專注於運行 Pod 的平臺，居然在限制 Pod 訪問經認證的鏡像方面，存在一個長達十餘年的問題，
詳見 [Issue 18787](https://github.com/kubernetes/kubernetes/issues/18787)！
v1.33 解決了這個十年前的老問題，這真是一個有紀念意義的版本。

{{< note >}}
<!--
Throughout this blog post, the term "pod credentials" will be used often. In this context,
the term generally encapsulates the authentication material that is available to a pod
to authenticate a container image pull.
-->
在本博文中，“Pod 憑據”這個術語將被頻繁使用。
在這篇博文的上下文中，這一術語通常指的是 Pod 拉取容器鏡像時可用於身份認證的認證材料。
{{< /note >}}

<!--
## IfNotPresent, even if I'm not supposed to have it

The gist of the problem is that the `imagePullPolicy: IfNotPresent` strategy has done
precisely what it says, and nothing more. Let's set up a scenario. To begin, *Pod A* in *Namespace X* is scheduled to *Node 1* and requires *image Foo* from a private repository.
For it's image pull authentication material, the pod references *Secret 1* in its `imagePullSecrets`. *Secret 1* contains the necessary credentials to pull from the private repository. The Kubelet will utilize the credentials from *Secret 1* as supplied by *Pod A*
and it will pull *container image Foo* from the registry.  This is the intended (and secure)
behavior.
-->
## IfNotPresent：即使我本不該有這個鏡像

問題的本質在於，`imagePullPolicy: IfNotPresent` 策略正如其字面意義所示，僅此而已。
我們來設想一個場景：**Pod A** 運行在 **Namespace X** 中，被調度到 **Node 1**，
此 Pod 需要從某個私有倉庫拉取**鏡像 Foo**。此 Pod 在 `imagePullSecrets` 中引用
**Secret 1** 來作爲鏡像拉取認證材料。**Secret 1** 包含從私有倉庫拉取鏡像所需的憑據。
kubelet 將使用 **Pod A** 提供的 **Secret 1** 來拉取 **鏡像 Foo**，這是預期的（也是安全的）行爲。

<!--
But now things get curious. If *Pod B* in *Namespace Y* happens to also be scheduled to *Node 1*, unexpected (and potentially insecure) things happen. *Pod B* may reference the same private image, specifying the `IfNotPresent` image pull policy. *Pod B* does not reference *Secret 1*
(or in our case, any secret) in its `imagePullSecrets`. When the Kubelet tries to run the pod, it honors the `IfNotPresent` policy. The Kubelet sees that the *image Foo* is already present locally, and will provide *image Foo* to *Pod B*. *Pod B* gets to run the image even though it did not provide credentials authorizing it to pull the image in the first place.
-->
但現在情況變得奇怪了。如果 **Namespace Y** 中的 **Pod B** 也被調度到 **Node 1**，就會出現意外（甚至是不安全）的情況。
**Pod B** 可以引用同一個私有鏡像，指定 `IfNotPresent` 鏡像拉取策略。
**Pod B** 未在其 `imagePullSecrets` 中引用 **Secret 1**（甚至未引用任何 Secret）。
當 kubelet 嘗試運行此 Pod 時，它會採用 `IfNotPresent` 策略。
kubelet 發現本地已存在**鏡像 Foo**，會將**鏡像 Foo** 提供給 **Pod B**。
即便 **Pod B** 一開始並未提供授權拉取鏡像的憑據，卻依然能夠運行此鏡像。

<!--
{{< figure
    src="ensure_secret_image_pulls.svg"
    caption="Using a private image pulled by a different pod"
    alt="Illustration of the process of two pods trying to access a private image, the first one with a pull secret, the second one without it"
>}}
-->
{{< figure
    src="ensure_secret_image_pulls.svg"
    caption="使用由另一個 Pod 拉取的私有鏡像"
    alt="兩個 Pod 嘗試訪問某個私有鏡像的過程示意圖，第一個 Pod 有拉取 Secret，第二個沒有"
>}}

<!--
While `IfNotPresent` should not pull *image Foo* if it is already present
on the node, it is an incorrect security posture to allow all pods scheduled
to a node to have access to previously pulled private image. These pods were never
authorized to pull the image in the first place.
-->
雖然 `IfNotPresent` 不應在節點上已存在**鏡像 Foo** 的情況下再拉取此鏡像，
但允許將所有 Pod 調度到有權限訪問之前已拉取私有鏡像的節點上，這從安全態勢講是不正確的做法。
因爲這些 Pod 從開始就未被授權拉取此鏡像。

<!--
## IfNotPresent, but only if I am supposed to have it

In Kubernetes v1.33, we - SIG Auth and SIG Node - have finally started to address this (really old) problem and getting the verification right! The basic expected behavior is not changed. If
an image is not present, the Kubelet will attempt to pull the image. The credentials each pod supplies will be utilized for this task. This matches behavior prior to 1.33.
-->
## IfNotPresent：但前提是我有權限

在 Kubernetes v1.33 中，SIG Auth 和 SIG Node 終於開始修復這個（非常古老的）難題，並經過驗證可行！
基本的預期行爲沒有變。如果某鏡像不存在，kubelet 會嘗試拉取此鏡像。
利用每個 Pod 提供的憑據來完成此拉取任務。這與 v1.33 之前的行爲相匹配。

<!--
If the image is present, then the behavior of the Kubelet changes. The Kubelet will now
verify the pod's credentials before allowing the pod to use the image.

Performance and service stability have been a consideration while revising the feature.
Pods utilizing the same credential will not be required to re-authenticate. This is
also true when pods source credentials from the same Kubernetes Secret object, even
when the credentials are rotated.
-->
但如果鏡像存在，kubelet 的行爲就變了。
kubelet 現在先要驗證 Pod 的憑據，然後纔會允許 Pod 使用鏡像。

在修繕此特性時，我們也考慮到了性能和服務穩定性。
如果多個 Pod 使用相同的憑據，則無需重複認證。
即使這些 Pod 使用的是相同的 Kubernetes Secret 對象（即便其憑據已輪換），也同樣適用。

<!--
## Never pull, but use if authorized

The `imagePullPolicy: Never` option does not fetch images. However, if the
container image is already present on the node, any pod attempting to use the private
image will be required to provide credentials, and those credentials require verification.

Pods utilizing the same credential will not be required to re-authenticate.
Pods that do not supply credentials previously used to successfully pull an
image will not be allowed to use the private image.
-->
## Never：永不拉取，但使用前仍需鑑權

採用 `imagePullPolicy: Never` 選項時，不會獲取鏡像。
但如果節點上已存在此容器鏡像，任何嘗試使用此私有鏡像的 Pod 都需要提供憑據，並且這些憑據需要經過驗證。

使用相同憑據的 Pod 無需重新認證。未提供之前已成功拉取鏡像所用憑據的 Pod，將不允許使用此私有鏡像。

<!--
## Always pull, if authorized

The `imagePullPolicy: Always` has always worked as intended. Each time an image
is requested, the request goes to the registry and the registry will perform an authentication
check.

In the past, forcing the `Always` image pull policy via pod admission was the only way to ensure
that your private container images didn't get reused by other pods on nodes which already pulled the images.
-->
## Always：鑑權通過後始終拉取

`imagePullPolicy: Always` 一直以來都能按預期工作。
每次某鏡像被請求時，請求會流轉到鏡像倉庫，鏡像倉庫將執行身份認證檢查。

過去，爲了確保你的私有容器鏡像不會被節點上已拉取過鏡像的其他 Pod 重複使用，
通過 Pod 准入來強制執行 `Always` 鏡像拉取策略是唯一的方式。

<!--
Fortunately, this was somewhat performant. Only the image manifest was pulled, not the image. However, there was still a cost and a risk. During a new rollout, scale up, or pod restart, the image registry that provided the image MUST be available for the auth check, putting the image registry in the critical path for stability of services running inside of the cluster.
-->
幸運的是，這個過程相對高效：僅拉取鏡像清單，而不是鏡像本體。
但這依然帶來代價與風險。每當發佈新版本、擴容或重啓 Pod 時，
提供鏡像的鏡像倉庫必須可以接受認證檢查，從而將鏡像倉庫放到關鍵路徑中確保集羣中所運行的服務的穩定性。

<!--
## How it all works

The feature is based on persistent, file-based caches that are present on each of
the nodes. The following is a simplified description of how the feature works.
For the complete version, please see [KEP-2535](https://kep.k8s.io/2535).
-->
## 工作原理

此特性基於每個節點上存在的持久化文件緩存。以下簡要說明了此特性的工作原理。
完整細節請參見 [KEP-2535](https://kep.k8s.io/2535)。

<!--
The process of requesting an image for the first time goes like this:
  1. A pod requesting an image from a private registry is scheduled to a node.
  2. The image is not present on the node.
  3. The Kubelet makes a record of the intention to pull the image.
  4. The Kubelet extracts credentials from the Kubernetes Secret referenced by the pod
     as an image pull secret, and uses them to pull the image from the private registry.
-->
首次請求某鏡像的流程如下：

1. 請求私有倉庫中某鏡像的 Pod 被調度到某節點。
2. 此鏡像在節點上不存在。
3. kubelet 記錄一次拉取鏡像的意圖。
4. kubelet 從 Pod 引用的 Kubernetes Secret 中提取憑據作爲鏡像拉取 Secret，並使用這些憑據從私有倉庫拉取鏡像。

<!--
  1. After the image has been successfully pulled, the Kubelet makes a record of
     the successful pull. This record includes details about credentials used
     (in the form of a hash) as well as the Secret from which they originated.
  2. The Kubelet removes the original record of intent.
  3. The Kubelet retains the record of successful pull for later use.
-->
5. 鏡像已成功拉取後，kubelet 會記錄這次成功的拉取。
   記錄包括所使用的憑據細節（哈希格式）以及構成這些憑據的原始 Secret。
6. kubelet 移除原始意圖記錄。
7. kubelet 保留成功拉取的記錄供後續使用。

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
當以後調度到同一節點的 Pod 請求之前拉取過的私有鏡像：

1. kubelet 檢查新 Pod 爲拉取鏡像所提供的憑據。
2. 如果這些憑據的哈希或其源 Secret 與之前成功拉取記錄的哈希或源 Secret 相匹配，則允許此 Pod 使用之前拉取的鏡像。
3. 如果在該鏡像的成功拉取記錄中找不到這些憑據或其源 Secret，則
   kubelet 將嘗試使用這些新的憑據從遠程倉庫進行拉取，同時觸發認證流程。

<!--
## Try it out

In Kubernetes v1.33 we shipped the alpha version of this feature. To give it a spin,
enable the `KubeletEnsureSecretPulledImages` feature gate for your 1.33 Kubelets.

You can learn more about the feature and additional optional configuration on the
[concept page for Images](/docs/concepts/containers/images/#ensureimagepullcredentialverification)
in the official Kubernetes documentation.
-->
## 試用

在 Kubernetes v1.33 中，我們發佈了此特性的 Alpha 版本。
要想試用，在 kubelet v1.33 上啓用 `KubeletEnsureSecretPulledImages` 特性門控。

你可以在 Kubernetes
官方文檔中的[鏡像概念頁](/zh-cn/docs/concepts/containers/images/#ensureimagepullcredentialverification)中瞭解此特性和更多可選配置的細節。

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

在未來的版本中，我們將：

1. 使此特性與 [kubelet 鏡像憑據提供程序的投射服務賬號令牌](https://kep.k8s.io/4412)協同工作，
   後者能夠添加新的、特定於工作負載的鏡像拉取憑據源。
2. 編寫基準測試套件，以評估此特性的性能並衡量後續變更的影響。
3. 實現內存中的緩存層，因此我們不需要爲每個鏡像拉取請求都讀取文件。
4. 添加對憑據過期的支持，從而強制重新認證之前已驗證過的憑據。

<!--
## How to get involved

[Reading KEP-2535](https://kep.k8s.io/2535) is a great way to understand these changes in depth.

If you are interested in further involvement, reach out to us on the [#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA) channel
on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
You are also welcome to join the bi-weekly [SIG Auth meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings),
held every other Wednesday.
-->
## 如何參與

閱讀 [KEP-2535](https://kep.k8s.io/2535) 是深入理解這些變更的絕佳方式。

如果你想進一步參與，可以加入 Kubernetes Slack 頻道
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
（如需邀請鏈接，請訪問 [https://slack.k8s.io/](https://slack.k8s.io/)）。
歡迎你參加每隔一週在星期三舉行的 [SIG Auth 雙週例會](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)。
