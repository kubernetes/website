---
title: Using Windows Server Containers in Kubernetes
toc_hide: true
---
{{< note >}}
These instructions are under revision for the v1.14 release with a [tracking issue](https://github.com/kubernetes/website/issues/12426). You can find the WIP draft in a [Google Doc](https://docs.google.com/document/d/1a2bRd7PZXygIEm4cEcCeLXpEqJ7opakP_j4Pc6AJVYA/edit?usp=sharing)
{{< /note >}}

## ​Motivation

Windows applications constitute a large portion of the services and applications that run in many organizations. [Windows containers](https://aka.ms/windowscontainers) provide a modern way to encapsulate processes and package dependencies, making it easier to use DevOps practices and follow cloud native patterns for Windows applications. Kubernetes has become the defacto standard container orchestrator, and the release of Kubernetes 1.14 includes production support for scheduling Windows containers on Windows nodes in a Kubernetes cluster, enabling a vast ecosystem of Windows applications to leverage the power of Kubernetes. Enterprises with investments in Windows-based applications and Linux-based applications don't have to look for separate orchestrators to manage their workloads, leading to increased operational efficiencies across their deployments, regardless of operating system. 


