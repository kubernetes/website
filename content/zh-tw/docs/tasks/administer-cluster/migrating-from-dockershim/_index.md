---
title: 從 dockershim 遷移
weight: 10
content_type: task 
no_list: true
---
<!-- 
title: "Migrating from dockershim"
weight: 10
content_type: task 
-->

<!-- overview -->

<!-- 
This section presents information you need to know when migrating from
dockershim to other container runtimes.
-->
本節提供從 dockershim 遷移到其他容器執行時的必備知識。

<!-- 
Since the announcement of [dockershim deprecation](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
in Kubernetes 1.20, there were questions on how this will affect various workloads and Kubernetes
installations. Our [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) is there to help you
to understand the problem better.
-->
自從 Kubernetes 1.20 宣佈
[棄用 dockershim](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)，
各類疑問隨之而來：這對各類工作負載和 Kubernetes 部署會產生什麼影響。
我們的[棄用  Dockershim 常見問題](/blog/2022/02/17/dockershim-faq/)可以幫助你更好地理解這個問題。

<!-- 
Dockershim was removed from Kubernetes with the release of v1.24.
If you use Docker Engine via dockershim as your container runtime, and wish to upgrade to v1.24,
it is recommended that you either migrate to another runtime or find an alternative means to obtain Docker Engine support.
-->
Dockershim 在 Kubernetes v1.24 版本已經被移除。
如果你叢集內是透過 dockershim 使用 Docker Engine 作為容器執行時，並希望 Kubernetes 升級到 v1.24，
建議你遷移到其他容器執行時或使用其他方法以獲得 Docker 引擎支援。

<!--
Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
section to know your options. Make sure to
[report issues](https://github.com/kubernetes/kubernetes/issues) you encountered
with the migration. So the issue can be fixed in a timely manner and your cluster would be
ready for dockershim removal.
-->
建議從 dockershim 遷移到其他替代的容器執行時。
請參閱[容器執行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
一節以瞭解可用的備選項。
當在遷移過程中遇到麻煩，請[上報問題](https://github.com/kubernetes/kubernetes/issues)。
那麼問題就可以及時修復，你的叢集也可以進入移除 dockershim 前的就緒狀態。

<!--
Your cluster might have more than one kind of node, although this is not a common
configuration.

These tasks will help you to migrate:

* [Check whether Dockershim deprecation affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
* [Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)
-->
你的叢集中可以有不止一種型別的節點，儘管這不是常見的情況。

下面這些任務可以幫助你完成遷移：

* [檢查棄用 Dockershim 是否影響到你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
* [將 Docker Engine 節點從 dockershim 遷移到 cri-dockerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [從 dockershim 遷移遙測和安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)

## {{% heading "whatsnext" %}}

<!--
* Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
  to understand your options for a container runtime.
* There is a
  [GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)
  to track discussion about the deprecation and removal of dockershim.
* If you found a defect or other technical concern relating to migrating away from dockershim,
  you can [report an issue](https://github.com/kubernetes/kubernetes/issues/new/choose)
  to the Kubernetes project.
-->
* 檢視[容器執行時](/zh-cn/docs/setup/production-environment/container-runtimes/)瞭解可選的容器執行時。
* [GitHub 問題](https://github.com/kubernetes/kubernetes/issues/106917)跟蹤有關
  dockershim 的棄用和刪除的討論。
* 如果你發現與 dockershim 遷移相關的缺陷或其他技術問題，
  可以在 Kubernetes 專案[報告問題](https://github.com/kubernetes/kubernetes/issues/new/choose)。

