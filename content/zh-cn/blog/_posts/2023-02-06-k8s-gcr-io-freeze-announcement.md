---
layout: blog
title: "k8s.gcr.io 镜像仓库将从 2023 年 4 月 3 日起被冻结"
date: 2023-02-06
slug: k8s-gcr-io-freeze-announcement
---
<!--
layout: blog
title: "k8s.gcr.io Image Registry Will Be Frozen From the 3rd of April 2023"
date: 2023-02-06
slug: k8s-gcr-io-freeze-announcement
-->

<!--
**Authors**: Mahamed Ali (Rackspace Technology)
-->
**作者**：Mahamed Ali (Rackspace Technology)

**译者**：Michael Yao (Daocloud)

<!--
The Kubernetes project runs a community-owned image registry called `registry.k8s.io`
to host its container images. On the 3rd of April 2023, the old registry `k8s.gcr.io`
will be frozen and no further images for Kubernetes and related subprojects will be
pushed to the old registry.

This registry `registry.k8s.io` replaced the old one and has been generally available
for several months. We have published a [blog post](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)
about its benefits to the community and the Kubernetes project. This post also
announced that future versions of Kubernetes will not be available in the old
registry. Now that time has come.
-->
Kubernetes 项目运行一个名为 `registry.k8s.io`、由社区管理的镜像仓库来托管其容器镜像。
2023 年 4 月 3 日，旧仓库 `k8s.gcr.io` 将被冻结，Kubernetes 及其相关子项目的镜像将不再推送到这个旧仓库。

`registry.k8s.io` 这个仓库代替了旧仓库，这个新仓库已正式发布七个月。
我们也发布了一篇[博文](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)阐述新仓库给社区和
Kubernetes 项目带来的好处。这篇博客再次宣布后续版本的 Kubernetes 将不可用于旧仓库。这个时刻已经到来。

<!--
What does this change mean for contributors:

- If you are a maintainer of a subproject, you will need to update your manifests
  and Helm charts to use the new registry.
-->
这次变更对贡献者意味着：

- 如果你是某子项目的 Maintainer，你将需要更新清单 (manifest) 和 Helm Chart 才能使用新仓库。

<!--
What does this change mean for end users:

- 1.27 Kubernetes release will not be published to the old registry.
- Patch releases for 1.24, 1.25, and 1.26 will no longer be published to the old
  registry from April. Please read the timelines below for details of the final
  patch releases in the old registry.
- Starting in 1.25, the default image registry has been set to `registry.k8s.io`.
  This value is overridable in `kubeadm` and `kubelet` but setting it to `k8s.gcr.io`
  will fail for new releases after April as they won’t be present in the old registry.
- If you want to increase the reliability of your cluster and remove dependency on
  the community-owned registry or you are running Kubernetes in networks where
  external traffic is restricted, you should consider hosting local image registry
  mirrors. Some cloud vendors may offer hosted solutions for this.
-->
这次变更对终端用户意味着：

- Kubernetes 1.27 版本将不会发布到旧仓库。
- 1.24、1.25 和 1.26 版本的补丁从 4 月份起将不再发布到旧仓库。请阅读以下时间线，了解旧仓库最终补丁版本的详情。
- 从 1.25 开始，默认的镜像仓库已设置为 `registry.k8s.io`。`kubeadm` 和 `kubelet`
  中的这个镜像仓库地址是可覆盖的，但设置为 `k8s.gcr.io` 将在 4 月份之后的新版本中失败，
  因为旧仓库将没有这些版本了。
- 如果你想提高集群的可靠性，不想再依赖社区管理的镜像仓库，或你正在外部流量受限的网络中运行 Kubernetes，
  你应该考虑托管本地镜像仓库的镜像。一些云供应商可能会为此提供托管解决方案。

<!--
## Timeline of the changes

- `k8s.gcr.io` will be frozen on the 3rd of April 2023
- 1.27 is expected to be released on the 12th of April 2023
- The last 1.23 release on `k8s.gcr.io` will be 1.23.18 (1.23 goes end-of-life before the freeze)
- The last 1.24 release on `k8s.gcr.io` will be 1.24.12
- The last 1.25 release on `k8s.gcr.io` will be 1.25.8
- The last 1.26 release on `k8s.gcr.io` will be 1.26.3
-->
## 变更时间线   {#timeline-of-changes}

- `k8s.gcr.io` 将于 2023 年 4 月 3 日被冻结
- 1.27 预计于 2023 年 4 月 12 日发布
- `k8s.gcr.io` 上的最后一个 1.23 版本将是 1.23.18（1.23 在仓库冻结前进入不再支持阶段）
- `k8s.gcr.io` 上的最后一个 1.24 版本将是 1.24.12
- `k8s.gcr.io` 上的最后一个 1.25 版本将是 1.25.8
- `k8s.gcr.io` 上的最后一个 1.26 版本将是 1.26.3

<!--
## What's next

Please make sure your cluster does not have dependencies on old image registry.
For example,  you can run this command to list the images used by pods:
-->
## 下一步   {#whats-next}

请确保你的集群未依赖旧的镜像仓库。例如，你可以运行以下命令列出 Pod 使用的镜像：

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

<!--
There may be other dependencies on the old image registry. Make sure you review
any potential dependencies to keep your cluster healthy and up to date.
-->
旧的镜像仓库可能存在其他依赖项。请确保你检查了所有潜在的依赖项，以保持集群健康和最新。

<!--
## Acknowledgments

__Change is hard__, and evolving our image-serving platform is needed to ensure
a sustainable future for the project. We strive to make things better for everyone
using Kubernetes. Many contributors from all corners of our community have been
working long and hard to ensure we are making the best decisions possible,
executing plans, and doing our best to communicate those plans.
-->
## 致谢   {#acknowledgments}

__改变是艰难的__，但只有镜像服务平台演进才能确保 Kubernetes 项目可持续的未来。
我们努力为 Kubernetes 的每个使用者提供更好的服务。从社区各个角落汇聚而来的众多贡献者长期努力工作，
确保我们能够做出尽可能最好的决策、履行计划并尽最大努力传达这些计划。

<!--
Thanks to Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine,
Davanum Srinivas, Mahamed Ali, and Tim Hockin from SIG K8s Infra, Brian McQueen,
and Sergey Kanzhelev from SIG Node, Lubomir Ivanov from SIG Cluster Lifecycle,
Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, and Stephen Augustus from
SIG Release, Bob Killen and Kaslin Fields from SIG Contribex, Tim Allclair from
the Security Response Committee. Also a big thank you to our friends acting as
liaisons with our cloud provider partners: Jay Pipes from Amazon and Jon Johnson
Jr. from Google.
-->
衷心感谢：

- 来自 SIG K8s Infra 的 Aaron Crickenberger、Arnaud Meukam、Benjamin Elder、Caleb
  Woodbine、Davanum Srinivas、Mahamed Ali 和 Tim Hockin
- 来自 SIG Node 的 Brian McQueen 和 Sergey Kanzhelev
- 来自 SIG Cluster Lifecycle 的 Lubomir Ivanov
- 来自 SIG Release 的 Adolfo García Veytia、Jeremy Rickard、Sascha Grunert 和 Stephen Augustus
- 来自 SIG Contribex 的 Bob Killen 和 Kaslin Fields
- 来自 Security Response Committee（安全响应委员会）的 Tim Allclair

此外非常感谢负责联络各个云提供商合作伙伴的朋友们：来自 Amazon 的 Jay Pipes 和来自 Google 的 Jon Johnson Jr.
