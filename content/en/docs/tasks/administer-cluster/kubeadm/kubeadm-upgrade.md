---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_template: templates/task
weight: 20
min-kubernetes-server-version: 1.18
---

{{% capture overview %}}

This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
1.17.x to version 1.18.x, and from version 1.18.x to 1.18.y (where `y > x`).

To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:

- [Upgrading kubeadm cluster from 1.16 to 1.17](https://v1-17.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.15 to 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.14 to 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [Upgrading kubeadm cluster from 1.13 to 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)

The upgrade workflow at high level is the following:

1. Upgrade the primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.

{{% /capture %}}

{{% capture prerequisites %}}

- You need to have a kubeadm Kubernetes cluster running version 1.17.0 or later.
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

{{% /capture %}}

{{% capture steps %}}

## Determine which version to upgrade to

1.  Find the latest stable 1.18 version:

    {{< tabs name="k8s_install_versions" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache madison kubeadm
    # find the latest 1.18 version in the list
    # it should look like 1.18.x-00, where x is the latest patch
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # find the latest 1.18 version in the list
    # it should look like 1.18.x-0, where x is the latest patch
    {{% /tab %}}
    {{< /tabs >}}

## Upgrading control plane nodes

### Upgrade the first control plane node

1.  On your first control plane node, upgrade kubeadm:

    {{< tabs name="k8s_install_kubeadm_first_cp" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.18.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.18.x-00 && \
    apt-mark hold kubeadm

    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm=1.18.x-00
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.18.x-0 with the latest patch version
    yum install -y kubeadm-1.18.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  Verify that the download works and has the expected version:

    ```shell
    kubeadm version
    ```

1.  Drain the control plane node:

    ```shell
    # replace <cp-node-name> with the name of your control plane node
    kubectl drain <cp-node-name> --ignore-daemonsets
    ```

1.  On the control plane node, run:

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
    [upgrade/versions] Cluster version: v1.17.3
    [upgrade/versions] kubeadm version: v1.18.0
    [upgrade/versions] Latest stable version: v1.18.0
    [upgrade/versions] Latest version in the v1.17 series: v1.18.0

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT             AVAILABLE
    Kubelet     1 x v1.17.3   v1.18.0

    Upgrade to the latest version in the v1.17 series:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.17.3   v1.18.0
    Controller Manager   v1.17.3   v1.18.0
    Scheduler            v1.17.3   v1.18.0
    Kube Proxy           v1.17.3   v1.18.0
    CoreDNS              1.6.5     1.6.7
    Etcd                 3.4.3     3.4.3-0

    You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.18.0

    _____________________________________________________________________
    ```

    This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.

    {{< note >}}
    `kubeadm upgrade` also automatically renews the certificates that it manages on this node.
    To opt-out of certificate renewal the flag `--certificate-renewal=false` can be used.
    For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
    {{</ note >}}

1.  Choose a version to upgrade to, and run the appropriate command. For example:

    ```shell
    # replace x with the patch version you picked for this upgrade
    sudo kubeadm upgrade apply v1.18.x
    ```


    You should see output similar to this:

    ```
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [preflight] Running pre-flight checks.
    [upgrade] Running cluster health checks
    [upgrade/version] You have chosen to change the cluster version to "v1.18.0"
    [upgrade/versions] Cluster version: v1.17.3
    [upgrade/versions] kubeadm version: v1.18.0
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
    [upgrade/prepull] Prepulling image for component etcd.
    [upgrade/prepull] Prepulling image for component kube-apiserver.
    [upgrade/prepull] Prepulling image for component kube-controller-manager.
    [upgrade/prepull] Prepulling image for component kube-scheduler.
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [upgrade/prepull] Prepulled image for component etcd.
    [upgrade/prepull] Prepulled image for component kube-apiserver.
    [upgrade/prepull] Prepulled image for component kube-controller-manager.
    [upgrade/prepull] Prepulled image for component kube-scheduler.
    [upgrade/prepull] Successfully prepulled the images for all the control plane components
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.18.0"...
    Static pod: kube-apiserver-myhost hash: 2cc222e1a577b40a8c2832320db54b46
    Static pod: kube-controller-manager-myhost hash: f7ce4bc35cb6e646161578ac69910f18
    Static pod: kube-scheduler-myhost hash: e3025acd90e7465e66fa19c71b916366
    [upgrade/etcd] Upgrading to TLS for etcd
    [upgrade/etcd] Non fatal issue encountered during upgrade: the desired etcd version for this Kubernetes version "v1.18.0" is "3.4.3-0", but the current etcd version is "3.4.3". Won't downgrade etcd, instead just continue
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests308527012"
    W0308 18:48:14.535122    3082 manifests.go:225] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
    [upgrade/staticpods] Preparing for "kube-apiserver" upgrade
    [upgrade/staticpods] Renewing apiserver certificate
    [upgrade/staticpods] Renewing apiserver-kubelet-client certificate
    [upgrade/staticpods] Renewing front-proxy-client certificate
    [upgrade/staticpods] Renewing apiserver-etcd-client certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-03-08-18-48-14/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-apiserver-myhost hash: 2cc222e1a577b40a8c2832320db54b46
    Static pod: kube-apiserver-myhost hash: 609429acb0d71dce6725836dd97d8bf4
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Preparing for "kube-controller-manager" upgrade
    [upgrade/staticpods] Renewing controller-manager.conf certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-03-08-18-48-14/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-controller-manager-myhost hash: f7ce4bc35cb6e646161578ac69910f18
    Static pod: kube-controller-manager-myhost hash: c7a1232ba2c5dc15641c392662fe5156
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Preparing for "kube-scheduler" upgrade
    [upgrade/staticpods] Renewing scheduler.conf certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-03-08-18-48-14/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-scheduler-myhost hash: e3025acd90e7465e66fa19c71b916366
    Static pod: kube-scheduler-myhost hash: b1b721486ae0ac504c160dcdc457ab0d
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.18" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.18" ConfigMap in the kube-system namespace
    [kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.18.0". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

1.  Manually upgrade your CNI provider plugin.

    Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
    Check the [addons](/docs/concepts/cluster-administration/addons/) page to
    find your CNI provider and see whether additional upgrade steps are required.

    This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.

1.  Uncordon the control plane node:

    ```shell
    # replace <cp-node-name> with the name of your control plane node
    kubectl uncordon <cp-node-name>
    ```

### Upgrade additional control plane nodes

1.  Same as the first control plane node but use:

    ```
    sudo kubeadm upgrade node
    ```

    instead of:

    ```
    sudo kubeadm upgrade apply
    ```

    Also `sudo kubeadm upgrade plan` is not needed.

### Upgrade kubelet and kubectl

1.  Upgrade the kubelet and kubectl on all control plane nodes:

    {{< tabs name="k8s_install_kubelet" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.18.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.18.x-00 kubectl=1.18.x-00 && \
    apt-mark hold kubelet kubectl

    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet=1.18.x-00 kubectl=1.18.x-00
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.18.x-0 with the latest patch version
    yum install -y kubelet-1.18.x-0 kubectl-1.18.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  Restart the kubelet

    ```shell
    sudo systemctl restart kubelet
    ```

## Upgrade worker nodes

The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.

### Upgrade kubeadm

1.  Upgrade kubeadm on all worker nodes:

    {{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.18.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.18.x-00 && \
    apt-mark hold kubeadm

    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm=1.18.x-00
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.18.x-0 with the latest patch version
    yum install -y kubeadm-1.18.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

### Drain the node

1.  Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

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

1.  Call the following command:

    ```shell
    sudo kubeadm upgrade node
    ```

### Upgrade kubelet and kubectl

1.  Upgrade the kubelet and kubectl on all worker nodes:

    {{< tabs name="k8s_kubelet_and_kubectl" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.18.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.18.x-00 kubectl=1.18.x-00 && \
    apt-mark hold kubelet kubectl

    # since apt-get version 1.1 you can also use the following method
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet=1.18.x-00 kubectl=1.18.x-00
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.18.x-0 with the latest patch version
    yum install -y kubelet-1.18.x-0 kubectl-1.18.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  Restart the kubelet

    ```shell
    sudo systemctl restart kubelet
    ```

### Uncordon the node

1.  Bring the node back online by marking it schedulable:

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

{{% /capture %}}

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
