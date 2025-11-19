---
layout: blog
title: "pkgs.k8s.io：介紹 Kubernetes 社區自有的包倉庫"
date: 2023-08-15T20:00:00+0000
slug: pkgs-k8s-io-introduction
author: >
  Marko Mudrinić (Kubermatic)
translator: >
  Wilson Wu (DaoCloud)
---
<!--
layout: blog
title: "pkgs.k8s.io: Introducing Kubernetes Community-Owned Package Repositories"
date: 2023-08-15T20:00:00+0000
slug: pkgs-k8s-io-introduction
author: >
  Marko Mudrinić (Kubermatic)
-->

<!--
On behalf of Kubernetes SIG Release, I am very excited to introduce the
Kubernetes community-owned software
repositories for Debian and RPM packages: `pkgs.k8s.io`! The new package
repositories are replacement for the Google-hosted package repositories
(`apt.kubernetes.io` and `yum.kubernetes.io`) that we've been using since
Kubernetes v1.5.
-->
我很高興代表 Kubernetes SIG Release 介紹 Kubernetes
社區自有的 Debian 和 RPM 軟件倉庫：`pkgs.k8s.io`！
這些全新的倉庫取代了我們自 Kubernetes v1.5 以來一直使用的託管在
Google 的倉庫（`apt.kubernetes.io` 和 `yum.kubernetes.io`）。

<!--
This blog post contains information about these new package repositories,
what does it mean to you as an end user, and how to migrate to the new
repositories.
-->
這篇博文包含關於這些新的包倉庫的信息、它對最終使用者意味着什麼以及如何遷移到新倉庫。

<!--
**ℹ️ Update (March 26, 2024): _the legacy Google-hosted repositories went
away on March 4, 2024. It's not possible to install Kubernetes packages from
the legacy Google-hosted package repositories any longer._**
Check out [the deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
for more details about this change.
-->
**ℹ️ 更新（2024 年 3 月 26 日）：舊版託管在 Google 的倉庫於 2024 年 3 月 4 日停用。
你不能再從舊版託管在 Google 的包倉庫中安裝 Kubernetes 包。**
查看[棄用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)瞭解本次變更的更多細節。

<!--
## What you need to know about the new package repositories?
-->
## 關於新的包倉庫，你需要了解哪些信息？ {#what-you-need-to-know-about-the-new-package-repositories}

<!--
_(updated on January 12, 2024 and March 26, 2024)_
-->
**（更新於 2024 年 1 月 12 日和 3 月 26 日）**

<!--
- This is an **opt-in change**; you're required to manually migrate from the
  Google-hosted repository to the Kubernetes community-owned repositories.
  See [how to migrate](#how-to-migrate) later in this announcement for migration information
  and instructions.
-->
- 這是一個**明確同意的更改**；你需要手動從託管在 Google 的倉庫遷移到
  Kubernetes 社區自有的倉庫。請參閱本公告後面的[如何遷移](#how-to-migrate)，
  瞭解遷移信息和說明。

<!--
- **The legacy Google-hosted package repositories went away on March 4, 2024. It's not possible
  to install Kubernetes packages from the legacy Google-hosted package repositories any longer.**
  These repositories have been **deprecated as of August 31, 2023**, and **frozen as of September 13, 2023**.
  Check out the [deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
  for more details about this change.
-->
- **舊版託管在 Google 的包倉庫於 2024 年 3 月 4 日停用。
  你不能再從舊版託管在 Google 的包倉庫中安裝 Kubernetes 包。**
  這些倉庫**自 2023 年 8 月 31 日起被棄用** ，並**自 2023 年 9 月 13 日被凍結** 。  
  有關此變更的更多細節請查閱[棄用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)。

<!--
- ~~**The legacy Google-hosted package repositories are going away in January 2024.** These repositories
  have been **deprecated as of August 31, 2023**, and **frozen as of September 13, 2023**.
  Check out the [deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
  for more details about this change.~~
-->
- ~~**舊版託管在 Google 的包倉庫在 2024 年 1 月停用。**
  這些倉庫自 **2023 年 8 月 31 日起被棄用**，並且 **自 2023 年 9 月 13 日起被凍結**。
  有關此更改的更多細節請查閱[棄用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)。~~

<!--
- ~~The existing packages in the legacy repositories will be available for the foreseeable future.
  However, the Kubernetes project can't provide any guarantees on how long is that going to be.
  The deprecated legacy repositories, and their contents, might be removed at any time in the future
  and without a further notice period. **The legacy package repositories are going away in
  January 2024.**~~ **The legacy Google-hosted package repositories went away on March 4, 2024.**
-->
- ~~舊倉庫中的現有包將在可預見的未來一段時間內可用。
  然而，Kubernetes 項目無法保證這會持續多久。
  已棄用的舊倉庫及其內容可能會在未來隨時被刪除，恕不另行通知。
  **舊版包倉庫於 2024 年 1 月停用。**~~
  **舊版託管在 Google 上的包倉庫於 2024 年 3 月 4 日停用。**

<!--
- Given that no new releases will be published to the legacy repositories after
  the September 13, 2023 cut-off point, you will not be able to upgrade to any patch or minor
  release made from that date onwards if you don't migrate to the new Kubernetes package repositories.
  ~~That said, we recommend migrating to the new Kubernetes package repositories **as soon as possible**.~~
  Migrating to the new Kubernetes package repositories is required to consume the official Kubernetes
  packages.
-->
- 鑑於在 2023 年 9 月 13 日這個截止時間點之後不會向舊倉庫發佈任何新版本，
  如果你不在該截止時間點遷移至新的 Kubernetes 倉庫，
  你將無法升級到該日期之後發佈的任何補丁或次要版本。
  ~~也就是說，我們建議**儘快**遷移到新的 Kubernetes 倉庫。~~
  你需要遷移到新的 Kubernetes 包倉庫，才能使用官方 Kubernetes 包。

<!--
- **The new Kubernetes package repositories contain packages beginning with those
  Kubernetes versions that were still under support when the community took
  over the package builds. This means that the new package repositories have Linux packages for all
  Kubernetes releases starting with v1.24.0.**
-->
- **新的 Kubernetes 倉庫中包含社區開始接管包構建以來仍在支持的 Kubernetes 版本的包。
  這意味着 v1.24.0 之前的任何內容都只存在於託管在 Google 的倉庫中。
  這意味着新的包倉庫將爲從 v1.24.0 開始的所有 Kubernetes 版本提供 Linux 包。**

<!--
- Kubernetes does not have official Linux packages available for earlier releases of Kubernetes;
  however, your Linux distribution may provide its own packages.
-->
- Kubernetes 沒有爲早期版本提供官方的 Linux 包；然而，你的 Linux 發行版可能會提供自己的包。

<!--
- There's a dedicated package repository for each Kubernetes minor version.
  When upgrading to a different minor release, you must bear in mind that
  the package repository details also change. Check out
  [Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)
  guide for information about steps that you need to take upon upgrading the Kubernetes minor version.
-->
- 每個 Kubernetes 次要版本都有一個專用的倉庫。
  當升級到不同的次要版本時，你必須記住，倉庫詳細信息也會發生變化。
  查閱[變更 Kubernetes 包倉庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)指南，
  瞭解升級 Kubernetes 次要版本時需要採取的步驟信息。

<!--
## Why are we introducing new package repositories?
-->
## 爲什麼我們要引入新的包倉庫？ {#why-are-we-introducing-new-package-repositories}

<!--
As the Kubernetes project is growing, we want to ensure the best possible
experience for the end users. The Google-hosted repository has been serving
us well for many years, but we started facing some problems that require
significant changes to how we publish packages. Another goal that we have is to
use community-owned infrastructure for all critical components and that
includes package repositories.
-->
隨着 Kubernetes 項目的不斷發展，我們希望確保最終使用者獲得最佳體驗。
託管在 Google 的倉庫多年來一直爲我們提供良好的服務，
但我們開始面臨一些問題，需要對發佈包的方式進行重大變更。
我們的另一個目標是對所有關鍵組件使用社區擁有的基礎設施，其中包括倉庫。

<!--
Publishing packages to the Google-hosted repository is a manual process that
can be done only by a team of Google employees called
[Google Build Admins](/releases/release-managers/#build-admins).
[The Kubernetes Release Managers team](/releases/release-managers/#release-managers)
is a very diverse team especially in terms of timezones that we work in.
Given this constraint, we have to do very careful planning for every release to
ensure that we have both Release Manager and Google Build Admin available to 
carry out the release.
-->
將包發佈到託管在 Google 的倉庫是一個手動過程，
只能由名爲 [Google 構建管理員](/zh-cn/releases/release-managers/#build-admins)的 Google 員工團隊來完成。
[Kubernetes 發佈管理員團隊](/zh-cn/releases/release-managers/#release-managers)是一個非常多元化的團隊，
尤其是在我們工作的時區方面。考慮到這一限制，我們必須對每個版本進行非常仔細的規劃，
確保我們有發佈經理和 Google 構建管理員來執行發佈。

<!--
Another problem is that we only have a single package repository. Because of
this, we were not able to publish packages for prerelease versions (alpha,
beta, and rc). This made testing Kubernetes prereleases harder for anyone who
is interested to do so. The feedback that we receive from people testing these
releases is critical to ensure the best quality of releases, so we want to make
testing these releases as easy as possible. On top of that, having only one
repository limited us when it comes to publishing dependencies like `cri-tools`
and `kubernetes-cni`.
-->
另一個問題是由於我們只有一個包倉庫。因此，我們無法發佈預發行版本
（Alpha、Beta 和 RC）的包。這使得任何有興趣測試的人都更難測試 Kubernetes 預發佈版本。
我們從測試這些版本的人員那裏收到的反饋對於確保版本的最佳質量至關重要，
因此我們希望儘可能輕鬆地測試這些版本。最重要的是，只有一個倉庫限制了我們對
`cri-tools` 和 `kubernetes-cni` 等依賴進行發佈，

<!--
Regardless of all these issues, we're very thankful to Google and Google Build
Admins for their involvement, support, and help all these years!
-->
儘管存在這些問題，我們仍非常感謝 Google 和 Google 構建管理員這些年來的參與、支持和幫助！

<!--
## How the new package repositories work?
-->
## 新的包倉庫如何工作？ {#how-the-new-package-repositories-work}

<!--
The new package repositories are hosted at `pkgs.k8s.io` for both Debian and
RPM packages. At this time, this domain points to a CloudFront CDN backed by S3
bucket that contains repositories and packages. However, we plan on onboarding
additional mirrors in the future, giving possibility for other companies to
help us with serving packages.
-->
新的 Debian 和 RPM 倉庫託管在 `pkgs.k8s.io`。
目前，該域指向一個 CloudFront CDN，其後是包含倉庫和包的 S3 存儲桶。
然而，我們計劃在未來添加更多的映像檔站點，讓其他公司有可能幫助我們提供軟件包服務。

<!--
Packages are built and published via the [OpenBuildService (OBS) platform](http://openbuildservice.org).
After a long period of evaluating different solutions, we made a decision to
use OpenBuildService as a platform to manage our repositories and packages.
First of all, OpenBuildService is an open source platform used by a large
number of open source projects and companies, like openSUSE, VideoLAN,
Dell, Intel, and more. OpenBuildService has many features making it very
flexible and easy to integrate with our existing release tooling. It also
allows us to build packages in a similar way as for the Google-hosted
repository making the migration process as seamless as possible.
-->
包通過 [OpenBuildService（OBS）平臺](http://openbuildservice.org)構建和發佈。
經過長時間評估不同的解決方案後，我們決定使用 OpenBuildService 作爲管理倉庫和包的平臺。
首先，OpenBuildService 是一個開源平臺，被大量開源項目和公司使用，
如 openSUSE、VideoLAN、Dell、Intel 等。OpenBuildService 具有許多功能，
使其非常靈活且易於與我們現有的發佈工具集成。
它還允許我們以與託管在 Google 的倉庫類似的方式構建包，從而使遷移過程儘可能無縫。

<!--
SUSE sponsors the Kubernetes project with access to their reference
OpenBuildService setup ([`build.opensuse.org`](http://build.opensuse.org)) and
with technical support to integrate OBS with our release processes.
-->
SUSE 贊助 Kubernetes 項目並且支持訪問其引入的 OpenBuildService 環境
（[`build.opensuse.org`](http://build.opensuse.org)），
還提供將 OBS 與我們的發佈流程集成的技術支持。

<!--
We use SUSE's OBS instance for building and publishing packages. Upon building
a new release, our tooling automatically pushes needed artifacts and 
package specifications to `build.opensuse.org`. That will trigger the build
process that's going to build packages for all supported architectures (AMD64,
ARM64, PPC64LE, S390X). At the end, generated packages will be automatically
pushed to our community-owned S3 bucket making them available to all users.
-->
我們使用 SUSE 的 OBS 實例來構建和發佈包。構建新版本後，
我們的工具會自動將所需的製品和包設置推送到 `build.opensuse.org`。
這將觸發構建過程，爲所有支持的架構（AMD64、ARM64、PPC64LE、S390X）構建包。
最後，生成的包將自動推送到我們社區擁有的 S3 存儲桶，以便所有使用者都可以使用它們。

<!--
We want to take this opportunity to thank SUSE for allowing us to use
`build.opensuse.org` and their generous support to make this integration
possible!
-->
我們想藉此機會感謝 SUSE 允許我們使用 `build.opensuse.org`
以及他們的慷慨支持，使這種集成成爲可能！

<!--
## What are significant differences between the Google-hosted and Kubernetes package repositories?
-->
## 託管在 Google 的倉庫和 Kubernetes 倉庫之間有哪些顯著差異？ {#what-are-significant-differences-between-the-google-hosted-and-kubernetes-package-repositories}

<!--
There are three significant differences that you should be aware of:
-->
你應該注意三個顯著差異：

<!--
- There's a dedicated package repository for each Kubernetes minor release.
  For example, repository called `core:/stable:/v1.28` only hosts packages for
  stable Kubernetes v1.28 releases. This means you can install v1.28.0 from
  this repository, but you can't install v1.27.0 or any other minor release
  other than v1.28. Upon upgrading to another minor version, you have to add a
  new repository and optionally remove the old one
-->
- 每個 Kubernetes 次要版本都有一個專用的倉庫。例如，
  名爲 `core:/stable:/v1.28` 的倉庫僅託管穩定 Kubernetes v1.28 版本的包。
  這意味着你可以從此倉庫安裝 v1.28.0，但無法安裝 v1.27.0 或 v1.28 之外的任何其他次要版本。
  升級到另一個次要版本後，你必須添加新的倉庫並可以選擇刪除舊的倉庫

<!--
- There's a difference in what `cri-tools` and `kubernetes-cni` package
  versions are available in each Kubernetes repository
  - These two packages are dependencies for `kubelet` and `kubeadm`
  - Kubernetes repositories for v1.24 to v1.27 have same versions of these
    packages as the Google-hosted repository
  - Kubernetes repositories for v1.28 and onwards are going to have published
    only versions that are used by that Kubernetes minor release
    - Speaking of v1.28, only kubernetes-cni 1.2.0 and cri-tools v1.28 are going
      to be available in the repository for Kubernetes v1.28
    - Similar for v1.29, we only plan on publishing cri-tools v1.29 and
      whatever kubernetes-cni version is going to be used by Kubernetes v1.29
-->
- 每個 Kubernetes 倉庫中可用的 `cri-tools` 和 `kubernetes-cni` 包版本有所不同
  - 這兩個包是 `kubelet` 和 `kubeadm` 的依賴項
  - v1.24 到 v1.27 的 Kubernetes 倉庫與託管在 Google 的倉庫具有這些包的相同版本
  - v1.28 及更高版本的 Kubernetes 倉庫將僅發佈該 Kubernetes 次要版本
    - 就 v1.28 而言，Kubernetes v1.28 的倉庫中僅提供 kubernetes-cni 1.2.0 和 cri-tools v1.28
    - 與 v1.29 類似，我們只計劃發佈 cri-tools v1.29 以及 Kubernetes v1.29 將使用的 kubernetes-cni 版本

<!--
- The revision part of the package version (the `-00` part in `1.28.0-00`) is
  now autogenerated by the OpenBuildService platform and has a different format.
  The revision is now in the format of `-x.y`, e.g. `1.28.0-1.1`
-->
- 包版本的修訂部分（`1.28.0-00` 中的 `-00` 部分）現在由 OpenBuildService
  平臺自動生成，並具有不同的格式。修訂版本現在採用 `-x.y` 格式，例如 `1.28.0-1.1`

<!--
## Does this in any way affect existing Google-hosted repositories?
-->
## 這是否會影響現有的託管在 Google 的倉庫？ {#does-this-in-any-way-affect-existing-google-hosted-repositories}

<!--
_(updated on March 26, 2024)_
-->
**（更新於 2024 年 3 月 26 日）**

<!--
**The legacy Google-hosted repositories went away on March 4, 2024. It's not possible to
install Kubernetes packages from the legacy Google-hosted package repositories any longer.**
Check out [the deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
for more details about this change.
-->
**舊版託管在 Google 的倉庫於 2024 年 3 月 4 日停用。
你不能再從舊版託管在 Google 的包倉庫中安裝 Kubernetes 包。**
有關本次變更細節查閱[棄用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)。

<!--
~~The Google-hosted repository and all packages published to it will continue
working in the same way as before. There are no changes in how we build and
publish packages to the Google-hosted repository, all newly-introduced changes
are only affecting packages publish to the community-owned repositories.~~
-->
~~託管在 Google 的倉庫以及發佈到其中的所有包仍然可用，與之前一樣。
我們構建包並將其發佈到託管在 Google 倉庫的方式沒有變化，
所有新引入的更改僅影響發佈到社區自有倉庫的包。~~

<!--
~~However, as mentioned at the beginning of this blog post, we plan to stop
publishing packages to the Google-hosted repository in the future.~~
-->
~~然而，正如本文開頭提到的，我們計劃將來停止將包發佈到託管在 Google 的倉庫。~~

<!--
## How to migrate to the Kubernetes community-owned repositories? {#how-to-migrate}
-->
## 如何遷移到 Kubernetes 社區自有的倉庫？ {#how-to-migrate}

<!--
### Debian, Ubuntu, and operating systems using `apt`/`apt-get` {#how-to-migrate-deb}
-->
### 使用 `apt`/`apt-get` 的 Debian、Ubuntu 一起其他操作系統 {#how-to-migrate-deb}

<!--
1. Replace the `apt` repository definition so that `apt` points to the new
   repository instead of the Google-hosted repository. Make sure to replace the
   Kubernetes minor version in the command below with the minor version
   that you're currently using:
-->
1. 替換 `apt` 倉庫定義，以便 `apt` 指向新倉庫而不是託管在 Google 的倉庫。
   確保將以下命令中的 Kubernetes 次要版本替換爲你當前使用的次要版本：

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

<!--
2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories, so you can disregard the
   version in the URL:
-->
2. 下載 Kubernetes 倉庫的公共簽名密鑰。所有倉庫都使用相同的簽名密鑰，
   因此你可以忽略 URL 中的版本：

   ```shell
   curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

    <!--
    _Update: In releases older than Debian 12 and Ubuntu 22.04, the folder `/etc/apt/keyrings` does not exist by default, and it should be created before the curl command._
    -->

    **更新：在 Debian 12 和 Ubuntu 22.04 之前的版本中，`/etc/apt/keyrings` 文件夾默認不存在，
    因此在執行 curl 命令之前應該先創建此文件夾。**

<!--
3. Update the `apt` package index:
-->
3. 更新 `apt` 包索引：

   ```shell
   sudo apt-get update
   ```

<!--
### CentOS, Fedora, RHEL, and operating systems using `rpm`/`dnf` {#how-to-migrate-rpm}
-->
### 使用 `rpm`/`dnf` 的 CentOS、Fedora、RHEL 以及其他操作系統 {#how-to-migrate-rpm}

<!--
1. Replace the `yum` repository definition so that `yum` points to the new 
   repository instead of the Google-hosted repository. Make sure to replace the
   Kubernetes minor version in the command below with the minor version
   that you're currently using:
-->
1. 替換 `yum` 倉庫定義，使 `yum` 指向新倉庫而不是託管在 Google 的倉庫。
   確保將以下命令中的 Kubernetes 次要版本替換爲你當前使用的次要版本：

   ```shell
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

<!--
## Where can I get packages for Kubernetes versions prior to v1.24.0?

_(updated on March 26, 2024)_
-->
## 我在哪裏可以獲取 Kubernetes v1.24.0 之前的軟件包？

**(更新於 2024 年 3 月 26 日)**

<!--
For Kubernetes v1.24 and onwards, Linux packages of Kubernetes components are available for
download via the official Kubernetes package repositories. Kubernetes does not publish any
software packages for releases of Kubernetes older than v1.24.0; however, your Linux
distribution may provide its own packages. Alternatively, you can directly download binaries
instead of using packages. As an example, see `Without a package manager` instructions in
["Installing kubeadm"](/docs/setup/production-environment/tools/kubeadm/install-kubeadm)
document.
-->
對於 Kubernetes v1.24 及更高版本，Kubernetes 組件的 Linux 包可以通過官方 Kubernetes 包倉庫下載。
Kubernetes 不會再發布 v1.24.0 之前的任何包；然而，你的 Linux 發行版可能會提供自己的包。
或者，你也可以直接下載二進制文件，而不是使用包。
有關細節參見[安裝 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm)
文檔中“沒有包管理器”一節的內容。

<!--
## Can I rollback to the Google-hosted repository after migrating to the Kubernetes repositories?
-->
## 遷移到 Kubernetes 倉庫後是否可以回滾到託管在 Google 的倉庫？ {#can-i-rollback-to-the-google-hosted-repository-after-migrating-to-the-kubernetes-repositories}

<!--
_(updated on March 26, 2024)_

**The legacy Google-hosted repositories went away on March 4, 2024 and therefore it's not possible
to rollback to the legacy Google-hosted repositories any longer.**
-->
**(更新於 2024 年 3 月 26 日)**

**舊版託管在 Google 的倉庫於 2024 年 3 月 4 日停用，因此你不能再回滾到舊版託管在 Google 的倉庫。**

<!--
~~In general, yes. Just do the same steps as when migrating, but use parameters
for the Google-hosted repository. You can find those parameters in a document
like ["Installing kubeadm"](/docs/setup/production-environment/tools/kubeadm/install-kubeadm).~~
-->
~~一般來說，可以。只需執行與遷移時相同的步驟，但使用託管在 Google 的倉庫參數。
你可以在[“安裝 kubeadm”](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm)等文檔中找到這些參數。~~

<!--
## Why isn’t there a stable list of domains/IPs? Why can’t I restrict package downloads?
-->
## 爲什麼沒有固定的域名/IP 列表？爲什麼我無法限制包下載？ {#why-isn-t-there-a-stable-list-of-domains-ips-why-can-t-i-restrict-package-downloads}

<!--
Our plan for `pkgs.k8s.io` is to make it work as a redirector to a set of 
backends (package mirrors) based on user's location. The nature of this change
means that a user downloading a package could be redirected to any mirror at
any time. Given the architecture and our plans to onboard additional mirrors in
the near future, we can't provide a list of IP addresses or domains that you 
can add to an allow list.
-->
我們對 `pkgs.k8s.io` 的計劃是使其根據使用者位置充當一組後端（包映像檔）的重定向器。
此更改的本質意味着下載包的使用者可以隨時重定向到任何映像檔。
鑑於架構和我們計劃在不久的將來加入更多映像檔，我們無法提供給你可以添加到允許列表中的
IP 地址或域名列表。

<!--
Restrictive control mechanisms like man-in-the-middle proxies or network
policies that restrict access to a specific list of IPs/domains will break with
this change. For these scenarios, we encourage you to mirror the release
packages to a local package repository that you have strict control over.
-->
限制性控制機制（例如限制訪問特定 IP/域名列表的中間人代理或網路策略）將隨着此更改而中斷。
對於這些場景，我們鼓勵你將包的發佈版本與你可以嚴格控制的本地倉庫建立映像檔。

<!--
## What should I do if I detect some abnormality with the new repositories?
-->
## 如果我發現新的倉庫有異常怎麼辦？ {#what-should-i-do-if-i-detect-some-abnormality-with-the-new-repositories}

<!--
If you encounter any issue with new Kubernetes package repositories, please
file an issue in the
[`kubernetes/release` repository](https://github.com/kubernetes/release/issues/new/choose).
-->
如果你在新的 Kubernetes 倉庫中遇到任何問題，
請在 [`kubernetes/release` 倉庫](https://github.com/kubernetes/release/issues/new/choose)中提交問題。
