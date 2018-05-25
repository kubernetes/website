---
reviewers:
- chuckha
title: Set up a High-Availability Etcd Cluster With Kubeadm
content_template: templates/task
---

{{% capture overview %}}

Kubeadm defaults to running a single member etcd cluster in a static pod managed
by the kubelet on the control plane node. This is not a highly-available setup
as the the etcd cluster contains only one member and cannot sustain any members
becoming unavailable. This task walks through the process of creating a highly
available etcd cluster of three members that can be used as an external etcd
when using kubeadm to set up a kubernetes cluster.

{{% /capture %}}

{{% capture prerequisites %}}

* Three hosts that can talk to each other over ports 2379 and 2380. This
  document assumes these default ports. However, they are configurable through
  the kubeadm config file.
* Each host must [have docker, kubelet, and kubeadm installed][toolbox].
* Some infrastructure to copy files between hosts (e.g., ssh).

[toolbox]: /docs/setup/independent/install-kubeadm/

{{% /capture %}}

{{% capture steps %}}

The general approach is to generate all certs on one node and only distribute
the *necessary* files to the other nodes.

## Create configuration files for kubeadm

Using the template provided below, create one kubeadm configuration file for
each host that will have an etcd member running on it. Update the value of
`CURRENT_HOST` and `NAME` before running the `cat` command.

```
export HOST0=10.0.0.1 # Update HOST0, HOST1, and HOST2 with the IPs or resolvable names of your hosts
export HOST1=10.0.0.2
export HOST2=10.0.0.3

# Create temp directories to store files that will end up on other hosts.
mkdir -p /tmp/${HOST0}/certs /tmp/${HOST1}/certs /tmp/${HOST2}/certs

export CURRENT_HOST="${HOST0}" # Update on each ranging through HOST0, HOST1 and HOST2
export NAME=infra0 # Update to use infra0 for HOST0, infra1 for HOST1 and infra2 for HOST2

cat << EOF > /tmp/${CURRENT_HOST}/kubeadmcfg.yaml
apiVersion: "kubeadm.k8s.io/v1alpha1"
kind: MasterConfiguration
etcd:
    serverCertSANs:
    - "${CURRENT_HOST}"
    peerCertSANs:
    - "${CURRENT_HOST}"
    extraArgs:
        initial-cluster: infra0=https://${HOST0}:2380,infra1=https://${HOST1}:2380,infra2=https://${HOST2}:2380
        initial-cluster-state: new
        name: ${NAME}
        listen-peer-urls: https://${CURRENT_HOST}:2380
        listen-client-urls: https://${CURRENT_HOST}:2379
        advertise-client-urls: https://${CURRENT_HOST}:2379
        initial-advertise-peer-urls: https://${CURRENT_HOST}:2380
EOF
```

## Generate certificates needed for the etcd cluster

### Certificate Authority

If you already have a CA then the only action that is copying the CA's `crt` and
`key` file to `/etc/kubernetes/pki/etcd/ca.crt` and
`/etc/kubernetes/pki/etcd/ca.key`. After those files have been copied, please
skip to the Certificate Swizzling section below.

If you do not already have a CA then run this command on `$HOST0` (where you
generated the configuration files for kubeadm).

```
kubeadm alpha phase certs etcd-ca
```

This creates two files

1. `/etc/kubernetes/pki/etcd/ca.crt`
2. `/etc/kubernetes/pki/etcd/ca.key`

### Create certificates for each member

In this step we create all the certs for each host in our cluster.

```
kubeadm alpha phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
kubeadm alpha phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
kubeadm alpha phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
# Move the generated certs out of the generated directory
find /etc/kubernetes/pki/etcd -not -name ca.crt -not -name ca.key -type f -exec mv {} /tmp/${HOST2}/certs \;
cp /etc/kubernetes/pki/etcd/ca.crt /tmp/${HOST2}/certs

kubeadm alpha phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
kubeadm alpha phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
kubeadm alpha phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
# Move the generated certs out of the generated directory
find /etc/kubernetes/pki/etcd -not -name ca.crt -not -name ca.key -type f -exec mv {} /tmp/${HOST1}/certs \;
cp /etc/kubernetes/pki/etcd/ca.crt /tmp/${HOST1}/certs

kubeadm alpha phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
kubeadm alpha phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
kubeadm alpha phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
# No need to move the certs because they are for HOST0
```

### Copy certs and configs to other hosts

Copy the certs and configs in each tmp directory to the respective hosts and put
the certs owned by root:root in `/etc/kubernetes/pki/etcd/`.

The steps to get these files on `$HOST1` might look like this if you can ssh
between hosts:

```
root@HOST0 $ scp -i /home/ubuntu/.ssh/id_rsa -r /tmp/${HOST1}/* ubuntu@${HOST1}:/home/ubuntu
root@HOST0 $ ssh -i /home/ubuntu/.ssh/id_rsa ubuntu@${HOST1}
ubuntu@HOST1 $ sudo -s
root@HOST1 $ chown -R root:root certs
root@HOST1 $ mv certs/* /etc/kubernetes/pki/etcd/
# Repeat for HOST2
```

### List of all generated certs

This is a list of all the files you have generated and where on which host they
should live.

#### Host 0

1. `/etc/kubernetes/pki/etcd/ca.crt`
1. `/etc/kubernetes/pki/etcd/ca.key`
1. `/etc/kubernetes/pki/etcd/server.crt`
1. `/etc/kubernetes/pki/etcd/server.key`
1. `/etc/kubernetes/pki/etcd/peer.crt`
1. `/etc/kubernetes/pki/etcd/peer.key`
1. `/etc/kubernetes/pki/etcd/healthcheck-client.crt`
1. `/etc/kubernetes/pki/etcd/healthcheck-client.key`
1. `/tmp/${HOST0}/kubeadmcfg.yaml`

#### Host 1

1. `/etc/kubernetes/pki/etcd/ca.crt`
1. `/etc/kubernetes/pki/etcd/server.crt`
1. `/etc/kubernetes/pki/etcd/server.key`
1. `/etc/kubernetes/pki/etcd/peer.crt`
1. `/etc/kubernetes/pki/etcd/peer.key`
1. `/etc/kubernetes/pki/etcd/healthcheck-client.crt`
1. `/etc/kubernetes/pki/etcd/healthcheck-client.key`
1. `/home/ubuntu/kubeadmcfg.yaml`

#### Host 2

1. `/etc/kubernetes/pki/etcd/ca.crt`
1. `/etc/kubernetes/pki/etcd/server.crt`
1. `/etc/kubernetes/pki/etcd/server.key`
1. `/etc/kubernetes/pki/etcd/peer.crt`
1. `/etc/kubernetes/pki/etcd/peer.key`
1. `/etc/kubernetes/pki/etcd/healthcheck-client.crt`
1. `/etc/kubernetes/pki/etcd/healthcheck-client.key`
1. `/home/ubuntu/kubeadmcfg.yaml`

## Manifests

Now that the certs and configs are in place we can create the manifest. On each
host run the `kubeadm` command to generate a static manifest for etcd.

```
root@HOST0 $ kubeadm alpha phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
root@HOST1 $ kubeadm alpha phase etcd local --config=/home/ubuntu/kubeadmcfg.yaml
root@HOST2 $ kubeadm alpha phase etcd local --config=/home/ubuntu/kubeadmcfg.yaml
```

## Optional: Check the cluster health

```
docker run --rm -it --net host -v /etc/kubernetes:/etc/kubernetes quay.io/coreos/etcd:v3.2.14 etcdctl --cert-file /etc/kubernetes/pki/etcd/peer.crt --key-file /etc/kubernetes/pki/etcd/peer.key --ca-file /etc/kubernetes/pki/etcd/ca.crt --endpoints https://${HOST0}:2379 cluster-health
...
cluster is healthy
```

{{% /capture %}}

{{% capture whatsnext %}}

Once your have a working 3 member etcd cluster, you can continue [setting up an
HA control plane using
kubeadm](/docs/setup/independent/high-availability/).

{{% /capture %}}


