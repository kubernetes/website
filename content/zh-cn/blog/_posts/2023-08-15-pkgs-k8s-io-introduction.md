---
layout: blog
title: "pkgs.k8s.io：介绍 Kubernetes 社区自有的包仓库"
date: 2023-08-15T20:00:00+0000
slug: pkgs-k8s-io-introduction
---
<!--
layout: blog
title: "pkgs.k8s.io: Introducing Kubernetes Community-Owned Package Repositories"
date: 2023-08-15T20:00:00+0000
slug: pkgs-k8s-io-introduction
-->

<!--
**Author**: Marko Mudrinić (Kubermatic)
-->
**作者**：Marko Mudrinić (Kubermatic)

**译者**：Wilson Wu (DaoCloud)

<!--
On behalf of Kubernetes SIG Release, I am very excited to introduce the
Kubernetes community-owned software
repositories for Debian and RPM packages: `pkgs.k8s.io`! The new package
repositories are replacement for the Google-hosted package repositories
(`apt.kubernetes.io` and `yum.kubernetes.io`) that we've been using since
Kubernetes v1.5.
-->
我很高兴代表 Kubernetes SIG Release 介绍 Kubernetes
社区自有的 Debian 和 RPM 软件仓库：`pkgs.k8s.io`！
这些全新的仓库取代了我们自 Kubernetes v1.5 以来一直使用的托管在
Google 的仓库（`apt.kubernetes.io` 和 `yum.kubernetes.io`）。

<!--
This blog post contains information about these new package repositories,
what does it mean to you as an end user, and how to migrate to the new
repositories.
-->
这篇博文包含关于这些新的包仓库的信息、它对最终用户意味着什么以及如何迁移到新仓库。

<!--
**ℹ️  Update (January 12, 2024):** the _**legacy Google-hosted repositories are going
away in January 2024.**_
Check out [the deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
for more details about this change.
-->
**ℹ️ 更新（2024 年 1 月 12 日）：旧版托管在 Google 的仓库已被弃用，并将于 2024 年 1 月开始被冻结。**
查看[弃用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)了解有关此更改的更多详细信息。

<!--
## What you need to know about the new package repositories?
-->
## 关于新的包仓库，你需要了解哪些信息？ {#what-you-need-to-know-about-the-new-package-repositories}

<!--
_(updated on January 12, 2024)_
-->
**（更新于 2024 年 1 月 12 日）**

<!--
- This is an **opt-in change**; you're required to manually migrate from the
  Google-hosted repository to the Kubernetes community-owned repositories.
  See [how to migrate](#how-to-migrate) later in this announcement for migration information
  and instructions.
-->
- 这是一个**明确同意的更改**；你需要手动从托管在 Google 的仓库迁移到
  Kubernetes 社区自有的仓库。请参阅本公告后面的[如何迁移](#how-to-migrate)，
  了解迁移信息和说明。

<!--
- **The legacy Google-hosted package repositories are going away in January 2024.** These repositories
  have been **deprecated as of August 31, 2023**, and **frozen as of September 13, 2023**.
  Check out the [deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/)
  for more details about this change.
-->
- **旧版托管在 Google 的包仓库于 2024 年 1 月停用。**
  这些仓库**自 2023 年 8 月 31 日起被弃用** ，并**自 2023 年 9 月 13 日被冻结** 。  
  有关此变更的更多细节请查阅[弃用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)。

<!--
- ~~The existing packages in the legacy repositories will be available for the foreseeable future.
  However, the Kubernetes project can't provide any guarantees on how long is that going to be.
  The deprecated legacy repositories, and their contents, might be removed at any time in the future
  and without a further notice period.~~ **The legacy package repositories are going away in
  January 2024.**
-->
- ~~旧仓库中的现有包将在可预见的未来一段时间内可用。
  然而，Kubernetes 项目无法保证这会持续多久。
  已弃用的旧仓库及其内容可能会在未来随时被删除，恕不另行通知。~~
  **旧版包仓库于 2024 年 1 月停用。**

<!--
- Given that no new releases will be published to the legacy repositories after
  the September 13, 2023 cut-off point, you will not be able to upgrade to any patch or minor
  release made from that date onwards if you don't migrate to the new Kubernetes package repositories.
  That said, we recommend migrating to the new Kubernetes package repositories **as soon as possible**.
-->
- 鉴于在 2023 年 9 月 13 日这个截止时间点之后不会向旧仓库发布任何新版本，
  如果你不在该截止时间点迁移至新的 Kubernetes 仓库，
  你将无法升级到该日期之后发布的任何补丁或次要版本。
  也就是说，我们建议**尽快**迁移到新的 Kubernetes 仓库。

<!--
- The new Kubernetes package repositories contain packages beginning with those
  Kubernetes versions that were still under support when the community took
  over the package builds. This means that the new package repositories have Linux packages for all
  Kubernetes releases starting with v1.24.0.
-->
- 新的 Kubernetes 仓库中包含社区开始接管包构建以来仍在支持的 Kubernetes 版本的包。
  这意味着 v1.24.0 之前的任何内容都只存在于托管在 Google 的仓库中。
  这意味着新的包仓库将为从 v1.24.0 开始的所有 Kubernetes 版本提供 Linux 包。

<!--
- Kubernetes does not have official Linux packages available for earlier releases of Kubernetes;
  however, your Linux distribution may provide its own packages.
-->
- Kubernetes 没有为早期版本提供官方的 Linux 包；然而，你的 Linux 发行版可能会提供自己的包。

<!--
- There's a dedicated package repository for each Kubernetes minor version.
  When upgrading to a different minor release, you must bear in mind that
  the package repository details also change.
-->
- 每个 Kubernetes 次要版本都有一个专用的仓库。
  当升级到不同的次要版本时，你必须记住，仓库详细信息也会发生变化。

<!--
## Why are we introducing new package repositories?
-->
## 为什么我们要引入新的包仓库？ {#why-are-we-introducing-new-package-repositories}

<!--
As the Kubernetes project is growing, we want to ensure the best possible
experience for the end users. The Google-hosted repository has been serving
us well for many years, but we started facing some problems that require
significant changes to how we publish packages. Another goal that we have is to
use community-owned infrastructure for all critical components and that
includes package repositories.
-->
随着 Kubernetes 项目的不断发展，我们希望确保最终用户获得最佳体验。
托管在 Google 的仓库多年来一直为我们提供良好的服务，
但我们开始面临一些问题，需要对发布包的方式进行重大变更。
我们的另一个目标是对所有关键组件使用社区拥有的基础设施，其中包括仓库。

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
将包发布到托管在 Google 的仓库是一个手动过程，
只能由名为 [Google 构建管理员](/zh-cn/releases/release-managers/#build-admins)的 Google 员工团队来完成。
[Kubernetes 发布管理员团队](/zh-cn/releases/release-managers/#release-managers)是一个非常多元化的团队，
尤其是在我们工作的时区方面。考虑到这一限制，我们必须对每个版本进行非常仔细的规划，
确保我们有发布经理和 Google 构建管理员来执行发布。

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
另一个问题是由于我们只有一个包仓库。因此，我们无法发布预发行版本
（Alpha、Beta 和 RC）的包。这使得任何有兴趣测试的人都更难测试 Kubernetes 预发布版本。
我们从测试这些版本的人员那里收到的反馈对于确保版本的最佳质量至关重要，
因此我们希望尽可能轻松地测试这些版本。最重要的是，只有一个仓库限制了我们对
`cri-tools` 和 `kubernetes-cni` 等依赖进行发布，

<!--
Regardless of all these issues, we're very thankful to Google and Google Build
Admins for their involvement, support, and help all these years!
-->
尽管存在这些问题，我们仍非常感谢 Google 和 Google 构建管理员这些年来的参与、支持和帮助！

<!--
## How the new package repositories work?
-->
## 新的包仓库如何工作？ {#how-the-new-package-repositories-work}

<!--
The new package repositories are hosted at `pkgs.k8s.io` for both Debian and
RPM packages. At this time, this domain points to a CloudFront CDN backed by S3
bucket that contains repositories and packages. However, we plan on onboarding
additional mirrors in the future, giving possibility for other companies to
help us with serving packages.
-->
新的 Debian 和 RPM 仓库托管在 `pkgs.k8s.io`。
目前，该域指向一个 CloudFront CDN，其后是包含仓库和包的 S3 存储桶。
然而，我们计划在未来添加更多的镜像站点，让其他公司有可能帮助我们提供软件包服务。

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
包通过 [OpenBuildService（OBS）平台](http://openbuildservice.org)构建和发布。
经过长时间评估不同的解决方案后，我们决定使用 OpenBuildService 作为管理仓库和包的平台。
首先，OpenBuildService 是一个开源平台，被大量开源项目和公司使用，
如 openSUSE、VideoLAN、Dell、Intel 等。OpenBuildService 具有许多功能，
使其非常灵活且易于与我们现有的发布工具集成。
它还允许我们以与托管在 Google 的仓库类似的方式构建包，从而使迁移过程尽可能无缝。

<!--
SUSE sponsors the Kubernetes project with access to their reference
OpenBuildService setup ([`build.opensuse.org`](http://build.opensuse.org)) and
with technical support to integrate OBS with our release processes.
-->
SUSE 赞助 Kubernetes 项目并且支持访问其引入的 OpenBuildService 环境
（[`build.opensuse.org`](http://build.opensuse.org)），
还提供将 OBS 与我们的发布流程集成的技术支持。

<!--
We use SUSE's OBS instance for building and publishing packages. Upon building
a new release, our tooling automatically pushes needed artifacts and 
package specifications to `build.opensuse.org`. That will trigger the build
process that's going to build packages for all supported architectures (AMD64,
ARM64, PPC64LE, S390X). At the end, generated packages will be automatically
pushed to our community-owned S3 bucket making them available to all users.
-->
我们使用 SUSE 的 OBS 实例来构建和发布包。构建新版本后，
我们的工具会自动将所需的制品和包设置推送到 `build.opensuse.org`。
这将触发构建过程，为所有支持的架构（AMD64、ARM64、PPC64LE、S390X）构建包。
最后，生成的包将自动推送到我们社区拥有的 S3 存储桶，以便所有用户都可以使用它们。

<!--
We want to take this opportunity to thank SUSE for allowing us to use
`build.opensuse.org` and their generous support to make this integration
possible!
-->
我们想借此机会感谢 SUSE 允许我们使用 `build.opensuse.org`
以及他们的慷慨支持，使这种集成成为可能！

<!--
## What are significant differences between the Google-hosted and Kubernetes package repositories?
-->
## 托管在 Google 的仓库和 Kubernetes 仓库之间有哪些显著差异？ {#what-are-significant-differences-between-the-google-hosted-and-kubernetes-package-repositories}

<!--
There are three significant differences that you should be aware of:
-->
你应该注意三个显著差异：

<!--
- There's a dedicated package repository for each Kubernetes minor release.
  For example, repository called `core:/stable:/v1.28` only hosts packages for
  stable Kubernetes v1.28 releases. This means you can install v1.28.0 from
  this repository, but you can't install v1.27.0 or any other minor release
  other than v1.28. Upon upgrading to another minor version, you have to add a
  new repository and optionally remove the old one
-->
- 每个 Kubernetes 次要版本都有一个专用的仓库。例如，
  名为 `core:/stable:/v1.28` 的仓库仅托管稳定 Kubernetes v1.28 版本的包。
  这意味着你可以从此仓库安装 v1.28.0，但无法安装 v1.27.0 或 v1.28 之外的任何其他次要版本。
  升级到另一个次要版本后，你必须添加新的仓库并可以选择删除旧的仓库

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
- 每个 Kubernetes 仓库中可用的 `cri-tools` 和 `kubernetes-cni` 包版本有所不同
  - 这两个包是 `kubelet` 和 `kubeadm` 的依赖项
  - v1.24 到 v1.27 的 Kubernetes 仓库与托管在 Google 的仓库具有这些包的相同版本
  - v1.28 及更高版本的 Kubernetes 仓库将仅发布该 Kubernetes 次要版本
    - 就 v1.28 而言，Kubernetes v1.28 的仓库中仅提供 kubernetes-cni 1.2.0 和 cri-tools v1.28
    - 与 v1.29 类似，我们只计划发布 cri-tools v1.29 以及 Kubernetes v1.29 将使用的 kubernetes-cni 版本

<!--
- The revision part of the package version (the `-00` part in `1.28.0-00`) is
  now autogenerated by the OpenBuildService platform and has a different format.
  The revision is now in the format of `-x.y`, e.g. `1.28.0-1.1`
-->
- 包版本的修订部分（`1.28.0-00` 中的 `-00` 部分）现在由 OpenBuildService
  平台自动生成，并具有不同的格式。修订版本现在采用 `-x.y` 格式，例如 `1.28.0-1.1`

<!--
## Does this in any way affect existing Google-hosted repositories?
-->
## 这是否会影响现有的托管在 Google 的仓库？ {#does-this-in-any-way-affect-existing-google-hosted-repositories}

<!--
The Google-hosted repository and all packages published to it will continue
working in the same way as before. There are no changes in how we build and
publish packages to the Google-hosted repository, all newly-introduced changes
are only affecting packages publish to the community-owned repositories.
-->
托管在 Google 的仓库以及发布到其中的所有包仍然可用，与之前一样。
我们构建包并将其发布到托管在 Google 仓库的方式没有变化，
所有新引入的更改仅影响发布到社区自有仓库的包。

<!--
However, as mentioned at the beginning of this blog post, we plan to stop
publishing packages to the Google-hosted repository in the future.
-->
然而，正如本文开头提到的，我们计划将来停止将包发布到托管在 Google 的仓库。

<!--
## How to migrate to the Kubernetes community-owned repositories? {#how-to-migrate}
-->
## 如何迁移到 Kubernetes 社区自有的仓库？ {#how-to-migrate}

<!--
### Debian, Ubuntu, and operating systems using `apt`/`apt-get` {#how-to-migrate-deb}
-->
### 使用 `apt`/`apt-get` 的 Debian、Ubuntu 一起其他操作系统 {#how-to-migrate-deb}

<!--
1. Replace the `apt` repository definition so that `apt` points to the new
   repository instead of the Google-hosted repository. Make sure to replace the
   Kubernetes minor version in the command below with the minor version
   that you're currently using:
-->
1. 替换 `apt` 仓库定义，以便 `apt` 指向新仓库而不是托管在 Google 的仓库。
   确保将以下命令中的 Kubernetes 次要版本替换为你当前使用的次要版本：

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

<!--
2. Download the public signing key for the Kubernetes package repositories.
   The same signing key is used for all repositories, so you can disregard the
   version in the URL:
-->
2. 下载 Kubernetes 仓库的公共签名密钥。所有仓库都使用相同的签名密钥，
   因此你可以忽略 URL 中的版本：

   ```shell
   curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

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
### 使用 `rpm`/`dnf` 的 CentOS、Fedora、RHEL 以及其他操作系统 {#how-to-migrate-rpm}

<!--
1. Replace the `yum` repository definition so that `yum` points to the new 
   repository instead of the Google-hosted repository. Make sure to replace the
   Kubernetes minor version in the command below with the minor version
   that you're currently using:
-->
1. 替换 `yum` 仓库定义，使 `yum` 指向新仓库而不是托管在 Google 的仓库。
   确保将以下命令中的 Kubernetes 次要版本替换为你当前使用的次要版本：

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
## Can I rollback to the Google-hosted repository after migrating to the Kubernetes repositories?
-->
## 迁移到 Kubernetes 仓库后是否可以回滚到托管在 Google 的仓库？ {#can-i-rollback-to-the-google-hosted-repository-after-migrating-to-the-kubernetes-repositories}

<!--
In general, yes. Just do the same steps as when migrating, but use parameters
for the Google-hosted repository. You can find those parameters in a document
like ["Installing kubeadm"](/docs/setup/production-environment/tools/kubeadm/install-kubeadm).
-->
一般来说，可以。只需执行与迁移时相同的步骤，但使用托管在 Google 的仓库参数。
你可以在[“安装 kubeadm”](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm)等文档中找到这些参数。

<!--
## Why isn’t there a stable list of domains/IPs? Why can’t I restrict package downloads?
-->
## 为什么没有固定的域名/IP 列表？为什么我无法限制包下载？ {#why-isn-t-there-a-stable-list-of-domains-ips-why-can-t-i-restrict-package-downloads}

<!--
Our plan for `pkgs.k8s.io` is to make it work as a redirector to a set of 
backends (package mirrors) based on user's location. The nature of this change
means that a user downloading a package could be redirected to any mirror at
any time. Given the architecture and our plans to onboard additional mirrors in
the near future, we can't provide a list of IP addresses or domains that you 
can add to an allow list.
-->
我们对 `pkgs.k8s.io` 的计划是使其根据用户位置充当一组后端（包镜像）的重定向器。
此更改的本质意味着下载包的用户可以随时重定向到任何镜像。
鉴于架构和我们计划在不久的将来加入更多镜像，我们无法提供给你可以添加到允许列表中的
IP 地址或域名列表。

<!--
Restrictive control mechanisms like man-in-the-middle proxies or network
policies that restrict access to a specific list of IPs/domains will break with
this change. For these scenarios, we encourage you to mirror the release
packages to a local package repository that you have strict control over.
-->
限制性控制机制（例如限制访问特定 IP/域名列表的中间人代理或网络策略）将随着此更改而中断。
对于这些场景，我们鼓励你将包的发布版本与你可以严格控制的本地仓库建立镜像。

<!--
## What should I do if I detect some abnormality with the new repositories?
-->
## 如果我发现新的仓库有异常怎么办？ {#what-should-i-do-if-i-detect-some-abnormality-with-the-new-repositories}

<!--
If you encounter any issue with new Kubernetes package repositories, please
file an issue in the
[`kubernetes/release` repository](https://github.com/kubernetes/release/issues/new/choose).
-->
如果你在新的 Kubernetes 仓库中遇到任何问题，
请在 [`kubernetes/release` 仓库](https://github.com/kubernetes/release/issues/new/choose)中提交问题。
