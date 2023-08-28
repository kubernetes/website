---
layout: blog
title: 'Hardware Accelerated SSL/TLS Termination in Ingress Controllers using Kubernetes Device Plugins and RuntimeClass'
date: 2019-04-24
---

**Authors:** Mikko Ylinen (Intel)

## Abstract

A Kubernetes Ingress is a way to connect cluster services to the world outside the cluster. In order
to correctly route the traffic to service backends, the cluster needs an Ingress controller. The
Ingress controller is responsible for setting the right destinations to backends based on the
Ingress API objects’ information. The actual traffic is routed through a proxy server that
is responsible for tasks such as load balancing and SSL/TLS (later “SSL” refers to both SSL
or TLS ) termination. The SSL termination is a CPU heavy operation due to the crypto operations
involved. To offload some of the CPU intensive work away from the CPU, OpenSSL based proxy
servers can take the benefit of OpenSSL Engine API and dedicated crypto hardware. This frees
CPU cycles for other things and improves the overall throughput of the proxy server.

In this blog post, we will show how easy it is to make hardware accelerated crypto available
for containers running the Ingress controller proxy using some of the recently created Kubernetes
building blocks: Device plugin framework and RuntimeClass. At the end, a reference setup is given
using an HAproxy based Ingress controller accelerated using Intel&reg; QuickAssist Technology cards.

## About Proxies, OpenSSL Engine and Crypto Hardware

The proxy server plays a vital role in a Kubernetes Ingress Controller function. It proxies
the traffic to the backends per Ingress objects routes. Under heavy traffic load, the performance
becomes critical especially if the proxying involves CPU intensive operations like SSL crypto.

The OpenSSL project provides the widely adopted library for implementing the SSL protocol. Of
the commonly known proxy servers used by Kubernetes Ingress controllers, Nginx and HAproxy use
OpenSSL. The CNCF graduated Envoy proxy uses BoringSSL but there seems to be [community interest
in having OpenSSL as the alternative](https://github.com/envoyproxy/envoy/pull/5161#issuecomment-446374130) for it too.

The OpenSSL SSL protocol library relies on libcrypto that implements the cryptographic functions.
For quite some time now (first introduced in 0.9.6 release), OpenSSL has provided an [ENGINE
concept](https://github.com/openssl/openssl/blob/master/README.ENGINE) that allows these cryptographic operations to be offloaded to a dedicated crypto
acceleration hardware. Later, a special *dynamic* ENGINE enabled the crypto hardware specific
pieces to be implemented in an independent loadable module that can be developed outside the
OpenSSL code base and distributed separately. From the application’s perspective, this is also
ideal because they don’t need to know the details of how to use the hardware, and the hardware
specific module can be loaded/used when the hardware is available.

Hardware based crypto can greatly improve Cloud applications’ performance due to hardware
accelerated processing in SSL operations as discussed, and can provide other crypto
services like key/random number generation. Clouds can make the hardware easily available
using the dynamic ENGINE and several loadable module implementations exist, for
example, [CloudHSM](https://docs.aws.amazon.com/cloudhsm/latest/userguide/openssl-library.html), [IBMCA](https://github.com/opencryptoki/openssl-ibmca), or [QAT Engine](https://github.com/intel/QAT_Engine/).

For Cloud deployments, the ideal scenario is for these modules to be shipped as part of
the container workload. The workload would get scheduled on a node that provides the
underlying hardware that the module needs to access. On the other hand, the workloads
should run the same way and without code modifications regardless of the crypto acceleration
hardware being available or not. The OpenSSL dynamic engine enables this. Figure 1 below
illustrates these two scenarios using a typical Ingress Controller container as an example.
The red colored boxes indicate the differences between a container with a crypto hardware
engine enabled container vs. a “standard” one. It’s worth pointing out that the configuration
changes shown do not necessarily require another version of the container since the configurations
could be managed, e.g., using ConfigMaps.

{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig1.png" caption="Figure 1. Examples of Ingress controller containers">}}

## Hardware Resources and Isolation

To be able to deploy workloads with hardware dependencies, Kubernetes provides excellent extension
and configurability mechanisms. Let’s take a closer look into Kubernetes the [device plugin framework](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
(beta in 1.14) and [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/) (beta in 1.14) and learn how they can be leveraged to expose crypto
hardware to workloads.

The device plugin framework, first introduced in Kubernetes 1.8, provides a way for hardware vendors
to register and allocate node hardware resources to Kubelets. The plugins implement the hardware
specific initialization logic and resource management. The pods can request hardware resources in
their PodSpec, which also guarantees the pod is scheduled on a node that can provide those resources.

The device resource allocation for containers is non-trivial. For applications dealing with security,
the hardware level isolation is critical. The PCIe based crypto acceleration device functions can
benefit from IO hardware virtualization, through an I/O Memory Management Unit (IOMMU), to provide
the isolation: an *IOMMU group* the device belongs to provides the isolated resource for a workload
(assuming the crypto cards do not share the IOMMU group with other devices). The number of isolated
resources can be further increased if the PCIe device supports the Single-Root I/O Virtualization
(SR-IOV) specification. SR-IOV allows the PCIe device to be split further to *virtual functions* (VF),
derived from *physical function* (PF) devices, and each belonging to their own IOMMU group. To expose
these IOMMU isolated device functions to user space and containers, the host kernel should bind
them to a specific device driver. In Linux, this  driver is vfio-pci and it makes each device
available through a character device in user space. The kernel vfio-pci driver provides user space
applications with a direct, IOMMU backed access to PCIe devices and functions, using a mechanism
called *PCI passthrough*. The interface can be leveraged by user space frameworks, such as the
Data Plane Development Kit (DPDK). Additionally, virtual machine (VM) hypervisors can provide
these user space device nodes to VMs and expose them as PCI devices to the guest kernel.
Assuming support from the guest kernel, the VM gets close to native performant direct access to the
underlying host devices.

To advertise these device resources to Kubernetes, we can have a simple Kubernetes device plugin
that runs the initialization (i.e., binding), calls kubelet’s `Registration` gRPC service, and
implements the DevicePlugin gRPC service that kubelet calls to, e.g., to `Allocate` the resources
upon Pod creation.

## Device Assignment and Pod Deployment

At this point, you may ask what the container could do with a VFIO device node? The answer comes
after we first take a quick look into the Kubernetes RuntimeClass.

The Kubernetes RuntimeClass was created to provide better control and configurability
over a variety of *runtimes* (an earlier [blog post](https://kubernetes.io/blog/2018/10/10/kubernetes-v1.12-introducing-runtimeclass/) goes into the details of the needs,
status and roadmap for it) that are available in the cluster. In essence, the RuntimeClass
provides cluster users better tools to pick and use the runtime that best suits for the pod use case.

The OCI compatible [Kata Containers runtime](https://katacontainers.io/) provides workloads with a hardware virtualized
isolation layer. In addition to workload isolation, the Kata Containers VM has the added
side benefit that the VFIO devices, as `Allocate`’d by the device plugin, can be passed
through to the container as hardware isolated devices. The only requirement is that the
Kata Containers kernel has driver for the exposed device enabled.

That’s all it really takes to enable hardware accelerated crypto for container workloads. To summarize:

  1. Cluster needs a device plugin running on the node that provides the hardware
  2. Device plugin exposes the hardware to user space using  the VFIO driver
  3. Pod requests the device resources and Kata Containers as the RuntimeClass in the PodSpec
  4. The container has the hardware adaptation library and the OpenSSL engine module

Figure 2 shows the overall setup using the Container A illustrated earlier.

{{<figure width="600"  src="/images/blog/2019-04-23-hardware-accelerated-tls-termination/k8s-blog-fig2.png" caption="Figure 2. Deployment overview">}}

## Reference Setup

Finally, we describe the necessary building blocks and steps to build a functional
setup described in Figure 2 that enables hardware accelerated SSL termination in
an Ingress Controller using an Intel&reg; QuickAssist Technology (QAT) PCIe device.
It should be noted that the use cases are not limited to Ingress controllers, but
any OpenSSL based workload can be accelerated.

### Cluster configuration:
  * Kubernetes 1.14 (`RuntimeClass` and `DevicePlugin` feature gates enabled (both are `true` in 1.14)
  * RuntimeClass ready runtime and Kata Containers configured

### Host configuration:
  * Intel&reg; QAT driver release with the kernel drivers installed for both host kernel and Kata Containers kernel (or on a rootfs as loadable modules)
  * [QAT device plugin](https://github.com/intel/intel-device-plugins-for-kubernetes/tree/master/cmd/qat_plugin) DaemonSet deployed

### Ingress controller configuration and deployment:
  * [HAproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) ingress controller in a modified container that has
     * the QAT HW HAL user space library (part of Intel&reg; QAT SW release) and
     * the [OpenSSL QAT Engine](https://github.com/intel/QAT_Engine/) built in
  * Haproxy-ingress ConfigMap to enable QAT engine usage
     * `ssl-engine=”qat”`
     * `ssl-mode-async=true`
  * Haproxy-ingress deployment `.yaml` to
     * Request `qat.intel.com: n` resources
     * Request `runtimeClassName: kata-containers` (name value depends on cluster config)
  * (QAT device config file for each requested device resource with OpenSSL engine configured available in the container)

Once the building blocks are available, the hardware accelerated SSL/TLS can be tested by following the [TLS termination
example](https://github.com/jcmoraisjr/haproxy-ingress/tree/master/examples/tls-termination) steps. In order to verify the hardware is used, you can check `/sys/kernel/debug/*/fw_counters` files on host as they
get updated by the Intel&reg; QAT firmware.

Haproxy-ingress and HAproxy are used because HAproxy can be directly configured to use the OpenSSL engine using
`ssl-engine <name> [algo ALGOs]` configuration flag without modifications to the global openssl configuration file.
Moreover, HAproxy can offload configured algorithms using asynchronous calls (with `ssl-mode-async`) to further improve performance.

## Call to Action

In this blog post we have shown how Kubernetes Device Plugins and RuntimeClass can be used to provide isolated hardware
access for applications in pods to offload crypto operations to hardware accelerators. Hardware accelerators can be used
to speed up crypto operations and also save CPU cycles to other tasks. We demonstrated the setup using HAproxy that already
supports asynchronous crypto offload with OpenSSL.

The next steps for our team is to repeat the same for Envoy (with an OpenSSL based TLS transport socket built
as an extension). Furthermore, we are working to enhance Envoy to be able to [offload BoringSSL asynchronous
private key operations](https://github.com/envoyproxy/envoy/issues/6248) to a crypto acceleration hardware. Any review feedback or help is appreciated!

How many CPU cycles can your crypto application save for other tasks when offloading crypto processing to a dedicated accelerator?
