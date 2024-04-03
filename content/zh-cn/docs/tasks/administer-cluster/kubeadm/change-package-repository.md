---
title: 更改 Kubernetes 软件包仓库
content_type: task
weight: 120
---
<!--
title: Changing The Kubernetes Package Repository
content_type: task
weight: 120
-->

<!-- overview -->

<!--
This page explains how to enable a package repository for the desired
Kubernetes minor release upon upgrading a cluster. This is only needed
for users of the community-owned package repositories hosted at `pkgs.k8s.io`.
Unlike the legacy package repositories, the community-owned package
repositories are structured in a way that there's a dedicated package
repository for each Kubernetes minor version.
-->
本页介绍了如何在升级集群时启用包含 Kubernetes 次要版本的软件包仓库。
这仅适用于使用托管在 `pkgs.k8s.io` 上社区自治软件包仓库的用户。
启用新的 Kubernetes 小版本的软件包仓库。与传统的软件包仓库不同，
社区自治的软件包仓库所采用的结构为每个 Kubernetes 小版本都有一个专门的软件包仓库。

{{< note >}}
<!--
This guide only covers a part of the Kubernetes upgrade process. Please see the
[upgrade guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) for
more information about upgrading Kubernetes clusters.
-->
本指南仅介绍 Kubernetes 升级过程的一部分。
有关升级 Kubernetes 集群的更多信息，
请参阅[升级指南](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
{{</ note >}}

{{< note >}}
<!--
This step is only needed upon upgrading a cluster to another **minor** release.
If you're upgrading to another patch release within the same minor release (e.g.
v{{< skew currentVersion >}}.5 to v{{< skew currentVersion >}}.7), you don't
need to follow this guide. However, if you're still using the legacy package
repositories, you'll need to migrate to the new community-owned package
repositories before upgrading (see the next section for more details on how to
do this).
-->
仅在将集群升级到另一个**次要**版本时才需要执行此步骤。
如果你要升级到同一次要版本中的另一个补丁版本（例如：v{{< skew currentVersion >}}.5 到
v{{< skew currentVersion >}}.7）则不需要遵循本指南。
但是，如果你仍在使用旧的软件包仓库，则需要在升级之前迁移到社区自治的新软件包仓库
（有关如何执行此操作的更多详细信息，请参阅下一节）。
{{</ note >}}

## {{% heading "prerequisites" %}}

<!--
This document assumes that you're already using the community-owned
package repositories (`pkgs.k8s.io`). If that's not the case, it's strongly
recommended to migrate to the community-owned package repositories as described
in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
本文假设你已经在使用社区自治的软件包仓库（`pkgs.k8s.io`）。如果不是这种情况，
强烈建议按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
迁移到社区自治的软件包仓库。

{{% legacy-repos-deprecation %}}

<!--
### Verifying if the Kubernetes package repositories are used

If you're unsure whether you're using the community-owned package repositories or the
legacy package repositories, take the following steps to verify:
-->
### 验证是否正在使用 Kubernetes 软件包仓库

如果你不确定自己是在使用社区自治的软件包仓库还是在使用老旧的软件包仓库，
可以执行以下步骤进行验证：

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

<!--
Print the contents of the file that defines the Kubernetes `apt` repository:

```shell
# On your system, this configuration file could have a different name
pager /etc/apt/sources.list.d/kubernetes.list
```

If you see a line similar to:
-->
打印定义 Kubernetes `apt` 仓库的文件的内容：

```shell
# 在你的系统上，此配置文件可能具有不同的名称
pager /etc/apt/sources.list.d/kubernetes.list
```

如果你看到类似以下的一行：

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

<!--
**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
**你正在使用 Kubernetes 软件包仓库，本指南适用于你。**
否则，强烈建议按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
迁移到 Kubernetes 软件包仓库。

{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}

<!--
Print the contents of the file that defines the Kubernetes `yum` repository:

```shell
# On your system, this configuration file could have a different name
cat /etc/yum.repos.d/kubernetes.repo
```

If you see a `baseurl` similar to the `baseurl` in the output below:
-->
打印定义 Kubernetes `yum` 仓库的文件的内容：

```shell
# 在你的系统上，此配置文件可能具有不同的名称
cat /etc/yum.repos.d/kubernetes.repo
```

如果你看到的 `baseurl` 类似以下输出中的 `baseurl`：

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

<!--
**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
**你正在使用 Kubernetes 软件包仓库，本指南适用于你。**
否则，强烈建议按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
迁移到 Kubernetes 软件包仓库。

{{% /tab %}}

{{% tab name="openSUSE 或 SLES" %}}

<!--
Print the contents of the file that defines the Kubernetes `zypper` repository:

```shell
# On your system, this configuration file could have a different name
cat /etc/zypp/repos.d/kubernetes.repo
```

If you see a `baseurl` similar to the `baseurl` in the output below:
-->
打印定义 Kubernetes `zypper` 仓库的文件的内容：

```shell
# 在你的系统上，此配置文件可能具有不同的名称
cat /etc/zypp/repos.d/kubernetes.repo
```

如果你看到的 `baseurl` 类似以下输出中的 `baseurl`：

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

<!--
**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
**你正在使用 Kubernetes 软件包仓库，本指南适用于你。**
否则，强烈建议按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
迁移到 Kubernetes 软件包仓库。

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
<!--
The URL used for the Kubernetes package repositories is not limited to `pkgs.k8s.io`,
it can also be one of:
-->
Kubernetes 软件包仓库所用的 URL 不仅限于 `pkgs.k8s.io`，还可以是以下之一：

- `pkgs.k8s.io`
- `pkgs.kubernetes.io`
- `packages.kubernetes.io`
{{</ note >}}

<!-- steps -->

<!--
## Switching to another Kubernetes package repository

This step should be done upon upgrading from one to another Kubernetes minor
release in order to get access to the packages of the desired Kubernetes minor
version.
-->
## 切换到其他 Kubernetes 软件包仓库  {#switching-to-another-kubernetes-package-repository}

在从一个 Kubernetes 小版本升级到另一个版本时，应执行此步骤以获取所需 Kubernetes 小版本的软件包访问权限。

{{< tabs name="k8s_upgrade_versions" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

<!--
1. Open the file that defines the Kubernetes `apt` repository using a text editor of your choice:
-->
1. 使用你所选择的文本编辑器打开定义 Kubernetes `apt` 仓库的文件：

   ```shell
   nano /etc/apt/sources.list.d/kubernetes.list
   ```

   <!--
   You should see a single line with the URL that contains your current Kubernetes
   minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
   you should see this:
   -->
   你应该看到一行包含当前 Kubernetes 小版本的 URL。
   例如，如果你正在使用 v{{< skew currentVersionAddMinor -1 "." >}}，你应该看到类似以下的输出：

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
   ```

<!--
1. Change the version in the URL to **the next available minor release**, for example:
-->
2. 将 URL 中的版本更改为**下一个可用的小版本**，例如：

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
   ```

<!--
1. Save the file and exit your text editor. Continue following the relevant upgrade instructions.
-->
3. 保存文件并退出文本编辑器。继续按照相关的升级说明进行操作。

{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}

<!--
1. Open the file that defines the Kubernetes `yum` repository using a text editor of your choice:
-->
1. 使用你所选择的文本编辑器打开定义 Kubernetes `yum` 仓库的文件：

   ```shell
   nano /etc/yum.repos.d/kubernetes.repo
   ```

   <!--
   You should see a file with two URLs that contain your current Kubernetes
   minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
   you should see this:
   -->
   你应该看到一个文件包含当前 Kubernetes 小版本的两个 URL。
   例如，如果你正在使用 v{{< skew currentVersionAddMinor -1 "." >}}，你应该看到类似以下的输出：

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

<!--
1. Change the version in these URLs to **the next available minor release**, for example:
-->
2. 将这些 URL 中的版本更改为**下一个可用的小版本**，例如：

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

<!--
1. Save the file and exit your text editor. Continue following the relevant upgrade instructions.
-->
3. 保存文件并退出文本编辑器。继续按照相关的升级说明进行操作。

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
-->
* 参见如何[升级 Linux 节点的说明](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)。
* 参见如何[升级 Windows 节点的说明](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)。
