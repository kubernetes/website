---
layout: blog
title: "CRI-O 正迁移至 pkgs.k8s.io"
date: 2023-10-10
slug: cri-o-community-package-infrastructure
---

<!--
layout: blog
title: "CRI-O is moving towards pkgs.k8s.io"
date: 2023-10-10
slug: cri-o-community-package-infrastructure
-->

**作者**：Sascha Grunert
<!--
**Author:** Sascha Grunert
-->

**译者**：Wilson Wu (DaoCloud)

<!--
The Kubernetes community [recently announced](/blog/2023/08/31/legacy-package-repository-deprecation/) that their legacy package repositories are frozen, and now they moved to [introduced community-owned package repositories](/blog/2023/08/15/pkgs-k8s-io-introduction) powered by the [OpenBuildService (OBS)](https://build.opensuse.org/project/subprojects/isv:kubernetes). CRI-O has a long history of utilizing [OBS for their package builds](https://github.com/cri-o/cri-o/blob/e292f17/install.md#install-packaged-versions-of-cri-o), but all of the packaging efforts have been done manually so far.
-->
Kubernetes 社区[最近宣布](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)旧的软件包仓库已被冻结，
现在这些软件包将被迁移到由 [OpenBuildService（OBS）](https://build.opensuse.org/project/subprojects/isv:kubernetes)
提供支持的[社区自治软件包仓库](/blog/2023/08/15/pkgs-k8s-io-introduction)中。
很久以来，CRI-O 一直在利用 [OBS 进行软件包构建](https://github.com/cri-o/cri-o/blob/e292f17/install.md#install-packaged-versions-of-cri-o)，
但到目前为止，所有打包工作都是手动完成的。

<!--
The CRI-O community absolutely loves Kubernetes, which means that they're delighted to announce that:
-->
CRI-O 社区非常喜欢 Kubernetes，这意味着他们很高兴地宣布：

<!--
**All future CRI-O packages will be shipped as part of the officially supported Kubernetes infrastructure hosted on pkgs.k8s.io!**
-->
**所有未来的 CRI-O 包都将作为在 pkgs.k8s.io 上托管的官方支持的 Kubernetes 基础设施的一部分提供！**

<!--
There will be a deprecation phase for the existing packages, which is currently being [discussed in the CRI-O community](https://github.com/cri-o/cri-o/discussions/7315). The new infrastructure will only support releases of CRI-O `>= v1.28.2` as well as release branches newer than `release-1.28`.
-->
现有软件包将进入一个弃用阶段，目前正在
[CRI-O 社区中讨论](https://github.com/cri-o/cri-o/discussions/7315)。
新的基础设施将仅支持 CRI-O `>= v1.28.2` 的版本以及比 `release-1.28` 新的版本分支。

<!--
## How to use the new packages
-->
## 如何使用新软件包  {#how-to-use-the-new-packages}

<!--
In the same way as the Kubernetes community, CRI-O provides `deb` and `rpm` packages as part of a dedicated subproject in OBS, called [`isv:kubernetes:addons:cri-o`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o). This project acts as an umbrella and provides `stable` (for CRI-O tags) as well as `prerelease` (for CRI-O `release-1.y` and `main` branches) package builds.
-->
与 Kubernetes 社区一样，CRI-O 提供 `deb` 和 `rpm` 软件包作为 OBS 中专用子项目的一部分，
被称为 [`isv:kubernetes:addons:cri-o`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o)。
这个项目是一个集合，提供 `stable`（针对 CRI-O 标记）以及 `prerelease`（针对 CRI-O `release-1.y` 和 `main` 分支）版本的软件包。

<!--
**Stable Releases:**
-->
**稳定版本：**

<!--
- [`isv:kubernetes:addons:cri-o:stable`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable): Stable Packages
  - [`isv:kubernetes:addons:cri-o:stable:v1.29`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable:v1.29): `v1.29.z` tags
  - [`isv:kubernetes:addons:cri-o:stable:v1.28`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable:v1.28): `v1.28.z` tags
-->
- [`isv:kubernetes:addons:cri-o:stable`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable)：稳定软件包
  - [`isv:kubernetes:addons:cri-o:stable:v1.29`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable:v1.29 )：`v1.29.z` 标记
  - [`isv:kubernetes:addons:cri-o:stable:v1.28`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:stable:v1.28 )：`v1.28.z` 标记

<!--
**Prereleases:**
-->
**预发布版本：**

<!--
- [`isv:kubernetes:addons:cri-o:prerelease`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease): Prerelease Packages
  - [`isv:kubernetes:addons:cri-o:prerelease:main`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:main): [`main`](https://github.com/cri-o/cri-o/commits/main) branch
  - [`isv:kubernetes:addons:cri-o:prerelease:v1.29`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:v1.29): [`release-1.29`](https://github.com/cri-o/cri-o/commits/release-1.29) branch
  - [`isv:kubernetes:addons:cri-o:prerelease:v1.28`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:v1.28): [`release-1.28`](https://github.com/cri-o/cri-o/commits/release-1.28) branch
-->
- [`isv:kubernetes:addons:cri-o:prerelease`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease)：预发布软件包
  - [`isv:kubernetes:addons:cri-o:prerelease:main`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:main)：
  [`main`](https://github.com/cri-o/cri-o/commits/main) 分支
  - [`isv:kubernetes:addons:cri-o:prerelease:v1.29`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:v1.29)：
  [`release-1.29`](https://github.com/cri-o/cri-o/commits/release-1.29) 分支
  - [`isv:kubernetes:addons:cri-o:prerelease:v1.28`](https://build.opensuse.org/project/show/isv:kubernetes:addons:cri-o:prerelease:v1.28)：
  [`release-1.28`](https://github.com/cri-o/cri-o/commits/release-1.28) 分支

<!--
There are no stable releases available in the v1.29 repository yet, because v1.29.0 will be released in December. The CRI-O community will also **not** support release branches older than `release-1.28`, because there have been CI requirements merged into `main` which could be only backported to `release-1.28` with appropriate efforts.
-->
v1.29 仓库中尚无可用的稳定版本，因为 v1.29.0 将于 12 月发布。
CRI-O 社区也**不**支持早于 `release-1.28` 的版本分支，
因为已经有 CI 需求合并到 `main` 中，只有通过适当的努力才能向后移植到 `release-1.28`。

<!--
For example, If an end-user would like to install the latest available version of the CRI-O `main` branch, then they can add the repository in the same way as they do for Kubernetes.
-->
例如，如果最终用户想要安装 CRI-O `main` 分支的最新可用版本，
那么他们可以按照与 Kubernetes 相同的方式添加仓库。

<!--
### `rpm` Based Distributions
-->
### 基于 `rpm` 的发行版  {#rpm-based-distributions}

<!--
For `rpm` based distributions, you can run the following commands as a `root` user to install CRI-O together with Kubernetes:
-->
对于基于 `rpm` 的发行版，您可以以 `root`
用户身份运行以下命令来将 CRI-O 与 Kubernetes 一起安装：

<!--
#### Add the Kubernetes repo
-->
#### 添加 Kubernetes 仓库  {#add-the-kubernetes-repo}

```bash
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.28/rpm/repodata/repomd.xml.key
EOF
```

<!--
#### Add the CRI-O repo
-->
#### 添加 CRI-O 仓库  {#add-the-cri-o-repo}

```bash
cat <<EOF | tee /etc/yum.repos.d/cri-o.repo
[cri-o]
name=CRI-O
baseurl=https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/rpm/repodata/repomd.xml.key
EOF
```

<!--
#### Install official package dependencies
-->
#### 安装官方包依赖  {#install-official-package-dependencies}

```bash
dnf install -y \
    conntrack \
    container-selinux \
    ebtables \
    ethtool \
    iptables \
    socat
```

<!--
#### Install the packages from the added repos
-->
#### 从添加的仓库中安装软件包  {#install-the-packages-from-the-added-repos}

```bash
dnf install -y --repo cri-o --repo kubernetes \
    cri-o \
    kubeadm \
    kubectl \
    kubelet
```

<!--
### `deb` Based Distributions
-->
### 基于 `deb` 的发行版  {#deb-based-distributions}

<!--
For `deb` based distributions, you can run the following commands as a `root` user:
-->
对于基于 `deb` 的发行版，您可以以 `root` 用户身份运行以下命令：

<!--
#### Install dependencies for adding the repositories
-->
#### 安装用于添加仓库的依赖项  {#install-dependencies-for-adding-the-repositories}

```bash
apt-get update
apt-get install -y software-properties-common curl
```

<!--
#### Add the Kubernetes repository
-->
#### 添加 Kubernetes 仓库  {#add-the-kubernetes-repository}

```bash
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list
```

<!--
#### Add the CRI-O repository
-->
#### 添加 CRI-O 仓库  {#add-the-cri-o-repository}

```bash
curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/ /" |
    tee /etc/apt/sources.list.d/cri-o.list
```

<!--
#### Install the packages
-->
#### 安装软件包  {#install-the-packages}

```bash
apt-get update
apt-get install -y cri-o kubelet kubeadm kubectl
```

<!--
#### Start CRI-O
-->
#### 启动 CRI-O  {#start-cri-o}

```bash
systemctl start crio.service
```

<!--
The Project's `prerelease:/main` prefix at the CRI-O's package path, can be replaced with `stable:/v1.28`, `stable:/v1.29`, `prerelease:/v1.28` or `prerelease:/v1.29` if another stream package is used.
-->
如果使用的是另一个包序列，CRI-O 包路径中项目的 `prerelease:/main`
前缀可以替换为 `stable:/v1.28`、`stable:/v1.29`、`prerelease:/v1.28` 或 `prerelease :/v1.29`。

<!--
Bootstrapping [a cluster using `kubeadm`](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) can be done by running `kubeadm init` command, which automatically detects that CRI-O is running in the background. There are also `Vagrantfile` examples available for [Fedora 38](https://github.com/cri-o/packaging/blob/91df5f7/test/rpm/Vagrantfile) as well as [Ubuntu 22.04](https://github.com/cri-o/packaging/blob/91df5f7/test/deb/Vagrantfile) for testing the packages together with `kubeadm`.
-->
你可以使用 `kubeadm init` 命令来[引导集群](/docs/setup/product-environment/tools/kubeadm/install-kubeadm/)，
该命令会自动检测后台正在运行 CRI-O。还有适用于
[Fedora 38](https://github.com/cri-o/packaging/blob/91df5f7/test/rpm/Vagrantfile)
以及 [Ubuntu 22.04](https://github.com/cri-o/packaging/blob/91df5f7/test/deb/Vagrantfile)
的 `Vagrantfile` 示例，可在使用 `kubeadm` 的场景中测试下载的软件包。

<!--
## How it works under the hood
-->
## 它是如何工作的  {#how-it-works-under-the-hood}

<!--
Everything related to these packages lives in the new [CRI-O packaging repository](https://github.com/cri-o/packaging). It contains a [daily reconciliation](https://github.com/cri-o/packaging/blob/91df5f7/.github/workflows/schedule.yml) GitHub action workflow, for all supported release branches as well as tags of CRI-O. A [test pipeline](https://github.com/cri-o/packaging/actions/workflows/obs.yml) in the OBS workflow ensures that the packages can be correctly installed and used before being published. All of the staging and publishing of the packages is done with the help of the [Kubernetes Release Toolbox (krel)](https://github.com/kubernetes/release/blob/1f85912/docs/krel/README.md), which is also used for the official Kubernetes `deb` and `rpm` packages.
-->
与这些包相关的所有内容都位于新的 [CRI-O 打包仓库](https://github.com/cri-o/packaging)中。
它包含 [Daily Reconciliation](https://github.com/cri-o/packaging/blob/91df5f7/.github/workflows/schedule.yml) GitHub 工作流，
支持所有发布分支以及 CRI-O 标签。
OBS 工作流程中的[测试管道](https://github.com/cri-o/packaging/actions/workflows/obs.yml)确保包在发布之前可以被正确安装和使用。
所有包的暂存和发布都是在 [Kubernetes 发布工具箱（krel）](https://github.com/kubernetes/release/blob/1f85912/docs/krel/README.md)的帮助下完成的，
这一工具箱也被用于官方 Kubernetes `deb` 和 `rpm` 软件包。

<!--
The package build inputs will undergo daily reconciliation and will be supplied by CRI-O's static binary bundles. These bundles are built and signed for each commit in the CRI-O CI, and contain everything CRI-O requires to run on a certain architecture. The static builds are reproducible, powered by [nixpkgs](https://github.com/NixOS/nixpkgs) and available only for `x86_64`, `aarch64` and `ppc64le` architecture.
-->
包构建的输入每天都会被动态调整，并使用 CRI-O 的静态二进制包。
这些包是基于 CRI-O CI 中的每次提交来构建和签名的，
并且包含 CRI-O 在特定架构上运行所需的所有内容。静态构建是可重复的，
由 [nixpkgs](https://github.com/NixOS/nixpkgs) 提供支持，
并且仅适用于 `x86_64`、`aarch64` 以及 `ppc64le` 架构。

<!--
The CRI-O maintainers will be happy to listen to any feedback or suggestions on the new packaging efforts! Thank you for reading this blog post, feel free to reach out to the maintainers via the Kubernetes [Slack channel #crio](https://kubernetes.slack.com/messages/CAZH62UR1) or create an issue in the [packaging repository](https://github.com/cri-o/packaging/issues).
-->
CRI-O 维护者将很乐意听取有关新软件包工作情况的任何反馈或建议！
感谢您阅读本文，请随时通过 Kubernetes [Slack 频道 #crio](https://kubernetes.slack.com/messages/CAZH62UR1)
联系维护人员或在[打包仓库](https://github.com/cri-o/packaging/issues)中创建 Issue。
