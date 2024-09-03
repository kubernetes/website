---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_type: task
weight: 40
---

<!-- overview -->

This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
{{< skew currentVersionAddMinor -1 >}}.x to version {{< skew currentVersion >}}.x, and from version
{{< skew currentVersion >}}.x to {{< skew currentVersion >}}.y (where `y > x`). Skipping MINOR versions
when upgrading is unsupported. For more details, please visit [Version Skew Policy](/releases/version-skew-policy/).

To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:

- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -2 >}} to {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -3 >}} to {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -4 >}} to {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -5 >}} to {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

The upgrade workflow at high level is the following:

1. Upgrade a primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.

## {{% heading "prerequisites" %}}

- Make sure you read the [release notes](https://git.k8s.io/kubernetes/CHANGELOG) carefully.
- The cluster should use a static control plane and etcd pods or external etcd.
- Make sure to back up any important components, such as app-level state stored in a database.
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
- [Swap must be disabled](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).

### Additional information

- The instructions below outline when to drain each node during the upgrade process.
  If you are performing a **minor** version upgrade for any kubelet, you **must**
  first drain the node (or nodes) that you are upgrading. In the case of control plane nodes,
  they could be running CoreDNS Pods or other critical workloads. For more information see
  [Draining nodes](/docs/tasks/administer-cluster/safely-drain-node/).
- The Kubernetes project recommends that you match your kubelet and kubeadm versions.
  You can instead use a version of kubelet that is older than kubeadm, provided it is within the
  range of supported versions.
  For more details, please visit [kubeadm's skew against the kubelet](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet).
- All containers are restarted after upgrade, because the container spec hash value is changed.
- To verify that the kubelet service has successfully restarted after the kubelet has been upgraded,
  you can execute `systemctl status kubelet` or view the service logs with `journalctl -xeu kubelet`.
- `kubeadm upgrade` supports `--config` with a
[`UpgradeConfiguration` API type](/docs/reference/config-api/kubeadm-config.v1beta4) which can
be used to configure the upgrade process.
- `kubeadm upgrade` does not support reconfiguration of an existing cluster. Follow the steps in
  [Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) instead.

### Considerations when upgrading etcd

Because the `kube-apiserver` static pod is running at all times (even if you
have drained the node), when you perform a kubeadm upgrade which includes an
etcd upgrade, in-flight requests to the server will stall while the new etcd
static pod is restarting. As a workaround, it is possible to actively stop the
`kube-apiserver` process a few seconds before starting the `kubeadm upgrade
apply` command. This permits to complete in-flight requests and close existing
connections, and minimizes the consequence of the etcd downtime. This can be
done as follows on control plane nodes:

```shell
killall -s SIGTERM kube-apiserver # trigger a graceful kube-apiserver shutdown
sleep 20 # wait a little bit to permit completing in-flight requests
kubeadm upgrade ... # execute a kubeadm upgrade command
```

<!-- steps -->

## Changing the package repository

If you're using the community-owned package repositories (`pkgs.k8s.io`), you need to
enable the package repository for the desired Kubernetes minor release. This is explained in
[Changing the Kubernetes package repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)
document.

{{% legacy-repos-deprecation %}}

## Determine which version to upgrade to

Find the latest patch release for Kubernetes {{< skew currentVersion >}} using the OS package manager:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}

```shell
# Find the latest {{< skew currentVersion >}} version in the list.
# It should look like {{< skew currentVersion >}}.x-*, where x is the latest patch.
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}

```shell
# Find the latest {{< skew currentVersion >}} version in the list.
# It should look like {{< skew currentVersion >}}.x-*, where x is the latest patch.
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

## Upgrading control plane nodes

The upgrade procedure on control plane nodes should be executed one node at a time.
Pick a control plane node that you wish to upgrade first. It must have the `/etc/kubernetes/admin.conf` file.

### Call "kubeadm upgrade"

**For the first control plane node**

1. Upgrade kubeadm:

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu, Debian or HypriotOS" %}}

   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL or Fedora" %}}

   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Verify that the download works and has the expected version:

   ```shell
   kubeadm version
   ```

1. Verify the upgrade plan:

   ```shell
   sudo kubeadm upgrade plan
   ```

   This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
   It also shows a table with the component config version states.

   {{< note >}}
   `kubeadm upgrade` also automatically renews the certificates that it manages on this node.
   To opt-out of certificate renewal the flag `--certificate-renewal=false` can be used.
   For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
   {{</ note >}}

1. Choose a version to upgrade to, and run the appropriate command. For example:

   ```shell
   # replace x with the patch version you picked for this upgrade
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```

   Once the command finishes you should see:

   ```
   [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

   [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
   ```

   {{< note >}}
   For versions earlier than v1.28, kubeadm defaulted to a mode that upgrades the addons (including CoreDNS and kube-proxy)
   immediately during `kubeadm upgrade apply`, regardless of whether there are other control plane instances that have not
   been upgraded. This may cause compatibility problems. Since v1.28, kubeadm defaults to a mode that checks whether all
   the control plane instances have been upgraded before starting to upgrade the addons. You must perform control plane
   instances upgrade sequentially or at least ensure that the last control plane instance upgrade is not started until all
   the other control plane instances have been upgraded completely, and the addons upgrade will be performed after the last
   control plane instance is upgraded.
   {{</ note >}}

1. Manually upgrade your CNI provider plugin.

   Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see whether additional upgrade steps are required.

   This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.

**For the other control plane nodes**

Same as the first control plane node but use:

```shell
sudo kubeadm upgrade node
```

instead of:

```shell
sudo kubeadm upgrade apply
```

Also calling `kubeadm upgrade plan` and upgrading the CNI provider plugin is no longer needed.

### Drain the node

Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

```shell
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```

### Upgrade kubelet and kubectl

1. Upgrade the kubelet and kubectl:

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu, Debian or HypriotOS" %}}

   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS, RHEL or Fedora" %}}

   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. Restart the kubelet:

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### Uncordon the node

Bring the node back online by marking it schedulable:

```shell
# replace <node-to-uncordon> with the name of your node
kubectl uncordon <node-to-uncordon>
```

## Upgrade worker nodes

The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.

The following pages show how to upgrade Linux and Windows worker nodes:

* [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
* [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

## Verify the status of the cluster

After the kubelet is upgraded on all nodes verify that all nodes are available again by running
the following command from anywhere kubectl can access the cluster:

```shell
kubectl get nodes
```

The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.

## Recovering from a failure state

If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.

To recover from a bad state, you can also run `sudo kubeadm upgrade apply --force` without changing the version that your cluster is running.

During upgrade kubeadm writes the following backup folders under `/etc/kubernetes/tmp`:

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` contains a backup of the local etcd member data for this control plane Node.
In case of an etcd upgrade failure and if the automatic rollback does not work, the contents of this folder
can be manually restored in `/var/lib/etcd`. In case external etcd is used this backup folder will be empty.

`kubeadm-backup-manifests` contains a backup of the static Pod manifest files for this control plane Node.
In case of a upgrade failure and if the automatic rollback does not work, the contents of this folder can be
manually restored in `/etc/kubernetes/manifests`. If for some reason there is no difference between a pre-upgrade
and post-upgrade manifest file for a certain component, a backup file for it will not be written.

{{< note >}}
After the cluster upgrade using kubeadm, the backup directory `/etc/kubernetes/tmp` will remain and
these backup files will need to be cleared manually.
{{</ note >}}

## How it works

`kubeadm upgrade apply` does the following:

- Checks that your cluster is in an upgradeable state:
  - The API server is reachable
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Generates replacements and/or uses user supplied overwrites if component configs require version upgrades.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `CoreDNS` and `kube-proxy` manifests and makes sure that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.

`kubeadm upgrade node` does the following on additional control plane nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Optionally backups the kube-apiserver certificate.
- Upgrades the static Pod manifests for the control plane components.
- Upgrades the kubelet configuration for this node.

`kubeadm upgrade node` does the following on worker nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Upgrades the kubelet configuration for this node.