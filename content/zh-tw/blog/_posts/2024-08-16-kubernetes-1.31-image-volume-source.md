---
layout: blog
title: "Kubernetes 1.31：基於 OCI 工件的只讀卷 (Alpha)"
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
Kubernetes 社區正朝着在未來滿足更多人工智能（AI）和機器學習（ML）使用場景的方向發展。
雖然此項目在過去設計爲滿足微服務架構，但現在是時候聽聽最終用戶的聲音並引入更側重於 AI/ML 的特性了。

<!--
One of these requirements is to support [Open Container Initiative (OCI)](https://opencontainers.org)
compatible images and artifacts (referred as OCI objects) directly as a native
volume source. This allows users to focus on OCI standards as well as enables
them to store and distribute any content using OCI registries. A feature like
this gives the Kubernetes project a chance to grow into use cases which go
beyond running particular images.
-->
其中一項需求是直接支持與[開放容器倡議（OCI）](https://opencontainers.org)
兼容的鏡像和工件（稱爲 OCI 對象）作爲原生卷源。
這使得用戶能夠專注於 OCI 標準，且能夠使用 OCI 鏡像倉庫存儲和分發任何內容。
與此類似的特性讓 Kubernetes 項目有機會擴大其使用場景，不再侷限於運行特定鏡像。

<!--
Given that, the Kubernetes community is proud to present a new alpha feature
introduced in v1.31: The Image Volume Source
([KEP-4639](https://kep.k8s.io/4639)). This feature allows users to specify an
image reference as volume in a pod while reusing it as volume mount within
containers:
-->
在這一背景下，Kubernetes 社區自豪地展示在 v1.31 中引入的一項新的 Alpha 特性：
鏡像卷源（[KEP-4639](https://kep.k8s.io/4639)）。
此特性允許用戶在 Pod 中指定一個鏡像引用作爲卷，並在容器內將其作爲卷掛載進行復用：

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
上述示例的結果是將 `my-image:tag` 掛載到 Pod 的容器中的 `/path/to/directory`。

<!--
## Use cases

The goal of this enhancement is to stick as close as possible to the existing
[container image](/docs/concepts/containers/images/) implementation within the
kubelet, while introducing a new API surface to allow more extended use cases.
-->
## 使用場景

此增強特性的目標是在儘可能貼近 kubelet 中現有的[容器鏡像](/zh-cn/docs/concepts/containers/images/)實現的同時，
引入新的 API 接口以支持更廣泛的使用場景。

<!--
For example, users could share a configuration file among multiple containers in
a pod without including the file in the main image, so that they can minimize
security risks and the overall image size. They can also package and distribute
binary artifacts using OCI images and mount them directly into Kubernetes pods,
so that they can streamline their CI/CD pipeline as an example.
-->
例如，用戶可以在 Pod 中的多個容器之間共享一個配置文件，而無需將此文件包含在主鏡像中，
這樣用戶就可以將安全風險最小化和並縮減整體鏡像大小。用戶還可以使用 OCI 鏡像打包和分發二進制工件，
並直接將它們掛載到 Kubernetes Pod 中，例如用戶這樣就可以簡化其 CI/CD 流水線。

<!--
Data scientists, MLOps engineers, or AI developers, can mount large language
model weights or machine learning model weights in a pod alongside a
model-server, so that they can efficiently serve them without including them in
the model-server container image. They can package these in an OCI object to
take advantage of OCI distribution and ensure efficient model deployment. This
allows them to separate the model specifications/content from the executables
that process them.
-->
數據科學家、MLOps 工程師或 AI 開發者可以與模型服務器一起在 Pod 中掛載大語言模型權重或機器學習模型權重數據，
從而可以更高效地提供服務，且無需將這些模型包含在模型服務器容器鏡像中。
他們可以將這些模型打包在 OCI 對象中，以利用 OCI 分發機制，還可以確保高效的模型部署。
這一新特性允許他們將模型規約/內容與處理它們的可執行文件分開。

<!--
Another use case is that security engineers can use a public image for a malware
scanner and mount in a volume of private (commercial) malware signatures, so
that they can load those signatures without baking their own combined image
(which might not be allowed by the copyright on the public image). Those files
work regardless of the OS or version of the scanner software.
-->
另一個使用場景是安全工程師可以使用公共鏡像作爲惡意軟件掃描器，並將私有的（商業的）惡意軟件簽名掛載到卷中，
這樣他們就可以加載這些簽名且無需製作自己的組合鏡像（公共鏡像的版權要求可能不允許這樣做）。
簽名數據文件與操作系統或掃描器軟件版本無關，總是可以被使用。

<!--
But in the long term it will be up to **you** as an end user of this project to
outline further important use cases for the new feature.
[SIG Node](https://github.com/kubernetes/community/blob/54a67f5/sig-node/README.md)
is happy to retrieve any feedback or suggestions for further enhancements to
allow more advanced usage scenarios. Feel free to provide feedback by either
using the [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
channel or the [SIG Node mailinglist](https://groups.google.com/g/kubernetes-sig-node).
-->
但就長期而言，作爲此項目的最終用戶的你要負責爲這一新特性的其他重要使用場景給出規劃。
[SIG Node](https://github.com/kubernetes/community/blob/54a67f5/sig-node/README.md)
樂於接收與進一步增強此特性以適應更高級的使用場景有關的所有反饋或建議。你可以通過使用
[Kubernetes Slack（#sig-node）](https://kubernetes.slack.com/messages/sig-node)
頻道或 [SIG Node 郵件列表](https://groups.google.com/g/kubernetes-sig-node)提供反饋。

<!--
## Detailed example {#example}

The Kubernetes alpha feature gate [`ImageVolume`](/docs/reference/command-line-tools-reference/feature-gates)
needs to be enabled on the [API Server](/docs/reference/command-line-tools-reference/kube-apiserver)
as well as the [kubelet](/docs/reference/command-line-tools-reference/kubelet)
to make it functional. If that’s the case and the [container runtime](/docs/setup/production-environment/container-runtimes)
has support for the feature (like CRI-O ≥ v1.31), then an example `pod.yaml`
like this can be created:
-->
## 詳細示例 {#example}

你需要在 [API 服務器](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver)以及
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet) 上啓用
Kubernetes Alpha 特性門控 [`ImageVolume`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)，
才能使其正常工作。如果啓用了此特性，
並且[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes)支持此特性
（如 CRI-O ≥ v1.31），那就可以創建這樣一個示例 `pod.yaml`：

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
此 Pod 使用值爲 `quay.io/crio/artifact:v1` 的 `image.reference` 聲明一個新卷，
該字段值引用了一個包含兩個文件的 OCI 對象。`pullPolicy` 的行爲與容器鏡像相同，允許以下值：

<!--
- `Always`: the kubelet always attempts to pull the reference and the container
  creation will fail if the pull fails.
- `Never`: the kubelet never pulls the reference and only uses a local image or
  artifact. The container creation will fail if the reference isn’t present.
- `IfNotPresent`: the kubelet pulls if the reference isn’t already present on
  disk. The container creation will fail if the reference isn’t present and the
  pull fails.
-->
- `Always`：kubelet 總是嘗試拉取引用，如果拉取失敗，容器創建將失敗。
- `Never`：kubelet 從不拉取引用，只使用本地鏡像或工件。如果引用不存在，容器創建將失敗。
- `IfNotPresent`：kubelet 會在引用已不在磁盤上時進行拉取。如果引用不存在且拉取失敗，容器創建將失敗。

<!--
The `volumeMounts` field is indicating that the container with the name `test`
should mount the volume under the path `/volume`.

If you now create the pod:
-->
`volumeMounts` 字段表示名爲 `test` 的容器應將卷掛載到 `/volume` 路徑下。

如果你現在創建 Pod：

```shell
kubectl apply -f pod.yaml
```

<!--
And exec into it:
-->
然後通過 exec 進入此 Pod：

```shell
kubectl exec -it pod -- sh
```

<!--
Then you’re able to investigate what has been mounted:
-->
那麼你就能夠查看已掛載的內容：

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
**你已經成功地使用 Kubernetes 訪問了 OCI 工件！**

容器運行時拉取鏡像（或工件），將其掛載到容器中，並最終使其可被直接使用。
在實現中有很多細節，這些細節與 kubelet 現有的鏡像拉取行爲密切相關。例如：

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
- 如果提供給 `reference` 的值包含 `:latest` 標籤，`pullPolicy` 將默認爲 `Always`，
  而在任何其他情況下，`pullPolicy` 在未被設置的情況下都默認爲 `IfNotPresent`。
- 如果 Pod 被刪除並重新創建，卷將被重新解析，這意味着在 Pod 重新創建時將可以訪問新的遠端內容。
  如果在 Pod 啓動期間未能解析或未能拉取鏡像，將會容器啓動會被阻止，並可能顯著增加延遲。
  如果拉取鏡像失敗，將使用正常的捲回退機制進行重試，並將在 Pod 的原因和消息中報告出錯原因。
<!--
- Pull secrets will be assembled in the same way as for the container image by
  looking up node credentials, service account image pull secrets, and pod spec
  image pull secrets.
- The OCI object gets mounted in a single directory by merging the manifest
  layers in the same way as for container images.
- The volume is mounted as read-only (`ro`) and non-executable files
  (`noexec`).
-->
- 拉取 Secret 的組裝方式與容器鏡像所用的方式相同，也是通過查找節點憑據、服務賬戶鏡像拉取 Secret
  和 Pod 規約中的鏡像拉取 Secret 來完成。
- OCI 對象被掛載到單個目錄中，清單層的合併方式與容器鏡像相同。
- 卷以只讀（`ro`）和非可執行文件（`noexec`）的方式被掛載。
<!--
- Sub-path mounts for containers are not supported
  (`spec.containers[*].volumeMounts.subpath`).
- The field `spec.securityContext.fsGroupChangePolicy` has no effect on this
  volume type.
- The feature will also work with the [`AlwaysPullImages` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  if enabled.
-->
- 容器的子路徑掛載不被支持（`spec.containers[*].volumeMounts.subpath`）。
- 字段 `spec.securityContext.fsGroupChangePolicy` 對這種卷類型沒有影響。
- 如果已啓用，此特性也將與
  [`AlwaysPullImages` 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)一起工作。

<!--
Thank you for reading through the end of this blog post! SIG Node is proud and
happy to deliver this feature as part of Kubernetes v1.31.

As writer of this blog post, I would like to emphasize my special thanks to
**all** involved individuals out there! You all rock, let’s keep on hacking!
-->
感謝你閱讀到這篇博客文章的結尾！對於將此特性作爲 Kubernetes v1.31
的一部分交付，SIG Node 感到很高興也很自豪。

作爲這篇博客的作者，我想特別感謝所有參與者！你們都很棒，讓我們繼續開發之旅！

<!--
## Further reading

- [Use an Image Volume With a Pod](/docs/tasks/configure-pod-container/image-volumes)
- [`image` volume overview](/docs/concepts/storage/volumes/#image)
-->
## 進一步閱讀

- [在 Pod 中使用鏡像卷](/zh-cn/docs/tasks/configure-pod-container/image-volumes)
- [`image` 卷概覽](/zh-cn/docs/concepts/storage/volumes/#image)
