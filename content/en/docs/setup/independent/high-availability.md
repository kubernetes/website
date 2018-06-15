---
reviewers:
- luxas
- timothysc
- detiber
- chuckha
title: Creating Highly Available Clusters with kubeadm
content_template: templates/task
---

{{% capture overview %}}

This page explains two different ways to set up a highly available Kubernetes
cluster using kubeadm:

- With stacked masters. This approach requires less infrastructure. etcd members
and control plane nodes are co-located.
- With an external etcd cluster. This approach requires more infrastructure. The
control plane nodes and etcd members are separated.

Your clusters must run Kubernetes version 1.11 or later.

{{< note >}}
**Note**: This guide does not cover cloud-provider installation. Therefore if
you are in a cloud environment your services of type LoadBalancer and Dynamic PersistentVolumes will not work.
{{< /note >}}

{{% /capture %}}

{{% capture prerequisites %}}

For both methods:

In both scenarios you will need this infrastructure:

- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/independent/install-kubeadm/#before-you-begin) for
  the masters
- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/independent/install-kubeadm/#before-you-begin) for
  the workers
- Full network connectivity between all machines in the cluster (public or
  private network is fine)
- SSH from one device to all nodes in the system
- sudo privileges on all machines

For the external etcd cluster only:

- Three additional machines for etcd members

{{< note >}}
**Note**: The following examples run Calico as the Pod networking provider. If
you run another networking provider, make sure to replace any default values as
needed.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## First steps for both methods

{{< note >}}
**Note**: All commands in this guide on any control plane or etcd node should be
run as root.
{{< /note >}}

1. Find your pod CIDR. For details, see [the CNI network
   documentation](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
   The example uses Calico, so the pod CIDR is `192.168.0.0/16`.
1. Enable ssh-agent on your main device that has access to all other nodes in
   the system by running `eval $(ssh-agent)`.
1. Add your ssh identity to the session `ssh-add ~/.ssh/path_to_private_key`.
1. When you ssh to any node make sure you add the `-A` flag like this `ssh -A 10.0.0.7`
1. When using sudo on any node make sure to preserve the environment so the ssh
   forwarding works, `sudo -E -s`.
1. SSH between nodes to check that the connection is working properly.
1. Create an apiserver load balancer with a DNS resolvable name.

{{< note >}}
**Note**: There are many configurations for load balancers. We have picked one
for this guide for the sake of an example, but be aware this is highly
customizable.
{{< /note >}}

In a cloud environment you want to put your control planes behind a tcp
forwarding load balancer. This load balancer will distribute traffic to all
healthy control plane nodes in its target list. The health check to determine if
an api server is healthy or not is a TCP check on the port the kube-apiserver is
listening on (default is `:6443`).

The load balancer must have a resolvable DNS name (we do not suggest using an IP
address directly in a cloud environment). The load balancer must have the ability to
communicate with all control plane nodes on the apiserver port and it must allow
incoming traffic on its listening port.

After this step, you have a resolvable DNS name for your load balancer.

You should add the control plane nodes to the load balancer but be aware they
will fail the health check until the kube-apiserver is running.

## Stacked control plane nodes

### Bootstrapping the first stacked control plane node

1. Create a `kubeadm-config.yaml` file

    Save this template in a file called `kubeadm-config.yaml`.

        apiVersion: kubeadm.k8s.io/v1alpha2
        kind: MasterConfiguration
        kubernetesVersion: v1.11.0
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        api:
            controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
          local:
            extraArgs:
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
            # This CIDR is a calico default. Substitute or remove for your CNI provider.
            podSubnet: "192.168.0.0/16"

1. Replace the following variables in the template that was just created with
   values for your specific situation:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `CP0_HOSTNAME`
    - `CP0_IP`

1. Run `sudo kubeadm init --config kubeadm-config.yaml`

### Copy secrets to other control plane nodes

Kubeadm created certificates during the init step that need to be shared on the
other control plane nodes. Specifically:

- `/etc/kubernetes/pki/ca.crt`
- `/etc/kubernetes/pki/ca.key`
- `/etc/kubernetes/pki/sa.key`
- `/etc/kubernetes/pki/sa.pub`
- `/etc/kubernetes/pki/front-proxy-ca.crt`
- `/etc/kubernetes/pki/front-proxy-ca.key`
- `/etc/kubernetes/pki/etcd/ca.crt`
- `/etc/kubernetes/pki/etcd/ca.key`

The admin kubeconfig will also be needed for bootstrapping the additional
control plane nodes:

- `/etc/kubernetes/admin.conf`

Here is an example, but your system may differ greatly. Replace
`CONTROL_PLANE_IP` with the IP addresses of the other control plane nodes.

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

### Add the second stacked control plane node

1. Create a `kubeadm-config.yaml` file

    Save this template in a file called `kubeadm-config.yaml`.

{{< note >}}
**Note**: This template contains differences from the one used previously.
{{< /note >}}

        apiVersion: kubeadm.k8s.io/v1alpha2
        kind: MasterConfiguration
        kubernetesVersion: v1.11.0
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        api:
            controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
          local:
            extraArgs:
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

1. Replace the following variables in the template that was just created with
   values for your specific situation:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `CP0_HOSTNAME`
    - `CP0_IP`
    - `CP1_HOSTNAME`
    - `CP1_IP`

1. Move the copied certificates to the proper locations

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

1. Run the kubeadm phase commands to bootstrap the kubelet

  ```sh
  kubeadm alpha phase certs all --config kubeadm-config.yaml
  kubeadm alpha phase kubelet config write-to-disk --config kubeadm-config.yaml
  kubeadm alpha phase kubelet write-env-file --config kubeadm-config.yaml
  kubeadm alpha phase kubeconfig kubelet --config kubeadm-config.yaml
  systemctl start kubelet
  ```

1. Run the commands to add the node to the etcd cluster

  {{< note >}}
  **Note**: This step will cause the etcd cluster to become unavailable for a
  brief period between adding the node to the running cluster config and the new
  node joining the etcd cluster.
  {{< /note >}}

  ```sh
  CP0_IP=10.0.0.7
  CP0_HOSTNAME=cp0
  CP1_IP=10.0.0.8
  CP1_HOSTNAME=cp1

  KUBECONFIG=/etc/kubernetes/admin.conf kubectl exec -n kube-system etcd-${CP0_HOSTNAME} -- etcdctl --ca-file /etc/kubernetes/pki/etcd/ca.crt --cert-file /etc/kubernetes/pki/etcd/peer.crt --key-file /etc/kubernetes/pki/etcd/peer.key --endpoints=https://${CP0_IP}:2379 member add ${CP1_HOSTNAME} https://${CP1_IP}:2380
  kubeadm alpha phase etcd local --config kubeadm-config.yaml
  ```

1. Deploy the control plane components and mark the node as a master

  ```sh
  kubeadm alpha phase kubeconfig all --config kubeadm-config.yaml
  kubeadm alpha phase controlplane all --config kubeadm-config.yaml
  kubeadm alpha phase mark-master --config kubeadm-config.yaml
  ```

### Add the third stacked control plane node

1. Create a `kubeadm-config.yaml` file

    Save this template in a file called `kubeadm-config.yaml`.

    {{< note >}}
    **Note**: This template contains differences from the one used previously.
    {{< /note >}}

        apiVersion: kubeadm.k8s.io/v1alpha2
        kind: MasterConfiguration
        kubernetesVersion: v1.11.0
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        api:
            controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
          local:
            extraArgs:
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

1. Replace the following variables in the template that was just created with
   values for your specific situation:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `CP0_HOSTNAME`
    - `CP0_IP`
    - `CP1_HOSTNAME`
    - `CP1_IP`
    - `CP2_HOSTNAME`
    - `CP2_IP`

1. Move the copied certificates to the proper locations

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

1. Run the kubeadm phase commands to bootstrap the kubelet

  ```sh
  kubeadm alpha phase certs all --config kubeadm-config.yaml
  kubeadm alpha phase kubelet config write-to-disk --config kubeadm-config.yaml
  kubeadm alpha phase kubelet write-env-file --config kubeadm-config.yaml
  kubeadm alpha phase kubeconfig kubelet --config kubeadm-config.yaml
  systemctl start kubelet
  ```

1. Run the commands to add the node to the etcd cluster

  ```sh
  CP0_IP=10.0.0.7
  CP0_HOSTNAME=cp0
  CP2_IP=10.0.0.9
  CP2_HOSTNAME=cp2

  KUBECONFIG=/etc/kubernetes/admin.conf kubectl exec -n kube-system etcd-${CP0_HOSTNAME} -- etcdctl --ca-file /etc/kubernetes/pki/etcd/ca.crt --cert-file /etc/kubernetes/pki/etcd/peer.crt --key-file /etc/kubernetes/pki/etcd/peer.key --endpoints=https://${CP0_IP}:2379 member add ${CP2_HOSTNAME} https://${CP2_IP}:2380
  kubeadm alpha phase etcd local --config kubeadm-config.yaml
  ```

1. Deploy the control plane components and mark the node as a master

  ```sh
  kubeadm alpha phase kubeconfig all --config kubeadm-config.yaml
  kubeadm alpha phase controlplane all --config kubeadm-config.yaml
  kubeadm alpha phase mark-master --config kubeadm-config.yaml
  ```

## External etcd

### Setting up a highly available etcd cluster using kubeadm

1. [Set up an HA etcd cluster using
   kubeadm](/docs/tasks/administer-cluster/setup-ha-etcd-with-kubeadm/).

    After this setup you should have these files on the first bootstrapped
    member. You will need to put these files on all of your control-plane nodes.

    - `/etc/kubernetes/pki/etcd/ca.crt`
    - `/etc/kubernetes/pki/apiserver-etcd-client.crt`
    - `/etc/kubernetes/pki/apiserver-etcd-client.key`

1. Set the `USER` and `CONTROL_PLANE_HOSTS` to your specific values.

     ```sh
     USER=ubuntu
     CONTROL_PLANE_HOSTS="10.0.0.7 10.0.0.8 10.0.0.9"
     for host in $CONTROL_PLANE_HOSTS; do
         scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:
         scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${USER}"@$host:
         scp /etc/kubernetes/pki/apiserver-etcd-client.key "${USER}"@$host:
     done
    ```

### Setting up the control plane

#### The first control plane node

##### Steps

1. Create a `kubeadm-config.yaml` file

    Save this template in a file called `kubeadm-config.yaml`.

        apiVersion: kubeadm.k8s.io/v1alpha2
        kind: MasterConfiguration
        kubernetesVersion: v1.11.0
        apiServerCertSANs:
        - "LOAD_BALANCER_DNS"
        api:
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

1. Replace the following variables in the template that was just created with values for your specific situation:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `ETCD_0_IP`
    - `ETCD_1_IP`
    - `ETCD_2_IP`

1. Run `kubeadm init --config kubeadm-config.yaml`

#### Copy certificates

Kubeadm created certificates during the init step that need to be shared on the other
control plane nodes. Specifically:

- `/etc/kubernetes/pki/ca.crt`
- `/etc/kubernetes/pki/ca.key`
- `/etc/kubernetes/pki/sa.key`
- `/etc/kubernetes/pki/sa.pub`
- `/etc/kubernetes/pki/front-proxy-ca.crt`
- `/etc/kubernetes/pki/front-proxy-ca.key`

Here is an example, but your system may differ greatly. Replace
`CONTROL_PLANE_IP` with the IP addresses of the other control plane nodes.

     ```sh
     USER=ubuntu # customizable
     CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
     for host in ${CONTROL_PLANE_IPS}; do
         scp /etc/kubernetes/pki/ca.crt "${USER}"@CONTROL_PLANE_IP:
         scp /etc/kubernetes/pki/ca.key "${USER}"@CONTROL_PLANE_IP:
         scp /etc/kubernetes/pki/sa.key "${USER}"@CONTROL_PLANE_IP:
         scp /etc/kubernetes/pki/sa.pub "${USER}"@CONTROL_PLANE_IP:
         scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@CONTROL_PLANE_IP:
         scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@CONTROL_PLANE_IP:
     done
     ```

#### The other control plane nodes

Make sure the certificates that were copied end up in the right place. Your
`/etc/kubernetes` directory should look like this:

- `/etc/kubernetes/pki/apiserver-etcd-client.crt`
- `/etc/kubernetes/pki/apiserver-etcd-client.key`
- `/etc/kubernetes/pki/ca.crt`
- `/etc/kubernetes/pki/ca.key`
- `/etc/kubernetes/pki/front-proxy-ca.crt`
- `/etc/kubernetes/pki/front-proxy-ca.key`
- `/etc/kubernetes/pki/sa.key`
- `/etc/kubernetes/pki/sa.pub`
- `/etc/kubernetes/pki/etcd/ca.crt`

You should also have the `kubeadm-config.yaml` that we created at the beginning.

Run `kubeadm init --config kubeadm-config.yaml` on each control plane node.

## Common Post-ControlPlane Bootstrapping Steps

### Install a pod network

Follow the instructions
[here](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the master configuration file.

### Install workers

Each worker can now join the cluster with the command returned from any of the
`kubeadm init` commands.

{{% /capture %}}
