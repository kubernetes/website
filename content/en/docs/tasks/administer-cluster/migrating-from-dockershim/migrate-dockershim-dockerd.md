---
title: "Migrate Docker Engine nodes from dockershim to cri-dockerd"
weight: 20
content_type: task 
---

{{% thirdparty-content %}}

This page shows you how to migrate your Docker Engine nodes to use `cri-dockerd`
instead of dockershim. You should follow these steps in these scenarios:

 * You want to switch away from dockershim and still use Docker Engine to run
    containers in Kubernetes.
 * You want to upgrade to Kubernetes v{{< skew currentVersion >}} and your
    existing cluster relies on dockershim, in which case you must migrate 
    from dockershim and `cri-dockerd` is one of your options.

To learn more about the removal of dockershim, read the [FAQ page](/dockershim).

## What is cri-dockerd? {#what-is-cri-dockerd}

In Kubernetes 1.23 and earlier, you could use Docker Engine with Kubernetes,
relying on a built-in component of Kubernetes named _dockershim_.
The dockershim component was removed in the Kubernetes 1.24 release; however,
a third-party replacement, `cri-dockerd`, is available. The `cri-dockerd` adapter
lets you use Docker Engine through the {{<glossary_tooltip term_id="cri" text="Container Runtime Interface">}}.

{{<note>}}
If you already use `cri-dockerd`, you aren't affected by the dockershim removal.
Before you begin, [Check whether your nodes use the dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
{{</note>}}

If you want to migrate to `cri-dockerd` so that you can continue using Docker
Engine as your container runtime, you should do the following for each affected
node: 

1.  Install `cri-dockerd`.
1.  Cordon and drain the node.
1.  Configure the kubelet to use `cri-dockerd`. 
1.  Restart the kubelet.
1.  Verify that the node is healthy.

Test the migration on non-critical nodes first.

You should perform the following steps for each node that you want to migrate
to `cri-dockerd`.

## {{% heading "prerequisites" %}}

*   [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install)
    installed and started on each node.
*   A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).

## Cordon and drain the node

1.  Cordon the node to stop new Pods scheduling on it:

    ```shell
    kubectl cordon <NODE_NAME>
    ```
    Replace `<NODE_NAME>` with the name of the node.

1.  Drain the node to safely evict running Pods: 

    ```shell
    kubectl drain <NODE_NAME> \
        --ignore-daemonsets
    ```

## Configure the kubelet to use cri-dockerd

The following steps apply to clusters set up using the kubeadm tool. If you use
a different tool, you should modify the kubelet using the configuration
instructions for that tool.

1.  Open `/var/lib/kubelet/kubeadm-flags.env` on each affected node.
1.  Modify the `--container-runtime-endpoint` flag to
    `unix:///var/run/cri-dockerd.sock`.
1.  Modify the `--container-runtime` flag to `remote`
    (unavailable in Kubernetes v1.27 and later).

The kubeadm tool stores the node's socket as an annotation on the `Node` object
in the control plane. To modify this socket for each affected node:  

1.  Edit the YAML representation of the `Node` object:

    ```shell
    KUBECONFIG=/path/to/admin.conf kubectl edit no <NODE_NAME>
    ```
    Replace the following:
    
    *   `/path/to/admin.conf`: the path to the kubectl configuration file,
        `admin.conf`.
    *   `<NODE_NAME>`: the name of the node you want to modify.

1.  Change `kubeadm.alpha.kubernetes.io/cri-socket` from
    `/var/run/dockershim.sock` to `unix:///var/run/cri-dockerd.sock`.
1.  Save the changes. The `Node` object is updated on save.

## Restart the kubelet

```shell
systemctl restart kubelet
```

## Verify that the node is healthy

To check whether the node uses the `cri-dockerd` endpoint, follow the
instructions in [Find out which runtime you use](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
The `--container-runtime-endpoint` flag for the kubelet should be `unix:///var/run/cri-dockerd.sock`.

## Uncordon the node

Uncordon the node to let Pods schedule on it: 

```shell
kubectl uncordon <NODE_NAME>
```

## {{% heading "whatsnext" %}}

*   Read the [dockershim removal FAQ](/dockershim/).
*   [Learn how to migrate from Docker Engine with dockershim to containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).
