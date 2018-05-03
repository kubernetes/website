---
reviewers:
- chrisnegus
title: Kubernetes on Fedora (Multi Node)
---

* TOC
{:toc}


To set up a multi-node Kubernetes cluster on Fedora using **kubeadm**, do the following:

* **Set up the master**: Follow the [Kubernetes on Fedora - Single-node](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/) instructions to set up a Kubernetes Master. After running **kubeadm init** on the master, copy the **kubeadm join** line from the output. This includes token information needed to connect the node to the master.
* **Set up nodes**: Use the instruction below to configure each additional node.

## Prerequisites

For each node you want to add, follow the Prerequisites and these steps from the Setup section of the [Kubernetes on Fedora - Single-node](https://kubernetes.io/docs/getting-started-guides/fedora/fedora_manual_config/) instructions:

* Prerequisites
* Install kubernetes-kubeadm and other software
* Enable kubelet

## Set up Nodes

1. Fix kubelet issue. On each node, you must correct a problem in the /etc/systemd/system/kubelet.service.d/kubeadm.conf file. (Follow [Bug 1542476](https://bugzilla.redhat.com/show_bug.cgi?id=1542476) to see if this gets fixed.) Make sure that the **--bootstrap-kubeconfig** option is added to the KUBELET_KUBECONFIG_ARGS value so it appears as follows (all on one line):

    <pre><tt>Environment="KUBELET_KUBECONFIG_ARGS=--kubeconfig=/etc/kubernetes/kubelet.conf --fail-swap-on=false --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf"
    </tt></pre>

2. Join node to the cluster. Using the output from the **kubeadm init** command you ran earlier on the master, run the **kubeadm join** command. The basic structure of the command is as follows:

    **IMPORTANT**: You may need the **--ignore-preflight-errors=all** option.

    <pre><tt><b>kubeadm join --ignore-preflight-errors=all  \
        --token xxxxxx.xxxxxxxxxxxxxxxx \
        hostname:6443 --discovery-token-ca-cert-hash   \
        sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</b>
    </tt></pre>

    For example:

    <pre><tt># <b>kubeadm join --ignore-preflight-errors=all \
         --token e50a48.61b21631a693c840 \
         192.168.122.238:6443 \
         --discovery-token-ca-cert-hash \
         sha256:5bdcd80b15c68e9afd4c52f0346e7c7013634f3ca...</b>
    ...
    [discovery] Trying to connect to API Server "192.168.122.238:6443"
    [discovery] Created cluster-info discovery client, requesting info from "https://192.168.122.238:6443"
    [discovery] Requesting info from "https://192.168.122.238:6443" again to validate TLS against the pinned public key
    [discovery] Cluster info signature and contents are valid and TLS certificate validates against pinned roots, will use API Server "192.168.122.238:6443"
    [discovery] Successfully established connection with API Server "192.168.122.238:6443"

    This node has joined the cluster:
    * Certificate signing request was sent to master and a response
      was received.
    * The Kubelet was informed of the new secure connection details.

    Run 'kubectl get nodes' on the master to see this node join the cluster.
    </tt></pre>

3. Return to the master and check that the node has joined.

    <pre><tt># <b>kubectl get node</b>
    NAME            STATUS    ROLES     AGE       VERSION
    fedora27iso     Ready     master    2d        v1.9.1
    fedora27iso02   Ready     &lt;none&gt;    4m        v1.9.1
    </tt></pre>


The node is now available to be used in the Kubernetes cluster.

## Troubleshooting Nodes

If you were unable to join the cluster, here are a few things to try:

### Reset

If you find that you have made some mistakes while setting up the node, you can always reset Kubernetes on the node by typing:

<pre><tt># <b>kubeadm reset</b>
</tt></pre>


After that, run kubeadm init again. To get everything working, you may need to restart the kubelet service again as well (**systemctl restart kubelet**).

### Token expired

If the token on the master has been changed or expired, you could see an error relating to a token problem when you try to join the cluster. For example:

    There is no JWS signed token in the cluster-info ConfigMap

To correct a problem with tokens, you can generate a new token on the master, then apply that information to each node when you join. For example:

On the Master:

<pre><tt># <b>kubeadm token create</b>
e50a48.61b21631a693c840
</tt></pre>


On the Node (be sure to use the new token):

<pre><tt># <b>kubeadm join --ignore-preflight-errors=all --token \
  <i>e50a48.61b21631a693c840</i> 192.168.122.238:6443 \
  --discovery-token-ca-cert-hash \
  sha256:5bdcd80b15c68e9afd4c52f0346e7c7013634f3ca3727b3610d9a308380a9444</b>
</tt></pre>


### Kubelet won’t start (bad token)

If you find that you can join the cluster, but kubelet is not able to connect to the master, the node won’t appear when you type **kubectl get node**. This failure may occur because the kubelet.conf file contains an old token. To fix this, edit /etc/kubernetes/bootstrap-kubelet.conf and change the token value. For example:

<pre><tt>kind: Config
preferences: {}
users:
- name: tls-bootstrap-token-user
  user:
    token: <b>e50a48.61b21631a693c840</b>
</tt></pre>

### Check that the node is working properly

Once the node is working properly, you should see that new containers have started. These should include flannel, kube-proxy, and pause-amd64. Run the following on the node to check that:

<pre><tt># <b>docker ps</b>
CONTAINER ID IMAGE                     COMMAND              CREATED         STATUS        PORTS  NAMES
e2a80db5a3d6 quay.io/coreos/flannel... "/opt/bin/flanneld"  12 minutes ago  Up 12 minutes        k8s_kube-proxy_kube-proxy-r9shd_kube-system_198a1c85-2dcf-11e8-adbb-5254003effb8_0
gcr.io/google_containers/kube-proxy... "/usr/local/bin/ku"  12 minutes ago  Up 12 minutes        k8s_kube-proxy_kube-proxy-r9shd_kube-system_198a1c85-2dcf-11e8-adbb-5254003effb8_0
f4e8f1cdf9ad gcr.io/google_contain...  "/pause"             14 minutes ago  Up 14 minutes        k8s_POD_kube-proxy-r9shd_kube-system_198a1c85-2dcf-11e8-adbb-5254003effb8_0
ef8821b8757d gcr.io/google_contain...  "/pause"             14 minutes ago  Up 14 minutes        k8s_POD_kube-flannel-ds-84bfh_kube-system_1966574d-2dcf-11e8-adbb-5254003effb8_0
</tt></pre>

## Support Level

IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community
