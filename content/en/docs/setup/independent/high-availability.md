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

Before proceeding, you should carefully consider which approach best meets the needs of your applications
and environment. [This comparison topic](/docs/setup/independent/ha-topology/) outlines the advantages and disadvantages of each.

Your clusters must run Kubernetes version 1.12 or later. You should also be aware that
setting up HA clusters with kubeadm is still experimental and will be further simplified
in future versions. You might encounter issues with upgrading your clusters, for example.
We encourage you to try either approach, and provide us with feedback in the kubeadm
[issue tracker](https://github.com/kubernetes/kubeadm/issues/new).

See also [The HA upgrade documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-ha-1-14).

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

## First steps for both methods

{{< note >}}
All commands on any control plane or etcd node should be
run as root.
{{< /note >}}

- Some CNI network plugins like Calico require a CIDR such as `192.168.0.0/16` and
  some like Weave do not. See the [CNI network
  documentation](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
  To add a pod CIDR set the `podSubnet: 192.168.0.0/16` field under
  the `networking` object of `ClusterConfiguration`.

### Create load balancer for kube-apiserver

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

    - `kubernetesVersion` should be set to the Kubernetes version to use. This
  example uses `stable`.
    - `controlPlaneEndpoint` should match the address or DNS and port of the load balancer.
    - It's recommended that the versions of kubeadm, kubelet, kubectl and Kubernetes match.

1.  Initialize the control plane:

    ```sh
    sudo kubeadm init --config=kubeadm-config.yaml --experimental-upload-certs
    ```
    - The `--experimental-upload-certs` flags is used to upload the control plane
  certificates to the cluster. 

    You should see something like:
    
    ```sh
    ...
    You can now join any number of control-plane node running the following command on each as a root:
      kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --experimental-control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    
    Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
    As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.
    
    Then you can join any number of worker nodes by running the following on each as root:
      kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
    ```

    - Copy this output to a text file. You will need it later to join control plane and worker nodes to the cluster.
    - When `--experimental-upload-certs` is used with `kubeadm init`, the certificates of the primary control plane
    are uploaded to the cluster in a Secret and encrypted.
    -  When joining new control plane nodes using `kubeadm join ... --experimental-control-plane`,
    if `--certificate-key ...` is provided it will cause the new control plane to download the certificates
    from the Secret and decrypt them.
    - Please note that the Secret and decryption key expire after two hours by default. To re-upload the certificates
    and generate a new decryption key, use the following command on a control plane that is already joined the cluster:

      ```sh
      kubeadm init phase upload-certs --experimental-upload-certs
      ```

1.  Apply the Weave CNI plugin:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

1.  Type the following and watch the pods of the components get started:

    ```sh
    kubectl get pod -n kube-system -w
    ```

    - It's recommended that you join new control plane nodes in a sequence, only after the first node has finished initializing.

1.  Optionally copy the `admin.conf` file from the first control plane node to the rest:

    In the following example, replace `CONTROL_PLANE_IPS` with the IP addresses of the
    other control plane nodes.
    ```sh
    USER=ubuntu # customizable
    CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
    for host in ${CONTROL_PLANE_IPS}; do
        scp /etc/kubernetes/admin.conf "${USER}"@$host:
    done
    ```

### Steps for the rest of the control plane nodes

1.  Optionally move the `admin.conf` file created by the previous step where `scp` was used:

    ```sh
    USER=ubuntu # customizable
    mv /home/${USER}/admin.conf /etc/kubernetes/admin.conf
    ```

1.  Start `kubeadm join` on this node using the join command that was previously given to you by `kubeadm init` on
    the first node. It should look something like this:

    ```sh
    kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --experimental-control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    ```

    - The `--experimental-control-plane` flag will automate the process of this
  control plane joining the cluster.
    - The `--certificate-key ...` flag provides a decryption key used to download
  control plane certificates from the cluster.

1.  Type the following and watch the pods of the components get started:

    ```sh
    kubectl get pod -n kube-system -w
    ```

1.  Repeat these steps for the rest of the control plane nodes.

## External etcd nodes

### Set up the etcd cluster

- Follow [these instructions](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)
  to set up the etcd cluster.

### Set up the first control plane node

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

    - The difference between stacked etcd and external etcd here is that we are using
  the `external` field for `etcd` in the kubeadm config. In the case of the stacked
  etcd topology this is managed automatically.

    -  Replace the following variables in the template with the appropriate values for your cluster:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

1.  Run `kubeadm init --config kubeadm-config.yaml --experimental-upload-certs` on this node.

1.  Write the output join commands that are returned to a text file for later use.

1.  Apply the Weave CNI plugin:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### Steps for the rest of the control plane nodes

The steps are the same as for the stacked etcd setup:

- Make sure the first control plane node is fully initialized.
- Join each control plane node with the join command you saved to a text file. It's recommended
to join the control plane nodes one at a time.
- Don't forget that the decryption key from `--certificate-key` expires after two hours, by default.

## Common tasks after bootstrapping control plane

### Install a pod network

[Follow these instructions](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the kubeadm configuration file.

### Install workers

Worker nodes can be joined to the cluster with the command you stored previously
as the output from the `kubeadm init` command:

```sh
kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

{{% /capture %}}
