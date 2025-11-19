---
layout: blog
title: "Kubernetes v1.33：映像檔捲進階至 Beta！"
date: 2025-04-29T10:30:00-08:00
slug: kubernetes-v1-33-image-volume-beta
author: Sascha Grunert (Red Hat)
translator: Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Image Volumes graduate to beta!"
date: 2025-04-29T10:30:00-08:00
slug: kubernetes-v1-33-image-volume-beta
author: Sascha Grunert (Red Hat)
-->

<!--
[Image Volumes](/blog/2024/08/16/kubernetes-1-31-image-volume-source) were
introduced as an Alpha feature with the Kubernetes v1.31 release as part of
[KEP-4639](https://github.com/kubernetes/enhancements/issues/4639). In Kubernetes v1.33, this feature graduates to **beta**.
-->
[映像檔卷](/zh-cn/blog/2024/08/16/kubernetes-1-31-image-volume-source)作爲
Alpha 特性首次引入 Kubernetes v1.31 版本，並作爲
[KEP-4639](https://github.com/kubernetes/enhancements/issues/4639)
的一部分發布。在 Kubernetes v1.33 中，此特性進階至 **Beta**。

<!--
Please note that the feature is still _disabled_ by default, because not all
[container runtimes](/docs/setup/production-environment/container-runtimes) have
full support for it. [CRI-O](https://cri-o.io) supports the initial feature since version v1.31 and
will add support for Image Volumes as beta in v1.33.
[containerd merged](https://github.com/containerd/containerd/pull/10579) support
for the alpha feature which will be part of the v2.1.0 release and is working on
beta support as part of [PR #11578](https://github.com/containerd/containerd/pull/11578).
-->
請注意，此特性目前仍默認**禁用**，
因爲並非所有的[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes)都完全支持此特性。
[CRI-O](https://cri-o.io) 自 v1.31 起就支持此初始特性，並將在 v1.33 中添加對映像檔卷的 Beta 支持。
[containerd 已合併](https://github.com/containerd/containerd/pull/10579)對 Alpha 特性的支持，
此特性將包含在 containerd v2.1.0 版本中，並正通過
[PR #11578](https://github.com/containerd/containerd/pull/11578) 實現對 Beta 的支持。

<!--
### What's new

The major change for the beta graduation of Image Volumes is the support for
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) and
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) mounts
for containers via `spec.containers[*].volumeMounts.[subPath,subPathExpr]`. This
allows end-users to mount a certain subdirectory of an image volume, which is
still mounted as readonly (`noexec`). This means that non-existing
subdirectories cannot be mounted by default. As for other `subPath` and
`subPathExpr` values, Kubernetes will ensure that there are no absolute path or
relative path components part of the specified sub path. Container runtimes are
also required to double check those requirements for safety reasons. If a
specified subdirectory does not exist within a volume, then runtimes should fail
on container creation and provide user feedback by using existing kubelet
events.
-->
### 新增內容   {#whats-new}

映像檔捲進階爲 Beta 的主要變化是支持通過 `spec.containers[*].volumeMounts.[subPath,subPathExpr]`
設定容器的 [`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath) 和
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) 掛載。
這允許最終使用者在保持只讀（`noexec`）方式掛載的同時可以掛載某映像檔卷中的某個子目錄。
這意味着默認情況下無法掛載不存在的子目錄。與其他 `subPath` 和 `subPathExpr` 取值一樣，
Kubernetes 將確保所指定的子路徑中不包含絕對路徑或相對路徑成分。
出於安全考慮，容器運行時也需要再次驗證這些要求。如果指定的子目錄在卷中不存在，
則運行時應在創建容器時失敗，並通過現有的 kubelet 事件向使用者提供反饋。

<!--
Besides that, there are also three new kubelet metrics available for image volumes:

- `kubelet_image_volume_requested_total`: Outlines the number of requested image volumes.
- `kubelet_image_volume_mounted_succeed_total`: Counts the number of successful image volume mounts.
- `kubelet_image_volume_mounted_errors_total`: Accounts the number of failed image volume mounts.
-->
除此之外，還爲映像檔卷新增三個 kubelet 指標：

- `kubelet_image_volume_requested_total`：統計請求映像檔卷的數量。
- `kubelet_image_volume_mounted_succeed_total`：統計映像檔捲成功掛載的數量。
- `kubelet_image_volume_mounted_errors_total`：統計映像檔卷掛載失敗的數量。

<!--
To use an existing subdirectory for a specific image volume, just use it as
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) (or
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment))
value of the containers `volumeMounts`:
-->
若要爲特定映像檔卷使用已有的子目錄，只需將其用作容器 `volumeMounts` 的
[`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath)
或 [`subPathExpr`](/zh-cn/docs/concepts/storage/volumes/#using-subpath-expanded-environment)
取值：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: image-volume
spec:
  containers:
  - name: shell
    command: ["sleep", "infinity"]
    image: debian
    volumeMounts:
    - name: volume
      mountPath: /volume
      subPath: dir
  volumes:
  - name: volume
    image:
      reference: quay.io/crio/artifact:v2
      pullPolicy: IfNotPresent
```

<!--
Then, create the pod on your cluster:
-->
然後，在叢集中創建 Pod：

```shell
kubectl apply -f image-volumes-subpath.yaml
```

<!--
Now you can attach to the container:
-->
現在你可以掛接到容器：

```shell
kubectl attach -it image-volume bash
```

<!--
And check the content of the file from the `dir` sub path in the volume:
-->
並查看卷中 `dir` 子路徑下的文件內容：

```shell
cat /volume/file
```

<!--
The output will be similar to:
-->
輸出將類似於：

```none
1
```

<!--
Thank you for reading through the end of this blog post! SIG Node is proud and
happy to deliver this feature graduation as part of Kubernetes v1.33.

As writer of this blog post, I would like to emphasize my special thanks to
**all** involved individuals out there!
-->
感謝你讀完本博文！SIG Node 團隊非常自豪和高興地在 Kubernetes v1.33 中交付此特性的進階版本。

作爲本文作者，我要特別感謝參與開發此特性的**所有人**！

<!--
If you would like to provide feedback or suggestions feel free to reach out
to SIG Node using the [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
channel or the [SIG Node mailing list](https://groups.google.com/g/kubernetes-sig-node).
-->
如果你有任何反饋或建議，歡迎通過
[Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
頻道或 [SIG Node 郵件列表](https://groups.google.com/g/kubernetes-sig-node)與 SIG Node 團隊聯繫。

<!--
## Further reading

- [Use an Image Volume With a Pod](/docs/tasks/configure-pod-container/image-volumes)
- [`image` volume overview](/docs/concepts/storage/volumes/#image)
-->
## 進一步閱讀   {#further-reading}

- [Pod 使用映像檔卷](/zh-cn/docs/tasks/configure-pod-container/image-volumes)
- [`image` 卷概覽](/zh-cn/docs/concepts/storage/volumes/#image)
