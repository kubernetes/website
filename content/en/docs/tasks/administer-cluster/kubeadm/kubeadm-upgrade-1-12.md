---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters from v1.11 to v1.12
content_template: templates/task
---

{{% capture overview %}}

This page explains how to upgrade a Kubernetes cluster created with `kubeadm` from version 1.11.x to version 1.12.x, and from version 1.12.x to 1.12.y, where `y > x`.

{{% /capture %}}

{{% capture prerequisites %}}

- You need to have a `kubeadm` Kubernetes cluster running version 1.11.0 or later. 
  [Swap must be disabled][swap]. 
  The cluster should use a static control plane and etcd pods.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.12.md) carefully.
- Make sure to back up any important components, such as app-level state stored in a database. 
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.


[swap]: https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux
### Additional information

- All containers are restarted after upgrade, because the container spec hash value is changed.
- You can upgrade only from one minor version to the next minor version. 
  That is, you cannot skip versions when you upgrade. 
  For example, you can upgrade only from 1.10 to 1.11, not from 1.9 to 1.11.

{{% /capture %}}

{{% capture steps %}}

## Upgrade the control plane

1.  On your master node, upgrade kubeadm:

    {{< tabs name="k8s_install" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace "x" with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get upgrade -y kubeadm=1.12.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace "x" with the latest patch version
    yum upgrade -y kubeadm-1.12.x --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  Verify that the download works and has the expected version:

    ```shell
    kubeadm version
    ```

1.  On the master node, run:

    ```shell
    kubeadm upgrade plan
    ```

    You should see output similar to this:

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade] Fetching available versions to upgrade to
    [upgrade/versions] Cluster version: v1.11.3
    [upgrade/versions] kubeadm version: v1.12.0
    [upgrade/versions] Latest stable version: v1.11.3
    [upgrade/versions] Latest version in the v1.11 series: v1.11.3
    [upgrade/versions] Latest experimental version: v1.13.0-alpha.0

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT       AVAILABLE
    Kubelet     2 x v1.11.1   v1.12.0
                1 x v1.11.3   v1.12.0

    Upgrade to the latest experimental version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.11.3   v1.12.0
    Controller Manager   v1.11.3   v1.12.0
    Scheduler            v1.11.3   v1.12.0
    Kube Proxy           v1.11.3   v1.12.0
    CoreDNS              1.1.3     1.2.2
    Etcd                 3.2.18    3.2.24

    You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.12.0 

    _____________________________________________________________________

    ```

    This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.

1.  Choose a version to upgrade to, and run the appropriate command. For example:

    ```shell
    kubeadm upgrade apply v1.12.0
    ```

    You should see output similar to this:

    <!-- TODO: output from stable -->

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade/apply] Respecting the --cri-socket flag that is set with higher priority than the config file.
    [upgrade/version] You have chosen to change the cluster version to "v1.12.0"
    [upgrade/versions] Cluster version: v1.11.3
    [upgrade/versions] kubeadm version: v1.12.0
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
    [upgrade/prepull] Prepulling image for component etcd.
    [upgrade/prepull] Prepulling image for component kube-apiserver.
    [upgrade/prepull] Prepulling image for component kube-controller-manager.
    [upgrade/prepull] Prepulling image for component kube-scheduler.
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-etcd
    [upgrade/prepull] Prepulled image for component kube-apiserver.
    [upgrade/prepull] Prepulled image for component kube-controller-manager.
    [upgrade/prepull] Prepulled image for component kube-scheduler.
    [upgrade/prepull] Prepulled image for component etcd.
    [upgrade/prepull] Successfully prepulled the images for all the control plane components
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.12.0"...
    Static pod: kube-apiserver-ip-172-31-80-76 hash: d9b7af93990d702b3ee9a2beca93384b
    Static pod: kube-controller-manager-ip-172-31-80-76 hash: 44a081fb5d26e90773ceb98b4e16fe10
    Static pod: kube-scheduler-ip-172-31-80-76 hash: 009228e74aef4d7babd7968782118d5e
    Static pod: etcd-ip-172-31-80-76 hash: 997fcf3d8d974c98abc14556cc02617e
    [etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests661777755/etcd.yaml"
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/etcd.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-09-19-18-58-14/etcd.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s
    Static pod: etcd-ip-172-31-80-76 hash: 997fcf3d8d974c98abc14556cc02617e
    <snip>
    [apiclient] Found 1 Pods for label selector component=etcd
    [upgrade/staticpods] Component "etcd" upgraded successfully!
    [upgrade/etcd] Waiting for etcd to become available
    [util/etcd] Waiting 0s for initial delay
    [util/etcd] Attempting to see if all cluster endpoints are available 1/10
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests661777755"
    [controlplane] wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests661777755/kube-apiserver.yaml"
    [controlplane] wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests661777755/kube-controller-manager.yaml"
    [controlplane] wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests661777755/kube-scheduler.yaml"
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-09-19-18-58-14/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s
    <snip>
    Static pod: kube-apiserver-ip-172-31-80-76 hash: 854a5a8468f899093c6a967bb81dcfbc
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-09-19-18-58-14/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s
    Static pod: kube-controller-manager-ip-172-31-80-76 hash: 44a081fb5d26e90773ceb98b4e16fe10
    Static pod: kube-controller-manager-ip-172-31-80-76 hash: b651f83474ae70031d5fb2cab73bd366
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-09-19-18-58-14/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s
    Static pod: kube-scheduler-ip-172-31-80-76 hash: 009228e74aef4d7babd7968782118d5e
    Static pod: kube-scheduler-ip-172-31-80-76 hash: da406e5a49adfbbeb90fe2a0cf8fd8d1
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.12" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet] Downloading configuration for the kubelet from the "kubelet-config-1.12" ConfigMap in the kube-system namespace
    [kubelet] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "ip-172-31-80-76" as an annotation
    [bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

1.  Manually upgrade your Software Defined Network (SDN).

    Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
    Check the [addons](/docs/concepts/cluster-administration/addons/) page to
    find your CNI provider and see whether additional upgrade steps are required.

## Upgrade master and node packages

1.  Prepare each node for maintenance, marking it unschedulable and evicting the workloads:

    ```shell
    kubectl drain $NODE --ignore-daemonsets
    ```

    On the master node, you must add `--ignore-daemonsets`:

    ```shell
    kubectl drain ip-172-31-85-18
    node "ip-172-31-85-18" cordoned
    error: unable to drain node "ip-172-31-85-18", aborting command...

    There are pending nodes to be drained:
    ip-172-31-85-18
    error: DaemonSet-managed pods (use --ignore-daemonsets to ignore): calico-node-5798d, kube-proxy-thjp9
    ```

    ```
    kubectl drain ip-172-31-85-18 --ignore-daemonsets
    node "ip-172-31-85-18" already cordoned
    WARNING: Ignoring DaemonSet-managed pods: calico-node-5798d, kube-proxy-thjp9
    node "ip-172-31-85-18" drained
    ```

1.  Upgrade the Kubernetes package version on each `$NODE` node by running the Linux package manager for your distribution:

    {{< tabs name="k8s_upgrade" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace "x" with the latest patch version
    apt-mark unhold kubelet kubeadm
    apt-get update
    apt-get upgrade -y kubelet=1.12.x-00 kubeadm=1.12.x-00
    apt-mark hold kubelet kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace "x" with the latest patch version
    yum upgrade -y kubelet-1.12.x kubeadm-1.12.x --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

## Upgrade kubelet on each node

1.  On each node except the master node, upgrade the kubelet config:

    ```shell
    sudo kubeadm upgrade node config --kubelet-version $(kubelet --version | cut -d ' ' -f 2)
    ```

1.  Restart the kubelet process:

    ```shell
    sudo systemctl restart kubelet
    ```

1.  Verify that the new version of the `kubelet` is running on the node:

    ```shell
    systemctl status kubelet
    ```

1.  Bring the node back online by marking it schedulable:

    ```shell
    kubectl uncordon $NODE
    ```


1.  After the kubelet is upgraded on all nodes, verify that all nodes are available again by running the following command from anywhere kubectl can access the cluster:

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
- Applies the new `kube-dns` and `kube-proxy` manifests and enforces that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.
