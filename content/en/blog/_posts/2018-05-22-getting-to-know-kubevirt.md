---
title: 'Getting to Know Kubevirt'
date: 2018-05-22
author: >
  [Jason Brooks](mailto:jbrooks@redhat.com) (Red Hat),
  [Kaitlyn Barnard](https://github.com/kbarnard10)
---

Once you've become accustomed to running Linux container workloads on Kubernetes, you may find yourself wishing that you could run other sorts of workloads on your Kubernetes cluster. Maybe you need to run an application that isn't architected for containers, or that requires a different version of the Linux kernel -- or an all together different operating system -- than what's available on your container host.

These sorts of workloads are often well-suited to running in virtual machines (VMs), and [KubeVirt](http://www.kubevirt.io/), a virtual machine management add-on for Kubernetes, is aimed at allowing users to run VMs right alongside containers in the their Kubernetes or OpenShift clusters.

KubeVirt extends Kubernetes by adding resource types for VMs and sets of VMs through Kubernetes' [Custom Resource Definitions API](/docs/concepts/api-extension/custom-resources/#customresourcedefinitions) (CRD). KubeVirt VMs run within regular Kubernetes pods, where they have access to standard pod networking and storage, and can be managed using standard Kubernetes tools such as kubectl.

Running VMs with Kubernetes involves a bit of an adjustment compared to using something like oVirt or OpenStack, and understanding the basic architecture of KubeVirt is a good place to begin.

In this post, we’ll talk about some of the components that are involved in KubeVirt at a high level. The components we’ll check out are CRDs, the KubeVirt virt-controller, virt-handler and virt-launcher components, libvirt, storage, and networking.

## KubeVirt Components

<img src="/images/blog/2018-05-22-getting-to-know-kubevirt/kubevirt-components.png" width="70%" alt="Kubevirt Components" />

## Custom Resource Definitions

Kubernetes resources are endpoints in the Kubernetes API that store collections of related API objects. For instance, the built-in pods resource contains a collection of Pod objects. The Kubernetes [Custom Resource Definition](/docs/concepts/api-extension/custom-resources/#customresourcedefinitions) API allows users to extend Kubernetes with additional resources by defining new objects with a given name and schema. Once you've applied a custom resource to your cluster, the Kubernetes API server serves and handles the storage of your custom resource.

KubeVirt's primary CRD is the VirtualMachine (VM) resource, which contains a collection of VM objects inside the Kubernetes API server. The VM resource defines all the properties of the Virtual machine itself, such as the machine and CPU type, the amount of RAM and vCPUs, and the number and type of NICs available in the VM.

## virt-controller

The virt-controller is a Kubernetes [Operator](https://coreos.com/operators/) that’s responsible for cluster-wide virtualization functionality. When new VM objects are posted to the Kubernetes API server, the virt-controller takes notice and creates the pod in which the VM will run. When the pod is scheduled on a particular node, the virt-controller updates the VM object with the node name, and hands off further responsibilities to a node-specific KubeVirt component, the virt-handler, an instance of which runs on every node in the cluster.

## virt-handler

Like the virt-controller, the virt-handler is also reactive, watching for changes to the VM object, and performing all necessary operations to change a VM to meet the required state. The virt-handler references the VM specification and signals the creation of a corresponding domain using a libvirtd instance in the VM's pod. When a VM object is deleted, the virt-handler observes the deletion and turns off the domain.

## virt-launcher

For every VM object one pod is created. This pod's primary container runs the virt-launcher KubeVirt component. The main purpose of the virt-launcher Pod is to provide the cgroups and namespaces which will be used to host the VM process.

virt-handler signals virt-launcher to start a VM by passing the VM's CRD object to virt-launcher. virt-launcher then uses a local libvirtd instance within its container to start the VM. From there virt-launcher monitors the VM process and terminates once the VM has exited.

If the Kubernetes runtime attempts to shutdown the virt-launcher pod before the VM has exited, virt-launcher forwards signals from Kubernetes to the VM process and attempts to hold off the termination of the pod until the VM has shutdown successfully.

```
# kubectl get pods

NAME                                   READY     STATUS        RESTARTS   AGE
virt-controller-7888c64d66-dzc9p   1/1       Running   0          2h
virt-controller-7888c64d66-wm66x   0/1       Running   0          2h
virt-handler-l2xkt                 1/1       Running   0          2h
virt-handler-sztsw                 1/1       Running   0          2h
virt-launcher-testvm-ephemeral-dph94   2/2       Running       0          2h
```

## libvirtd

An instance of libvirtd is present in every VM pod. virt-launcher uses libvirtd to manage the life-cycle of the VM process.

## Storage and Networking

KubeVirt VMs may be configured with disks, backed by volumes.

[Persistent Volume Claim](https://github.com/kubevirt/kubevirt/blob/master/docs/direct-pv-disks.md) volumes make Kubernetes persistent volume available as disks directly attached to the VM. This is the primary way to provide KubeVirt VMs with persistent storage. Currently, persistent volumes must be iscsi block devices, although work is underway to enable [file-based pv disks](https://kubevirt.gitbooks.io/user-guide/disks-and-volumes.html#persistentvolumeclaim).

[Ephemeral Volumes](https://kubevirt.gitbooks.io/user-guide/disks-and-volumes.html#ephemeral-volume) are a local copy on write images that use a network volume as a read-only backing store. KubeVirt dynamically generates the ephemeral images associated with a VM when the VM starts, and discards the ephemeral images when the VM stops. Currently, ephemeral volumes must be backed by pvc volumes.

[Registry Disk](https://kubevirt.gitbooks.io/user-guide/disks-and-volumes.html#registrydisk) volumes reference docker image that embed a qcow or raw disk. As the name suggests, these volumes are pulled from a container registry. Like regular ephemeral container images, data in these volumes persists only while the pod lives.

[CloudInit NoCloud](https://kubevirt.gitbooks.io/user-guide/disks-and-volumes.html#cloudinitnocloud) volumes provide VMs with a cloud-init NoCloud user-data source, which is added as a disk to the VM, where it's available to provide configuration details to guests with cloud-init installed. Cloud-init details can be provided in clear text, as base64 encoded UserData files, or via Kubernetes secrets.

In the example below, a Registry Disk is configured to provide the image from which to boot the VM. A cloudInit NoCloud volume, paired with an ssh-key stored as clear text in the userData field, is provided for authentication with the VM:

```
apiVersion: kubevirt.io/v1alpha1
kind: VirtualMachine
metadata:
  name: myvm
spec:
  terminationGracePeriodSeconds: 5
  domain:
    resources:
      requests:
        memory: 64M
    devices:
      disks:
      - name: registrydisk
        volumeName: registryvolume
        disk:
          bus: virtio
      - name: cloudinitdisk
        volumeName: cloudinitvolume
        disk:
          bus: virtio
  volumes:
    - name: registryvolume
      registryDisk:
        image: kubevirt/cirros-registry-disk-demo:devel
    - name: cloudinitvolume
      cloudInitNoCloud:
        userData: |
          ssh-authorized-keys:
            - ssh-rsa AAAAB3NzaK8L93bWxnyp test@test.com
```

Just as with regular Kubernetes pods, basic networking functionality is made available automatically to each KubeVirt VM, and particular TCP or UDP ports can be exposed to the outside world using regular Kubernetes services.  No special network configuration is required.

## Getting Involved

KubeVirt development is accelerating, and the project is eager for new contributors. If you're interested in getting involved, check out the project's [open issues](https://github.com/kubevirt/kubevirt/issues) and check out the [project calendar](https://calendar.google.com/embed?src=18pc0jur01k8f2cccvn5j04j1g@group.calendar.google.com).

If you need some help or want to chat you can connect to the team via freenode IRC in #kubevirt, or on the KubeVirt [mailing list](https://groups.google.com/forum/#!forum/kubevirt-dev). User documentation is available at https://kubevirt.gitbooks.io/user-guide/.
