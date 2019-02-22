---
title: kubeadmを使用した高可用性クラスターの作成
content_template: templates/task
weight: 60
---

{{% capture overview %}}

This page explains two different approaches to setting up a highly available Kubernetes
cluster using kubeadm:

- With stacked control plane nodes. This approach requires less infrastructure. The etcd members
and control plane nodes are co-located.
- With an external etcd cluster. This approach requires more infrastructure. The
control plane nodes and etcd members are separated.

Before proceeding, you should carefully consideer which approach best meets the needs of your applications
and environment. [This comparison topic](/docs/setup/independent/ha-topology/) outlines the advantages and disadvantages of each.

Your clusters must run Kubernetes version 1.12 or later. You should also be aware that
setting up HA clusters with kubeadm is still experimental and will be further simplified
in future versions. You might encounter issues with upgrading your clusters, for example.
We encourage you to try either approach, and provide us with feedback in the kubeadm
[issue tracker](https://github.com/kubernetes/kubeadm/issues/new).

Note that the alpha feature gate `HighAvailability` is deprecated in v1.12 and removed in v1.13.

See also [The HA upgrade documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-ha).

{{< caution >}}
This page does not address running your cluster on a cloud provider. In a cloud
environment, neither approach documented here works with Service objects of type
LoadBalancer, or with dynamic PersistentVolumes.
{{< /caution >}}

{{% /capture %}}

{{% capture prerequisites %}}

For both methods you need this infrastructure:

- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/independent/install-kubeadm/#before-you-begin) for
  the masters
- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/independent/install-kubeadm/#before-you-begin) for
  the workers
- Full network connectivity between all machines in the cluster (public or
  private network)
- sudo privileges on all machines
- SSH access from one device to all nodes in the system
- `kubeadm` and `kubelet` installed on all machines. `kubectl` is optional.

For the external etcd cluster only, you also need:

- Three additional machines for etcd members

{{< note >}}
The following examples run Calico as the Pod networking provider. If you run another
networking provider, make sure to replace any default values as needed.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## 両手順における最初のステップ

{{< note >}}
**Note**: All commands on any control plane or etcd node should be
run as root.
{{< /note >}}

- Some CNI network plugins like Calico require a CIDR such as `192.168.0.0/16` and
  some like Weave do not. See the see [the CNI network
  documentation](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
  To add a pod CIDR set the `podSubnet: 192.168.0.0/16` field under
  the `networking` object of `ClusterConfiguration`.

### kube-apiserver用にロードバランサーを作成

{{< note >}}
There are many configurations for load balancers. The following example is only one
option. Your cluster requirements may need a different configuration.
{{< /note >}}

1.  Create a kube-apiserver load balancer with a name that resolves to DNS.

    - In a cloud environment you should place your control plane nodes behind a TCP
      forwarding load balancer. This load balancer distributes traffic to all
      healthy control plane nodes in its target list. The health check for
      an apiserver is a TCP check on the port the kube-apiserver listens on
      (default value `:6443`).

    - It is not recommended to use an IP address directly in a cloud environment.

    - The load balancer must be able to communicate with all control plane nodes
      on the apiserver port. It must also allow incoming traffic on its
      listening port.

    - [HAProxy](http://www.haproxy.org/) can be used as a load balancer.

    - Make sure the address of the load balancer always matches
      the address of kubeadm's `ControlPlaneEndpoint`.

1.  Add the first control plane nodes to the load balancer and test the
    connection:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - A connection refused error is expected because the apiserver is not yet
      running. A timeout, however, means the load balancer cannot communicate
      with the control plane node. If a timeout occurs, reconfigure the load
      balancer to communicate with the control plane node.

1.  Add the remaining control plane nodes to the load balancer target group.

### SSHの設定

SSH is required if you want to control all nodes from a single machine.

1.  Enable ssh-agent on your main device that has access to all other nodes in
    the system:

    ```
    eval $(ssh-agent)
    ```

1.  Add your SSH identity to the session:

    ```
    ssh-add ~/.ssh/path_to_private_key
    ```

1.  SSH between nodes to check that the connection is working correctly.

    - When you SSH to any node, make sure to add the `-A` flag:

        ```
        ssh -A 10.0.0.7
        ```

    - When using sudo on any node, make sure to preserve the environment so SSH
      forwarding works:

        ```
        sudo -E -s
        ```

## 積み重なったコントロールプレーンとetcdノード

### 最初のコントロールプレーンノードの手順

1.  On the first control plane node, create a configuration file called `kubeadm-config.yaml`:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServer:
          certSANs:
          - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"

    - `kubernetesVersion` should be set to the Kubernetes version to use. This
  example uses `stable`.
    - `controlPlaneEndpoint` should match the address or DNS and port of the load balancer.
    - It's recommended that the versions of kubeadm, kubelet, kubectl and Kubernetes match.

1.  Make sure that the node is in a clean state:

    ```sh
    sudo kubeadm init --config=kubeadm-config.yaml
    ```
    
    You should see something like:
    
    ```sh
    ...
    You can now join any number of machines by running the following on each node
    as root:
    
    kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash    sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f
    ```

1.  Copy this output to a text file. You will need it later to join other control plane nodes to the
    cluster.

1.  Apply the Weave CNI plugin:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

1.  Type the following and watch the pods of the components get started:

    ```sh
    kubectl get pod -n kube-system -w
    ```

    - It's recommended that you join new control plane nodes only after the first node has finished initializing.

1.  Copy the certificate files from the first control plane node to the rest:

    In the following example, replace `CONTROL_PLANE_IPS` with the IP addresses of the
    other control plane nodes.
    ```sh
    USER=ubuntu # customizable
    CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
    for host in ${CONTROL_PLANE_IPS}; do
        scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
        scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
        scp /etc/kubernetes/admin.conf "${USER}"@$host:
    done
    ```

### 残りのコントロールプレーンノードの手順

1.  Move the files created by the previous step where `scp` was used:

    ```sh
    USER=ubuntu # customizable
    mkdir -p /etc/kubernetes/pki/etcd
    mv /home/${USER}/ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/ca.key /etc/kubernetes/pki/
    mv /home/${USER}/sa.pub /etc/kubernetes/pki/
    mv /home/${USER}/sa.key /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
    mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
    mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
    mv /home/${USER}/admin.conf /etc/kubernetes/admin.conf
    ```

    This process writes all the requested files in the `/etc/kubernetes` folder.

1.  Start `kubeadm join` on this node using the join command that was previously given to you by `kubeadm init` on
    the first node. It should look something like this:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f --experimental-control-plane
    ```

    - Notice the addition of the `--experimental-control-plane` flag. This flag automates joining this
    control plane node to the cluster.

1.  Type the following and watch the pods of the components get started:

    ```sh
    kubectl get pod -n kube-system -w
    ```

1.  Repeat these steps for the rest of the control plane nodes.

## 外部のetcdノード

### etcdクラスターの構築

- Follow [these instructions](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)
  to set up the etcd cluster.

### 最初のコントロールプレーンノードの構築

1.  Copy the following files from any node from the etcd cluster to this node:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    +scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    +scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    +scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - Replace the value of `CONTROL_PLANE` with the `user@host` of this machine.

1.  Create a file called `kubeadm-config.yaml` with the following contents:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServer:
          certSANs:
          - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
            external:
                endpoints:
                - https://ETCD_0_IP:2379
                - https://ETCD_1_IP:2379
                - https://ETCD_2_IP:2379
                caFile: /etc/kubernetes/pki/etcd/ca.crt
                certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
                keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key

    - The difference between stacked etcd and external etcd here is that we are using the `external` field for `etcd` in the kubeadm config. In the case of the stacked etcd topology this is managed automatically.

    -  Replace the following variables in the template with the appropriate values for your cluster:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

1.  Run `kubeadm init --config kubeadm-config.yaml` on this node.

1.  Write the join command that is returned to a text file for later use.

1.  Apply the Weave CNI plugin:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### 残りのコントロールプレーンノードの手順

To add the rest of the control plane nodes, follow [these instructions](#steps-for-the-rest-of-the-control-plane-nodes).
The steps are the same as for the stacked etcd setup, with the exception that a local
etcd member is not created.

To summarize:

- Make sure the first control plane node is fully initialized.
- Copy certificates between the first control plane node and the other control plane nodes.
- Join each control plane node with the join command you saved to a text file, plus add the `--experimental-control-plane` flag.

## コントロールプレーン起動後の共通タスク

### Podネットワークのインストール

[Follow these instructions](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the master configuration file.

### ワーカーのインストール

Each worker node can now be joined to the cluster with the command returned from any of the
`kubeadm init` commands. The flag `--experimental-control-plane` should not be added to worker nodes.

{{% /capture %}}
