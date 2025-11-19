---
layout: blog
title: "k8s.gcr.io 映像檔倉庫將從 2023 年 4 月 3 日起被凍結"
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

**譯者**：Michael Yao (Daocloud)

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
Kubernetes 項目運行一個名爲 `registry.k8s.io`、由社區管理的映像檔倉庫來託管其容器映像檔。
2023 年 4 月 3 日，舊倉庫 `k8s.gcr.io` 將被凍結，Kubernetes 及其相關子項目的映像檔將不再推送到這個舊倉庫。

`registry.k8s.io` 這個倉庫代替了舊倉庫，這個新倉庫已正式發佈七個月。
我們也發佈了一篇[博文](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/)闡述新倉庫給社區和
Kubernetes 項目帶來的好處。這篇博客再次宣佈後續版本的 Kubernetes 將不可用於舊倉庫。這個時刻已經到來。

<!--
What does this change mean for contributors:

- If you are a maintainer of a subproject, you will need to update your manifests
  and Helm charts to use the new registry.
-->
這次變更對貢獻者意味着：

- 如果你是某子項目的 Maintainer，你將需要更新清單 (manifest) 和 Helm Chart 才能使用新倉庫。

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
這次變更對終端使用者意味着：

- Kubernetes 1.27 版本將不會發布到舊倉庫。
- 1.24、1.25 和 1.26 版本的補丁從 4 月份起將不再發布到舊倉庫。請閱讀以下時間線，瞭解舊倉庫最終補丁版本的詳情。
- 從 1.25 開始，默認的映像檔倉庫已設置爲 `registry.k8s.io`。`kubeadm` 和 `kubelet`
  中的這個映像檔倉庫地址是可覆蓋的，但設置爲 `k8s.gcr.io` 將在 4 月份之後的新版本中失敗，
  因爲舊倉庫將沒有這些版本了。
- 如果你想提高叢集的可靠性，不想再依賴社區管理的映像檔倉庫，或你正在外部流量受限的網路中運行 Kubernetes，
  你應該考慮託管本地映像檔倉庫的映像檔。一些雲供應商可能會爲此提供託管解決方案。

<!--
## Timeline of the changes

- `k8s.gcr.io` will be frozen on the 3rd of April 2023
- 1.27 is expected to be released on the 12th of April 2023
- The last 1.23 release on `k8s.gcr.io` will be 1.23.18 (1.23 goes end-of-life before the freeze)
- The last 1.24 release on `k8s.gcr.io` will be 1.24.12
- The last 1.25 release on `k8s.gcr.io` will be 1.25.8
- The last 1.26 release on `k8s.gcr.io` will be 1.26.3
-->
## 變更時間線   {#timeline-of-changes}

- `k8s.gcr.io` 將於 2023 年 4 月 3 日被凍結
- 1.27 預計於 2023 年 4 月 12 日發佈
- `k8s.gcr.io` 上的最後一個 1.23 版本將是 1.23.18（1.23 在倉庫凍結前進入不再支持階段）
- `k8s.gcr.io` 上的最後一個 1.24 版本將是 1.24.12
- `k8s.gcr.io` 上的最後一個 1.25 版本將是 1.25.8
- `k8s.gcr.io` 上的最後一個 1.26 版本將是 1.26.3

<!--
## What's next

Please make sure your cluster does not have dependencies on old image registry.
For example,  you can run this command to list the images used by pods:
-->
## 下一步   {#whats-next}

請確保你的叢集未依賴舊的映像檔倉庫。例如，你可以運行以下命令列出 Pod 使用的映像檔：

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
舊的映像檔倉庫可能存在其他依賴項。請確保你檢查了所有潛在的依賴項，以保持叢集健康和最新。

<!--
## Acknowledgments

__Change is hard__, and evolving our image-serving platform is needed to ensure
a sustainable future for the project. We strive to make things better for everyone
using Kubernetes. Many contributors from all corners of our community have been
working long and hard to ensure we are making the best decisions possible,
executing plans, and doing our best to communicate those plans.
-->
## 致謝   {#acknowledgments}

__改變是艱難的__，但只有映像檔服務平臺演進才能確保 Kubernetes 項目可持續的未來。
我們努力爲 Kubernetes 的每個使用者提供更好的服務。從社區各個角落匯聚而來的衆多貢獻者長期努力工作，
確保我們能夠做出儘可能最好的決策、履行計劃並盡最大努力傳達這些計劃。

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
衷心感謝：

- 來自 SIG K8s Infra 的 Aaron Crickenberger、Arnaud Meukam、Benjamin Elder、Caleb
  Woodbine、Davanum Srinivas、Mahamed Ali 和 Tim Hockin
- 來自 SIG Node 的 Brian McQueen 和 Sergey Kanzhelev
- 來自 SIG Cluster Lifecycle 的 Lubomir Ivanov
- 來自 SIG Release 的 Adolfo García Veytia、Jeremy Rickard、Sascha Grunert 和 Stephen Augustus
- 來自 SIG Contribex 的 Bob Killen 和 Kaslin Fields
- 來自 Security Response Committee（安全響應委員會）的 Tim Allclair

此外非常感謝負責聯絡各個雲提供商合作伙伴的朋友們：來自 Amazon 的 Jay Pipes 和來自 Google 的 Jon Johnson Jr.
