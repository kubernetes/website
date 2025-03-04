---
title: Changing The Kubernetes Package Repository
content_type: task
weight: 120
---

<!-- overview -->

This page explains how to enable a package repository for the desired
Kubernetes minor release upon upgrading a cluster. This is only needed 
for users of the community-owned package repositories hosted at `pkgs.k8s.io`.
Unlike the legacy package repositories, the community-owned package
repositories are structured in a way that there's a dedicated package
repository for each Kubernetes minor version.

{{< note >}}
This guide only covers a part of the Kubernetes upgrade process. Please see the
[upgrade guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) for
more information about upgrading Kubernetes clusters.
{{</ note >}}

{{< note >}}
This step is only needed upon upgrading a cluster to another **minor** release.
If you're upgrading to another patch release within the same minor release (e.g.
v{{< skew currentVersion >}}.5 to v{{< skew currentVersion >}}.7), you don't
need to follow this guide. However, if you're still using the legacy package
repositories, you'll need to migrate to the new community-owned package
repositories before upgrading (see the next section for more details on how to
do this).
{{</ note >}}

## {{% heading "prerequisites" %}}

This document assumes that you're already using the community-owned
package repositories (`pkgs.k8s.io`). If that's not the case, it's strongly
recommended to migrate to the community-owned package repositories as described
in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% legacy-repos-deprecation %}}

### Verifying if the Kubernetes package repositories are used

If you're unsure whether you're using the community-owned package repositories or the
legacy package repositories, take the following steps to verify:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

Print the contents of the file that defines the Kubernetes `apt` repository:

```shell
# On your system, this configuration file could have a different name
pager /etc/apt/sources.list.d/kubernetes.list
```

If you see a line similar to:

```
deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
```

**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

Print the contents of the file that defines the Kubernetes `yum` repository:

```shell
# On your system, this configuration file could have a different name
cat /etc/yum.repos.d/kubernetes.repo
```

If you see a `baseurl` similar to the `baseurl` in the output below:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}

{{% tab name="openSUSE or SLES" %}}

Print the contents of the file that defines the Kubernetes `zypper` repository:

```shell
# On your system, this configuration file could have a different name
cat /etc/zypp/repos.d/kubernetes.repo
```

If you see a `baseurl` similar to the `baseurl` in the output below:

```
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl
```

**You're using the Kubernetes package repositories and this guide applies to you.**
Otherwise, it's strongly recommended to migrate to the Kubernetes package repositories
as described in the [official announcement](/blog/2023/08/15/pkgs-k8s-io-introduction/).

{{% /tab %}}
{{< /tabs >}}

{{< note >}}
The URL used for the Kubernetes package repositories is not limited to `pkgs.k8s.io`,
it can also be one of:

- `pkgs.k8s.io`
- `pkgs.kubernetes.io`
- `packages.kubernetes.io`
{{</ note >}}

<!-- steps -->

## Switching to another Kubernetes package repository

This step should be done upon upgrading from one to another Kubernetes minor
release in order to get access to the packages of the desired Kubernetes minor
version.

{{< tabs name="k8s_upgrade_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

1. Open the file that defines the Kubernetes `apt` repository using a text editor of your choice:

   ```shell
   nano /etc/apt/sources.list.d/kubernetes.list
   ```

   You should see a single line with the URL that contains your current Kubernetes
   minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
   you should see this:

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/deb/ /
   ```

1. Change the version in the URL to **the next available minor release**, for example:

   ```
   deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /
   ```

1. Save the file and exit your text editor. Continue following the relevant upgrade instructions.

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

1. Open the file that defines the Kubernetes `yum` repository using a text editor of your choice:

   ```shell
   nano /etc/yum.repos.d/kubernetes.repo
   ```

   You should see a file with two URLs that contain your current Kubernetes
   minor version. For example, if you're using v{{< skew currentVersionAddMinor -1 "." >}},
   you should see this:

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/v{{< skew currentVersionAddMinor -1 "." >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Change the version in these URLs to **the next available minor release**, for example:

   ```
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   ```

1. Save the file and exit your text editor. Continue following the relevant upgrade instructions.

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
