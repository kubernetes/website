---
title: Using eBPF in Kubernetes
date: 2017-12-07
slug: using-ebpf-in-kubernetes
url: /blog/2017/12/Using-Ebpf-In-Kubernetes
---

## Introduction
Kubernetes provides a high-level API and a set of components that hides almost all of the intricate and—to some of us—interesting details of what happens at the systems level. Application developers are not required to have knowledge of the machines' IP tables, cgroups, namespaces, seccomp, or, nowadays, even the [container runtime](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes) that their application runs on top of. But underneath, Kubernetes and the technologies upon which it relies (for example, the container runtime) heavily leverage core Linux functionalities.  

This article focuses on a core Linux functionality increasingly used in networking, security and auditing, and tracing and monitoring tools. This functionality is called [extended Berkeley Packet Filter](http://man7.org/linux/man-pages/man2/bpf.2.html) (eBPF)  

**Note:** _In this article we use both acronyms: eBPF and BPF. The former is used for the extended BPF functionality, and the latter for "classic" BPF functionality._


## What is BPF?
BPF is a mini-VM residing in the Linux kernel that runs BPF programs. Before running, BPF programs are loaded with the [bpf()](http://man7.org/linux/man-pages/man2/bpf.2.html) syscall and are validated for safety: checking for loops, code size, etc. BPF programs are attached to kernel objects and executed when events happen on those objects—for example, when a network interface emits a packet.  

## BPF Superpowers
BPF programs are event-driven by definition, an incredibly powerful concept, and executes code in the kernel when an event occurs. [Netflix's Brendan Gregg](http://www.brendangregg.com/bio.html) refers to BPF as a [Linux superpower](http://www.brendangregg.com/blog/2016-03-05/linux-bpf-superpowers.html).  



## The 'e' in eBPF
Traditionally, BPF could only be attached to sockets for socket filtering. BPF’s first use case was in `tcpdump`. When you run `tcpdump` the filter is compiled into a BPF program and attached to a raw `AF_PACKET` socket in order to print out filtered packets.  

But over the years, eBPF added the ability to attach to [other kernel objects](https://github.com/torvalds/linux/blob/v4.14/include/uapi/linux/bpf.h#L117-L133). In addition to socket filtering, some supported attach points are:  

- Kprobes (and userspace equivalents uprobes)
- Tracepoints
- Network schedulers or qdiscs for classification or action (tc)
- XDP (eXpress Data Path)
This and other, newer features like in-kernel helper functions and shared data-structures (maps) that can be used to communicate with user space, extend BPF’s capabilities.
## Existing Use Cases of eBPF with Kubernetes
Several open-source Kubernetes tools already use eBPF and many use cases warrant a closer look, especially in areas such as networking, monitoring and security tools.

## Dynamic Network Control and Visibility with Cilium
[Cilium](https://github.com/cilium/cilium) is a networking project that makes heavy use of eBPF superpowers to route and filter network traffic for container-based systems. By using eBPF, Cilium can dynamically generate and apply rules—even at the device level with XDP—without making changes to the Linux kernel itself.  

The Cilium Agent runs on each host. Instead of managing IP tables, it translates network policy definitions to BPF programs that are loaded into the kernel and attached to a container's virtual ethernet device. These programs are executed—rules applied—on each packet that is sent or received.  

This diagram shows how the Cilium project works:  

 ![](https://lh4.googleusercontent.com/Xe8qee5yYsJton2NHFLOhHevxdbpCHHPPgttOLP18ZWtoUJp9ChFKtKJiTxqNFn8zQPRJu4BdtG7xc24vlGkD2gtfbkCuHq_eU3Tx6z2m6ld4iYGEZv-MsSCcJ3jAcJO2HkMc_d_)  

Depending on what network rules are applied, BPF programs may be attached with [tc](http://man7.org/linux/man-pages/man8/tc.8.html) or [XDP](https://www.iovisor.org/technology/xdp). By using XDP, Cilium can attach the BPF programs at the lowest possible point, which is also the most performant point in the networking software stack.  

If you'd like to learn more about how Cilium uses eBPF, take a look at the project's [BPF and XDP reference guide](http://cilium.readthedocs.io/en/latest/bpf/).  

## Tracking TCP Connections in Weave Scope
[Weave Scope](https://github.com/weaveworks/scope) is a tool for monitoring, visualizing and interacting with container-based systems. For our purposes, we'll focus on how Weave Scope gets the TCP connections.  

 ![](https://lh6.googleusercontent.com/47C76UqCrrDr5O8wand6jESyFzx1SP4SQ_jVWiAhN5ctAEefz9e0orgmu0Q_2681QhcxJDfMQbn3HcRZYZN_QiPjKfXMo5Kt6XuXPjRGAoc_j2x7yC_9Un5JIoVt1Aa-DCHl-DUu)  

Weave Scope employs an agent that runs on each node of a cluster. The agent monitors the system, generates a report and sends it to the app server. The app server compiles the reports it receives and presents the results in the Weave Scope UI.  

To accurately draw connections between containers, the agent attaches a BPF program to kprobes that track socket events: opening and closing connections. The BPF program, [tcptracer-bpf](https://github.com/weaveworks/tcptracer-bpf), is compiled into an ELF object file and loaded using [gobpf](https://github.com/iovisor/gobpf).  

(As a side note, Weave Scope also has a plugin that make use of eBPF: [HTTP statistics](https://github.com/weaveworks-plugins/scope-http-statistics).)  

To learn more about how this works and why it's done this way, read [this extensive post](https://www.weave.works/blog/improving-performance-reliability-weave-scope-ebpf/) that the [Kinvolk](https://kinvolk.io/) team wrote for the [Weaveworks Blog](https://www.weave.works/blog/). You can also watch [a recent talk](https://www.youtube.com/watch?v=uTTFUpT0Sfw&list=PLWYdJViL9Eio5o5j4Uth_-Mt0FPrYXNwx) about the topic.  

## Limiting syscalls with seccomp-bpf
Linux has more than 300 system calls (read, write, open, close, etc.) available for use—or misuse. Most applications only need a small subset of syscalls to function properly. [seccomp](https://en.wikipedia.org/wiki/Seccomp) is a Linux security facility used to limit the set of syscalls that an application can use, thereby limiting potential misuse.  

The original implementation of seccomp was highly restrictive. Once applied, if an application attempted to do anything beyond reading and writing to files it had already opened, seccomp sent a `SIGKILL` signal.  

[seccomp-bpf](https://blog.yadutaf.fr/2014/05/29/introduction-to-seccomp-bpf-linux-syscall-filter/) enables more complex filters and a wider range of actions. Seccomp-bpf, also known as seccomp mode 2, allows for applying custom filters in the form of BPF programs. When the BPF program is loaded, the filter is applied to each syscall and the appropriate action is taken (Allow, Kill, Trap, etc.).  

seccomp-bpf is widely used in Kubernetes tools and exposed in Kubernetes itself. For example, seccomp-bpf is used in Docker to apply custom [seccomp security profiles](https://docs.docker.com/engine/security/seccomp/), in rkt to apply [seccomp isolators](https://github.com/rkt/rkt/blob/5fadf0f1f444cdfde40d57e1d199b6dd6371594c/Documentation/seccomp-guide.md), and in Kubernetes itself in its [Security Context](/docs/tasks/configure-pod-container/security-context/).  

But in all of these cases the use of BPF is hidden behind [libseccomp](https://github.com/seccomp/libseccomp). Behind the scenes, libseccomp generates BPF code from rules provided to it. Once generated, the BPF program is loaded and the rules applied.

## Potential Use Cases for eBPF with Kubernetes
eBPF is a relatively new Linux technology. As such, there are many uses that remain unexplored. eBPF itself is also evolving: new features are being added in eBPF that will enable new use cases that aren’t currently possible. In the following sections, we're going to look at some of these that have only recently become possible and ones on the horizon. Our hope is that these features will be leveraged by open source tooling.  

## Pod and container level network statistics
BPF socket filtering is nothing new, but BPF socket filtering per cgroup is. Introduced in Linux 4.10, [cgroup-bpf](https://lwn.net/Articles/698073/) allows attaching eBPF programs to cgroups. Once attached, the program is executed for all packets entering or exiting any process in the cgroup.  

A [cgroup](http://man7.org/linux/man-pages/man7/cgroups.7.html) is, amongst other things, a hierarchical grouping of processes. In Kubernetes, this grouping is found at the container level. One idea for making use of cgroup-bpf, is to install BPF programs that collect detailed per-pod and/or per-container network statistics.  

Generally, such statistics are collected by periodically checking the relevant file in Linux's `/sys` directory or using Netlink. By using BPF programs attached to cgroups for this, we can get much more detailed statistics: for example, how many packets/bytes on tcp port 443, or how many packets/bytes from IP 10.2.3.4. In general, because BPF programs have a kernel context, they can safely and efficiently deliver more detailed information to user space.  

To explore the idea, the Kinvolk team implemented a proof-of-concept: [https://github.com/kinvolk/cgnet](https://github.com/kinvolk/cgnet). This project attaches a BPF program to each cgroup and exports the information to [Prometheus](https://prometheus.io/).  

There are of course other interesting possibilities, like doing actual packet filtering. But the obstacle currently standing in the way of this is having cgroup v2 support—required by cgroup-bpf—in [Docker](https://github.com/opencontainers/runc/issues/654) and Kubernetes.

## Application-applied LSM

[Linux Security Modules](https://en.wikipedia.org/wiki/Linux_Security_Modules) (LSM) implements a generic framework for security policies in the Linux kernel. [SELinux](https://wiki.centos.org/HowTos/SELinux) and [AppArmor](https://wiki.ubuntu.com/AppArmor) are examples of these. Both of these implement rules at a system-global scope, placing the onus on the administrator to configure the security policies.  

[Landlock](https://landlock.io/) is another LSM under development that would co-exist with SELinux and AppArmor. An initial patchset has been submitted to the Linux kernel and is in an early stage of development. The main difference with other LSMs is that Landlock is designed to allow unprivileged applications to build their own sandbox, effectively restricting themselves instead of using a global configuration. With Landlock, an application can load a BPF program and have it executed when the process performs a specific action. For example, when the application opens a file with the open() system call, the kernel will execute the BPF program, and, depending on what the BPF program returns, the action will be accepted or denied.  

In some ways, it is similar to seccomp-bpf: using a BPF program, seccomp-bpf allows unprivileged processes to restrict what system calls they can perform. Landlock will be more powerful and provide more flexibility. Consider the following system call:  



```
C  
fd = open(“myfile.txt”, O\_RDWR);

```



The first argument is a “char \*”, a pointer to a memory address, such as `0xab004718`.   

With seccomp, a BPF program only has access to the parameters of the syscall but cannot dereference the pointers, making it impossible to make security decisions based on a file. seccomp also uses classic BPF, meaning it cannot make use of eBPF maps, the mechanism for interfacing with user space. This restriction means security policies cannot be changed in seccomp-bpf based on a configuration in an eBPF map.  

BPF programs with Landlock don’t receive the arguments of the syscalls but a reference to a kernel object. In the example above, this means it will have a reference to the file, so it does not need to dereference a pointer, consider relative paths, or perform chroots.  

## Use Case: Landlock in Kubernetes-based serverless frameworks
In Kubernetes, the unit of deployment is a pod. Pods and containers are the main unit of isolation. In serverless frameworks, however, the main unit of deployment is a function. Ideally, the unit of deployment equals the unit of isolation. This puts serverless frameworks like [Kubeless](https://github.com/kubeless/kubeless) or [OpenFaaS](https://github.com/openfaas/faas) into a predicament: optimize for unit of isolation or deployment?  

To achieve the best possible isolation, each function call would have to happen in its own container—ut what's good for isolation is not always good for performance. Inversely, if we run function calls within the same container, we increase the likelihood of collisions.  

By using Landlock, we could isolate function calls from each other within the same container, making a temporary file created by one function call inaccessible to the next function call, for example. Integration between Landlock and technologies like Kubernetes-based serverless frameworks would be a ripe area for further exploration.  

## Auditing kubectl-exec with eBPF
In Kubernetes 1.7 the [audit proposal](/docs/tasks/debug/debug-cluster/audit/) started making its way in. It's currently pre-stable with plans to be stable in the 1.10 release. As the name implies, it allows administrators to log and audit events that take place in a Kubernetes cluster.   

While these events log Kubernetes events, they don't currently provide the level of visibility that some may require. For example, while we can see that someone has used `kubectl exec` to enter a container, we are not able to see what commands were executed in that session. With eBPF one can attach a BPF program that would record any commands executed in the `kubectl exec` session and pass those commands to a user-space program that logs those events. We could then play that session back and know the exact sequence of events that took place.
## Learn more about eBPF
If you're interested in learning more about eBPF, here are some resources:
- A comprehensive [reading list about eBPF](https://qmonnet.github.io/whirl-offload/2016/09/01/dive-into-bpf/) for doing just that
- [BCC](https://github.com/iovisor/bcc) (BPF Compiler Collection) provides tools for working with eBPF as well as many example tools making use of BCC.
- Some videos

  - [BPF: Tracing and More](https://www.youtube.com/watch?v=JRFNIKUROPE) by Brendan Gregg
  - [Cilium - Container Security and Networking Using BPF and XDP](https://www.youtube.com/watch?v=CcGtDMm1SJA) by Thomas Graf
  - [Using BPF in Kubernetes](https://www.youtube.com/watch?v=T3Wcuj8fy5o) by Alban Crequy

## Conclusion
We are just starting to see the Linux superpowers of eBPF being put to use in Kubernetes tools and technologies. We will undoubtedly see increased use of eBPF. What we have highlighted here is just a taste of what you might expect in the future. What will be really exciting is seeing how these technologies will be used in ways that we have not yet thought about. Stay tuned!  

The Kinvolk team will be hanging out at the Kinvolk booth at KubeCon in Austin. Come by to talk to us about all things, Kubernetes, Linux, container runtimes and yeah, eBPF.
