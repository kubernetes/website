---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters from v1.10 to v1.11
content_template: templates/task
---

{{% capture overview %}}

This guide is for upgrading `kubeadm` clusters from version 1.10.x to 1.11.x and 1.11.x to 1.11.y where `y > x`.

{{% /capture %}}

{{% capture prerequisites %}}

Before proceeding:

- You need to have a functional `kubeadm` Kubernetes cluster running version 1.10.0 or higher in order to use the process described here. Swap also needs to be disabled. This cluster should use a self-hosted etcd and static control plane pods.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md) carefully.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up what's important to you. For example, any app-level state, such as a database an app might depend on (like MySQL or MongoDB) must be backed up beforehand.

{{< caution >}}
**Caution:** All the containers will get restarted after the upgrade, due to container spec hash value being changed.
{{< /caution >}}

Also, note that only one minor version upgrade is supported. For example, you can only upgrade from 1.10 to 1.11, not from 1.9 to 1.11.

{{< caution >}}
**Caution:** The default DNS provider in 1.11 is [CoreDNS](https://coredns.io/) rather than [kube-dns](https://github.com/kubernetes/dns). 
To keep `kube-dns`, pass `--feature-flags=CoreDNS=false` to `kubeadm upgrade apply`.
{{< /caution >}}

{{% /capture %}}

{{% capture steps %}}

## Upgrading your control plane

Execute these commands on your master node (as root):

1. 

    ```shell
    export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) # or manually specify a released Kubernetes version
    export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
    curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /usr/bin/kubeadm
    chmod a+rx /usr/bin/kubeadm
    ```

    {{< caution >}}
    **Caution:** Upgrading the `kubeadm` package on your system prior to upgrading the control plane causes a failed upgrade. 
    Even though `kubeadm` ships in the Kubernetes repositories, it's important to install `kubeadm` manually. The kubeadm 
    team is working on fixing this limitation. 
    {{< /caution >}}


    `kubeadm` is only needed on individual (non-master) nodes for joining the cluster.
    It is not necessary to update kubeadm on nodes 

    Verify that this download of kubeadm works and has the expected version:

    ```shell
    kubeadm version
    ```

2. On the master node, run the following:

    ```shell
    kubeadm upgrade plan
    ```

    You should see output similar to this:

    <!-- TODO: copy-paste actual output once new version is stable -->

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    I0618 20:32:32.950358   15307 feature_gate.go:230] feature gates: &{map[]}
    [upgrade] Fetching available versions to upgrade to
    [upgrade/versions] Cluster version: v1.10.4
    [upgrade/versions] kubeadm version: v1.11.0-beta.2.78+e0b33dbc2bde88

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT       AVAILABLE
    Kubelet     1 x v1.10.4   v1.11.0

    Upgrade to the latest version in the v1.10 series:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.10.4   v1.11.0
    Controller Manager   v1.10.4   v1.11.0
    Scheduler            v1.10.4   v1.11.0
    Kube Proxy           v1.10.4   v1.11.0
    CoreDNS                        1.1.3
    Kube DNS             1.14.8
    Etcd                 3.1.12    3.2.18

    You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.11.0

    Note: Before you can perform this upgrade, you have to update kubeadm to v1.11.0.

    _____________________________________________________________________
    ```

    The `kubeadm upgrade plan` checks that your cluster is upgradeable and fetches the versions available to upgrade to in an user-friendly way.

3. Pick a version to upgrade to and run. For example:

    ```shell
    kubeadm upgrade apply v1.11.0
    ```

    If you  currently use `kube-dns` and wish to continue doing so, use `--feature-flags=CoreDNS=false`.

    You should see output similar to this:

    <!-- TODO: output from stable --> 

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    I0614 20:56:08.320369   30918 feature_gate.go:230] feature gates: &{map[]}
    [upgrade/apply] Respecting the --cri-socket flag that is set with higher priority than the config file.
    [upgrade/version] You have chosen to change the cluster version to "v1.11.0-beta.2.78+e0b33dbc2bde88"
    [upgrade/versions] Cluster version: v1.10.4
    [upgrade/versions] kubeadm version: v1.11.0-beta.2.78+e0b33dbc2bde88
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.11.0-beta.2.78+e0b33dbc2bde88"...
    Static pod: kube-apiserver-ip-172-31-85-18 hash: 7a329408b21bc0c44d7b3b78ff8187bf
    Static pod: kube-controller-manager-ip-172-31-85-18 hash: 24fd3157627c7567b687968967c6a5e8
    Static pod: kube-scheduler-ip-172-31-85-18 hash: 5179266fb24d4c1834814c4f69486371
    Static pod: etcd-ip-172-31-85-18 hash: 9dfc197f444be11fcc70ab1467b030b8
    [etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests089436939/etcd.yaml"
    [certificates] Using the existing etcd/ca certificate and key.
    [certificates] Using the existing etcd/server certificate and key.
    [certificates] Using the existing etcd/peer certificate and key.
    [certificates] Using the existing etcd/healthcheck-client certificate and key.
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/etcd.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-06-14-20-56-11/etcd.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    Static pod: etcd-ip-172-31-85-18 hash: 9dfc197f444be11fcc70ab1467b030b8
    < snip >
    [apiclient] Found 1 Pods for label selector component=etcd
    [upgrade/staticpods] Component "etcd" upgraded successfully!
    [upgrade/etcd] Waiting for etcd to become available
    [util/etcd] Waiting 0s for initial delay
    [util/etcd] Attempting to see if all cluster endpoints are available 1/10
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests089436939"
    [controlplane] wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests089436939/kube-apiserver.yaml"
    [controlplane] wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests089436939/kube-controller-manager.yaml"
    [controlplane] wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests089436939/kube-scheduler.yaml"
    [certificates] Using the existing etcd/ca certificate and key.
    [certificates] Using the existing apiserver-etcd-client certificate and key.
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-06-14-20-56-11/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    Static pod: kube-apiserver-ip-172-31-85-18 hash: 7a329408b21bc0c44d7b3b78ff8187bf
    < snip >
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-06-14-20-56-11/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    Static pod: kube-controller-manager-ip-172-31-85-18 hash: 24fd3157627c7567b687968967c6a5e8
    Static pod: kube-controller-manager-ip-172-31-85-18 hash: 63992ff14733dcb9dcfa6ac0a3b8031a
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-06-14-20-56-11/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    Static pod: kube-scheduler-ip-172-31-85-18 hash: 5179266fb24d4c1834814c4f69486371
    Static pod: kube-scheduler-ip-172-31-85-18 hash: 831e4b9425f758e572392976311e56d9
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.11" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet] Downloading configuration for the kubelet from the "kubelet-config-1.11" ConfigMap in the kube-system namespace
    [kubelet] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "ip-172-31-85-18" as an annotation
    [bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.11.0-beta.2.78+e0b33dbc2bde88". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

    To upgrade the cluster with CoreDNS as the default internal DNS, invoke `kubeadm upgrade apply` with the `--feature-gates=CoreDNS=true` flag.

4. Manually upgrade your Software Defined Network (SDN).

   Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.

## Upgrading your master and node packages

For each host (referred to as `$HOST` below) in your cluster, upgrade `kubelet` by executing the following commands:

1. Prepare the host for maintenance, marking it unschedulable and evicting the workload:

    ```shell
    kubectl drain $HOST --ignore-daemonsets
    ```

    When running this command against the master host, `--ignore-daemonsets` is required:

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

2. Upgrade the Kubernetes package versions on the `$HOST` node by using a Linux distribution-specific package manager:

    If the host is running a Debian-based distro such as Ubuntu, run:

    {{< tabs name="k8s_install" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt-get update
    apt-get upgrade -y kubelet kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    yum upgrade -y kubelet kubedam
    {{% /tab %}}
    {{< /tabs >}}

    Upgrading `kubeadm` is only required on the master node.

3. Restart the kubectl process with 
    ```shell
    sudo systemctl restart kubelet
    ```

    Now the new version of the `kubelet` should be running on the host. Verify this using the following command on `$HOST`:

    ```shell
    systemctl status kubelet
    ```

4. Bring the host back online by marking it schedulable:

    ```shell
    kubectl uncordon $HOST
    ```

5. After upgrading `kubelet` on each host in your cluster, verify that all nodes are available again by executing the following (from anywhere, for example, from outside the cluster):

    ```shell
    kubectl get nodes
    ```

    If the `STATUS` column of the above command shows `Ready` for all of your hosts and the version you expect, you are done.

{{% /capture %}}

## Recovering from a failure state

If `kubeadm upgrade` somehow fails and fails to roll back, for example due to an unexpected shutdown during execution,
you can run `kubeadm upgrade` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring.

You can use `kubeadm upgrade` to change a running cluster with `x.x.x --> x.x.x` with `--force`, which can be used to recover from a bad state.

## How it works

`kubeadm upgrade apply` does the following:

- Checks that your cluster is in an upgradeable state:
  - The API server is reachable,
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `kube-dns` and `kube-proxy` manifests and enforces that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.
