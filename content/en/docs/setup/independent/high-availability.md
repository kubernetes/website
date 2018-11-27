---
reviewers:
- sig-cluster-lifecycle
title: Creating Highly Available Clusters with kubeadm
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
**Caution**: This page does not address running your cluster on a cloud provider.
In a cloud environment, neither approach documented here works with Service objects
of type LoadBalancer, or with dynamic PersistentVolumes.
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

Optional for all control plane nodes:

- Install [kubeadm-getter](https://github.com/neolit123/kubeadm-getter/releases).
This small tool is used to secure transfer of the `admin.conf` and certificate files
between control plane nodes. The alternative is to use `scp` with SSH keys. The examples
on this page assume that you are running kubeadm-getter.

{{< note >}}
**Note**: The following examples run Calico as the Pod networking provider. If
you run another networking provider, make sure to replace any default values as
needed.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## First steps for both methods

{{< note >}}
**Note**: All commands on any control plane or etcd node should be
run as root.
{{< /note >}}

- Find your pod CIDR. For details, see [the CNI network
   documentation](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
   The example uses Calico, so the pod CIDR is `192.168.0.0/16`. Some CNI plugins like
   WeaveNet do not require setting a CIDR.

### Create load balancer for kube-apiserver

{{< note >}}
**Note**: There are many configurations for load balancers. The following
example is only one option. Your cluster requirements may need a
different configuration.
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

    - [keepalived](http://www.keepalived.org/) or something like [docker-ucar](https://github.com/craigtracey/docker-ucarp)
      can be used as a load balancer.

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

### Configure SSH

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

## Stacked control plane and etcd nodes

### Steps for the first control plane node

1.  On the first control plane node, create a configuration file called `kubeadm-config.yaml`:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServer:
          certSANs:
          - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
          networking:
            # This CIDR is a calico default. Substitute or remove for your CNI provider.
            podSubnet: "192.168.0.0/16"

    - `kubernetesVersion` should be set to the Kubernetes version to use. This
  example uses `stable`.
    - `controlPlaneEndpoint` should match the address or DNS and port of the load balancer.
    - It's recommended that the versions of kubeadm, kubelet, kubectl and Kubernetes match.

1.  Make sure that the node is in a clean state:

    ```sh
    sudo kubeadm reset -f
    sudo kubeadm init --config=kubeadm-config.yaml
    ```
    
    You should see something like:
    
    ```sh
    ...
    You can now join any number of machines by running the following on each node
    as root:
    
    kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash    sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f
    ```

1.  Copy this output to a text file. You will need it later to join other control plane nodes to the cluster.

1.  Type the following and watch the pods of the components get started:

    ```sh
    watch kubectl get pods --all-namespaces
    ```

    - It's recommended that you join new control plane nodes only after the first node has finished initializing.

1.  Start `kubeadm-getter`:

    ```sh
    sudo kubeadm-getter --token=j04n3m.octy8zely83cy2ts --input-path=/etc/kubernetes --listen
    ```

    You should see something like:

    ```sh
    /* kubeadm-getter
    /* server listenting on 192.168.0.103:11764
    /* this process will remain open for 10m0s (TTL)
    ```

    - Notice that the `--token` value is the same as the value was returned from `kubeadm init`.
    - `11764` is the default port.
    - `192.168.0.103` in this example is the default outbound address of this machine.

    This causes the node to act as a server that can transfer files to the other control plane nodes. Make sure that your firewall and NAT settings do not block this process.

### Steps for the rest of the control plane nodes

1.  Make sure you reset any previous kubeadm state:

    ```sh
    sudo kubeadm reset -f
    ```

1.  Copy the following files from the first control plane node to every other node:

    ```sh
    /etc/kubernetes/pki/ca.crt
    /etc/kubernetes/pki/ca.key
    /etc/kubernetes/pki/front-proxy-ca.crt
    /etc/kubernetes/pki/front-proxy-ca.key
    /etc/kubernetes/pki/sa.key
    /etc/kubernetes/pki/sa.pub
    /etc/kubernetes/pki/etcd/ca.crt
    /etc/kubernetes/pki/etcd/ca.key
    /etc/kubernetes/admin.conf
    ```

    - `admin.conf` is optional.

1.  Call `kubeadm-getter` on each node:

    ```sh
    sudo kubeadm-getter --token=j04n3m.octy8zely83cy2ts --address=192.168.0.103 --output-path=/etc/kubernetes \
    --files=pki/ca.crt,pki/ca.key,pki/front-proxy-ca.crt,pki/front-proxy-ca.key,pki/sa.key,pki/sa.pub,pki/etcd/ca.crt,pki/etcd/ca.key,admin.conf
    ```

    - `--token`: the token that was received when you called `kubeadm-getter` on the first control plane node.
    - `--address`: the address of the `kubeadm-getter` server on the first control plane node.
    - `--output-path`: where to write the downloaded files.
    - `--files`: comma-separated list of files to download from the `--input-path` on the server. This example specifies the required certs and `admin.conf` for the cluster.

    When the command finishes you should see something like:

    ```sh
    ...
    * receiving file: admin.conf
    * receiving block 6; size: 0
    * writing file: /etc/kubernetes/admin.conf
    * done transfering files
    ```

    This process writes all the requested files in the `/etc/kubernetes` folder.

1.  Start `kubeadm` on this node:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f --experimental-control-plane
    ```

    - Notice that this is the command that was returned from running `kubeadm init` on the first node, with the addition of the `--experimental-control-plane` flag. This flag automates joining this control plane node to the cluster.

1.  Repeat these steps for the rest of the control plane nodes. 

1.  After you copy files from the first control plane node to every other node, stop the `kubeadm-getter` server.

## External etcd nodes

### Set up the etcd cluster

- Follow [these instructions](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)
  to set up the etcd cluster.

### Set up the first control plane node

1.  On the first etcd node, call:

    ```sh
    export TEMP_TOKEN=`kubeadm-getter --create-token`
    echo $TEMP_TOKEN
    sudo kubeadm-getter --token=$TEMP_TOKEN --listen --input-path=/etc/kubernetes/pki
    ```

1. On the first control plane node, call::

    ```sh
    sudo kubeadm-getter --token=$TEMP_TOKEN --address=$ETCD_SERVER --output-path=/etc/kubernetes/pki \
    --files=etcd/ca.crt,apiserver-etcd-client.crt,apiserver-etcd-client.key
    ```

    where:

    - `$TEMP_TOKEN` is the token returned from the call to `kubeadm-getter` that you ran on the first etcd node.
    - `$ETCD_SERVER` is the address of the `kubeadm-getter` server listening on the etcd node.

1.  Stop the `kubeadm-getter` server. Make sure the following files are copied to the control plane node:

    - `/etc/kubernetes/pki/etcd/ca.crt`
    - `/etc/kubernetes/pki/apiserver-etcd-client.crt`
    - `/etc/kubernetes/pki/apiserver-etcd-client.key`

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
        networking:
            # This CIDR is a calico default. Substitute or remove for your CNI provider.
            podSubnet: "192.168.0.0/16"

    - The difference between stacked etcd and external etcd here is that we are using the `external` field for `etcd` in the kubeadm config. In the case of the stacked etcd topology this is managed automatically.

    -  Replace the following variables in the template with the appropriate values for your cluster:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

1.  On the first control plane node, Run `kubeadm init --config kubeadm-config.yaml`

1.  Write the join command that is returned to a text file for later use.

1.  Start `kubeadm-getter`:

    ```sh
    sudo kubeadm-getter --token=$TOKEN --input-path=/etc/kubernetes --listen
    ```

    where `$TOKEN` is the value returned from `kubeadm init`.

### Add the other control plane nodes

To add the rest of the control plane nodes, follow [these instructions](#steps-for-the-rest-of-the-control-plane-nodes).
The steps are the same as for the stacked etcd setup. To summarize:

- Make sure the first control plane node is fully initialized.
- Run `kubeadm-getter` to copy certificates between the first control plane node and the other control plane nodes.
- Join each control plane node with the join command you saved to a text file, plus the `--experimental-control-plane` flag.

## Common tasks after bootstrapping control plane

### Install a pod network

[Follow these instructions](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the master configuration file.

### Install workers

Each worker node can now be joined to the cluster with the command returned from any of the
`kubeadm init` commands. The flag `--experimental-control-plane` should not be added to worker nodes.

{{% /capture %}}
