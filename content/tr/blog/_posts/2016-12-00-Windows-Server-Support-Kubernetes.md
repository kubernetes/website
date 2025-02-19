---
title: " Windows Server Support Comes to Kubernetes "
date: 2016-12-21
slug: windows-server-support-kubernetes
url: /blog/2016/12/Windows-Server-Support-Kubernetes
author: >
  [Michael Michael](https://twitter.com/michmike77) (Apprenda)
---
_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/12/five-days-of-kubernetes-1-5/) on what's new in Kubernetes 1.5_

Extending on the theme of giving users choice, [Kubernetes 1.5 release](https://kubernetes.io/blog/2016/12/kubernetes-1-5-supporting-production-workloads/) includes the support for Windows Servers. WIth more than [80%](http://www.gartner.com/document/3446217) of enterprise apps running Java on Linux or .Net on Windows, Kubernetes is previewing capabilities that extends its reach to the mass majority of enterprise workloads.&nbsp;

The new Kubernetes Windows Server 2016 and Windows Container support includes public preview with the following features:  

- **Containerized Multiplatform Applications** - Applications developed in operating system neutral languages like Go and .NET Core were previously impossible to orchestrate between Linux and Windows. Now, with support for Windows Server 2016 in Kubernetes, such applications can be deployed on both Windows Server as well as Linux, giving the developer choice of the operating system runtime. This capability has been desired by customers for almost two decades.&nbsp;

- **Support for Both Windows Server Containers and Hyper-V Containers** - There are two types of containers in Windows Server 2016. Windows Containers is similar to Docker containers on Linux, and uses kernel sharing. The other, called Hyper-V Containers, is more lightweight than a virtual machine while at the same time offering greater isolation, its own copy of the kernel, and direct memory assignment. Kubernetes can orchestrate both these types of containers.&nbsp;

- **Expanded Ecosystem of Applications** - One of the key drivers of introducing Windows Server support in Kubernetes is to expand the ecosystem of applications supported by Kubernetes: IIS, .NET, Windows Services, ASP.NET, .NET Core, are some of the application types that can now be orchestrated by Kubernetes, running inside a container on Windows Server.

- **Coverage for Heterogeneous Data Centers** - Organizations already use Kubernetes to host tens of thousands of application instances across Global 2000 and Fortune 500. This will allow them to expand Kubernetes to the large footprint of Windows Server.&nbsp;

The process to bring Windows Server to Kubernetes has been a truly multi-vendor effort and championed by the [Windows Special Interest Group (SIG)](https://github.com/kubernetes/community/blob/master/sig-windows/README.md) - Apprenda, Google, Red Hat and Microsoft were all involved in bringing Kubernetes to Windows Server. On the community effort to bring Kubernetes to Windows Server, Taylor Brown, Principal Program Manager at Microsoft stated that “This new Kubernetes community work furthers Windows Server container support options for popular orchestrators, reinforcing Microsoft’s commitment to choice and flexibility for both Windows and Linux ecosystems.”  

**Guidance for Current Usage**  


|
Where to use Windows Server support?
 |
Right now organizations should start testing Kubernetes on Windows Server and provide feedback. Most organizations take months to set up hardened production environments and general availability should be available in next few releases of Kubernetes.
 |
|
What works?
 |
Most of the Kubernetes constructs, such as Pods, Services, Labels, etc. work with Windows Containers.
 |
|
What doesn’t work yet?
 |

- Pod abstraction is not same due to networking namespaces. Net result is that Windows containers in a single POD cannot communicate over localhost. Linux containers can share networking stack by placing them in the same network namespace.
- DNS capabilities are not fully implemented
- UDP is not supported inside a container

 |
|
When will it be ready for all production workloads (general availability)?
 |
The goal is to refine the networking and other areas that need work to get Kubernetes users a production version of Windows Server 2016 - including with Windows Nano Server and Windows Server Core installation options - support in the next couple releases.
 |


**Technical Demo**  




**Roadmap**  

Support for Windows Server-based containers is in alpha release mode for Kubernetes 1.5, but the community is not stopping there. Customers want enterprise hardened container scheduling and management for their entire tech portfolio. That has to include full parity of features among Linux and Windows Server in production. The [Windows Server SIG](https://github.com/kubernetes/community/blob/master/sig-windows/README.md) will deliver that parity within the next one or two releases of Kubernetes through a few key areas of investment:  

- **Networking** - the SIG will continue working side by side with Microsoft to enhance the networking backbone of Windows Server Containers, specifically around lighting up container mode networking and native network overlay support for container endpoints.&nbsp;
- **OOBE** - Improving the setup, deployment, and diagnostics for a Windows Server node, including the ability to deploy to any cloud (Azure, AWS, GCP)
- **Runtime Operations** - the SIG will play a key part in defining the monitoring interface of the Container Runtime Interface (CRI), leveraging it to provide deep insight and monitoring for Windows Server-based containers
**Get Started**  

To get started with Kubernetes on Windows Server 2016, please visit the [GitHub guide](/docs/getting-started-guides/windows/) for more details.  
If you want to help with Windows Server support, then please connect with the [Windows Server SIG](https://github.com/kubernetes/community/blob/master/sig-windows/README.md) or connect directly with Michael Michael, the SIG lead, on [GitHub](https://github.com/michmike).&nbsp;  






| ![](https://lh6.googleusercontent.com/1Lqqd5m0gHECz_yHvTas4eOOkFnB64h9j65Flrb5OHmIoaAZLUr64y2kukx5m7_QbBxnk_plxfxsQymhnO9UrcGGixDx_ZG7w0tJIzV_pnljLJLk3u3o8P1wJxNJiKbf0L077eYO) |
| Kubernetes on Windows Server 2016 Architecture |
