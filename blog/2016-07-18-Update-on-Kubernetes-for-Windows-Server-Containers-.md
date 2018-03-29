---
layout: blog
title: " Update on Kubernetes for Windows Server Containers  "
date:  Tuesday, July 18, 2016
pagination:
  enabled: true
---
_Today's post is written by Jitendra Bhurat, Product Manager at Apprenda, and Cesar Wong, Principal Software Engineer at Red Hat; describing the progress made to bring Kubernetes on Windows Server.&nbsp;_  

Large organizations have significant investments and long-term roadmaps for both Linux and Windows Server. With Microsoft adopting Docker in Windows Server 2016, organizations are looking for a simplified means to orchestrating containers in both their Linux and Windows environments.&nbsp;  

As the adoption and [contribution curve of Kubernetes is unmatched](https://apprenda.com/blog/kubernetes-now-leads-linkedin-awesome-stats-infographic/), there has been a lot of interest in making Kubernetes compatible with the Microsoft ecosystem. At Apprenda, we have been building .NET distributed systems for the better part of a decade and kicked off the porting of Kubernetes to Windows in June.  

Our current goal is to develop a minimally viable proof of concept (POC) of Kubernetes on Windows Server 2016 so that the community can learn about the pitfalls that will need to be overcome for future production environments. As the community drives this project to its first milestone, a number of lessons have been learned, work is ongoing, and we are currently investigating a number of networking options on Windows Server.  

**GETTING STARTED**  

In June, Apprenda and Kismatic (acquired by Apprenda), formed the Kubernetes Windows [SIG](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig) team, and along with Red Hat, formed a partnership to create a Windows version of the Kubernetes Kubelet and Kube-Proxy, the two key components for operating Kubernetes on Windows Server. For a minimum viable POC, the initial work was divided into the following logical areas to help facilitate project management:  





|
Focus Area
 |
Architectural Notes
 |
Status
 |
Part of POC
 |
|
Container Runtime
 |
Expanding Kubernetes container runtimes to support Windows Server 2016 Docker containers
 |
Work for POC complete
 |
Yes
 |
|
cAdvisor
 |
Resource usage and performance characteristics in Kubernetes for Docker containers. Other architectural features in Kubernetes can run without this component. &nbsp;
 |
Research will start after POC milestone
 |
No
 |
|
Pod Architecture
 |
Fundamental unit of container bundling in Kubernetes. Current area of research ongoing on ultimate architecture in Windows Server. &nbsp;&nbsp;
 |
Work for POC close to complete and will be finished when networking work is completed.
 |
Yes
 |
|
Networking and Kube-Proxy
 |
Networking and communications among components (e.g. services to pod, pod to pod, etc.).
 |
Still active area of research for POC. For some parts of Kubernetes there are no direct parallels in Windows Server - e.g. IPTables. Currently investigating Open vSwitch for container networking.
 |
Yes
 |
|
OOM Score
 |
Frees up memory by sacrificing processes when all else fails. There is no direct comparison for OOM in Windows Server.
 |
Research will start after POC milestone
 |
No
 |



[Cesar Wong](https://github.com/csrwng) from Red Hat offered to contribute to Container Runtime and Pod Architecture sections and Apprenda has been working on Kubelet Integration and Kube-Proxy.&nbsp;



It is important to mention that for Windows Server environments, the Kubernetes control plane (API server, schedulers, etcd, etc) would continue to run on Linux and there would not be a Windows-only version of Kubernetes. Given the vast majority of organizations are running both Linux and Windows Server instances, this requirement is not a technical roadblock to adoption. For example, vSphere has a [similar requirement](http://www.vmware.com/files/pdf/techpaper/VMW-vCTR-SRVR-Deployment-Guide-6-0.pdf).&nbsp;



**Container Runtime&nbsp;**



The current Kubelet implementation for Linux relies on an infrastructure container per pod to hold on to an IP address while other containers may be killed/restarted. This requires that containers be able to share their network stack (--net=container:id). In Docker for Windows, it is not possible to share the network stack across containers. It is also not possible to set a container’s DNS servers. In the container runtime POC for Windows, we created a new container runtime that removed the requirement of an infrastructure container. It also uses the IP of the first container in the pod as the pod’s IP address. With some limitations, however, it was possible to stand up pods with Windows-specific containers.&nbsp;



It is worth noting that a refactor of the container runtime in the Kubelet is under way and the POC code will need to be updated to reflect this new runtime architecture.



**Pod Architecture**



Pods in Kubernetes can include multiple containers, all sharing the same network, PID and volume namespace. Since Windows containers cannot share namespaces, multiple containers inside a pod are more isolated from each other. Furthermore, each container gets its own IP address, while the pod will only expose a single IP address for all containers.&nbsp;



At least initially, this means that Windows pods in Kubernetes should be limited to a single container. This also reflects the fact that containers in Windows are more monolithic than their Linux counterparts, including more of the underlying operating system pieces, including a service manager and other processes.

**Kubelet Integration**



The goal here was to have Kubelet running on Windows Server Container and be capable of accepting requests/commands from the Kubernetes API Server running on Linux. The Kubelet code base is, unfortunately, closely coupled with the Linux OS. For example, even for trivial things like finding the hostname, the Kubelet code assumes Linux as the operating system. Thanks to the versatility of Kubernetes, many of the OS dependencies (like hostname) &nbsp;were fixable using command line flags to provide a default value. &nbsp;



Thus far, we have been able to disjoin parts of the Kubelet from its dependencies which allow it to run on Windows with the proper abstraction layers. While the current status of the Kubelet is good enough for a POC, there is more work that needs to be done to get it into a state of general availability. For one, instead of using flags and environmental variables, it would be best to have code changes upstream. There are also a number of bugs that need fixing. For example, we encountered a [Golang bug](https://github.com/golang/go/issues/14527) where moving a directory fails in Windows and had to provide an alternate implementation. &nbsp;

**Networking / Kube-Proxy**

Organizations using containers need the ability to deploy multiple containers and pods on a single host, have them share an IP address and be able to easily talk to other containers and pods on that same host. To accomplish this design goal, we conducted a lot of research on [Windows Container Networking](https://msdn.microsoft.com/en-us/virtualization/windowscontainers/management/container_networking), as this held the keys to both the Kubernetes pod and service level networking.&nbsp;



We looked in-depth at the different networking modes supported by Windows Containers and found L2 Bridge Networking mode to be the most appropriate in our case, as it allowed inter-container communication across different hosts. Working closely with the Microsoft networking team, we were able to identify and resolve issues we were having setting up the L2 Bridge networking mode in our environment using the TP5 release of Windows Server 2016. &nbsp;

As we dug deep into networking, two options were clear for the Kube-Proxy implementation:

- Implement Kube-Proxy natively on Windows &nbsp;
- Run a Linux version of the Kube-Proxy on a Hyper-V VM using the same bridge as the other containers running on Windows and have the Kube-Proxy forward requests to the other containers and have the Windows host forward requests to the proxy


For the POC, we decided to run Kube-Proxy on a Hyper-V Linux virtual machine and configure L2 Bridge mode networking with a private subnet. This implementation would enable us to forward traffic from the Kube-Proxy to containers running on Windows. Unfortunately, it did not work as it did in theory.&nbsp;



On further investigation, with the help of Microsoft, we determined that for this to work, we would have to configure the L2 Bridge networking mode with an externally accessible gateway and on the same subnet as the container host. Such a requirement goes against the networking isolation boundary that the pod currently enjoys because each container on that host and other hosts can communicate with each other and all the other container hosts. This means any container can talk to any other container regardless of pod membership. &nbsp;

We are currently looking at using Open vSwitch (OVS) to configure overlay networking to overcome the issue described above. Cloudbase, which is also a member of the Kubernetes Windows SIG, is actively involved in this effort. Their team has successfully [implemented](https://cloudbase.it/openvswitch/) OVS in Windows Server and their work is promising for this effort. The community is also currently engaged with the Microsoft lead on Windows Server networking to find an alternative in case this route does not pan out.&nbsp;



As we continue to make progress on the POC, we welcome ideas from the community to help us advance this vision. You can connect with us in the following ways:

- Chat with us on the [Kubernetes Slack](http://slack.k8s.io/): [#sig-windows](https://kubernetes.slack.com/messages/sig-windows/)
- Contribute on the Kubernetes [Windows SIG Google Group](https://groups.google.com/forum/#!forum/kubernetes-sig-windows)
- Join our meetings: biweekly on Tuesdays at 10AM PT



_--Jitendra Bhurat, Product Manager at Apprenda. Container Runtime and Pod Architecture sections contributed by Cesar Wong, Principal Software Engineer at Red Hat_
