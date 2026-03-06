---
title: " Kubernetes 1.8 的五天 "
date: 2017-10-24
slug: five-days-of-kubernetes-18
---
<!--
title: " Five Days of Kubernetes 1.8 "
date: 2017-10-24
slug: five-days-of-kubernetes-18
url: /blog/2017/10/Five-Days-Of-Kubernetes-18
-->

<!--
Kubernetes 1.8 is live, made possible by hundreds of contributors pushing thousands of commits in this latest releases.
-->
Kubernetes 1.8 已经推出，数百名贡献者在这个最新版本中推出了成千上万的提交。

<!--
The community has tallied more than 66,000 commits in the main repo and continues rapid growth outside of the main repo, which signals growing maturity and stability for the project. The community has logged more than 120,000 commits across all repos and 17,839 commits across all repos for v1.7.0 to v1.8.0 alone.
-->
社区已经有超过 66,000 个提交在主仓库，并在主仓库之外继续快速增长，这标志着该项目日益成熟和稳定。仅 v1.7.0 到 v1.8.0，社区就记录了所有仓库的超过 120,000 次提交和 17839 次提交。

<!--
With the help of our growing community of 1,400 plus contributors, we issued more than 3,000 PRs and pushed more than 5,000 commits to deliver Kubernetes 1.8 with significant security and workload support updates. This all points to increased stability, a result of our project-wide focus on maturing [process](https://github.com/kubernetes/sig-release), formalizing [architecture](https://github.com/kubernetes/community/tree/master/sig-architecture), and strengthening Kubernetes’ [governance model](https://github.com/kubernetes/community/tree/master/community/elections/2017).
-->
在拥有 1400 多名贡献者，并且不断发展壮大的社区的帮助下，我们合并了 3000 多个 PR，并发布了 5000 多个提交，最后的 Kubernetes 1.8 在安全和工作负载方面添加了很多的更新。
这一切都表明稳定性的提高，这是我们整个项目关注成熟[流程](https://github.com/kubernetes/sig-release)、形式化[架构](https://github.com/kubernetes/community/tree/master/sig-architecture)和加强 Kubernetes 的[治理模型](https://github.com/kubernetes/community/tree/master/community/elections/2017)的结果。

<!--
While many improvements have been contributed, we highlight key features in this series of in-depth&nbsp;posts listed below. [Follow along](https://twitter.com/kubernetesio) and see what’s new and improved with storage, security and more.
-->
虽然有很多改进，但我们在下面列出的这一系列深度文章中突出了一些关键特性。[跟随](https://twitter.com/kubernetesio)并了解存储，安全等方面的新功能和改进功能。

<!--
**Day 1:** [5 Days of Kubernetes 1.8](https://kubernetes.io/blog/2017/10/five-days-of-kubernetes-18)
**Day 2:** [kubeadm v1.8 Introduces Easy Upgrades for Kubernetes Clusters](https://kubernetes.io/blog/2017/10/kubeadm-v18-released)
**Day 3:** [Kubernetes v1.8 Retrospective: It Takes a Village to Raise a Kubernetes](https://kubernetes.io/blog/2017/10/it-takes-village-to-raise-kubernetes)
**Day 4:** [Using RBAC, Generally Available in Kubernetes v1.8](https://kubernetes.io/blog/2017/10/using-rbac-generally-available-18)
**Day 5:** [Enforcing Network Policies in Kubernetes](https://kubernetes.io/blog/2017/10/enforcing-network-policies-in-kubernetes)
-->

**第一天：** [Kubernetes 1.8 的五天](https://kubernetes.io/blog/2017/10/five-days-of-kubernetes-18)
**第二天：** [kubeadm v1.8 为 Kubernetes 集群引入了简单的升级](https://kubernetes.io/blog/2017/10/kubeadm-v18-released)
**第三天：** [Kubernetes v1.8 回顾：提升一个 Kubernetes 需要一个 Village](https://kubernetes.io/blog/2017/10/it-takes-village-to-raise-kubernetes)
**第四天：** [使用 RBAC，一般在 Kubernetes v1.8 中提供](https://kubernetes.io/blog/2017/10/using-rbac-generally-available-18)
**第五天：** [在 Kubernetes 执行网络策略](https://kubernetes.io/blog/2017/10/enforcing-network-policies-in-kubernetes)

<!--
**Connect**
-->

**链接**

<!--
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
-->

- 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上发布问题（或回答问题）
- 加入 [K8sPort](http://k8sport.org/) 布道师的社区门户网站
- 在 Twitter [@Kubernetesio](https://twitter.com/kubernetesio) 关注我们以获取最新更新
- 与 [Slack](http://slack.k8s.io/) 上的社区联系
- 参与 [GitHub](https://github.com/kubernetes/kubernetes) 上的 Kubernetes 项目


