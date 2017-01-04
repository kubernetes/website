---
assignees:
- erictune
- idvoretskyi
title: CoreOS on libvirt
---

* TOC
{:toc}

### Highlights

* Super-fast cluster boot-up (few seconds instead of several minutes for vagrant)
* Reduced disk usage thanks to [COW](https://en.wikibooks.org/wiki/QEMU/Images#Copy_on_write)
* Reduced memory footprint thanks to [KSM](https://www.kernel.org/doc/Documentation/vm/ksm.txt)

### Warnings about `libvirt-coreos` use case

The primary goal of the `libvirt-coreos` cluster provider is to deploy a multi-node Kubernetes cluster on local VMs as fast as possible and to be as light as possible in term of resources used.

In order to achieve that goal, its deployment is very different from the "standard production deployment" method used on other providers. This was done on purpose in order to implement some optimizations made possible by the fact that we know that all VMs will be running on the same physical machine.

The `libvirt-coreos` cluster provider doesn't aim at being production look-alike.

Another difference is that no security is enforced on `libvirt-coreos` at all. For example,

* Kube API server is reachable via a clear-text connection (no SSL);
* Kube API server requires no credentials;
* etcd access is not protected;
* Kubernetes secrets are not protected as securely as they are on production environments;
* etc.

So, a k8s application developer should not validate its interaction with Kubernetes on `libvirt-coreos` because he might technically succeed in doing things that are prohibited on a production environment like:

* un-authenticated access to Kube API server;
* Access to Kubernetes private data structures inside etcd;
* etc.

On the other hand, `libvirt-coreos` might be useful for people investigating low level implementation of Kubernetes because debugging techniques like sniffing the network traffic or introspecting the etcd content are easier on `libvirt-coreos` than on a production deployment.

### Prerequisites

1. Install [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)
2. Install [ebtables](http://ebtables.netfilter.org/)
3. Install [qemu](http://wiki.qemu.org/Main_Page)
4. Install [libvirt](http://libvirt.org/)
5. Install [openssl](http://openssl.org/)
6. Enable and start the libvirt daemon, e.g.:
   * ``systemctl enable libvirtd && systemctl start libvirtd`` # for systemd-based systems
   * ``/etc/init.d/libvirt-bin start`` # for init.d-based systems
7. [Grant libvirt access to your user¹](https://libvirt.org/aclpolkit.html)
8. Check that your $HOME is accessible to the qemu user²

#### &sup1; Depending on your distribution, libvirt access may be denied by default or may require a password at each access.

You can test it with the following command:

```shell
virsh -c qemu:///system pool-list
```

If you have access error messages, please read https://libvirt.org/acl.html and https://libvirt.org/aclpolkit.html .

In short, if your libvirt has been compiled with Polkit support (ex: Arch, Fedora 21), you can create `/etc/polkit-1/rules.d/50-org.libvirt.unix.manage.rules` as follows to grant full access to libvirt to `$USER`

```shell
sudo /bin/sh -c "cat - > /etc/polkit-1/rules.d/50-org.libvirt.unix.manage.rules" << EOF
```

```conf
polkit.addRule(function(action, subject) {
        if (action.id == "org.libvirt.unix.manage" &&
            subject.user == "$USER") {
                return polkit.Result.YES;
                polkit.log("action=" + action);
                polkit.log("subject=" + subject);
        }
});
EOF
```

If your libvirt has not been compiled with Polkit (ex: Ubuntu 14.04.1 LTS), check the permissions on the libvirt unix socket:

```shell
$ ls -l /var/run/libvirt/libvirt-sock
srwxrwx--- 1 root libvirtd 0 févr. 12 16:03 /var/run/libvirt/libvirt-sock

$ usermod -a -G libvirtd $USER
# $USER needs to logout/login to have the new group be taken into account
```

(Replace `$USER` with your login name)

#### &sup2; Qemu will run with a specific user. It must have access to the VMs drives

All the disk drive resources needed by the VM (CoreOS disk image, Kubernetes binaries, cloud-init files, etc.) are put inside `./cluster/libvirt-coreos/libvirt_storage_pool`.

As we're using the `qemu:///system` instance of libvirt, qemu will run with a specific `user:group` distinct from your user. It is configured in `/etc/libvirt/qemu.conf`. That qemu user must have access to that libvirt storage pool.

If your `$HOME` is world readable, everything is fine. If your $HOME is private, `cluster/kube-up.sh` will fail with an error message like:

```shell
error: Cannot access storage file '$HOME/.../kubernetes/cluster/libvirt-coreos/libvirt_storage_pool/kubernetes_master.img' (as uid:99, gid:78): Permission denied
```

In order to fix that issue, you have several possibilities:

* set `POOL_PATH` inside `cluster/libvirt-coreos/config-default.sh` to a directory:
  * backed by a filesystem with a lot of free disk space
  * writable by your user;
  * accessible by the qemu user.
* Grant the qemu user access to the storage pool.

On Arch:

```shell
setfacl -m g:kvm:--x ~
```

### Setup

By default, the libvirt-coreos setup will create a single Kubernetes master and 3 Kubernetes nodes. Because the VM drives use Copy-on-Write and because of memory ballooning and KSM, there is a lot of resource over-allocation.

There is both an automated way and a manual, customizable way of setting up libvirt Kubernetes clusters on CoreOS.

#### Automated setup

There is an automated setup script on https://get.k8s.io that will download the tarball for Kubernetes and spawn a Kubernetes cluster on a local CoreOS instances that the script creates. To run this script, use wget or curl with the KUBERNETES_PROVIDER environment variable set to libvirt-coreos:

```shell
export KUBERNETES_PROVIDER=libvirt-coreos; wget -q -O - https://get.k8s.io | bash
```

Here is the curl version of this command:

```shell
export KUBERNETES_PROVIDER=libvirt-coreos; curl -sS https://get.k8s.io | bash
```

This script downloads and unpacks the tarball, then spawns a Kubernetes cluster on CoreOS instances with the following characteristics:

- Total of 4 KVM/QEMU instances
- 1 instance acting as a Kubernetes master node
- 3 instances acting as minion nodes

If you'd like to run this cluster with customized settings, follow the manual setup instructions.

#### Manual setup

To start your local cluster, open a shell and run:

```shell
cd kubernetes

export KUBERNETES_PROVIDER=libvirt-coreos
cluster/kube-up.sh
```

The `KUBERNETES_PROVIDER` environment variable tells all of the various cluster management scripts which variant to use.  If you forget to set this, the assumption is you are running on Google Compute Engine.

The `NUM_NODES` environment variable may be set to specify the number of nodes to start. If it is not set, the number of nodes defaults to 3.

The `KUBE_PUSH` environment variable may be set to specify which Kubernetes binaries must be deployed on the cluster. Its possible values are:

* `release` (default if `KUBE_PUSH` is not set) will deploy the binaries of `_output/release-tars/kubernetes-server-….tar.gz`. This is built with `make release` or `make release-skip-tests`.
* `local` will deploy the binaries of `_output/local/go/bin`. These are built with `make`.

### Management

You can check that your machines are there and running with:

```shell
$ virsh -c qemu:///system list
 Id    Name                           State
----------------------------------------------------
 15    kubernetes_master              running
 16    kubernetes_node-01             running
 17    kubernetes_node-02             running
 18    kubernetes_node-03             running
 ```

You can check that the Kubernetes cluster is working with:

```shell
$ kubectl get nodes
NAME                LABELS              STATUS
192.168.10.2        <none>              Ready
192.168.10.3        <none>              Ready
192.168.10.4        <none>              Ready
```

The VMs are running [CoreOS](https://coreos.com/).
Your ssh keys have already been pushed to the VM. (It looks for ~/.ssh/id_*.pub)
The user to use to connect to the VM is `core`.
The IP to connect to the master is 192.168.10.1.
The IPs to connect to the nodes are 192.168.10.2 and onwards.

Connect to `kubernetes_master`:

```shell
ssh core@192.168.10.1
```

Connect to `kubernetes_node-01`:

```shell
ssh core@192.168.10.2
```

### Interacting with your Kubernetes cluster with the `kube-*` scripts.

All of the following commands assume you have set `KUBERNETES_PROVIDER` appropriately:

```shell
export KUBERNETES_PROVIDER=libvirt-coreos
```

Bring up a libvirt-CoreOS cluster of 5 nodes

```shell
NUM_NODES=5 cluster/kube-up.sh
```

Destroy the libvirt-CoreOS cluster

```shell
cluster/kube-down.sh
```

Update the libvirt-CoreOS cluster with a new Kubernetes release produced by `make release` or `make release-skip-tests`:

```shell
cluster/kube-push.sh
```

Update the libvirt-CoreOS cluster with the locally built Kubernetes binaries produced by `make`:

```shell
KUBE_PUSH=local cluster/kube-push.sh
```

Interact with the cluster

```shell
kubectl ...
```

### Troubleshooting

#### !!! Cannot find kubernetes-server-linux-amd64.tar.gz

Build the release tarballs:

```shell
make release
```

#### Can't find virsh in PATH, please fix and retry.

Install libvirt

On Arch:

```shell
pacman -S qemu libvirt
```

On Ubuntu 14.04:

```shell
aptitude install qemu-system-x86 libvirt-bin
```

On Fedora 21:

```shell
yum install qemu libvirt
```

#### error: Failed to connect socket to '/var/run/libvirt/libvirt-sock': No such file or directory

Start the libvirt daemon

On Arch:

```shell
systemctl start libvirtd virtlogd.socket
```

The `virtlogd.socket` is not started with the libvirtd daemon. If you enable the `libvirtd.service` it is linked and started automatically on the next boot.

On Ubuntu 14.04:

```shell
service libvirt-bin start
```

#### error: Failed to connect socket to '/var/run/libvirt/libvirt-sock': Permission denied

Fix libvirt access permission (Remember to adapt `$USER`)

On Arch and Fedora 21:

```shell
cat > /etc/polkit-1/rules.d/50-org.libvirt.unix.manage.rules <<EOF
```

```conf
polkit.addRule(function(action, subject) {
        if (action.id == "org.libvirt.unix.manage" &&
            subject.user == "$USER") {
                return polkit.Result.YES;
                polkit.log("action=" + action);
                polkit.log("subject=" + subject);
        }
});
EOF
```

On Ubuntu:

```shell
usermod -a -G libvirtd $USER
```

#### error: Out of memory initializing network (virsh net-create...)

Ensure libvirtd has been restarted since ebtables was installed.

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
libvirt/KVM          | CoreOS       | CoreOS | libvirt/KVM | [docs](/docs/getting-started-guides/libvirt-coreos)                         |          | Community ([@lhuard1A](https://github.com/lhuard1A))


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

