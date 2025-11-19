---
layout: blog
title: "Kubernetes 舊版軟件包倉庫將於 2023 年 9 月 13 日被凍結"
date: 2023-08-31T15:30:00-07:00
slug: legacy-package-repository-deprecation
evergreen: true
author: >
  Bob Killen (Google),
  Chris Short (AWS),
  Jeremy Rickard (Microsoft),
  Marko Mudrinić (Kubermatic),
  Tim Bannister (The Scale Factory)
translator: >
  [Mengjiao Liu](https://github.com/mengjiao-liu) (DaoCloud)
---

<!--
layout: blog
title: "Kubernetes Legacy Package Repositories Will Be Frozen On September 13, 2023"
date: 2023-08-31T15:30:00-07:00
slug: legacy-package-repository-deprecation
evergreen: true
author: >
  Bob Killen (Google),
  Chris Short (AWS),
  Jeremy Rickard (Microsoft),
  Marko Mudrinić (Kubermatic),
  Tim Bannister (The Scale Factory)
-->

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

2023 年 8 月 15 日，Kubernetes 項目宣佈社區擁有的 Debian 和 RPM
軟件包倉庫在 `pkgs.k8s.io` 上正式提供。新的軟件包倉庫將取代舊的由
Google 託管的軟件包倉庫：`apt.kubernetes.io` 和 `yum.kubernetes.io`。
[`pkgs.k8s.io` 的公告博客文章](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)強調我們未來將停止將軟件包發佈到舊倉庫。

<!--
Today, we're formally deprecating the legacy package repositories (`apt.kubernetes.io`
and `yum.kubernetes.io`), and we're announcing our plans to freeze the contents of
the repositories as of **September 13, 2023**.
-->
今天，我們正式棄用舊軟件包倉庫（`apt.kubernetes.io` 和 `yum.kubernetes.io`），
並且宣佈我們計劃在 **2023 年 9 月 13 日** 凍結倉庫的內容。

<!--
Please continue reading in order to learn what does this mean for you as an user or
distributor, and what steps you may need to take.
-->
請繼續閱讀以瞭解這對於作爲用戶或分發商的你意味着什麼，
以及你可能需要採取哪些步驟。

<!--
**ℹ Update (March 26, 2024): _the legacy Google-hosted repositories went
away on March 4, 2024. It's not possible to install Kubernetes packages from
the legacy Google-hosted package repositories any longer._**
-->
**i 更新（2024 年 3 月 26 日)：舊 Google 託管倉庫已於 2024 年 3 月 4 日下線。
現在無法再從舊 Google 託管軟件包倉庫安裝 Kubernetes 軟件包。**

<!--
## How does this affect me as a Kubernetes end user?

This change affects users **directly installing upstream versions of Kubernetes**,
either manually by following the official
[installation](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) and
[upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) instructions, or
by **using a Kubernetes installer** that's using packages provided by the Kubernetes
project.
-->
## 作爲 Kubernetes 最終用戶，這對我有何影響？ {#how-does-this-affect-me-as-a-kubernetes-end-user}

此更改影響**直接安裝 Kubernetes 的上游版本**的用戶，
無論是按照官方手動[安裝](/zh-cn/docs/setup/生產環境/工具/kubeadm/install-kubeadm/)
和[升級](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)說明，
還是通過**使用 Kubernetes 安裝工具**，該安裝工具使用 Kubernetes 項目提供的軟件包。

<!--
**This change also affects you if you run Linux on your own PC and have installed `kubectl` using the legacy package repositories**.
We'll explain later on how to [check](#check-if-affected) if you're affected.
-->
**如果你在自己的 PC 上運行 Linux 並使用舊軟件包倉庫安裝了 `kubectl`，則此更改也會影響你**。
我們稍後將解釋如何[檢查](#check-if-affected)是否你會受到影響。

<!--
If you use **fully managed** Kubernetes, for example through a service from a cloud
provider, you would only be affected by this change if you also installed `kubectl`
on your Linux PC using packages from the legacy repositories. Cloud providers are
generally using their own Kubernetes distributions and therefore they don't use
packages provided by the Kubernetes project; more importantly, if someone else is
managing Kubernetes for you, then they would usually take responsibility for that check.
-->
如果你使用**完全託管的** Kubernetes，例如從雲提供商獲取服務，
那麼只有在你還使用舊倉庫中的軟件包在你的 Linux PC 上安裝 `kubectl` 時，
你纔會受到此更改的影響。雲提供商通常使用他們自己的 Kubernetes 發行版，
因此他們不使用 Kubernetes 項目提供的軟件包；更重要的是，如果有其他人爲你管理 Kubernetes，
那麼他們通常會負責該檢查。

<!--
If you have a managed [control plane](/docs/concepts/architecture/#control-plane-components)
but you are responsible for **managing the nodes yourself**, and any of those nodes run Linux,
you should [check](#check-if-affected) whether you are affected.
-->
如果你使用的是託管的[控制平面](/zh-cn/docs/concepts/architecture/#control-plane-components)
但你負責**自行管理節點**，並且每個節點都運行 Linux，
你應該[檢查](#check-if-affected)你是否會受到影響。

<!--
If you're managing your clusters on your own by following the official installation
and upgrade instructions, please follow the instructions in this blog post to migrate
to the (new) community-owned package repositories.
-->
如果你按照官方的安裝和升級說明自己管理你的集羣，
請按照本博客文章中的說明遷移到（新的）社區擁有的軟件包倉庫。

<!--
If you're using a Kubernetes installer that's using packages provided by the
Kubernetes project, please check the installer tool's communication channels for
information about what steps you need to take, and eventually if needed, follow up
with maintainers to let them know about this change.
-->
如果你使用的 Kubernetes 安裝程序使用 Kubernetes 項目提供的軟件包，
請檢查安裝程序工具的通信渠道，瞭解有關你需要採取的步驟的信息，最後如果需要，
請與維護人員聯繫，讓他們瞭解此更改。

<!--
The following diagram shows who's affected by this change in a visual form
(click on diagram for the larger version):

{{< figure src="/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" alt="Visual explanation of who's affected by the legacy repositories being deprecated and frozen. Textual explanation is available above this diagram." class="diagram-large" link="/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" >}}
-->
下圖以可視化形式顯示了誰受到此更改的影響（單擊圖表可查看大圖）：

{{< figure src="/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" alt="直觀地解釋誰受到棄用和凍結的遺留倉庫的影響。圖上提供了文字解釋。" class="diagram-large" link="/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/flow.svg" >}}

<!--
## How does this affect me as a Kubernetes distributor?

If you're using the legacy repositories as part of your project (e.g. a Kubernetes
installer tool), you should migrate to the community-owned repositories as soon as
possible and inform your users about this change and what steps they need to take.
-->
## 這對我作爲 Kubernetes 分發商有何影響？  {#how-does-this-affect-me-as-a-kubernetes-distributor}

如果你將舊倉庫用作項目的一部分（例如 Kubernetes 安裝程序工具），
則應儘快遷移到社區擁有的倉庫，並告知用戶此更改以及他們需要採取哪些步驟。

<!--
## Timeline of changes

_(updated on March 26, 2024)_

- **15th August 2023:**  
  Kubernetes announces a new, community-managed source for Linux software packages of Kubernetes components
- **31st August 2023:**  
  _(this announcement)_ Kubernetes formally deprecates the legacy
  package repositories
- **13th September 2023** (approximately):  
  Kubernetes will freeze the legacy package repositories,
  (`apt.kubernetes.io` and `yum.kubernetes.io`).
  The freeze will happen immediately following the patch releases that are scheduled for September, 2023.
- **12th January 2024:**  
  Kubernetes announced intentions to remove the legacy package repositories in January 2024
- **4th March 2024:**  
  The legacy package repositories have been removed. It's not possible to install Kubernetes packages from
  the legacy package repositories any longer
-->
## 變更時間表  {#timeline-of-changes}

<!-- note to maintainers - the trailing whitespace is significant -->
**（更新於 2024 年 3 月 26 日）**

- **2023 年 8 月 15 日：**  
  Kubernetes 宣佈推出一個新的社區管理的 Kubernetes 組件 Linux 軟件包源
- **2023 年 8 月 31 日：**  
  **（本公告）** Kubernetes 正式棄用舊版軟件包倉庫
- **2023 年 9 月 13 日**（左右）：  
  Kubernetes 將凍結舊軟件包倉庫（`apt.kubernetes.io` 和 `yum.kubernetes.io`）。
  凍結將計劃於 2023 年 9 月發佈補丁版本後立即進行。
- **2024 年 1 月 12 日：**  
  Kubernetes 宣佈計劃在 2024 年 1 月移除舊軟件包倉庫。  
- **2024 年 3 月 4 日：**  
  舊軟件包倉庫已被移除，現在無法再從舊軟件包倉庫安裝 Kubernetes 軟件包。  

<!--
The Kubernetes patch releases scheduled for September 2023 (v1.28.2, v1.27.6,
v1.26.9, v1.25.14) will have packages published **both** to the community-owned and
the legacy repositories.
-->
計劃於 2023 年 9 月發佈的 Kubernetes 補丁（v1.28.2、v1.27.6、v1.26.9、v1.25.14）
將把軟件包發佈到社區擁有的倉庫和舊倉庫。

<!--
We'll freeze the legacy repositories after cutting the patch releases for September
which means that we'll completely stop publishing packages to the legacy repositories
at that point.
-->
在發佈 9 月份的補丁版本後，我們將凍結舊倉庫，這意味着屆時我們將完全停止向舊倉庫發佈軟件包。

<!--
For the v1.28, v1.27, v1.26, and v1.25 patch releases from October 2023 and onwards,
we'll only publish packages to the new package repositories (`pkgs.k8s.io`).
-->
對於 2023 年 10 月及以後的 v1.28、v1.27、v1.26 和 v1.25 補丁版本，
我們僅將軟件包發佈到新的軟件包倉庫 (`pkgs.k8s.io`)。

<!--
### What about future minor releases?

Kubernetes 1.29 and onwards will have packages published **only** to the
community-owned repositories (`pkgs.k8s.io`).
-->
### 未來的次要版本怎麼樣？  {#what-about-future-minor-releases}

Kubernetes 1.29 及以後的版本將**僅**發佈軟件包到社區擁有的倉庫（`pkgs.k8s.io`）。

<!--
### What releases are available in the new community-owned package repositories?

Linux packages for releases starting from Kubernetes v1.24.0 are available in the 
Kubernetes package repositories (`pkgs.k8s.io`). Kubernetes does not have official
Linux packages available for earlier releases of Kubernetes; however, your Linux
distribution may provide its own packages.
-->
### 新的社區擁有的軟件包倉庫提供哪些可用的軟件包版本？ {#what-releases-are-available-in-the-new-community-owned-package-repositories}

Kubernetes 軟件包倉庫（`pkgs.k8s.io`）提供從 Kubernetes v1.24.0 版本開始的 Linux 軟件包。
Kubernetes 官方沒有爲早期的 Kubernetes 版本提供可用的 Linux 軟件包，但你的 Linux 發行版可能會提供其自有的軟件包。  

<!--
## Can I continue to use the legacy package repositories?

_(updated on March 26, 2024)_

**The legacy Google-hosted repositories went away on March 4, 2024. It's not possible
to install Kubernetes packages from the legacy Google-hosted package repositories any
longer.**

The existing packages in the legacy repositories will be available for the foreseeable
future. However, the Kubernetes project can't provide _any_ guarantees on how long
is that going to be. The deprecated legacy repositories, and their contents, might
be removed at any time in the future and without a further notice period.
-->
## 我可以繼續使用舊軟件包倉庫嗎？ {#can-i-continue-to-use-the-legacy-package-repositories}

**（更新於 2024 年 3 月 26 日）**

**舊 Google 託管軟件包倉庫已於 2024 年 3 月 4 日下線。
現在無法再從舊 Google 託管軟件包倉庫安裝 Kubernetes 軟件包。**  

~~舊倉庫中的現有軟件包將在可預見的未來內保持可用。然而，
Kubernetes 項目無法對這會持續多久提供**任何**保證。
已棄用的舊倉庫及其內容可能會在未來隨時刪除，恕不另行通知。~~

<!--
~~The Kubernetes project **strongly recommends** migrating to the new community-owned
repositories **as soon as possible**.~~ Migrating to the new package repositories is
required to consume the official Kubernetes packages.
-->
~~Kubernetes 項目**強烈建議儘快**遷移到新的社區擁有的倉庫。~~
要使用 Kubernetes 官方軟件包，需要遷移到新的軟件包倉庫。  

<!--
Given that no new releases will be published to the legacy repositories **after the September 13, 2023**
cut-off point, **you will not be able to upgrade to any patch or minor release made from that date onwards.**
-->
鑑於**在 2023 年 9 月 13 日**截止時間點之後不會向舊倉庫發佈任何新版本，
**你將無法升級到自該日期起發佈的任何補丁或次要版本。**

<!--
Whilst the project makes every effort to release secure software, there may one
day be a high-severity vulnerability in Kubernetes, and consequently an important
release to upgrade to. The advice we're announcing will help you be as prepared for
any future security update, whether trivial or urgent.
-->
儘管該項目會盡一切努力發佈安全軟件，但有一天 Kubernetes 可能會出現一個高危性漏洞，
因此需要升級到一個重要版本。我們所公開的建議將幫助你爲未來的所有安全更新（無論是微不足道的還是緊急的）做好準備。

<!--
## How can I check if I'm using the legacy repositories? {#check-if-affected}

The steps to check if you're using the legacy repositories depend on whether you're
using Debian-based distributions (Debian, Ubuntu, and more) or RPM-based distributions
(CentOS, RHEL, Rocky Linux, and more) in your cluster.

Run these instructions on one of your nodes in the cluster.
-->
## 如何檢查我是否正在使用舊倉庫？ {#check-if-affected}

檢查你是否使用舊倉庫的步驟取決於你在集羣中使用的是基於
Debian 的發行版（Debian、Ubuntu 等）還是基於 RPM
的發行版（CentOS、RHEL、Rocky Linux 等）。

在集羣中的一個節點上運行以下指令。
<!--
### Debian-based Linux distributions

The repository definitions (sources) are located in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`
on Debian-based distributions. Inspect these two locations and try to locate a
package repository definition that looks like:
-->
### 基於 Debian 的 Linux 發行版  {#debian-based-linux-distributions}

在基於 Debian 的發行版上，倉庫定義（源）位於`/etc/apt/sources.list`
和 `/etc/apt/sources.list.d/`中。檢查這兩個位置並嘗試找到如下所示的軟件包倉庫定義：
```
deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main
```

<!--
**If you find a repository definition that looks like this, you're using the legacy repository and you need to migrate.**

If the repository definition uses `pkgs.k8s.io`, you're already using the
community-hosted repositories and you don't need to take any action.
-->
**如果你發現像這樣的倉庫定義，則你正在使用舊倉庫並且需要遷移。**

如果倉庫定義使用 `pkgs.k8s.io`，則你已經在使用社區託管的倉庫，無需執行任何操作。

<!--
On most systems, this repository definition should be located in
`/etc/apt/sources.list.d/kubernetes.list` (as recommended by the Kubernetes
documentation), but on some systems it might be in a different location.
-->
在大多數系統上，此倉庫定義應位於 `/etc/apt/sources.list.d/kubernetes.list`
（按照 Kubernetes 文檔的建議），但在某些系統上它可能位於不同的位置。

<!--
If you can't find a repository definition related to Kubernetes, it's likely that you
don't use package managers to install Kubernetes and you don't need to take any action.
-->
如果你找不到與 Kubernetes 相關的倉庫定義，
則很可能你沒有使用軟件包管理器來安裝 Kubernetes，因此不需要執行任何操作。

<!--
### RPM-based Linux distributions

The repository definitions are located in `/etc/yum.repos.d` if you're using the
`yum` package manager, or `/etc/dnf/dnf.conf` and `/etc/dnf/repos.d/` if you're using
`dnf` package manager. Inspect those locations and try to locate a package repository
definition that looks like this:
-->
### 基於 RPM 的 Linux 發行版  {#rpm-based-linux-distributions}

如果你使用的是 `yum` 軟件包管理器，則倉庫定義位於
`/etc/yum.repos.d`，或者 `/etc/dnf/dnf.conf` 和 `/etc/dnf/repos.d/` 
如果你使用的是 `dnf` 軟件包管理器。檢查這些位置並嘗試找到如下所示的軟件包倉庫定義：
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
**如果你發現像這樣的倉庫定義，則你正在使用舊倉庫並且需要遷移。**

如果倉庫定義使用 `pkgs.k8s.io`，則你已經在使用社區託管的倉庫，無需執行任何操作。

<!--
On most systems, that repository definition should be located in `/etc/yum.repos.d/kubernetes.repo`
(as recommended by the Kubernetes documentation), but on some systems it might be
in a different location.
-->
在大多數系統上，該倉庫定義應位於 `/etc/yum.repos.d/kubernetes.repo`
（按照 Kubernetes 文檔的建議），但在某些系統上它可能位於不同的位置。

<!--
If you can't find a repository definition related to Kubernetes, it's likely that you
don't use package managers to install Kubernetes and you don't need to take any action.
-->
如果你找不到與 Kubernetes 相關的倉庫定義，則很可能你沒有使用軟件包管理器來安裝
Kubernetes，那麼你不需要執行任何操作。

<!--
## How can I migrate to the new community-operated repositories?

For more information on how to migrate to the new community
managed packages, please refer to the
[announcement blog post for `pkgs.k8s.io`](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
## 我如何遷移到新的社區運營的倉庫？  {#how-can-i-migrate-to-the-new-community-operated-repositories}

有關如何遷移到新的社區管理軟件包的更多信息，請參閱
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
## 爲什麼 Kubernetes 項目要做出這樣的改變？  {#why-is-the-kubernetes-project-making-this-change}

自 Kubernetes v1.5 或過去**七**年以來，Kubernetes 一直只將軟件包發佈到 
Google 託管的倉庫！繼遷移到社區管理的註冊表 `registry.k8s.io` 之後，
我們現在正在將 Kubernetes 軟件包倉庫遷移到我們自己的社區管理的基礎設施。
我們感謝 Google 這些年來持續的託管和支持，
但這一轉變標誌着該項目遷移到完全由社區擁有的基礎設施的目標的又一個重要里程碑。

<!--
## Is there a Kubernetes tool to help me migrate?

We don't have any announcement to make about tooling there. As a Kubernetes user, you
have to manually modify your configuration to use the new repositories. Automating
the migration from the legacy to the community-owned repositories is technically
challenging and we want to avoid any potential risks associated with this.
-->
## 有 Kubernetes 工具可以幫助我遷移嗎？ {#is-there-a-kubernetes-tool-to-help-me-migrate}

關於遷移工具方面，我們目前沒有任何公告。作爲 Kubernetes 用戶，
你必須手動修改配置才能使用新倉庫。自動從舊倉庫遷移到社區擁有的倉庫在技術上具有挑戰性，
我們希望避免與此相關的任何潛在風險。

<!--
## Acknowledgments

First of all, we want to acknowledge the contributions from Alphabet. Staff at Google
have provided their time; Google as a business has provided both the infrastructure
to serve packages, and the security context for giving those packages trustworthy
digital signatures.
These have been important to the adoption and growth of Kubernetes.
-->
## 致謝  {#acknowledgments}

首先，我們要感謝 Alphabet 的貢獻。Google 的員工投入了他們的時間；
作爲一家企業，谷歌既提供了服務於軟件包的基礎設施，也提供了爲這些軟件包提供可信數字簽名的安全上下文。
這些對於 Kubernetes 的採用和成長非常重要。

<!--
Releasing software might not be glamorous but it's important. Many people within
the Kubernetes contributor community have contributed to the new way that we, as a
project, have for building and publishing packages.
-->
發佈軟件可能並不那麼引人注目，但很重要。Kubernetes
貢獻者社區中的許多人都爲我們作爲一個項目構建和發佈軟件包的新方法做出了貢獻。

<!--
And finally, we want to once again acknowledge the help from SUSE. OpenBuildService,
from SUSE, is the technology that the powers the new community-managed package repositories.
-->
最後，我們要再次感謝 SUSE 的幫助。SUSE 的 OpenBuildService
爲新的社區管理的軟件包倉庫提供支持的技術。
