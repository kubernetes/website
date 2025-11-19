---
title: 更改 Kubernetes 軟件包倉庫
content_type: task
weight: 150
---
<!--
title: Changing The Kubernetes Package Repository
content_type: task
weight: 150
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
本頁介紹瞭如何在升級叢集時啓用包含 Kubernetes 次要版本的軟件包倉庫。
這僅適用於使用託管在 `pkgs.k8s.io` 上社區自治軟件包倉庫的使用者。
啓用新的 Kubernetes 小版本的軟件包倉庫。與傳統的軟件包倉庫不同，
社區自治的軟件包倉庫所採用的結構爲每個 Kubernetes 小版本都有一個專門的軟件包倉庫。

{{< note >}}
<!--
This guide only covers a part of the Kubernetes upgrade process. Please see the
[upgrade guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) for
more information about upgrading Kubernetes clusters.
-->
本指南僅介紹 Kubernetes 升級過程的一部分。
有關升級 Kubernetes 叢集的更多信息，
請參閱[升級指南](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
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
僅在將叢集升級到另一個**次要**版本時才需要執行此步驟。
如果你要升級到同一次要版本中的另一個補丁版本（例如：v{{< skew currentVersion >}}.5 到
v{{< skew currentVersion >}}.7）則不需要遵循本指南。
但是，如果你仍在使用舊的軟件包倉庫，則需要在升級之前遷移到社區自治的新軟件包倉庫
（有關如何執行此操作的更多詳細信息，請參閱下一節）。
{{</ note >}}

## {{% heading "prerequisites" %}}

<!--
This document assumes that you're already using the community-owned
package repositories (`pkgs.k8s.io`). If that's not the case, it's strongly
recommended to migrate to the community-owned package repositories as described
in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
本文假設你已經在使用社區自治的軟件包倉庫（`pkgs.k8s.io`）。如果不是這種情況，
強烈建議按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
遷移到社區自治的軟件包倉庫。

{{% legacy-repos-deprecation %}}

<!--
### Verifying if the Kubernetes package repositories are used

If you're unsure whether you're using the community-owned package repositories or the
legacy package repositories, take the following steps to verify:
-->
### 驗證是否正在使用 Kubernetes 軟件包倉庫

如果你不確定自己是在使用社區自治的軟件包倉庫還是在使用老舊的軟件包倉庫，
可以執行以下步驟進行驗證：

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
打印定義 Kubernetes `apt` 倉庫的文件的內容：

```shell
# 在你的系統上，此配置文件可能具有不同的名稱
pager /etc/apt/sources.list.d/kubernetes.list
```

如果你看到類似以下的一行：

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

<!--
**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).
-->
**你正在使用 Kubernetes 軟件包倉庫，本指南適用於你。**
否則，強烈建議按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
遷移到 Kubernetes 軟件包倉庫。

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
打印定義 Kubernetes `yum` 倉庫的文件的內容：

```shell
# 在你的系統上，此配置文件可能具有不同的名稱
cat /etc/yum.repos.d/kubernetes.repo
```

如果你看到的 `baseurl` 類似以下輸出中的 `baseurl`：

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
**你正在使用 Kubernetes 軟件包倉庫，本指南適用於你。**
否則，強烈建議按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
遷移到 Kubernetes 軟件包倉庫。

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
打印定義 Kubernetes `zypper` 倉庫的文件的內容：

```shell
# 在你的系統上，此配置文件可能具有不同的名稱
cat /etc/zypp/repos.d/kubernetes.repo
```

如果你看到的 `baseurl` 類似以下輸出中的 `baseurl`：

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
**你正在使用 Kubernetes 軟件包倉庫，本指南適用於你。**
否則，強烈建議按照[官方公告](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/)中所述，
遷移到 Kubernetes 軟件包倉庫。

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
<!--
The URL used for the Kubernetes package repositories is not limited to `pkgs.k8s.io`,
it can also be one of:
-->
Kubernetes 軟件包倉庫所用的 URL 不僅限於 `pkgs.k8s.io`，還可以是以下之一：

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
## 切換到其他 Kubernetes 軟件包倉庫  {#switching-to-another-kubernetes-package-repository}

在從一個 Kubernetes 小版本升級到另一個版本時，應執行此步驟以獲取所需 Kubernetes 小版本的軟件包訪問權限。

{{< tabs name="k8s_upgrade_versions" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

<!--
1. Open the file that defines the Kubernetes `apt` repository using a text editor of your choice:
-->
1. 使用你所選擇的文本編輯器打開定義 Kubernetes `apt` 倉庫的文件：

   ```shell
   nano /etc/apt/sources.list.d/kubernetes.list
   ```

   <!--
   You should see a single line with the URL that contains your current Kubernetes
   minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
   you should see this:
   -->
   你應該看到一行包含當前 Kubernetes 小版本的 URL。
   例如，如果你正在使用 v{{< skew currentVersionAddMinor -1 "." >}}，你應該看到類似以下的輸出：

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
   ```

<!--
1. Change the version in the URL to **the next available minor release**, for example:
-->
2. 將 URL 中的版本更改爲**下一個可用的小版本**，例如：

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
   ```

<!--
1. Save the file and exit your text editor. Continue following the relevant upgrade instructions.
-->
3. 保存文件並退出文本編輯器。繼續按照相關的升級說明進行操作。

{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}

<!--
1. Open the file that defines the Kubernetes `yum` repository using a text editor of your choice:
-->
1. 使用你所選擇的文本編輯器打開定義 Kubernetes `yum` 倉庫的文件：

   ```shell
   nano /etc/yum.repos.d/kubernetes.repo
   ```

   <!--
   You should see a file with two URLs that contain your current Kubernetes
   minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
   you should see this:
   -->
   你應該看到一個文件包含當前 Kubernetes 小版本的兩個 URL。
   例如，如果你正在使用 v{{< skew currentVersionAddMinor -1 "." >}}，你應該看到類似以下的輸出：

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
2. 將這些 URL 中的版本更改爲**下一個可用的小版本**，例如：

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
3. 保存文件並退出文本編輯器。繼續按照相關的升級說明進行操作。

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
-->
* 參見如何[升級 Linux 節點的說明](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)。
* 參見如何[升級 Windows 節點的說明](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)。
