---
reviewers:
- sig-cluster-lifecycle
title: Creating Highly Available Clusters with kubeadm
content_template: templates/task
weight: 50
---

{{% capture overview %}}

This page explains two different approaches to setting up a highly available Kubernetes
cluster using kubeadm:

- With stacked masters. This approach requires less infrastructure. etcd members
and control plane nodes are co-located.
- With an external etcd cluster. This approach requires more infrastructure. The
control plane nodes and etcd members are separated.

Your clusters must run Kubernetes version 1.12 or later. You should also be aware that
setting up HA clusters with kubeadm is still experimental. You might encounter issues
with upgrading your clusters, for example. We encourage you to try either approach,
and provide feedback.

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
  private network is fine)
- SSH access from one device to all nodes in the system
- sudo privileges on all machines

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
All commands in this guide on any control plane or etcd node should be run as root.
{{< /note >}}

- Find your pod CIDR. For details, see [the CNI network
   documentation](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
   The example uses Calico, so the pod CIDR is `192.168.0.0/16`.

### Configure SSH

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

## Stacked control plane nodes

### Bootstrap the first stacked control plane node

{{< note >}}
Optionally replace the string `stable` with a different version of Kubernetes, for example `v1.12.0`.
{{< /note >}}

1.  Create a `kubeadm-config.yaml` template file:

        apiVersion: kubeadm.k8s.io/v1alpha3
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
          local:
            extraArgs:
              name: "CP0_HOSTNAME"
              listen-client-urls: "https://127.0.0.1:2379,https://CP0_IP:2379"
              advertise-client-urls: "https://CP0_IP:2379"
              listen-peer-urls: "https://CP0_IP:2380"
              initial-advertise-peer-urls: "https://CP0_IP:2380"
              initial-cluster: "CP0_HOSTNAME=https://CP0_IP:2380"
            serverCertSANs:
              - CP0_HOSTNAME
              - CP0_IP
            peerCertSANs:
              - CP0_HOSTNAME
              - CP0_IP
        networking:
            # This CIDR is a Calico default. Substitute or remove for your CNI provider.
            podSubnet: "192.168.0.0/16"

1.  Replace the following variables in the template with the appropriate
    values for your cluster:

    * `LOAD_BALANCER_DNS`
    * `LOAD_BALANCER_PORT`
    * `CP0_HOSTNAME`
    * `CP0_IP`

1.  Run `kubeadm init --config kubeadm-config.yaml`

### Copy required files to other control plane nodes

The following certificates and other required files were created when you ran `kubeadm init`.
Copy these files to your other control plane nodes:

- `/etc/kubernetes/pki/ca.crt`
- `/etc/kubernetes/pki/ca.key`
- `/etc/kubernetes/pki/sa.key`
- `/etc/kubernetes/pki/sa.pub`
- `/etc/kubernetes/pki/front-proxy-ca.crt`
- `/etc/kubernetes/pki/front-proxy-ca.key`
- `/etc/kubernetes/pki/etcd/ca.crt`
- `/etc/kubernetes/pki/etcd/ca.key`

Copy the admin kubeconfig to the other control plane nodes:

- `/etc/kubernetes/admin.conf`

In the following example, replace
`CONTROL_PLANE_IPS` with the IP addresses of the other control plane nodes.

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

{{< note >}}
Remember that your config may differ from this example.
{{< /note >}}

### Add the second stacked control plane node

1.  Create a second, different `kubeadm-config.yaml` template file:

        apiVersion: kubeadm.k8s.io/v1alpha3
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
          local:
            extraArgs:
              name: "CP1_HOSTNAME"
              listen-client-urls: "https://127.0.0.1:2379,https://CP1_IP:2379"
              advertise-client-urls: "https://CP1_IP:2379"
              listen-peer-urls: "https://CP1_IP:2380"
              initial-advertise-peer-urls: "https://CP1_IP:2380"
              initial-cluster: "CP0_HOSTNAME=https://CP0_IP:2380,CP1_HOSTNAME=https://CP1_IP:2380"
              initial-cluster-state: existing
            serverCertSANs:
              - CP1_HOSTNAME
              - CP1_IP
            peerCertSANs:
              - CP1_HOSTNAME
              - CP1_IP
        networking:
            # This CIDR is a calico default. Substitute or remove for your CNI provider.
            podSubnet: "192.168.0.0/16"

1.  Replace the following variables in the template with the appropriate values for your cluster:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `CP0_HOSTNAME`
    - `CP0_IP`
    - `CP1_HOSTNAME`
    - `CP1_IP`

1.  Move the copied files to the correct locations:

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

1.  Run the kubeadm phase commands to bootstrap the kubelet:

    ```sh
    kubeadm alpha phase certs all --config kubeadm-config.yaml
    kubeadm alpha phase kubelet config write-to-disk --config kubeadm-config.yaml
    kubeadm alpha phase kubelet write-env-file --config kubeadm-config.yaml
    kubeadm alpha phase kubeconfig kubelet --config kubeadm-config.yaml
    systemctl start kubelet
    ```

1.  Run the commands to add the node to the etcd cluster:

    ```sh
    export CP0_IP=10.0.0.7
    export CP0_HOSTNAME=cp0
    export CP1_IP=10.0.0.8
    export CP1_HOSTNAME=cp1

    kubeadm alpha phase etcd local --config kubeadm-config.yaml
    export KUBECONFIG=/etc/kubernetes/admin.conf
    kubectl exec -n kube-system etcd-${CP0_HOSTNAME} -- etcdctl --ca-file /etc/kubernetes/pki/etcd/ca.crt --cert-file /etc/kubernetes/pki/etcd/peer.crt --key-file /etc/kubernetes/pki/etcd/peer.key --endpoints=https://${CP0_IP}:2379 member add ${CP1_HOSTNAME} https://${CP1_IP}:2380
    ```

    - This command causes the etcd cluster to become unavailable for a
      brief period, after the node is added to the running cluster, and before the
      new node is joined to the etcd cluster.

1.  Deploy the control plane components and mark the node as a master:

    ```sh
    kubeadm alpha phase kubeconfig all --config kubeadm-config.yaml
    kubeadm alpha phase controlplane all --config kubeadm-config.yaml
    kubeadm alpha phase kubelet config annotate-cri --config kubeadm-config.yaml
    kubeadm alpha phase mark-master --config kubeadm-config.yaml
    ```

### Add the third stacked control plane node

1.  Create a third, different `kubeadm-config.yaml` template file:

        apiVersion: kubeadm.k8s.io/v1alpha3
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
          local:
            extraArgs:
              name: "CP2_HOSTNAME"
              listen-client-urls: "https://127.0.0.1:2379,https://CP2_IP:2379"
              advertise-client-urls: "https://CP2_IP:2379"
              listen-peer-urls: "https://CP2_IP:2380"
              initial-advertise-peer-urls: "https://CP2_IP:2380"
              initial-cluster: "CP0_HOSTNAME=https://CP0_IP:2380,CP1_HOSTNAME=https://CP1_IP:2380,CP2_HOSTNAME=https://CP2_IP:2380"
              initial-cluster-state: existing
            serverCertSANs:
              - CP2_HOSTNAME
              - CP2_IP
            peerCertSANs:
              - CP2_HOSTNAME
              - CP2_IP
        networking:
            # This CIDR is a calico default. Substitute or remove for your CNI provider.
            podSubnet: "192.168.0.0/16"

1.  Replace the following variables in the template with the appropriate values for your cluster:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `CP0_HOSTNAME`
    - `CP0_IP`
    - `CP1_HOSTNAME`
    - `CP1_IP`
    - `CP2_HOSTNAME`
    - `CP2_IP`

1.  Move the copied files to the correct locations:

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

1.  Run the kubeadm phase commands to bootstrap the kubelet:

    ```sh
    kubeadm alpha phase certs all --config kubeadm-config.yaml
    kubeadm alpha phase kubelet config write-to-disk --config kubeadm-config.yaml
    kubeadm alpha phase kubelet write-env-file --config kubeadm-config.yaml
    kubeadm alpha phase kubeconfig kubelet --config kubeadm-config.yaml
    systemctl start kubelet
    ```

1.  Run the commands to add the node to the etcd cluster:

    ```sh
    export CP0_IP=10.0.0.7
    export CP0_HOSTNAME=cp0
    export CP2_IP=10.0.0.9
    export CP2_HOSTNAME=cp2

    export KUBECONFIG=/etc/kubernetes/admin.conf
    kubectl exec -n kube-system etcd-${CP0_HOSTNAME} -- etcdctl --ca-file /etc/kubernetes/pki/etcd/ca.crt --cert-file /etc/kubernetes/pki/etcd/peer.crt --key-file /etc/kubernetes/pki/etcd/peer.key --endpoints=https://${CP0_IP}:2379 member add ${CP2_HOSTNAME} https://${CP2_IP}:2380
    kubeadm alpha phase etcd local --config kubeadm-config.yaml
    ```

1.  Deploy the control plane components and mark the node as a master:

    ```sh
    kubeadm alpha phase kubeconfig all --config kubeadm-config.yaml
    kubeadm alpha phase controlplane all --config kubeadm-config.yaml
    kubeadm alpha phase kubelet config annotate-cri --config kubeadm-config.yaml
    kubeadm alpha phase mark-master --config kubeadm-config.yaml
    ```

## External etcd

### Set up the cluster

- Follow [these instructions](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)
   to set up the etcd cluster.

#### Copy required files from an etcd node to all control plane nodes

In the following example, replace `USER` and `CONTROL_PLANE_HOSTS` values with values
for your environment.

```sh
# Make a list of required etcd certificate files
cat << EOF > etcd-pki-files.txt
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
EOF

# create the archive
tar -czf etcd-pki.tar.gz -T etcd-pki-files.txt

# copy the archive to the control plane nodes
USER=ubuntu
CONTROL_PLANE_HOSTS="10.0.0.7 10.0.0.8 10.0.0.9"
for host in $CONTROL_PLANE_HOSTS; do
    scp etcd-pki.tar.gz "${USER}"@$host:
done
```

### Set up the first control plane node

{{< note >}}
Optionally replace the string `stable` with a different version of Kubernetes, for example `v1.11.3`.
{{< /note >}}

1.  Extract the etcd certificates

        mkdir -p /etc/kubernetes/pki
        tar -xzf etcd-pki.tar.gz -C /etc/kubernetes/pki --strip-components=3

1.  Create a `kubeadm-config.yaml`:

        apiVersion: kubeadm.k8s.io/v1alpha3
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServerCertSANs:
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

1.  Replace the following variables in the template with the appropriate values for your cluster:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `ETCD_0_IP`
    - `ETCD_1_IP`
    - `ETCD_2_IP`

1.  Run `kubeadm init --config kubeadm-config.yaml`
1.  Copy the output from the join command

### Copy required files to the correct locations

The following pki files were created during the `kubeadm init` step and must be shared with
all other control plane nodes.

- `/etc/kubernetes/pki/ca.crt`
- `/etc/kubernetes/pki/ca.key`
- `/etc/kubernetes/pki/sa.key`
- `/etc/kubernetes/pki/sa.pub`
- `/etc/kubernetes/pki/front-proxy-ca.crt`
- `/etc/kubernetes/pki/front-proxy-ca.key`

In the following example, replace the list of
`CONTROL_PLANE_IPS` values with the IP addresses of the other control plane nodes.

```sh
# make a list of required kubernetes certificate files
cat << EOF > certificate_files.txt
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
EOF

# create the archive
tar -czf control-plane-certificates.tar.gz -T certificate_files.txt

USER=ubuntu # customizable
CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
for host in ${CONTROL_PLANE_IPS}; do
    scp control-plane-certificates.tar.gz "${USER}"@$host:
done
```

### Set up the other control plane nodes

1.  Extract the required certificates

        mkdir -p /etc/kubernetes/pki
        tar -xzf etcd-pki.tar.gz -C /etc/kubernetes/pki --strip-components 3
        tar -xzf control-plane-certificates.tar.gz -C /etc/kubernetes/pki --strip-components 3

1.  Verify the location of the copied files.
    Your `/etc/kubernetes` directory should look like this:

    - `/etc/kubernetes/pki/apiserver-etcd-client.crt`
    - `/etc/kubernetes/pki/apiserver-etcd-client.key`
    - `/etc/kubernetes/pki/ca.crt`
    - `/etc/kubernetes/pki/ca.key`
    - `/etc/kubernetes/pki/front-proxy-ca.crt`
    - `/etc/kubernetes/pki/front-proxy-ca.key`
    - `/etc/kubernetes/pki/sa.key`
    - `/etc/kubernetes/pki/sa.pub`
    - `/etc/kubernetes/pki/etcd/ca.crt`

1.  Run the copied `kubeadm join` command from above. Add the flag "--experimental-control-plane".
    The final command will look something like this:

        kubeadm join ha.k8s.example.com:6443 --token 5ynki1.3erp9i3yo7gqg1nv --discovery-token-ca-cert-hash sha256:a00055bd8c710a9906a3d91b87ea02976334e1247936ac061d867a0f014ecd81 --experimental-control-plane

## Common tasks after bootstrapping control plane

### Install a pod network

[Follow these instructions](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the master configuration file.

### Install workers

Each worker node can now be joined to the cluster with the command returned from any of the
`kubeadm init` commands.

{{% /capture %}}
