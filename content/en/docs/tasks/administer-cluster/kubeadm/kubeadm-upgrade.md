---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_type: task
weight: 20
min-kubernetes-server-version: 1.19
---

<!-- overview -->

This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
1.18.x to version 1.19.x, and from version 1.19.x to 1.19.y (where `y > x`).

To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:

- [Upgrading kubeadm cluster from 1.17 to 1.18](https://v1-18.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.16 to 1.17](https://v1-17.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.15 to 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.14 to 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [Upgrading kubeadm cluster from 1.13 to 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)

The upgrade workflow at high level is the following:

1. Upgrade the primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.

## {{% heading "prerequisites" %}}

- You need to have a kubeadm Kubernetes cluster running version 1.18.0 or later.
- [Swap must be disabled](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).
- The cluster should use a static control plane and etcd pods or external etcd.
- Make sure you read the [release notes]({{< latest-release-notes >}}) carefully.
- Make sure to back up any important components, such as app-level state stored in a database.
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.

### Additional information

- All containers are restarted after upgrade, because the container spec hash value is changed.
- You only can upgrade from one MINOR version to the next MINOR version,
  or between PATCH versions of the same MINOR. That is, you cannot skip MINOR versions when you upgrade.
  For example, you can upgrade from 1.y to 1.y+1, but not from 1.y to 1.y+2.

<!-- steps -->

## Determine which version to upgrade to

Find the latest stable 1.19 version:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache madison kubeadm
    # find the latest 1.19 version in the list
    # it should look like 1.19.x-00, where x is the latest patch
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # find the latest 1.19 version in the list
    # it should look like 1.19.x-0, where x is the latest patch
{{% /tab %}}
{{< /tabs >}}

## Upgrading control plane nodes

### Upgrade the first control plane node

-  On your first control plane node, upgrade kubeadm:

{{< tabs name="k8s_install_kubeadm_first_cp" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.19.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.19.x-00 && \
    apt-mark hold kubeadm
    -
    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm=1.19.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.19.x-0 with the latest patch version
    yum install -y kubeadm-1.19.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

-  Verify that the download works and has the expected version:

    ```shell
    kubeadm version
    ```

-  Drain the control plane node:

    ```shell
    # replace <cp-node-name> with the name of your control plane node
    kubectl drain <cp-node-name> --ignore-daemonsets
    ```

-   On the control plane node, run:

    ```shell
    sudo kubeadm upgrade plan
    ```

    You should see output similar to this:

    ```
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [preflight] Running pre-flight checks.
    [upgrade] Running cluster health checks
    [upgrade] Fetching available versions to upgrade to
    [upgrade/versions] Cluster version: v1.18.4
    [upgrade/versions] kubeadm version: v1.19.0
    [upgrade/versions] Latest stable version: v1.19.0
    [upgrade/versions] Latest version in the v1.18 series: v1.18.4

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT             AVAILABLE
    Kubelet     1 x v1.18.4         v1.19.0

    Upgrade to the latest version in the v1.18 series:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.18.4   v1.19.0
    Controller Manager   v1.18.4   v1.19.0
    Scheduler            v1.18.4   v1.19.0
    Kube Proxy           v1.18.4   v1.19.0
    CoreDNS              1.6.7     1.7.0
    Etcd                 3.4.3-0   3.4.7-0

    You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.19.0

    _____________________________________________________________________

    The table below shows the current state of component configs as understood by this version of kubeadm.
    Configs that have a "yes" mark in the "MANUAL UPGRADE REQUIRED" column require manual config upgrade or
    resetting to kubeadm defaults before a successful upgrade can be performed. The version to manually
    upgrade to is denoted in the "PREFERRED VERSION" column.

    API GROUP                 CURRENT VERSION   PREFERRED VERSION   MANUAL UPGRADE REQUIRED
    kubeproxy.config.k8s.io   v1alpha1          v1alpha1            no
    kubelet.config.k8s.io     v1beta1           v1beta1             no
    _____________________________________________________________________

    ```

    This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
    It also shows a table with the component config version states.

{{< note >}}
`kubeadm upgrade` also automatically renews the certificates that it manages on this node.
To opt-out of certificate renewal the flag `--certificate-renewal=false` can be used.
For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
{{</ note >}}

{{< note >}}
If `kubeadm upgrade plan` shows any component configs that require manual upgrade, users must provide
a config file with replacement configs to `kubeadm upgrade apply` via the `--config` command line flag.
Failing to do so will cause `kubeadm upgrade apply` to exit with an error and not perform an upgrade.
{{</ note >}}

-  Choose a version to upgrade to, and run the appropriate command. For example:

    ```shell
    # replace x with the patch version you picked for this upgrade
    sudo kubeadm upgrade apply v1.19.x
    ```


    You should see output similar to this:

    ```
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [preflight] Running pre-flight checks.
    [upgrade] Running cluster health checks
    [upgrade/version] You have chosen to change the cluster version to "v1.19.0"
    [upgrade/versions] Cluster version: v1.18.4
    [upgrade/versions] kubeadm version: v1.19.0
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Pulling images required for setting up a Kubernetes cluster
    [upgrade/prepull] This might take a minute or two, depending on the speed of your internet connection
    [upgrade/prepull] You can also perform this action in beforehand using 'kubeadm config images pull'
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.19.0"...
    Static pod: kube-apiserver-kind-control-plane hash: b4c8effe84b4a70031f9a49a20c8b003
    Static pod: kube-controller-manager-kind-control-plane hash: 9ac092f0ca813f648c61c4d5fcbf39f2
    Static pod: kube-scheduler-kind-control-plane hash: 7da02f2c78da17af7c2bf1533ecf8c9a
    [upgrade/etcd] Upgrading to TLS for etcd
    Static pod: etcd-kind-control-plane hash: 171c56cd0e81c0db85e65d70361ceddf
    [upgrade/staticpods] Preparing for "etcd" upgrade
    [upgrade/staticpods] Renewing etcd-server certificate
    [upgrade/staticpods] Renewing etcd-peer certificate
    [upgrade/staticpods] Renewing etcd-healthcheck-client certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/etcd.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-07-13-16-24-16/etcd.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: etcd-kind-control-plane hash: 171c56cd0e81c0db85e65d70361ceddf
    Static pod: etcd-kind-control-plane hash: 171c56cd0e81c0db85e65d70361ceddf
    Static pod: etcd-kind-control-plane hash: 59e40b2aab1cd7055e64450b5ee438f0
    [apiclient] Found 1 Pods for label selector component=etcd
    [upgrade/staticpods] Component "etcd" upgraded successfully!
    [upgrade/etcd] Waiting for etcd to become available
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests999800980"
    [upgrade/staticpods] Preparing for "kube-apiserver" upgrade
    [upgrade/staticpods] Renewing apiserver certificate
    [upgrade/staticpods] Renewing apiserver-kubelet-client certificate
    [upgrade/staticpods] Renewing front-proxy-client certificate
    [upgrade/staticpods] Renewing apiserver-etcd-client certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-07-13-16-24-16/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-apiserver-kind-control-plane hash: b4c8effe84b4a70031f9a49a20c8b003
    Static pod: kube-apiserver-kind-control-plane hash: b4c8effe84b4a70031f9a49a20c8b003
    Static pod: kube-apiserver-kind-control-plane hash: b4c8effe84b4a70031f9a49a20c8b003
    Static pod: kube-apiserver-kind-control-plane hash: b4c8effe84b4a70031f9a49a20c8b003
    Static pod: kube-apiserver-kind-control-plane hash: f717874150ba572f020dcd89db8480fc
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Preparing for "kube-controller-manager" upgrade
    [upgrade/staticpods] Renewing controller-manager.conf certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-07-13-16-24-16/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-controller-manager-kind-control-plane hash: 9ac092f0ca813f648c61c4d5fcbf39f2
    Static pod: kube-controller-manager-kind-control-plane hash: b155b63c70e798b806e64a866e297dd0
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Preparing for "kube-scheduler" upgrade
    [upgrade/staticpods] Renewing scheduler.conf certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-07-13-16-24-16/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-scheduler-kind-control-plane hash: 7da02f2c78da17af7c2bf1533ecf8c9a
    Static pod: kube-scheduler-kind-control-plane hash: 260018ac854dbf1c9fe82493e88aec31
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.19" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to get nodes
    [bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    W0713 16:26:14.074656    2986 dns.go:282] the CoreDNS Configuration will not be migrated due to unsupported version of CoreDNS. The existing CoreDNS Corefile configuration and deployment has been retained.
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.19.0". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

-  Manually upgrade your CNI provider plugin.

    Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
    Check the [addons](/docs/concepts/cluster-administration/addons/) page to
    find your CNI provider and see whether additional upgrade steps are required.

    This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.

-  Uncordon the control plane node:

    ```shell
    # replace <cp-node-name> with the name of your control plane node
    kubectl uncordon <cp-node-name>
    ```

### Upgrade additional control plane nodes

Same as the first control plane node but use:

```
sudo kubeadm upgrade node
```

instead of:

```
sudo kubeadm upgrade apply
```

Also `sudo kubeadm upgrade plan` is not needed.

### Upgrade kubelet and kubectl

Upgrade the kubelet and kubectl on all control plane nodes:

{{< tabs name="k8s_install_kubelet" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.19.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.19.x-00 kubectl=1.19.x-00 && \
    apt-mark hold kubelet kubectl
    -
    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet=1.19.x-00 kubectl=1.19.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.19.x-0 with the latest patch version
    yum install -y kubelet-1.19.x-0 kubectl-1.19.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

Restart the kubelet

```shell
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

## Upgrade worker nodes

The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.

### Upgrade kubeadm

-  Upgrade kubeadm on all worker nodes:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.19.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.19.x-00 && \
    apt-mark hold kubeadm
    -
    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm=1.19.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.19.x-0 with the latest patch version
    yum install -y kubeadm-1.19.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

### Drain the node

-  Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

    ```shell
    # replace <node-to-drain> with the name of your node you are draining
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    You should see output similar to this:

    ```
    node/ip-172-31-85-18 cordoned
    WARNING: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-dj7d7, kube-system/weave-net-z65qx
    node/ip-172-31-85-18 drained
    ```

### Upgrade the kubelet configuration

-  Call the following command:

    ```shell
    sudo kubeadm upgrade node
    ```

### Upgrade kubelet and kubectl

-  Upgrade the kubelet and kubectl on all worker nodes:

{{< tabs name="k8s_kubelet_and_kubectl" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.19.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.19.x-00 kubectl=1.19.x-00 && \
    apt-mark hold kubelet kubectl
    -
    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet=1.19.x-00 kubectl=1.19.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.19.x-0 with the latest patch version
    yum install -y kubelet-1.19.x-0 kubectl-1.19.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

-  Restart the kubelet

    ```shell
    sudo systemctl daemon-reload
    sudo systemctl restart kubelet
    ```

### Uncordon the node

-   Bring the node back online by marking it schedulable:

    ```shell
    # replace <node-to-drain> with the name of your node
    kubectl uncordon <node-to-drain>
    ```

## Verify the status of the cluster

After the kubelet is upgraded on all nodes verify that all nodes are available again by running the following command from anywhere kubectl can access the cluster:

```shell
kubectl get nodes
```

The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.



## Recovering from a failure state

If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.

To recover from a bad state, you can also run `kubeadm upgrade apply --force` without changing the version that your cluster is running.

During upgrade kubeadm writes the following backup folders under `/etc/kubernetes/tmp`:
- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` contains a backup of the local etcd member data for this control-plane Node.
In case of an etcd upgrade failure and if the automatic rollback does not work, the contents of this folder
can be manually restored in `/var/lib/etcd`. In case external etcd is used this backup folder will be empty.

`kubeadm-backup-manifests` contains a backup of the static Pod manifest files for this control-plane Node.
In case of a upgrade failure and if the automatic rollback does not work, the contents of this folder can be
manually restored in `/etc/kubernetes/manifests`. If for some reason there is no difference between a pre-upgrade
and post-upgrade manifest file for a certain component, a backup file for it will not be written.

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
- Applies the new `kube-dns` and `kube-proxy` manifests and makes sure that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.

`kubeadm upgrade node` does the following on additional control plane nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Optionally backups the kube-apiserver certificate.
- Upgrades the static Pod manifests for the control plane components.
- Upgrades the kubelet configuration for this node.

`kubeadm upgrade node` does the following on worker nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Upgrades the kubelet configuration for this node.
