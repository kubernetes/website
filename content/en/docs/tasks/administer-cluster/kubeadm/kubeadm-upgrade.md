---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_template: templates/task
---

{{% capture overview %}}

This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
1.15.x to version 1.16.x, and from version 1.16.x to 1.16.y (where `y > x`).

To see information about upgrading clusters created using older versions of kubeadm,
please pick a Kubernetes version from the drop down menu of this web page.

The upgrade workflow at high level is the following:

1. Upgrade the primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.

{{% /capture %}}

{{% capture prerequisites %}}

- You need to have a kubeadm Kubernetes cluster running version 1.15.0 or later.
- [Swap must be disabled](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).
- The cluster should use a static control plane and etcd pods or external etcd.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.16.md) carefully.
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

1.  Find the latest stable 1.16 version:

    {{< tabs name="k8s_install_versions" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache policy kubeadm
    # find the latest 1.16 version in the list
    # it should look like 1.16.x-00, where x is the latest patch
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # find the latest 1.16 version in the list
    # it should look like 1.16.x-0, where x is the latest patch
    {{% /tab %}}
    {{< /tabs >}}

## Upgrading control plane nodes

### Upgrade the first control plane node

1.  On your first control plane node, upgrade kubeadm:

    {{< tabs name="k8s_install_kubeadm_first_cp" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.16.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.16.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.16.x-0 with the latest patch version
    yum install -y kubeadm-1.16.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  Verify that the download works and has the expected version:

    ```shell
    kubeadm version
    ```

1.  On the control plane node, run:

    ```shell
    sudo kubeadm upgrade plan
    ```

    You should see output similar to this:

    ```shell
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade] Fetching available versions to upgrade to
    [upgrade/versions] Cluster version: v1.15.2
    [upgrade/versions] kubeadm version: v1.16.0

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT       AVAILABLE
    Kubelet     1 x v1.15.2   v1.16.0

    Upgrade to the latest version in the v1.16 series:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.15.2   v1.16.0
    Controller Manager   v1.15.2   v1.16.0
    Scheduler            v1.15.2   v1.16.0
    Kube Proxy           v1.15.2   v1.16.0
    CoreDNS              1.3.1     1.6.2
    Etcd                 3.3.10    3.3.15

    You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.16.0

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
    sudo kubeadm upgrade apply v1.16.x
    ```

    - Replace `x` with the patch version you picked for this upgrade.

    You should see output similar to this:

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade/version] You have chosen to change the cluster version to "v1.16.0"
    [upgrade/versions] Cluster version: v1.15.2
    [upgrade/versions] kubeadm version: v1.16.0
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
    [upgrade/prepull] Prepulling image for component etcd.
    [upgrade/prepull] Prepulling image for component kube-apiserver.
    [upgrade/prepull] Prepulling image for component kube-controller-manager.
    [upgrade/prepull] Prepulling image for component kube-scheduler.
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-etcd
    [upgrade/prepull] Prepulled image for component etcd.
    [upgrade/prepull] Prepulled image for component kube-controller-manager.
    [upgrade/prepull] Prepulled image for component kube-apiserver.
    [upgrade/prepull] Prepulled image for component kube-scheduler.
    [upgrade/prepull] Successfully prepulled the images for all the control plane components
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.16.0"...
    Static pod: kube-apiserver-luboitvbox hash: 8d931c2296a38951e95684cbcbe3b923
    Static pod: kube-controller-manager-luboitvbox hash: 2480bf6982ad2103c05f6764e20f2787
    Static pod: kube-scheduler-luboitvbox hash: 9b290132363a92652555896288ca3f88
    [upgrade/etcd] Upgrading to TLS for etcd
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests446257614"
    [upgrade/staticpods] Preparing for "kube-apiserver" upgrade
    [upgrade/staticpods] Renewing "apiserver-etcd-client" certificate
    [upgrade/staticpods] Renewing "apiserver" certificate
    [upgrade/staticpods] Renewing "apiserver-kubelet-client" certificate
    [upgrade/staticpods] Renewing "front-proxy-client" certificate
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-06-05-23-38-03/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-apiserver-luboitvbox hash: 8d931c2296a38951e95684cbcbe3b923
    Static pod: kube-apiserver-luboitvbox hash: 1b4e2b09a408c844f9d7b535e593ead9
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Preparing for "kube-controller-manager" upgrade
    [upgrade/staticpods] Renewing certificate embedded in "controller-manager.conf"
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-06-05-23-38-03/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-controller-manager-luboitvbox hash: 2480bf6982ad2103c05f6764e20f2787
    Static pod: kube-controller-manager-luboitvbox hash: 6617d53423348aa619f1d6e568bb894a
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Preparing for "kube-scheduler" upgrade
    [upgrade/staticpods] Renewing certificate embedded in "scheduler.conf"
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-06-05-23-38-03/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-scheduler-luboitvbox hash: 9b290132363a92652555896288ca3f88
    Static pod: kube-scheduler-luboitvbox hash: edf58ab819741a5d1eb9c33de756e3ca
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [upgrade/staticpods] Renewing certificate embedded in "admin.conf"
    [upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.16" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.16" ConfigMap in the kube-system namespace
    [kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.16.0". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

1.  Manually upgrade your CNI provider plugin.

    Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
    Check the [addons](/docs/concepts/cluster-administration/addons/) page to
    find your CNI provider and see whether additional upgrade steps are required.

    This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.

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
    # replace x in 1.16.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.16.x-00 kubectl=1.16.x-00 && \
    apt-mark hold kubelet kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.16.x-0 with the latest patch version
    yum install -y kubelet-1.16.x-0 kubectl-1.16.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1. Restart the kubelet

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
    # replace x in 1.16.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.16.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.16.x-0 with the latest patch version
    yum install -y kubeadm-1.16.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

### Drain the node

1.  Prepare the node for maintenance by marking it unschedulable and evicting the workloads. Run:

    ```shell
    kubectl drain $NODE --ignore-daemonsets
    ```

    You should see output similar to this:

    ```shell
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
    # replace x in 1.16.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.16.x-00 kubectl=1.16.x-00 && \
    apt-mark hold kubelet kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.16.x-0 with the latest patch version
    yum install -y kubelet-1.16.x-0 kubectl-1.16.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1. Restart the kubelet

    ```shell
    sudo systemctl restart kubelet
    ```

### Uncordon the node

1.  Bring the node back online by marking it schedulable:

    ```shell
    kubectl uncordon $NODE
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

To recover from a bad state, you can also run `kubeadm upgrade --force` without changing the version that your cluster is running.

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
