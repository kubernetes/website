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

- With stacked control planes. This approach requires less infrastructure. etcd members
and control plane nodes are co-located.
- With an external etcd cluster. This approach requires more infrastructure. The
control plane nodes and etcd members are separated.

Your clusters must run Kubernetes version 1.12 or later. You should also be aware that
setting up HA clusters with kubeadm is still experimental and will be further simplified
in future versions. You might encounter issues with upgrading your clusters, for example.
We encourage you to try either approach, and provide us with feedback in the kubeadm
[issue tracker](https://github.com/kubernetes/kubeadm/issues/new).

Note that the alpha feature gate `HighAvailability` was marked as deprecated in v1.12 and was removed in v1.13.

The HA upgrade documentation can be found [here](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-ha).

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
  private network is fine)
- sudo privileges on all machines
- SSH access from one device to all nodes in the system

For the external etcd cluster only, you also need:

- Three additional machines for etcd members

Prerequisites for all nodes (control plane and worker):

- Install `kubeadm` and `kubelet` using your preferred method, like a package manager.
  `kubectl` is optional. `scp` is required if you want to use it for copying files between machines.

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

    - Make sure that the address of the load balancer will later match
      the address of kubeadm's `ControlPlaneEndpoint` address.

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

SSH will be required if you want to control all node from a single machine.

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

## Stacked etcd topology

A "stacked" HA cluster is a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed
data storage cluster provided by etcd is stacked on top of the cluster formed by the nodes that run control
plane components.

Each control plane node runs an instance of the `kube-apiserver`, `kube-scheduler`, `kube-controller-manager`
and the `kube-apiserver` is exposed to worker nodes using a load balancer.

Each control plane node creates a local etcd member and this etcd member communicate *only* with
the `kube-apiserver` of this particular node. The same applies to the local `kube-controller-manager`
and `kube-scheduler` instances.

This topology couples the control planes and etcd members under the same nodes and arguably forms
the most basic and replication friendly Kubernetes HA setup.

On the other hand, this topology does suffer from the limitation of "failed coupling",
where if one node goes down, both an etcd member and a control plane instance will be lost from
the redundancy factor of this cluster. This can be compensated by introducing more stacked control plane nodes.

A minimum of 3 stacked control plane nodes can be considered HA.

![Stacked etcd topology](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

### Steps for the first control plane node

Go on the first control plane node and create a configuration file called `kubeadm-config.yaml`:

```yaml
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
```

- `kubernetesVersion` should be set to the Kubernetes version you wish to use. This
  example uses `stable`.
- `controlPlaneEndpoint` should match the address (or DNS) and port of the load balancer.
- It is highly recommended that your kubeadm, kubelet, kubectl and `kubernetesVersion` match
  for this tutorial.

Make sure that the node is in a clean state using `reset` and then call `init`:

```sh
sudo kubeadm reset -f
sudo kubeadm init --config=kubeadm-config.yaml
```

If the process is successful you should see something like:

```sh
kubeadm join LOAD_BALANCER_DNS:LOAD_BALANCER_PORT --token <token> --discovery-token-ca-cert-hash <hash>
```

Write this down to a text file as this will be later used to join other control plane nodes to the cluster.

Now copy the required files from this node to the other control plane nodes using a smilar script:

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

- `CONTROL_PLANE_IPS` contains the list of IPs for the control plane node.
- `USER` can be changed to the user for each machine.
- Note that the files actually need to be in the `/etc/kubernetes/` folder for each of the machines.

It's recommended that you join new control plane nodes only after the first node has finished initializing.
Type the following command and watch the pods of the components getting started:

```sh
watch kubectl get pods --all-namespaces
```

### Steps for the rest of the control plane nodes

Make sure that you have copied the required files as outlined in the previous step.
Note that every time you call `kubeadm reset` such files will be deleted and you need to copy them again.

At this point you can start `kubeadm` on this node using the join command from earlier:

```sh
kubeadm join LOAD_BALANCER_DNS:LOAD_BALANCER_PORT --token <token> --discovery-token-ca-cert-hash <hash> \
--experimental-control-plane
```

Notice that the command is the same as what the first control plane node gave us, except
that we added `--experimental-control-plane`. This extra flag will automate the join process
of this control plane to the cluster.

## External etcd topology

While being fairly similar to the "stacked" HA cluster, an "external etcd" HA cluster is
a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed data storage
cluster provided by etcd is external to the cluster formed by the nodes that run control
plane components.

An external etcd cluster is formed by creating a number of separate etcd hosts, that talk to the
`kube-apiserver` of each control plane node.

This topology decouples the control plane and etcd member and provides an HA setup where
losing a control plane instance or an etcd member has less of an impact and does not affect
the cluster redundancy as much as the stacked HA topology.

One obvious downside comparing the two is that this topology requires a larger number of machines.
A minimum of 3 (control planes) by 3 (etcd hosts) setup for this topology can be considered HA.

![External etcd topology](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

### Set up the etcd cluster

Follow [these instructions](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)
to set up the etcd cluster.

### Set up the first control plane node

Once you have setup your etcd cluster you have to copy the etcd certificates from
one of the etcd nodes to the first control plane node. This can be done by executing
a similar script on the etcd node:

```sh
CONTROL_PLANE="ubuntu@10.0.0.7"
scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
```

- Replace `CONTROL_PLANE` with the `user@host` of your first control plane node.
- Note that the files actually need to be in the `/etc/kubernetes/` folder of the target machine.

kubeadm will recognize that the above certificates are already existing and not overwrite them.
After the first control plane node has initialized we are going to copy its certificates
to the rest of the control plane nodes.

Create a file called `kubeadm-config.yaml` with the following contents:

{{< note >}}
**Note**: Optionally replace `stable` with a different version of Kubernetes, for example `v1.11.3`.
{{< /note >}}

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

1.  Replace the following variables in the template with the appropriate values for your cluster:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `ETCD_0_IP`
    - `ETCD_1_IP`
    - `ETCD_2_IP`

1.  Run `kubeadm init --config kubeadm-config.yaml`
1.  Write the join command to a text file for later use.

The difference between stacked etcd and external etcd here is that we are using the `external`
field for `etcd` in the kubeadm config. In the case of the stacked etcd topology this `etcd` is local
and this is managed automatically.

At this point the external etcd procedure is exactly the same as the one for the stacked etcd topology
outlined [here](#steps-for-the-rest-of-the-control-plane-nodes).

- Make sure that the first control plane node is fully initialized.
- Copy certificates between the first control plane node and the rest.
- Join each control plane node using the join command you got from the first control plane node,
  while also adding the flag `--experimental-control-plane`.

## Common tasks after bootstrapping control plane

### Install a pod network

[Follow these instructions](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the master configuration file.

### Install workers

Each worker node can now be joined to the cluster with the command returned from any of the
`kubeadm init` commands. The flag `--experimental-control-plane` should not be added to worker nodes.

{{% /capture %}}
