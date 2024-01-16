---
layout: blog
title: "Kubernetes 旧版软件包仓库将于 2023 年 9 月 13 日被冻结"
date: 2023-08-31T15:30:00-07:00
slug: legacy-package-repository-deprecation
evergreen: true
---

<!--
layout: blog
title: "Kubernetes Legacy Package Repositories Will Be Frozen On September 13, 2023"
date: 2023-08-31T15:30:00-07:00
slug: legacy-package-repository-deprecation
evergreen: true
-->
<!--
**Authors**: Bob Killen (Google), Chris Short (AWS), Jeremy Rickard (Microsoft), Marko Mudrinić (Kubermatic), Tim Bannister (The Scale Factory)
-->
**作者**：Bob Killen (Google), Chris Short (AWS), Jeremy Rickard (Microsoft), Marko Mudrinić (Kubermatic), Tim Bannister (The Scale Factory)

**译者**：[Mengjiao Liu](https://github.com/mengjiao-liu) (DaoCloud)

<!--
On August 15, 2023, the Kubernetes project announced the general availability of
the community-owned package repositories for Debian and RPM packages available
at `pkgs.k8s.io`. The new package repositories are replacement for the legacy
Google-hosted package repositories: `apt.kubernetes.io` and `yum.kubernetes.io`.
The
[announcement blog post for `pkgs.k8s.io`](/blog/2023/08/15/pkgs-k8s-io-introduction/)
highlighted that we will stop publishing packages to the legacy repositories in
the future.
-->

2023 年 8 月 15 日，Kubernetes 项目宣布社区拥有的 Debian 和 RPM
软件包仓库在 `pkgs.k8s.io` 上正式提供。新的软件包仓库将取代旧的由
Google 托管的软件包仓库：`apt.kubernetes.io` 和 `yum.kubernetes.io`。
[`pkgs.k8s.io` 的公告博客文章](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)强调我们未来将停止将软件包发布到旧仓库。

<!--
Today, we're formally deprecating the legacy package repositories (`apt.kubernetes.io`
and `yum.kubernetes.io`), and we're announcing our plans to freeze the contents of
the repositories as of **September 13, 2023**.
-->
今天，我们正式弃用旧软件包仓库（`apt.kubernetes.io` 和 `yum.kubernetes.io`），
并且宣布我们计划在 **2023 年 9 月 13 日** 冻结仓库的内容。

<!--
Please continue reading in order to learn what does this mean for you as an user or
distributor, and what steps you may need to take.
-->
请继续阅读以了解这对于作为用户或分发商的你意味着什么，
以及你可能需要采取哪些步骤。

<!--
## How does this affect me as a Kubernetes end user?

This change affects users **directly installing upstream versions of Kubernetes**,
either manually by following the official
[installation](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) and
[upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) instructions, or
by **using a Kubernetes installer** that's using packages provided by the Kubernetes
project.
-->
## 作为 Kubernetes 最终用户，这对我有何影响？ {#how-does-this-affect-me-as-a-kubernetes-end-user}

此更改影响**直接安装 Kubernetes 的上游版本**的用户，
无论是按照官方手动[安装](/zh-cn/docs/setup/生产环境/工具/kubeadm/install-kubeadm/)
和[升级](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)说明，
还是通过**使用 Kubernetes 安装工具**，该安装工具使用 Kubernetes 项目提供的软件包。

<!--
**This change also affects you if you run Linux on your own PC and have installed `kubectl` using the legacy package repositories**.
We'll explain later on how to [check](#check-if-affected) if you're affected.
-->
**如果你在自己的 PC 上运行 Linux 并使用旧软件包仓库安装了 `kubectl`，则此更改也会影响你**。
我们稍后将解释如何[检查](#check-if-affected)是否你会受到影响。

<!--
If you use **fully managed** Kubernetes, for example through a service from a cloud
provider, you would only be affected by this change if you also installed `kubectl`
on your Linux PC using packages from the legacy repositories. Cloud providers are
generally using their own Kubernetes distributions and therefore they don't use
packages provided by the Kubernetes project; more importantly, if someone else is
managing Kubernetes for you, then they would usually take responsibility for that check.
-->
如果你使用**完全托管的** Kubernetes，例如从云提供商获取服务，
那么只有在你还使用旧仓库中的软件包在你的 Linux PC 上安装 `kubectl` 时，
你才会受到此更改的影响。云提供商通常使用他们自己的 Kubernetes 发行版，
因此他们不使用 Kubernetes 项目提供的软件包；更重要的是，如果有其他人为你管理 Kubernetes，
那么他们通常会负责该检查。

<!--
If you have a managed [control plane](/docs/concepts/overview/components/#control-plane-components)
but you are responsible for **managing the nodes yourself**, and any of those nodes run Linux,
you should [check](#check-if-affected) whether you are affected.
-->
如果你使用的是托管的[控制平面](/zh-cn/docs/concepts/overview/components/#control-plane-components)
但你负责**自行管理节点**，并且每个节点都运行 Linux，
你应该[检查](#check-if-affected)你是否会受到影响。

<!--
If you're managing your clusters on your own by following the official installation
and upgrade instructions, please follow the instructions in this blog post to migrate
to the (new) community-owned package repositories.
-->
如果你按照官方的安装和升级说明自己管理你的集群，
请按照本博客文章中的说明迁移到（新的）社区拥有的软件包仓库。

<!--
If you're using a Kubernetes installer that's using packages provided by the
Kubernetes project, please check the installer tool's communication channels for
information about what steps you need to take, and eventually if needed, follow up
with maintainers to let them know about this change.
-->
如果你使用的 Kubernetes 安装程序使用 Kubernetes 项目提供的软件包，
请检查安装程序工具的通信渠道，了解有关你需要采取的步骤的信息，最后如果需要，
请与维护人员联系，让他们了解此更改。

<!--
The following diagram shows who's affected by this change in a visual form
(click on diagram for the larger version):

{{< figure src="/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" alt="Visual explanation of who's affected by the legacy repositories being deprecated and frozen. Textual explanation is available above this diagram." class="diagram-large" link="/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" >}}
-->
下图以可视化形式显示了谁受到此更改的影响（单击图表可查看大图）：

{{< figure src="/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" alt="直观地解释谁受到弃用和冻结的遗留仓库的影响。图上提供了文字解释。" class="diagram-large" link="/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" >}}

<!--
## How does this affect me as a Kubernetes distributor?

If you're using the legacy repositories as part of your project (e.g. a Kubernetes
installer tool), you should migrate to the community-owned repositories as soon as
possible and inform your users about this change and what steps they need to take.
-->
## 这对我作为 Kubernetes 分发商有何影响？  {#how-does-this-affect-me-as-a-kubernetes-distributor}

如果你将旧仓库用作项目的一部分（例如 Kubernetes 安装程序工具），
则应尽快迁移到社区拥有的仓库，并告知用户此更改以及他们需要采取哪些步骤。

<!--
## Timeline of changes

- **15th August 2023:**  
  Kubernetes announces a new, community-managed source for Linux software packages of Kubernetes components
- **31st August 2023:**  
  _(this announcement)_ Kubernetes formally deprecates the legacy
  package repositories
- **13th September 2023** (approximately):  
  Kubernetes will freeze the legacy package repositories,
  (`apt.kubernetes.io` and `yum.kubernetes.io`).
  The freeze will happen immediately following the patch releases that are scheduled for September, 2023.
-->
## 变更时间表  {#timeline-of-changes}

<!-- note to maintainers - the trailing whitespace is significant -->

- **2023 年 8 月 15 日：**  
  Kubernetes 宣布推出一个新的社区管理的 Kubernetes 组件 Linux 软件包源
- **2023 年 8 月 31 日：**  
  **（本公告）** Kubernetes 正式弃用旧版软件包仓库
- **2023 年 9 月 13 日**（左右）：  
  Kubernetes 将冻结旧软件包仓库（`apt.kubernetes.io` 和 `yum.kubernetes.io`）。
  冻结将计划于 2023 年 9 月发布补丁版本后立即进行。

<!--
The Kubernetes patch releases scheduled for September 2023 (v1.28.2, v1.27.6,
v1.26.9, v1.25.14) will have packages published **both** to the community-owned and
the legacy repositories.
-->
计划于 2023 年 9 月发布的 Kubernetes 补丁（v1.28.2、v1.27.6、v1.26.9、v1.25.14）
将把软件包发布到社区拥有的仓库和旧仓库。

<!--
We'll freeze the legacy repositories after cutting the patch releases for September
which means that we'll completely stop publishing packages to the legacy repositories
at that point.
-->
在发布 9 月份的补丁版本后，我们将冻结旧仓库，这意味着届时我们将完全停止向旧仓库发布软件包。

<!--
For the v1.28, v1.27, v1.26, and v1.25 patch releases from October 2023 and onwards,
we'll only publish packages to the new package repositories (`pkgs.k8s.io`).
-->
对于 2023 年 10 月及以后的 v1.28、v1.27、v1.26 和 v1.25 补丁版本，
我们仅将软件包发布到新的软件包仓库 (`pkgs.k8s.io`)。

<!--
### What about future minor releases?

Kubernetes 1.29 and onwards will have packages published **only** to the
community-owned repositories (`pkgs.k8s.io`).
-->
### 未来的次要版本怎么样？  {#what-about-future-minor-releases}

Kubernetes 1.29 及以后的版本将**仅**发布软件包到社区拥有的仓库（`pkgs.k8s.io`）。

<!--
## Can I continue to use the legacy package repositories?

The existing packages in the legacy repositories will be available for the foreseeable
future. However, the Kubernetes project can't provide _any_ guarantees on how long
is that going to be. The deprecated legacy repositories, and their contents, might
be removed at any time in the future and without a further notice period.

**UPDATE**: The legacy packages are expected to go away in January 2024.
-->
## 我可以继续使用旧软件包仓库吗？ {#can-i-continue-to-use-the-legacy-package-repositories}

~~旧仓库中的现有软件包将在可预见的未来内保持可用。然而，
Kubernetes 项目无法对这会持续多久提供**任何**保证。
已弃用的旧仓库及其内容可能会在未来随时删除，恕不另行通知。~~

**更新**: 旧版软件包预计将于 2024 年 1 月被删除。

<!--
The Kubernetes project **strongly recommends** migrating to the new community-owned
repositories **as soon as possible**.
-->
Kubernetes 项目**强烈建议尽快**迁移到新的社区拥有的仓库。

<!--
Given that no new releases will be published to the legacy repositories **after the September 13, 2023**
cut-off point, **you will not be able to upgrade to any patch or minor release made from that date onwards.**
-->
鉴于**在 2023 年 9 月 13 日**截止时间点之后不会向旧仓库发布任何新版本，
**你将无法升级到自该日期起发布的任何补丁或次要版本。**

<!--
Whilst the project makes every effort to release secure software, there may one
day be a high-severity vulnerability in Kubernetes, and consequently an important
release to upgrade to. The advice we're announcing will help you be as prepared for
any future security update, whether trivial or urgent.
-->
尽管该项目会尽一切努力发布安全软件，但有一天 Kubernetes 可能会出现一个高危性漏洞，
因此需要升级到一个重要版本。我们所公开的建议将帮助你为未来的所有安全更新（无论是微不足道的还是紧急的）做好准备。

<!--
## How can I check if I'm using the legacy repositories? {#check-if-affected}

The steps to check if you're using the legacy repositories depend on whether you're
using Debian-based distributions (Debian, Ubuntu, and more) or RPM-based distributions
(CentOS, RHEL, Rocky Linux, and more) in your cluster.

Run these instructions on one of your nodes in the cluster.
-->
## 如何检查我是否正在使用旧仓库？ {#check-if-affected}

检查你是否使用旧仓库的步骤取决于你在集群中使用的是基于
Debian 的发行版（Debian、Ubuntu 等）还是基于 RPM
的发行版（CentOS、RHEL、Rocky Linux 等）。

在集群中的一个节点上运行以下指令。
<!--
### Debian-based Linux distributions

The repository definitions (sources) are located in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`
on Debian-based distributions. Inspect these two locations and try to locate a
package repository definition that looks like:
-->
### 基于 Debian 的 Linux 发行版  {#debian-based-linux-distributions}

在基于 Debian 的发行版上，仓库定义（源）位于`/etc/apt/sources.list`
和 `/etc/apt/sources.list.d/`中。检查这两个位置并尝试找到如下所示的软件包仓库定义：
```
deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main
```

<!--
**If you find a repository definition that looks like this, you're using the legacy repository and you need to migrate.**

If the repository definition uses `pkgs.k8s.io`, you're already using the
community-hosted repositories and you don't need to take any action.
-->
**如果你发现像这样的仓库定义，则你正在使用旧仓库并且需要迁移。**

如果仓库定义使用 `pkgs.k8s.io`，则你已经在使用社区托管的仓库，无需执行任何操作。

<!--
On most systems, this repository definition should be located in
`/etc/apt/sources.list.d/kubernetes.list` (as recommended by the Kubernetes
documentation), but on some systems it might be in a different location.
-->
在大多数系统上，此仓库定义应位于 `/etc/apt/sources.list.d/kubernetes.list`
（按照 Kubernetes 文档的建议），但在某些系统上它可能位于不同的位置。

<!--
If you can't find a repository definition related to Kubernetes, it's likely that you
don't use package managers to install Kubernetes and you don't need to take any action.
-->
如果你找不到与 Kubernetes 相关的仓库定义，
则很可能你没有使用软件包管理器来安装 Kubernetes，因此不需要执行任何操作。

<!--
### RPM-based Linux distributions

The repository definitions are located in `/etc/yum.repos.d` if you're using the
`yum` package manager, or `/etc/dnf/dnf.conf` and `/etc/dnf/repos.d/` if you're using
`dnf` package manager. Inspect those locations and try to locate a package repository
definition that looks like this:
-->
### 基于 RPM 的 Linux 发行版  {#rpm-based-linux-distributions}

如果你使用的是 `yum` 软件包管理器，则仓库定义位于
`/etc/yum.repos.d`，或者 `/etc/dnf/dnf.conf` 和 `/etc/dnf/repos.d/` 
如果你使用的是 `dnf` 软件包管理器。检查这些位置并尝试找到如下所示的软件包仓库定义：
```
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
```

<!--
**If you find a repository definition that looks like this, you're using the legacy repository and you need to migrate.**

If the repository definition uses `pkgs.k8s.io`, you're already using the
community-hosted repositories and you don't need to take any action.
-->
**如果你发现像这样的仓库定义，则你正在使用旧仓库并且需要迁移。**

如果仓库定义使用 `pkgs.k8s.io`，则你已经在使用社区托管的仓库，无需执行任何操作。

<!--
On most systems, that repository definition should be located in `/etc/yum.repos.d/kubernetes.repo`
(as recommended by the Kubernetes documentation), but on some systems it might be
in a different location.
-->
在大多数系统上，该仓库定义应位于 `/etc/yum.repos.d/kubernetes.repo`
（按照 Kubernetes 文档的建议），但在某些系统上它可能位于不同的位置。

<!--
If you can't find a repository definition related to Kubernetes, it's likely that you
don't use package managers to install Kubernetes and you don't need to take any action.
-->
如果你找不到与 Kubernetes 相关的仓库定义，则很可能你没有使用软件包管理器来安装
Kubernetes，那么你不需要执行任何操作。

<!--
## How can I migrate to the new community-operated repositories?

For more information on how to migrate to the new community
managed packages, please refer to the
[announcement blog post for `pkgs.k8s.io`](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
## 我如何迁移到新的社区运营的仓库？  {#how-can-i-migrate-to-the-new-community-operated-repositories}

有关如何迁移到新的社区管理软件包的更多信息，请参阅
[`pkgs.k8s.io`的公告博客文章](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/) 。

<!--
## Why is the Kubernetes project making this change?

Kubernetes has been publishing packages solely to the Google-hosted repository
since Kubernetes v1.5, or the past **seven** years! Following in the footsteps of
migrating to our community-managed registry, `registry.k8s.io`, we are now migrating the
Kubernetes package repositories to our own community-managed infrastructure. We’re
thankful to Google for their continuous hosting and support all these years, but
this transition marks another big milestone for the project’s goal of migrating
to complete community-owned infrastructure.
-->
## 为什么 Kubernetes 项目要做出这样的改变？  {#why-is-the-kubernetes-project-making-this-change}

自 Kubernetes v1.5 或过去**七**年以来，Kubernetes 一直只将软件包发布到 
Google 托管的仓库！继迁移到社区管理的注册表 `registry.k8s.io` 之后，
我们现在正在将 Kubernetes 软件包仓库迁移到我们自己的社区管理的基础设施。
我们感谢 Google 这些年来持续的托管和支持，
但这一转变标志着该项目迁移到完全由社区拥有的基础设施的目标的又一个重要里程碑。

<!--
## Is there a Kubernetes tool to help me migrate?

We don't have any announcement to make about tooling there. As a Kubernetes user, you
have to manually modify your configuration to use the new repositories. Automating
the migration from the legacy to the community-owned repositories is technically
challenging and we want to avoid any potential risks associated with this.
-->
## 有 Kubernetes 工具可以帮助我迁移吗？ {#is-there-a-kubernetes-tool-to-help-me-migrate}

关于迁移工具方面，我们目前没有任何公告。作为 Kubernetes 用户，
你必须手动修改配置才能使用新仓库。自动从旧仓库迁移到社区拥有的仓库在技术上具有挑战性，
我们希望避免与此相关的任何潜在风险。

<!--
## Acknowledgments

First of all, we want to acknowledge the contributions from Alphabet. Staff at Google
have provided their time; Google as a business has provided both the infrastructure
to serve packages, and the security context for giving those packages trustworthy
digital signatures.
These have been important to the adoption and growth of Kubernetes.
-->
## 致谢  {#acknowledgments}

首先，我们要感谢 Alphabet 的贡献。Google 的员工投入了他们的时间；
作为一家企业，谷歌既提供了服务于软件包的基础设施，也提供了为这些软件包提供可信数字签名的安全上下文。
这些对于 Kubernetes 的采用和成长非常重要。

<!--
Releasing software might not be glamorous but it's important. Many people within
the Kubernetes contributor community have contributed to the new way that we, as a
project, have for building and publishing packages.
-->
发布软件可能并不那么引人注目，但很重要。Kubernetes
贡献者社区中的许多人都为我们作为一个项目构建和发布软件包的新方法做出了贡献。

<!--
And finally, we want to once again acknowledge the help from SUSE. OpenBuildService,
from SUSE, is the technology that the powers the new community-managed package repositories.
-->
最后，我们要再次感谢 SUSE 的帮助。SUSE 的 OpenBuildService
为新的社区管理的软件包仓库提供支持的技术。
