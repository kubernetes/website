---
layout: blog
title: "Avoiding the Default Address when Using kubeadm to Create a Cluster"
date: YYYY-MM-DD
slug: avoiding-the-default-address-when-using-kubeadm-to-create-a-cluster
---

**Authors:** Mike Spreitzer

When using `kubeadm` to create a cluster, the default behavior is to
take the default address of each node as the address to use in every
sort of Kubernetes configuration --- and sometimes this is entirely
wrong.  I am concerning myself here only with IPv4; extension to IPv6
and dual-stack should be follow the same lines.  The default address
of a node is the address of the network interface that appears in the
default route.  In some use cases, this default address is not
reachable from other nodes and so _must not_ be used in any part of
Kuberntes configuration.  In a recent adventure of mine, this arose
because each node is a VirtualBox VM that uses what VirtualBox calls a
"NAT network adapter" to get connectivity to the outside world.  You
may have other use cases, perhaps involving containers.

In this post I will look at how to make all of the changes needed for
a single-control-node cluster.  I have not yet attempted multiple
control nodes, and the solution will need further work for that case.
The needed results are getting the desired address to appear in the
following places.

- The IP address that the kube-apiserver puts in its Endoints object.
- The Subject Alternative Name list of the x509 certificate generated
  for the kube-apiserver.
- The IP address that appears in the `kubeadm join` commands that
  `kubeadm` outputs.
- The InternalIP type of address that each kubelet puts into its
  Node's status.

This post describes work done with version 1.21.1 of kubeadm and
Kubernetes.

You may also like to read a related blog post, [Kubernetes Setup Using
Ansible and
Vagrant](/blog/2019/03/15/kubernetes-setup-using-ansible-and-vagrant/).
In contrast, the post at hand is about comprehensively overriding the
default address and not being specific to one form of automation.

As an added bonus, I will also mention how to stop DHCP from assigning
the same address to every node for networks where that is not desired.
This comes first because everything else depends on it; you can skip
that section if you are not having that problem.

## Getting DHCP to assign unique addresses

This is a problem that I had when using a common Ubuntu 20.04 snapshot
to base my various VMs on.  This snapshot includes a file named
`/etc/machine-id`, and so all my VMs get the same content in that file
(unless I take extra steps).  This is relevant because in Ubuntu
20.04, the default DHCP client is `systemd.networkd`, and its default
configuration causes it to send an explicit "DHCP client identifier"
(in addition to the client MAC address) in each request and that
identifier is derived from `/etc/machine-id` and _not_ the relevant
network interface's MAC address.  When an explicit client ID is
supplied, the DHCP server uses only that --- not also the client MAC
address.  Howevever, rather than having to tweak each derived VM, I
tweaked the common snapshot to make the DHCP client eschew that
explicit client ID --- leaving the DHCP server to look only at the
client's MAC address.  The relevant bit of `systemd.networkd`
configuration is normally driven by a higher level tool called
`netplan`.  I tweaked its configuration by creating a drop-in file
named `/etc/netplan/10-enp0s8.yaml` (because `enp0s8` is the name of
the network interface that I want to get a distinct IPv4 address on
each node) with the following contents.

```yaml
network:
  ethernets:
    enp0s8:
      dhcp4: true
      dhcp-identifier: mac
  version: 2
```

## The kube-apiserver's address in its Endpoints object

The default for this can be overridden by passing
`--advertise-address=${desired_address}` on the kube-apiservers's
command line.  You can get `kubeadm init` to do that either with a
command line flag or a bit of configuration file content.  The command
line flag would be `--apiserver-advertise-address=192.168.56.101`,
assuming the desired address for the control node is 192.168.56.101.
I will use that example address throughout this post.

I used a configuration file, named `ka-init.conf`.  The following
content will get this job done.

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
apiServer:
  extraArgs:
    advertise-address: 192.168.56.101
```

## The Subject Alternative Name list in the kube-apiserver's certificate

This job can be done with either a command line flag or a bit of
config file contents.  The command line flag is
`--apiserver-cert-extra-sans=192.168.56.101`.  The config file content
sets the `apiServer.certSANS` of a `ClusterConfiguration` to hold the
desired extra entries, such as `IP:192.168.56.101`.  Because the
Subject Alternative Name list is a list, it is not functionally
critical to make that list exclude the undesired default address.

This job together with replacing the address
that appears in the generated `kubeadm join` command can be done with
a different command line flag or bit of configuration content.

## The IP address in generated `kubeadm join` commands

This is overridden with a command line flag or bit of config file
contents.  This same bit of kubeadm configuration also gets the
desired address into the kube-apisever's x509 certificate's Subject
Alternative Name list.

The command line flag is `--control-plane-endpoint=192.168.56.101`.

The config file contents sets the `controlPlaneEndpoint` of a
`ClusterConfiguration`.  Following is the cumulative config file
content so far.

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
apiServer:
  extraArgs:
    advertise-address: 192.168.56.101
controlPlaneEndpoint: 192.168.56.101
```

## Each node's InternalIP type of address

The `kubeadm` tool takes no responsibility for configuring this.
However, it is part of the problem at hand.  I solved it by looking
into the `systemd` configuration for the kubelet and discovering that:
- the kubelet command line includes `$KUBELET_EXTRA_ARGS`,
- in a vanilla installation, nothing sets that variable,
- the file `/etc/default/kubelet`, if it exists, is `source`d as part
  of preparing the kubelet command line,
- in a vanilla installation, that file does not exist.

So I was able to use a simple solution that does not conflict with any
maintained configuration.  On each node I create the file named
`/etc/default/kubelet` and give it content like the following.

```shell
KUBELET_EXTRA_ARGS=--node-ip=192.168.56.101
```

Note: the kubelet also accepts a command line flag named `--address`,
but that one does not get this job done.

**Note well:** the proper content for this file is different on every
node.

## The grand finale

With the above in place, I started creating my two-node cluster by
executing

```shell
kubeadm init --config ka-init.conf
```

on the one control node and noting the `kubeadm join` command that was
printed at the end.

Next I used `kubectl` to look around an verify that everything looks
good.  The kube-apiserver's Endpoints object looks good.

```shell
root@init1:~# kubectl get Endpoints -A
NAMESPACE     NAME         ENDPOINTS             AGE
default       kubernetes   192.168.56.101:6443   30s
kube-system   kube-dns     <none>                14s
```

The control node has the right address but is not ready.
Investigation (not shown here) shows that it is because there is no
network plugin yet.

```shell
root@init1:~# kubectl get Node -o wide
NAME    STATUS     ROLES                  AGE   VERSION   INTERNAL-IP      EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
init1   NotReady   control-plane,master   40s   v1.21.1   192.168.56.101   <none>        Ubuntu 20.04.1 LTS   5.4.0-65-generic   docker://20.10.2
```

The pods look good, except for the DNS ones that are waiting for pod
networking.

```shell
root@init1:~# kubectl get Pod -A -o wide
NAMESPACE     NAME                            READY   STATUS    RESTARTS   AGE   IP               NODE     NOMINATED NODE   READINESS GATES
kube-system   coredns-558bd4d5db-pgn9l        0/1     Pending   0          29s   <none>           <none>   <none>           <none>
kube-system   coredns-558bd4d5db-xjdlp        0/1     Pending   0          29s   <none>           <none>   <none>           <none>
kube-system   etcd-init1                      1/1     Running   0          41s   192.168.56.101   init1    <none>           <none>
kube-system   kube-apiserver-init1            1/1     Running   0          41s   192.168.56.101   init1    <none>           <none>
kube-system   kube-controller-manager-init1   1/1     Running   0          41s   192.168.56.101   init1    <none>           <none>
kube-system   kube-proxy-bn8s4                1/1     Running   0          29s   192.168.56.101   init1    <none>           <none>
kube-system   kube-scheduler-init1            1/1     Running   0          41s   192.168.56.101   init1    <none>           <none>
```

Next I installed Flannel as the network plugin, following the
instructions at
[https://github.com/flannel-io/flannel#deploying-flannel-manually].

```shell
root@init1:~# kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
Warning: policy/v1beta1 PodSecurityPolicy is deprecated in v1.21+, unavailable in v1.25+
podsecuritypolicy.policy/psp.flannel.unprivileged created
clusterrole.rbac.authorization.k8s.io/flannel created
clusterrolebinding.rbac.authorization.k8s.io/flannel created
serviceaccount/flannel created
configmap/kube-flannel-cfg created
daemonset.apps/kube-flannel-ds created
```

BTW, Flannel requires each node to have a pod CIDR block assigned ---
which kubeadm does _not_ do by default.  I added a bit more kubeadm
config file content to accomplish that.  Following is the full config
file content that I used.  Note that the pod subnet has to be /23 or
bigger in my case (because the default allocation to each node is
/24), and you never want it to overlap with the service subnet.  Note
also that Flannel does not pick up on the pod subnet you configured
through kubeadm, it has its own configuration and that defaults to
`10.244.0.0/16`.  To keep my life simple, I used that in the kubeadm
configuration.

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
apiServer:
  extraArgs:
    advertise-address: 192.168.56.101
controlPlaneEndpoint: 192.168.56.101
networking:
  serviceSubnet: 10.96.0.0/16
  podSubnet: 10.244.0.0/16
```

After giving Flannel about half a minute for startup transients, I
re-examined the pods and found them all happily running.

```shell
root@init1:~# kubectl get Pod -A -o wide
NAMESPACE     NAME                            READY   STATUS    RESTARTS   AGE   IP               NODE    NOMINATED NODE   READINESS GATES
kube-system   coredns-558bd4d5db-pgn9l        1/1     Running   0          71s   10.244.0.3       init1   <none>           <none>
kube-system   coredns-558bd4d5db-xjdlp        1/1     Running   0          71s   10.244.0.2       init1   <none>           <none>
kube-system   etcd-init1                      1/1     Running   0          83s   192.168.56.101   init1   <none>           <none>
kube-system   kube-apiserver-init1            1/1     Running   0          83s   192.168.56.101   init1   <none>           <none>
kube-system   kube-controller-manager-init1   1/1     Running   0          83s   192.168.56.101   init1   <none>           <none>
kube-system   kube-flannel-ds-hqtfh           1/1     Running   0          35s   192.168.56.101   init1   <none>           <none>
kube-system   kube-proxy-bn8s4                1/1     Running   0          71s   192.168.56.101   init1   <none>           <none>
kube-system   kube-scheduler-init1            1/1     Running   0          83s   192.168.56.101   init1   <none>           <none>
```


Next I took the `kubeadm join` command noted above and ran it on the
worker node.  That reported success.  After waiting a little while I
examined all the pods again and found some running on the worker node
(for which I use the example name join1 and address 192.168.56.102
here).

```shell
root@init1:~# kubectl get Pod -A -o wide
NAMESPACE     NAME                            READY   STATUS    RESTARTS   AGE     IP               NODE    NOMINATED NODE   READINESS GATES
kube-system   coredns-558bd4d5db-pgn9l        1/1     Running   0          2m38s   10.244.0.3       init1   <none>           <none>
kube-system   coredns-558bd4d5db-xjdlp        1/1     Running   0          2m38s   10.244.0.2       init1   <none>           <none>
kube-system   etcd-init1                      1/1     Running   0          2m50s   192.168.56.101   init1   <none>           <none>
kube-system   kube-apiserver-init1            1/1     Running   0          2m50s   192.168.56.101   init1   <none>           <none>
kube-system   kube-controller-manager-init1   1/1     Running   0          2m50s   192.168.56.101   init1   <none>           <none>
kube-system   kube-flannel-ds-hqtfh           1/1     Running   0          2m2s    192.168.56.101   init1   <none>           <none>
kube-system   kube-flannel-ds-nrn6n           1/1     Running   0          15s     192.168.56.102   join1   <none>           <none>
kube-system   kube-proxy-bn8s4                1/1     Running   0          2m38s   192.168.56.101   init1   <none>           <none>
kube-system   kube-proxy-wxvpg                1/1     Running   0          15s     192.168.56.102   join1   <none>           <none>
kube-system   kube-scheduler-init1            1/1     Running   0          2m50s   192.168.56.101   init1   <none>           <none>
```
