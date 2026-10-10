---
layout: blog
title: "Kubernetes v1.33：镜像卷进阶至 Beta！"
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
[镜像卷](/zh-cn/blog/2024/08/16/kubernetes-1-31-image-volume-source)作为
Alpha 特性首次引入 Kubernetes v1.31 版本，并作为
[KEP-4639](https://github.com/kubernetes/enhancements/issues/4639)
的一部分发布。在 Kubernetes v1.33 中，此特性进阶至 **Beta**。

<!--
Please note that the feature is still _disabled_ by default, because not all
[container runtimes](/docs/setup/production-environment/container-runtimes) have
full support for it. [CRI-O](https://cri-o.io) supports the initial feature since version v1.31 and
will add support for Image Volumes as beta in v1.33.
[containerd merged](https://github.com/containerd/containerd/pull/10579) support
for the alpha feature which will be part of the v2.1.0 release and is working on
beta support as part of [PR #11578](https://github.com/containerd/containerd/pull/11578).
-->
请注意，此特性目前仍默认**禁用**，
因为并非所有的[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes)都完全支持此特性。
[CRI-O](https://cri-o.io) 自 v1.31 起就支持此初始特性，并将在 v1.33 中添加对镜像卷的 Beta 支持。
[containerd 已合并](https://github.com/containerd/containerd/pull/10579)对 Alpha 特性的支持，
此特性将包含在 containerd v2.1.0 版本中，并正通过
[PR #11578](https://github.com/containerd/containerd/pull/11578) 实现对 Beta 的支持。

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
### 新增内容   {#whats-new}

镜像卷进阶为 Beta 的主要变化是支持通过 `spec.containers[*].volumeMounts.[subPath,subPathExpr]`
配置容器的 [`subPath`](/zh-cn/docs/concepts/storage/volumes/#using-subpath) 和
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment) 挂载。
这允许最终用户在保持只读（`noexec`）方式挂载的同时可以挂载某镜像卷中的某个子目录。
这意味着默认情况下无法挂载不存在的子目录。与其他 `subPath` 和 `subPathExpr` 取值一样，
Kubernetes 将确保所指定的子路径中不包含绝对路径或相对路径成分。
出于安全考虑，容器运行时也需要再次验证这些要求。如果指定的子目录在卷中不存在，
则运行时应在创建容器时失败，并通过现有的 kubelet 事件向用户提供反馈。

<!--
Besides that, there are also three new kubelet metrics available for image volumes:

- `kubelet_image_volume_requested_total`: Outlines the number of requested image volumes.
- `kubelet_image_volume_mounted_succeed_total`: Counts the number of successful image volume mounts.
- `kubelet_image_volume_mounted_errors_total`: Accounts the number of failed image volume mounts.
-->
除此之外，还为镜像卷新增三个 kubelet 指标：

- `kubelet_image_volume_requested_total`：统计请求镜像卷的数量。
- `kubelet_image_volume_mounted_succeed_total`：统计镜像卷成功挂载的数量。
- `kubelet_image_volume_mounted_errors_total`：统计镜像卷挂载失败的数量。

<!--
To use an existing subdirectory for a specific image volume, just use it as
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) (or
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment))
value of the containers `volumeMounts`:
-->
若要为特定镜像卷使用已有的子目录，只需将其用作容器 `volumeMounts` 的
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
然后，在集群中创建 Pod：

```shell
kubectl apply -f image-volumes-subpath.yaml
```

<!--
Now you can attach to the container:
-->
现在你可以挂接到容器：

```shell
kubectl attach -it image-volume bash
```

<!--
And check the content of the file from the `dir` sub path in the volume:
-->
并查看卷中 `dir` 子路径下的文件内容：

```shell
cat /volume/file
```

<!--
The output will be similar to:
-->
输出将类似于：

```none
1
```

<!--
Thank you for reading through the end of this blog post! SIG Node is proud and
happy to deliver this feature graduation as part of Kubernetes v1.33.

As writer of this blog post, I would like to emphasize my special thanks to
**all** involved individuals out there!
-->
感谢你读完本博文！SIG Node 团队非常自豪和高兴地在 Kubernetes v1.33 中交付此特性的进阶版本。

作为本文作者，我要特别感谢参与开发此特性的**所有人**！

<!--
If you would like to provide feedback or suggestions feel free to reach out
to SIG Node using the [Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
channel or the [SIG Node mailing list](https://groups.google.com/g/kubernetes-sig-node).
-->
如果你有任何反馈或建议，欢迎通过
[Kubernetes Slack (#sig-node)](https://kubernetes.slack.com/messages/sig-node)
频道或 [SIG Node 邮件列表](https://groups.google.com/g/kubernetes-sig-node)与 SIG Node 团队联系。

<!--
## Further reading

- [Use an Image Volume With a Pod](/docs/tasks/configure-pod-container/image-volumes)
- [`image` volume overview](/docs/concepts/storage/volumes/#image)
-->
## 进一步阅读   {#further-reading}

- [Pod 使用镜像卷](/zh-cn/docs/tasks/configure-pod-container/image-volumes)
- [`image` 卷概览](/zh-cn/docs/concepts/storage/volumes/#image)
