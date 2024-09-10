---
title: " rktnetes brings rkt container engine to Kubernetes "
date: 2016-07-11
slug: rktnetes-brings-rkt-container-engine-to-kubernetes
url: /blog/2016/07/Rktnetes-Brings-Rkt-Container-Engine-To-Kubernetes
author: >
  Yifan Gu (CoreOS),
  Josh Wood (CoreOS)
---
_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/07/five-days-of-kubernetes-1-3) on what's new in Kubernetes 1.3_

As part of [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/), we’re happy to report that our work to bring interchangeable container engines to Kubernetes is bearing early fruit. What we affectionately call “rktnetes” is included in the version 1.3 Kubernetes release, and is ready for development use. rktnetes integrates support for [CoreOS rkt](https://coreos.com/rkt/) into Kubernetes as the container runtime on cluster nodes, and is now part of the mainline Kubernetes source code. Today it’s easier than ever for developers and ops pros with container portability in mind to try out running Kubernetes with a different container engine.

"We find CoreOS’s rkt a compelling container engine in Kubernetes because of how rkt is composed with the underlying systemd,” said Mark Petrovic, senior MTS and architect at Xoom, a PayPal service. “The rkt runtime assumes only the responsibility it needs to, then delegates to other system services where appropriate. This separation of concerns is important to us.”  


### What’s rktnetes?

rktnetes is the nickname given to the code that enables Kubernetes nodes to execute application containers with the rkt container engine, rather than with Docker. This change adds new abilities to Kubernetes, for instance running containers under flexible levels of isolation. rkt explores an alternative approach to container runtime architecture, aimed to reflect the Unix philosophy of cleanly separated, modular tools. Work done to support rktnetes also opens up future possibilities for Kubernetes, such as multiple container image format support, and the integration of other container runtimes tailored for specific use cases or platforms.  


### Why does Kubernetes need rktnetes?

rktnetes is about more than just rkt. It’s also about refining and exercising Kubernetes interfaces, and paving the way for other modular runtimes in the future. While the Docker container engine is well known, and is currently the default Kubernetes container runtime, a number of benefits derive from pluggable container environments. Some clusters may call for very specific container engine implementations, for example, and ensuring the Kubernetes design is flexible enough to support alternate runtimes, starting with rkt, helps keep the interfaces between components clean and simple.  

#### Separation of concerns: Decomposing the monolithic container daemon
The current container runtime used by Kubernetes imposes a number of design decisions. Experimenting with other container execution architectures is worthwhile in such a rapidly evolving space. Today, when Kubernetes sends a request to a node to start running a pod, it communicates through the kubelet on each node with the default container runtime’s central daemon, responsible for managing all of the node’s containers.  

rkt does not implement a monolithic container management daemon. (It is worth noting that the [default container runtime is in the midst of refactoring its original monolithic architecture](https://blog.docker.com/2016/04/docker-engine-1-11-runc/).) The rkt design has from day one tried to apply the principle of modularity to the fullest, including reusing well-tested system components, rather than reimplementing them.  

The task of building container images is abstracted away from the container runtime core in rkt, and implemented by an independent utility. The same approach is taken to ongoing container lifecycle management. A single binary, rkt, configures the environment and prepares container images for execution, then sets the container application and its isolation environment running. At this point, the rkt program has done its “one job”, and the container isolator takes over.  

The API for querying container engine and pod state, used by Kubernetes to track cluster work on each node, is implemented in a separate service, isolating coordination and orchestration features from the core container runtime. While the API service does not fully implement all the API features of the current default container engine, it already helps isolate containers from failures and upgrades in the core runtime, and provides the read-only parts of the expected API for querying container metadata.  

#### Modular container isolation levels
With rkt managing container execution, Kubernetes can take advantage of the CoreOS container engine’s modular _stage1_ isolation mechanism. The typical container runs under rkt in a software-isolated environment constructed from Linux kernel namespaces, cgroups, and other facilities. Containers isolated in this common way nevertheless share a single kernel with all the other containers on a system, making for lightweight isolation of running apps.  

However, rkt features pluggable isolation environments, referred to as stage1s, to change how containers are executed and isolated. For example, the [rkt fly stage1](https://coreos.com/rkt/docs/latest/running-fly-stage1.html) runs containers in the host namespaces (PID, mount, network, etc), granting containers greater power on the host system. Fly is used for containerizing lower-level system and network software, like the kubelet itself. At the other end of the isolation spectrum, the [KVM stage1](https://coreos.com/rkt/docs/latest/running-lkvm-stage1.html) runs standard app containers as individual virtual machines, each above its own Linux kernel, managed by the KVM hypervisor. This isolation level can be useful for high security and multi-tenant cluster workloads.  



[![](https://1.bp.blogspot.com/-k3RRYf70fsg/V4a_-lVypxI/AAAAAAAAAl4/m9lVW0mxw7s35dzLlT4XJO5gdMzy_RBiQCLcB/s640/rkt%2Bstages.png)](https://1.bp.blogspot.com/-k3RRYf70fsg/V4a_-lVypxI/AAAAAAAAAl4/m9lVW0mxw7s35dzLlT4XJO5gdMzy_RBiQCLcB/s1600/rkt%2Bstages.png)




Currently, rktnetes can use the KVM stage1 to execute all containers on a node with VM isolation by setting the kubelet’s --rkt-stage1-image option. Experimental work exists to choose the stage1 isolation regime on a per-pod basis with a Kubernetes annotation declaring the pod’s appropriate stage1. KVM containers and standard Linux containers can be mixed together in the same cluster.  


### How rkt works with Kubernetes



Kubernetes today talks to the default container engine over an API provided by the Docker daemon. rktnetes communicates with rkt a little bit differently. First, there is a distinction between how Kubernetes changes the state of a node’s containers – how it starts and stops pods, or reschedules them for failover or scaling – and how the orchestrator queries pod metadata for regular, read-only bookkeeping. Two different facilities implement these two different cases.  


[![](https://3.bp.blogspot.com/-Agx6uMnddDc/V4bAA2YH_-I/AAAAAAAAAl8/PbKRFjVy0JMqyZ_OJ4oqMtGyTmlFTh0bQCEw/s640/rktnetes%2B%25281%2529.png)](https://3.bp.blogspot.com/-Agx6uMnddDc/V4bAA2YH_-I/AAAAAAAAAl8/PbKRFjVy0JMqyZ_OJ4oqMtGyTmlFTh0bQCEw/s1600/rktnetes%2B%25281%2529.png)



#### Managing microservice lifecycles
The kubelet on each cluster node communicates with rkt to [prepare](https://coreos.com/rkt/docs/latest/subcommands/prepare.html) containers and their environments into pods, and with systemd, the linux service management framework, to invoke and manage the pod processes. Pods are then managed as systemd services, and the kubelet sends systemd commands over dbus to manipulate them. Lifecycle management, such as restarting failed pods and killing completed processes, is handled by systemd, at the kubelet’s behest.  


#### The API service for reading pod data
A discrete [rkt api-service](https://coreos.com/rkt/docs/latest/subcommands/api-service.html) implements the pod introspection mechanisms expected by Kubernetes. While each node’s kubelet uses systemd to start, stop, and restart pods as services, it contacts the API service to read container runtime metadata. This includes basic orchestration information such as the number of pods running on the node, the names and networks of those pods, and the details of pod configuration, resource limits and storage volumes (think of the information shown by the kubectl describe subcommand).  

Pod logs, having been written to journal files, are made available for kubectl logs and other forensic subcommands by the API service as well, which reads from log files to provide pod log data to the kubelet for answering control plane requests.  

This dual interface to the container environment is an area of very active development, and plans are for the API service to expand to provide methods for the pod manipulation commands. The underlying mechanism will continue to keep separation of concerns in mind, but will hide more of this from the kubelet. The methods the kubelet uses to control the rktnetes container engine will grow less different from the default container runtime interface over time.  


### Try rktnetes

So what can you do with rktnetes today? Currently, rktnetes passes all of [the applicable Kubernetes “end-to-end” (aka “e2e”) tests](http://storage.googleapis.com/kubernetes-test-history/static/suite-rktnetes:kubernetes-e2e-gce.html), provides standard metrics to cAdvisor, manages networks using [CNI](https://github.com/containernetworking/cni), handles per-container/pod logs, and automatically garbage collects old containers and images. Kubernetes running on rkt already provides more than the basics of a modular, flexible container runtime for Kubernetes clusters, and it is already a functional part of our development environment at CoreOS.  

Developers and early adopters can follow the known issues in the [rktnetes notes](/docs/getting-started-guides/rkt/notes/) to get an idea &nbsp;of the wrinkles and bumps test-drivers can expect to encounter. This list groups the high-level pieces required to bring rktnetes to feature parity with the existing container runtime and API. We hope you’ll try out rktnetes in your Kubernetes clusters, too.  

#### Use rkt with Kubernetes Today
The introductory guide [_Running Kubernetes on rkt_](/docs/getting-started-guides/rkt/) walks through the steps to spin up a rktnetes cluster, from kubelet --container-runtime=rkt to networking and starting pods. This intro also sketches the configuration you’ll need to start a cluster on GCE with the Kubernetes kube-up.sh script.  

Recent work aims to make rktnetes cluster creation much easier, too. While not yet merged, an&nbsp;[in-progress pull request creates a single rktnetes configuration toggle](https://github.com/coreos/coreos-kubernetes/pull/551) to select rkt as the container engine when deploying a Kubernetes cluster with the [coreos-kubernetes](https://github.com/coreos/coreos-kubernetes#kubernetes-on-coreos) configuration tools. You can also check out the [rktnetes workshop project](https://github.com/coreos/rkt8s-workshop), which launches a single-node rktnetes cluster on just about any developer workstation with one vagrant up command.  

We’re excited to see the experiments the wider Kubernetes and CoreOS communities devise to put rktnetes to the test, and we welcome your input – and pull requests!  


