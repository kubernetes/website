---
layout: blog
title: "k8s.gcr.io 重定向到 registry.k8s.io - 用戶須知"
date: 2023-03-10T17:00:00.000Z
slug: image-registry-redirect
---
<!--
layout: blog
title: "k8s.gcr.io Redirect to registry.k8s.io - What You Need to Know"
date: 2023-03-10T17:00:00.000Z
slug: image-registry-redirect
-->

<!--
**Authors**: Bob Killen (Google), Davanum Srinivas (AWS), Chris Short (AWS), Frederico Muñoz (SAS
Institute), Tim Bannister (The Scale Factory), Ricky Sadowski (AWS), Grace Nguyen (Expo), Mahamed
Ali (Rackspace Technology), Mars Toktonaliev (independent), Laura Santamaria (Dell), Kat Cosgrove
(Dell)
-->
**作者**：Bob Killen (Google)、Davanum Srinivas (AWS)、Chris Short (AWS)、Frederico Muñoz (SAS
Institute)、Tim Bannister (The Scale Factory)、Ricky Sadowski (AWS)、Grace Nguyen (Expo)、Mahamed
Ali (Rackspace Technology)、Mars Toktonaliev（獨立個人）、Laura Santamaria (Dell)、Kat Cosgrove
(Dell)

**譯者**：Michael Yao (DaoCloud)

<!--
On Monday, March 20th, the k8s.gcr.io registry [will be redirected to the community owned
registry](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/),
**registry.k8s.io** .
-->
3 月 20 日星期一，k8s.gcr.io
倉庫[被重定向到了社區擁有的倉庫](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)：
**registry.k8s.io** 。

<!--
## TL;DR: What you need to know about this change

- On Monday, March 20th, traffic from the older k8s.gcr.io registry will be redirected to
  registry.k8s.io with the eventual goal of sunsetting k8s.gcr.io.
- If you run in a restricted environment, and apply strict domain name or IP address access policies
  limited to k8s.gcr.io, **the image pulls will not function** after k8s.gcr.io starts redirecting
  to the new registry.
-->
## 長話短說：本次變更須知   {#you-need-to-know}

- 3 月 20 日星期一，來自 k8s.gcr.io 舊倉庫的流量被重定向到了 registry.k8s.io，
  最終目標是逐步淘汰 k8s.gcr.io。
- 如果你在受限的環境中運行，且你爲 k8s.gcr.io 限定採用了嚴格的域名或 IP 地址訪問策略，
  那麼 k8s.gcr.io 開始重定向到新倉庫之後鏡像拉取操作將不起作用。
<!--
- A small subset of non-standard clients do not handle HTTP redirects by image registries, and will
  need to be pointed directly at registry.k8s.io.
- The redirect is a stopgap to assist users in making the switch. The deprecated k8s.gcr.io registry
  will be phased out at some point. **Please update your manifests as soon as possible to point to
  registry.k8s.io**.
- If you host your own image registry, you can copy images you need there as well to reduce traffic
  to community owned registries.
-->
- 少量非標準的客戶端不會處理鏡像倉庫的 HTTP 重定向，將需要直接指向 registry.k8s.io。
- 本次重定向只是一個協助用戶進行切換的權宜之計。棄用的 k8s.gcr.io 倉庫將在某個時間點被淘汰。
  **請儘快更新你的清單，儘快指向 registry.k8s.io。**
- 如果你託管自己的鏡像倉庫，你可以將需要的鏡像拷貝到自己的倉庫，這樣也能減少到社區所擁有倉庫的流量壓力。

<!--
If you think you may be impacted, or would like to know more about this change, please keep reading.
-->
如果你認爲自己可能受到了影響，或如果你想知道本次變更的更多相關信息，請繼續閱讀下文。

<!--
## How can I check if I am impacted?

To test connectivity to registry.k8s.io and being able to pull images from there, here is a sample
command that can be executed in the namespace of your choosing:
-->
## 若我受到影響該怎樣檢查？   {#how-can-i-check}

若要測試到 registry.k8s.io 的連通性，測試是否能夠從 registry.k8s.io 拉取鏡像，
可以在你所選的命名空間中執行類似以下的命令：

```shell
kubectl run hello-world -ti --rm --image=registry.k8s.io/busybox:latest --restart=Never -- date
```

<!--
When you run the command above, here’s what to expect when things work correctly:
-->
當你執行上一條命令時，若一切工作正常，預期的輸出如下：

```none
$ kubectl run hello-world -ti --rm --image=registry.k8s.io/busybox:latest --restart=Never -- date
Fri Feb 31 07:07:07 UTC 2023
pod "hello-world" deleted
```

<!--
## What kind of errors will I see if I’m impacted?

Errors may depend on what kind of container runtime you are using, and what endpoint you are routed
to, but it should present such as `ErrImagePull`, `ImagePullBackOff`, or a container failing to be
created with the warning `FailedCreatePodSandBox`.

Below is an example error message showing a proxied deployment failing to pull due to an unknown
certificate:
-->
## 若我受到影響會看到哪種錯誤？   {#what-kind-of-errors}

出現的錯誤可能取決於你正使用的容器運行時類別以及你被路由到的端點，
通常會出現 `ErrImagePull`、`ImagePullBackOff` 這類錯誤，
也可能容器創建失敗時伴隨着警告 `FailedCreatePodSandBox`。

以下舉例的錯誤消息顯示了由於未知的證書使得代理後的部署拉取失敗：

```none
FailedCreatePodSandBox: Failed to create pod sandbox: rpc error: code = Unknown desc = Error response from daemon: Head “https://us-west1-docker.pkg.dev/v2/k8s-artifacts-prod/images/pause/manifests/3.8”: x509: certificate signed by unknown authority
```

<!--
## What images will be impacted?

**ALL** images on k8s.gcr.io will be impacted by this change. k8s.gcr.io hosts many images beyond
Kubernetes releases. A large number of Kubernetes subprojects host their images there as well. Some
examples include the `dns/k8s-dns-node-cache`, `ingress-nginx/controller`, and
`node-problem-detector/node-problem-detector` images.
-->
## 哪些鏡像會受影響？    {#what-images-be-impacted}

k8s.gcr.io 上的 **所有** 鏡像都會受到本次變更的影響。
k8s.gcr.io 除了 Kubernetes 各個版本外還託管了許多鏡像。
大量 Kubernetes 子項目也在其上託管了自己的鏡像。
例如 `dns/k8s-dns-node-cache`、`ingress-nginx/controller` 和
`node-problem-detector/node-problem-detector` 這些鏡像。

<!--
## I am impacted. What should I do?

For impacted users that run in a restricted environment, the best option is to copy over the
required images to a private registry or configure a pull-through cache in their registry.

There are several tools to copy images between registries;
[crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/doc/crane_copy.md) is one
of those tools, and images can be copied to a private registry by using `crane copy SRC DST`. There
are also vendor-specific tools, like e.g. Google’s
[gcrane](https://cloud.google.com/container-registry/docs/migrate-external-containers#copy), that
perform a similar function but are streamlined for their platform.
-->
## 我受影響了。我該怎麼辦？   {#what-should-i-do}

若受影響的用戶在受限的環境中運行，最好的辦法是將必需的鏡像拷貝到私有倉庫，或在自己的倉庫中配置一個直通緩存。
在倉庫之間拷貝鏡像可使用若干工具：
[crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/doc/crane_copy.md)
就是其中一種工具，通過使用 `crane copy SRC DST` 可以將鏡像拷貝到私有倉庫。還有一些供應商特定的工具，例如 Google 的
[gcrane](https://cloud.google.com/container-registry/docs/migrate-external-containers#copy)，
這個工具實現了類似的功能，但針對其平臺自身做了一些精簡。

<!--
## How can I find which images are using the legacy registry, and fix them?

**Option 1**: See the one line kubectl command in our [earlier blog
post](https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/#what-s-next):
-->
## 我怎樣才能找到哪些鏡像正使用舊倉庫，如何修復？    {#how-can-i-find-and-fix}

**方案 1**：
試試[上一篇博文](https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/#what-s-next)中所述的一條
kubectl 命令：

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

<!--
**Option 2**: A `kubectl` [krew](https://krew.sigs.k8s.io/) plugin has been developed called
[`community-images`](https://github.com/kubernetes-sigs/community-images#kubectl-community-images),
that will scan and report any images using the k8s.gcr.io endpoint.

If you have krew installed, you can install it with:
-->
**方案 2**：`kubectl` [krew](https://krew.sigs.k8s.io/) 的一個插件已被開發完成，名爲
[`community-images`](https://github.com/kubernetes-sigs/community-images#kubectl-community-images)，
它能夠使用 k8s.gcr.io 端點掃描和報告所有正使用 k8s.gcr.io 的鏡像。

如果你安裝了 krew，你可以運行以下命令進行安裝：

```shell
kubectl krew install community-images
```

<!--
and generate a report with:
-->
並用以下命令生成一個報告：

```shell
kubectl community-images
```

<!--
For alternate methods of install and example output, check out the repo:
[kubernetes-sigs/community-images](https://github.com/kubernetes-sigs/community-images).

**Option 3**: If you do not have access to a cluster directly, or manage many clusters - the best
way is to run a search over your manifests and charts for _"k8s.gcr.io"_.
-->
對於安裝和示例輸出的其他方法，可以查閱代碼倉庫：
[kubernetes-sigs/community-images](https://github.com/kubernetes-sigs/community-images)。

**方案 3**：如果你不能直接訪問集羣，或如果你管理了許多集羣，最好的方式是在清單（manifest）和
Chart 中搜索 **"k8s.gcr.io"**。

<!--
**Option 4**: If you wish to prevent k8s.gcr.io based images from running in your cluster, example
policies for [Gatekeeper](https://open-policy-agent.github.io/gatekeeper-library/website/) and
[Kyverno](https://kyverno.io/) are available in the [AWS EKS Best Practices
repository](https://github.com/aws/aws-eks-best-practices/tree/master/policies/k8s-registry-deprecation)
that will block them from being pulled. You can use these third-party policies with any Kubernetes
cluster.
-->
**方案 4**：如果你想預防基於 k8s.gcr.io 的鏡像在你的集羣中運行，可以在
[AWS EKS 最佳實踐代碼倉庫](https://github.com/aws/aws-eks-best-practices/tree/master/policies/k8s-registry-deprecation)中找到針對
[Gatekeeper](https://open-policy-agent.github.io/gatekeeper-library/website/)
和 [Kyverno](https://kyverno.io/) 的示例策略，這些策略可以阻止鏡像被拉取。
你可以在任何 Kubernetes 集羣中使用這些第三方策略。

<!--
**Option 5**: As a **LAST** possible option, you can use a [Mutating
Admission Webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
to change the image address dynamically. This should only be
considered a stopgap till your manifests have been updated. You can
find a (third party) Mutating Webhook and Kyverno policy in
[k8s-gcr-quickfix](https://github.com/abstractinfrastructure/k8s-gcr-quickfix).
-->
**方案 5**：作爲 **最後一個** 備選方案，
你可以使用[修改性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
來動態更改鏡像地址。在更新你的清單之前這隻應視爲一個權宜之計。你可以在
[k8s-gcr-quickfix](https://github.com/abstractinfrastructure/k8s-gcr-quickfix)
中找到（第三方）可變性質的 Webhook 和 Kyverno 策略。

<!--
## Why did Kubernetes change to a different image registry?

k8s.gcr.io is hosted on a custom [Google Container Registry
(GCR)](https://cloud.google.com/container-registry) domain that was set up solely for the Kubernetes
project. This has worked well since the inception of the project, and we thank Google for providing
these resources, but today, there are other cloud providers and vendors that would like to host
images to provide a better experience for the people on their platforms. In addition to Google’s
[renewed commitment to donate $3
million](https://www.cncf.io/google-cloud-recommits-3m-to-kubernetes/) to support the project's
infrastructure last year, Amazon Web Services announced a matching donation [during their Kubecon NA
2022 keynote in Detroit](https://youtu.be/PPdimejomWo?t=236). This will provide a better experience
for users (closer servers = faster downloads) and will reduce the egress bandwidth and costs from
GCR at the same time.
-->
## 爲什麼 Kubernetes 要換到一個全新的鏡像倉庫？   {#why-did-k8s-change-registry}

k8s.gcr.io 託管在一個 [Google Container Registry (GCR)](https://cloud.google.com/container-registry)
自定義的域中，這是專爲 Kubernetes 項目搭建的域。自 Kubernetes 項目啓動以來，
這個倉庫一直運作良好，我們感謝 Google 提供這些資源，然而如今還有其他雲提供商和供應商希望託管這些鏡像，
以便爲他們自己雲平臺上的用戶提供更好的體驗。除了去年 Google
[捐贈 300 萬美金的續延承諾](https://www.cncf.io/google-cloud-recommits-3m-to-kubernetes/)來支持本項目的基礎設施外，
Amazon Web Services (AWS) 也在[底特律召開的 Kubecon NA 2022 上發言](https://youtu.be/PPdimejomWo?t=236)公佈了相當的捐贈金額。
AWS 能爲用戶提供更好的體驗（距離用戶更近的服務器 = 更快的下載速度），同時還能減輕 GCR 的出站帶寬和成本。

<!--
For more details on this change, check out [registry.k8s.io: faster, cheaper and Generally Available
(GA)](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/).
-->
有關此次變更的更多詳情，請查閱
[registry.k8s.io：更快、成本更低且正式發佈 (GA)](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)。

<!--
## Why is a redirect being put in place?

The project switched to [registry.k8s.io last year with the 1.25
release](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/); however, most of
the image pull traffic is still directed at the old endpoint k8s.gcr.io. This has not been
sustainable for us as a project, as it is not utilizing the resources that have been donated to the
project from other providers, and we are in the danger of running out of funds due to the cost of
serving this traffic.
-->
## 爲什麼要設置重定向？   {#why-is-a-redirect}

本項目在[去年發佈 1.25 時切換至 registry.k8s.io](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)；
然而，大多數鏡像拉取流量仍被重定向到舊端點 k8s.gcr.io。
從項目角度看，這對我們來說是不可持續的，因爲這樣既沒有完全利用其他供應商捐贈給本項目的資源，
也由於流量服務成本而使我們面臨資金耗盡的危險。

<!--
A redirect will enable the project to take advantage of these new resources, significantly reducing
our egress bandwidth costs. We only expect this change to impact a small subset of users running in
restricted environments or using very old clients that do not respect redirects properly.
-->
重定向將使本項目能夠利用這些新資源的優勢，從而顯著降低我們的出站帶寬成本。
我們預計此次更改只會影響一小部分用戶，他們可能在受限環境中運行 Kubernetes，
或使用了老舊到無法處理重定向行爲的客戶端。

<!--
## What will happen to k8s.gcr.io?

Separate from the redirect, k8s.gcr.io will be frozen [and will not be updated with new images
after April 3rd, 2023](https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/). `k8s.gcr.io`
will not get any new releases, patches, or security updates. It will continue to remain available to
help people migrate, but it **WILL** be phased out entirely in the future.
-->
## k8s.gcr.io 將會怎樣？   {#what-will-happen-to-k8s-gcr-io}

除了重定向之外，k8s.gcr.io 將被凍結，
[且在 2023 年 4 月 3 日之後將不會隨着新的鏡像而更新](/zh-cn/blog/2023/02/06/k8s-gcr-io-freeze-announcement/)。
`k8s.gcr.io` 將不再獲取任何新的版本、補丁或安全更新。
這個舊倉庫將繼續保持可用，以幫助人們遷移，但在以後將會被徹底淘汰。

<!--
## I still have questions, where should I go?

For more information on registry.k8s.io and why it was developed, see [registry.k8s.io: faster,
cheaper and Generally Available](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/).

If you would like to know more about the image freeze and the last images that will be available
there, see the blog post: [k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April
2023](/blog/2023/02/06/k8s-gcr-io-freeze-announcement/).
-->
## 我仍有疑問，我該去哪兒詢問？   {#what-should-i-go}

有關 registry.k8s.io 及其爲何開發這個新倉庫的更多信息，請參見
[registry.k8s.io：更快、成本更低且正式發佈](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)。

如果你想了解鏡像凍結以及最後一版可用鏡像的更多信息，請參見博文：
[k8s.gcr.io 鏡像倉庫將從 2023 年 4 月 3 日起被凍結](/zh-cn/blog/2023/02/06/k8s-gcr-io-freeze-announcement/)。

<!--
Information on the architecture of registry.k8s.io and its [request handling decision
tree](https://github.com/kubernetes/registry.k8s.io/blob/8408d0501a88b3d2531ff54b14eeb0e3c900a4f3/cmd/archeio/docs/request-handling.md)
can be found in the [kubernetes/registry.k8s.io
repo](https://github.com/kubernetes/registry.k8s.io).

If you believe you have encountered a bug with the new registry or the redirect, please open an
issue in the [kubernetes/registry.k8s.io
repo](https://github.com/kubernetes/registry.k8s.io/issues/new/choose). **Please check if there is an issue already
open similar to what you are seeing before you create a new issue**.
-->
有關 registry.k8s.io
架構及其[請求處理決策樹](https://github.com/kubernetes/registry.k8s.io/blob/8408d0501a88b3d2531ff54b14eeb0e3c900a4f3/cmd/archeio/docs/request-handling.md)的信息，
請查閱 [kubernetes/registry.k8s.io 代碼倉庫](https://github.com/kubernetes/registry.k8s.io)。

若你認爲自己在使用新倉庫和重定向時遇到 bug，請在
[kubernetes/registry.k8s.io 代碼倉庫](https://github.com/kubernetes/registry.k8s.io/issues/new/choose)中提出 Issue。
**請先檢查是否有人提出了類似的 Issue，再行創建新 Issue。**
