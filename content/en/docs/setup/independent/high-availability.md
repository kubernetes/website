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

Q: THE ORIGINAL SEEMS TO HAVE CLEARER INFORMATION ABOUT WHY YOU'D CHOOSE ONE OR
THE OTHER. SHOULD WE ADD SOME OF IT BACK IN?

 Your clusters must run Kubernetes version 1.11 or later.

{{% /capture %}}

NOTE: THE TEMPLATE LAYOUT OVERRIDES ANYTHING YOU TRY TO WRAP IT IN. THIS MEANS YOU
DON'T GET WHAT YOU EXPECT IF YOU TRY TO WRAP THE PREREQUISITES IN ANYTHING. (TAKE 
A LOOK AT THE NETLIFY PREVIEW)

{{% capture prerequisites %}}

For both methods:

- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/independent/install-kubeadm/#before-you-begin) for
  the masters
- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/independent/install-kubeadm/#before-you-begin) for
  the workers
- Full network connectivity between all machines in the cluster (public or
  private network is fine)

For the external etcd cluster only:

- Three additional machines [TODO: simple kubelet and kubeadm] for etcd members

NOTE IS MOVED BC BETTER TO HIGHLIGHT ACTUAL PREREQUISITES FIRST
{{< note >}}
**Note**: The following examples run Calico as the Pod networking provider. If
you run another networking provider, make sure to replace any default values as
needed.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## First steps for both methods

1. Find your pod CIDR. For details, see [the CNI network
   documentation](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
   The example uses Calico, so the pod CIDR is `192.168.0.0/16`.

1. Create an SSH key pair on the node which has the files that will be
copied to other nodes:
I STILL HAVE A Q HERE: HOW DO YOU KNOW WHICH NODE THIS IS? IS IT AN
ARBITRARY NODE? IS IT THE FIRST NODE THAT YOU SPUN UP? IF THERE'S AN ORDER
TO THINGS, HOW DO YOU GET THAT ORDER? (IOW, WHAT ELSE HAVE YOU DONE BEFORE THIS?
IF THERE'S A POD TO GET THE CIDR FOR, OR IF THERE'S A NODE TO CREATE AN SSH KEY
PAIR ON -- HOW DID THEY HAPPEN?)

     ```sh
     # The -N flag sets an empty passphrase
     ssh-keygen -N '' -f ~/.ssh/id_rsa
     ```

1. Distribute the key that's returned:

     ```sh
     HOSTS="10.0.0.8 10.0.0.9 10.0.0.10 10.0.0.11"
     for host in ${HOSTS}; do
         ssh-copy-id -i ~/.ssh/id_rsa.pub $host;
     done
     ```

1. SSH between nodes to check that the connection is working properly.

## Stacked control plane nodes

### TODO: add steps here

## External etcd

### Setting up an HA etcd cluster using kubeadm

1. [Set up an HA etcd cluster using
   kubeadm](/docs/tasks/administer-cluster/setup-etcd-with-kubeadm).

     After this setup you should have these files on the first bootstrapped member.
     You will need to put these files on all of your control-plane nodes.

     - `/etc/kubernetes/pki/etcd/ca.crt`
     - `/etc/kubernetes/pki/apiserver-etcd-client.crt`
     - `/etc/kubernetes/pki/apiserver-etcd-client.key`

1. Set the `USER` and `CONTROL_PLANE_HOSTS` to your specific values.

     ```
     USER=ubuntu
     CONTROL_PLANE_HOSTS="10.0.0.7 10.0.0.8 10.0.0.9"
     for host in $CONTROL_PLANE_HOSTS; do
         scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host
         scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${USER}"@$host
         scp /etc/kubernetes/pki/apiserver-etcd-client.key "${USER}"@$host
     done
     ```

### Setting up the control plane

#### Creating a load balancer

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

#### The first control plane node

##### Steps

{{< note >}}
**Note**: This guide does not cover cloud-provider installation. Therefore if
you are in a cloud environment your services of type LoadBalancer will not work.
{{< /note >}}

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

1.  Replace the following variables in the template that was just created with values for your specific situation:

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

```
USER=ubuntu # customizable
CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
for host in ${CONTROL_PLANE_IPS}; do
    scp /etc/kubernetes/pki/ca.crt "${USER}"@CONTROL_PLANE_IP
    scp /etc/kubernetes/pki/ca.key "${USER}"@CONTROL_PLANE_IP
    scp /etc/kubernetes/pki/sa.key "${USER}"@CONTROL_PLANE_IP
    scp /etc/kubernetes/pki/sa.pub "${USER}"@CONTROL_PLANE_IP
    scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@CONTROL_PLANE_IP
    scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@CONTROL_PLANE_IP
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

### Install a pod network

Follow the instructions
[here](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install
the pod network. Make sure this corresponds to whichever pod CIDR you provided
in the master configuration file.

### Install workers

Each worker can now join the cluster with the command returned from any of the
`kubeadm init` commands.

{{% /capture %}}