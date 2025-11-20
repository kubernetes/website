---
layout: blog
title: '更新 NGINX-Ingress 以使用穩定的 Ingress API'
date: 2021-07-26
slug: update-with-ingress-nginx
---
<!--
layout: blog
title: 'Updating NGINX-Ingress to use the stable Ingress API'
date: 2021-07-26
slug: update-with-ingress-nginx
-->

<!--
**Authors:** James Strong, Ricardo Katz
-->
**作者：** James Strong, Ricardo Katz

<!--
With all Kubernetes APIs, there is a process to creating, maintaining, and
ultimately deprecating them once they become GA. The networking.k8s.io API group is no
different. The upcoming Kubernetes 1.22 release will remove several deprecated APIs
that are relevant to networking:
-->
對於所有 Kubernetes API，一旦它們被正式發佈（GA），就有一個創建、維護和最終棄用它們的過程。
networking.k8s.io API 組也不例外。
即將發佈的 Kubernetes 1.22 版本將移除幾個與網路相關的已棄用 API：

<!--
- the `networking.k8s.io/v1beta1` API version of [IngressClass](/docs/concepts/services-networking/ingress/#ingress-class)
- all beta versions of [Ingress](/docs/concepts/services-networking/ingress/): `extensions/v1beta1` and `networking.k8s.io/v1beta1`
-->
- [IngressClass](/zh-cn/docs/concepts/services-networking/ingress/#ingress-class) 的 `networking.k8s.io/v1beta1` API 版本
- [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 的所有 Beta 版本: `extensions/v1beta1` 和 `networking.k8s.io/v1beta1`

<!--
On a v1.22 Kubernetes cluster, you'll be able to access Ingress and IngressClass
objects through the stable (v1) APIs, but access via their beta APIs won't be possible.
-->
在 v1.22 Kubernetes 叢集上，你能夠通過穩定版本（v1）的 API 訪問 Ingress 和 IngressClass 對象，
但無法通過其 Beta API 訪問。 
<!--
This change has been in
in discussion since
[2017](https://github.com/kubernetes/kubernetes/issues/43214),
[2019](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) with 
1.16 Kubernetes API deprecations, and most recently in
KEP-1453: 
[Graduate Ingress API to GA](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1453-ingress-api#122).
-->
自 [2017](https://github.com/kubernetes/kubernetes/issues/43214)、
[2019](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) 
以來一直討論關於 Kubernetes 1.16 棄用 API 的更改，
最近的討論是在 KEP-1453：[Ingress API 畢業到 GA](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1453-ingress-api#122)。

<!--
During community meetings, the networking Special Interest Group has decided to continue 
supporting Kubernetes versions older than 1.22 with Ingress-NGINX version 0.47.0. 
Support for Ingress-NGINX will continue for six months after Kubernetes 1.22 
is released. Any additional bug fixes and CVEs for Ingress-NGINX will be 
addressed on a need-by-need basis.
-->
在社區會議中，網路特別興趣小組決定繼續支持帶有 0.47.0 版本 Ingress-NGINX 的早於 1.22 版本的 Kubernetes。
在 Kubernetes 1.22 發佈後，對 Ingress-NGINX 的支持將持續六個月。
團隊會根據需要解決 Ingress-NGINX 的額外錯誤修復和 CVE 問題。

<!--
Ingress-NGINX will have separate branches and releases of Ingress-NGINX to 
support this model, mirroring the Kubernetes project process. Future 
releases of the Ingress-NGINX project will track and support the latest 
versions of Kubernetes.
-->
Ingress-NGINX 將擁有獨立的分支和發佈版本來支持這個模型，與 Kubernetes 項目流程相一致。
Ingress-NGINX 項目的未來版本將跟蹤和支持最新版本的 Kubernetes。

<!--
{{< table caption="Ingress NGINX supported version with Kubernetes Versions" >}}
Kubernetes 版本  | Ingress-NGINX version | Notes
:-------------------|:----------------------|:------------
v1.22              | v1.0.0-alpha.2     | New features, plus bug fixes.
v1.21              | v0.47.x        | Bugfixes only, and just for security issues or crashes. No end-of-support date announced.
v1.20              | v0.47.x        | Bugfixes only, and just  for security issues or crashes. No end-of-support date announced.
v1.19              | v0.47.x        | Bugfixes only, and just  for security issues or crashes. Fixes only provided until 6 months after Kubernetes v1.22.0 is released.
{{< /table >}}    
-->
{{< table caption="Kubernetes 各版本支持的 Ingress NGINX 版本" >}}
Kubernetes 版本  | Ingress-NGINX 版本 | 公告
:-------------------|:----------------------|:------------
v1.22              | v1.0.0-alpha.2     | 新特性，以及錯誤修復。
v1.21              | v0.47.x        | 僅修復安全問題或系統崩潰的錯誤。沒有宣佈終止支持日期。
v1.20              | v0.47.x        | 僅修復安全問題或系統崩潰的錯誤。沒有宣佈終止支持日期。
v1.19              | v0.47.x        | 僅修復安全問題或系統崩潰的錯誤。僅在 Kubernetes v1.22.0 發佈後的 6 個月內提供修復支持。
{{< /table >}}    

<!--
Because of the updates in Kubernetes 1.22, **v0.47.0** will not work with 
Kubernetes 1.22. 
-->
由於 Kubernetes 1.22 中的更新，**v0.47.0** 將無法與 Kubernetes 1.22 一起使用。 

<!--
# What you need to do
-->
## 你需要做什麼

<!--
The team is currently in the process of upgrading ingress-nginx to support 
the v1 migration, you can track the progress 
[here](https://github.com/kubernetes/ingress-nginx/pull/7156).  
We're not making feature improvements to `ingress-nginx` until after the support for
Ingress v1 is complete.
-->
團隊目前正在升級 Ingress-NGINX 以支持向 v1 的遷移，
你可以在[此處](https://github.com/kubernetes/ingress-nginx/pull/7156)跟蹤進度。
在對 Ingress v1 的支持完成之前，
我們不會對功能進行改進。

<!--
In the meantime to ensure no compatibility issues: 
-->
同時，團隊會確保沒有兼容性問題：

<!--
* Update to the latest version of Ingress-NGINX; currently
  [v0.47.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v0.47.0) 
-->
* 更新到最新的 Ingress-NGINX 版本，
  目前是 [v0.47.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v0.47.0)。 
<!--
* After Kubernetes 1.22 is released, ensure you are using the latest version of 
  Ingress-NGINX that supports the stable APIs for Ingress and IngressClass.
-->  
* Kubernetes 1.22 發佈後，請確保使用的是支持 Ingress 和 IngressClass 穩定 API 的最新版本的 Ingress-NGINX。
<!--
* Test Ingress-NGINX version v1.0.0-alpha.2 with Cluster versions >= 1.19 
  and report any issues to the projects Github page. 
-->
* 使用叢集版本 >= 1.19 測試 Ingress-NGINX 版本 v1.0.0-alpha.2，並將任何問題報告給項目 GitHub 頁面。

<!--
The community’s feedback and support in this effort is welcome. The
Ingress-NGINX Sub-project regularly holds community meetings where we discuss
this and other issues facing the project. For more information on the sub-project, 
please see [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
歡迎社區對此工作的反饋和支持。
Ingress-NGINX 子項目定期舉行社區會議，
我們會討論這個問題以及項目面臨的其他問題。
有關子項目的更多資訊，請參閱 [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)。
