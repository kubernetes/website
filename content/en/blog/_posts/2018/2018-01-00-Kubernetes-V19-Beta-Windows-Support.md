---
title: Kubernetes v1.9 releases beta support for Windows Server Containers
date: 2018-01-09
slug: kubernetes-v19-beta-windows-support
url: /blog/2018/01/Kubernetes-V19-Beta-Windows-Support
author: >
  Michael Michael (Apprenda)
---

_At the time of publication, Michael Michael was writing as SIG-Windows Lead._

With the release of Kubernetes v1.9, our mission of ensuring Kubernetes works well everywhere and for everyone takes a great step forward. We’ve advanced support for Windows Server to beta along with continued feature and functional advancements on both the Kubernetes and Windows platforms. SIG-Windows has been working since March of 2016 to open the door for many Windows-specific applications and workloads to run on Kubernetes, significantly expanding the implementation scenarios and the enterprise reach of Kubernetes.  

Enterprises of all sizes have made significant investments in .NET and Windows based applications. Many enterprise portfolios today contain .NET and Windows, with Gartner claiming that [80%](http://www.gartner.com/document/3446217) of enterprise apps run on Windows. According to StackOverflow Insights, 40% of professional developers use the .NET programming languages (including .NET Core).  

But why is all this information important? It means that enterprises have both legacy and new born-in-the-cloud (microservice) applications that utilize a wide array of programming frameworks. There is a big push in the industry to modernize existing/legacy applications to containers, using an approach similar to “lift and shift”. Modernizing existing applications into containers also provides added flexibility for new functionality to be introduced in additional Windows or Linux containers. Containers are becoming the de facto standard for packaging, deploying, and managing both existing and microservice applications. IT organizations are looking for an easier and homogenous way to orchestrate and manage containers across their Linux and Windows environments. Kubernetes v1.9 now offers beta support for Windows Server containers, making it the clear choice for orchestrating containers of any kind.  



### Features
Alpha support for Windows Server containers in Kubernetes was great for proof-of-concept projects and visualizing the road map for support of Windows in Kubernetes. The alpha release had significant drawbacks, however, and lacked many features, especially in networking. SIG-Windows, Microsoft, Cloudbase Solutions, Apprenda, and other community members banded together to create a comprehensive beta release, enabling Kubernetes users to start evaluating and using Windows.  

Some key feature improvements for Windows Server containers on Kubernetes include:  

- Improved support for pods! Multiple Windows Server containers in a pod can now share the network namespace using network compartments in Windows Server. This feature brings the concept of a pod to parity with Linux-based containers
- Reduced network complexity by using a single network endpoint per pod
- Kernel-Based load-balancing using the Virtual Filtering Platform (VFP) Hyper-v Switch Extension (analogous to Linux iptables)
- Container Runtime Interface (CRI) pod and node level statistics. Windows Server containers can now be profiled for Horizontal Pod Autoscaling using performance metrics gathered from the pod and the node
- Support for kubeadm commands to add Windows Server nodes to a Kubernetes environment. Kubeadm simplifies the provisioning of a Kubernetes cluster, and with the support for Windows Server, you can use a single tool to deploy Kubernetes in your infrastructure
- Support for ConfigMaps, Secrets, and Volumes. These are key features that allow you to separate, and in some cases secure, the configuration of the containers from the implementation
The crown jewels of Kubernetes 1.9 Windows support, however, are the networking enhancements. With the release of Windows Server 1709, Microsoft has enabled key networking capabilities in the operating system and the Windows Host Networking Service (HNS) that paved the way to produce a number of CNI plugins that work with Windows Server containers in Kubernetes. The Layer-3 routed and network overlay plugins that are supported with Kubernetes 1.9 are listed below:  

1. Upstream L3 Routing - IP routes configured in upstream ToR
2. Host-Gateway - IP routes configured on each host
3. Open vSwitch (OVS) & Open Virtual Network (OVN) with Overlay - Supports STT and Geneve tunneling types
You can read more about each of their [configuration, setup, and runtime capabilities](/docs/getting-started-guides/windows/) to make an informed selection for your networking stack in Kubernetes.  

Even though you have to continue running the Kubernetes Control Plane and Master Components in Linux, you are now able to introduce Windows Server as a Node in Kubernetes. As a community, this is a huge milestone and achievement. We will now start seeing .NET, .NET Core, ASP.NET, IIS, Windows Services, Windows executables and many more windows-based applications in Kubernetes.  

### What’s coming next
A lot of work went into this beta release, but the community realizes there are more areas of investment needed before we can release Windows support as GA (General Availability) for production workloads. Some keys areas of focus for the first two quarters of 2018 include:  

1. Continue to make progress in the area of networking. Additional CNI plugins are under development and nearing completion
- Overlay - win-overlay (vxlan or IP-in-IP encapsulation using Flannel)&nbsp;
- Win-l2bridge (host-gateway)&nbsp;
- OVN using cloud networking - without overlays
- Support for Kubernetes network policies in ovn-kubernetes
- Support for Hyper-V Isolation
- Support for StatefulSet functionality for stateful applications
- Produce installation artifacts and documentation that work on any infrastructure and across many public cloud providers like Microsoft Azure, Google Cloud, and Amazon AWS
- Continuous Integration/Continuous Delivery (CI/CD) infrastructure for SIG-Windows
- Scalability and Performance testing
Even though we have not committed to a timeline for GA, SIG-Windows estimates a GA release in the first half of 2018.



### Get Involved
As we continue to make progress towards General Availability of this feature in Kubernetes, we welcome you to get involved, contribute code, provide feedback, deploy Windows Server containers to your Kubernetes cluster, or simply join our community.  

- If you want to get started on deploying Windows Server containers in Kubernetes, read our getting started guide at [/docs/getting-started-guides/windows/](/docs/getting-started-guides/windows/)
- We meet every other Tuesday at 12:30 Eastern Standard Time (EST) at [https://zoom.us/my/sigwindows](https://zoom.us/my/sigwindows). All our meetings are recorded on youtube and referenced at [https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4](https://www.youtube.com/playlist?list=PL69nYSiGNLP2OH9InCcNkWNu2bl-gmIU4)
- Chat with us on Slack at [https://kubernetes.slack.com/messages/sig-windows](https://kubernetes.slack.com/messages/sig-windows)
- Find us on GitHub at [https://github.com/kubernetes/community/tree/master/sig-windows](https://github.com/kubernetes/community/tree/master/sig-windows)
