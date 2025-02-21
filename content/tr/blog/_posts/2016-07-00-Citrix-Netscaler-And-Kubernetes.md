---
title: " Citrix + Kubernetes = A Home Run "
date: 2016-07-14
slug: citrix-netscaler-and-kubernetes
url: /blog/2016/07/Citrix-Netscaler-And-Kubernetes
author: >
  Mikko Disini (Citrix Systems)
---

Technical collaboration is like sports. If you work together as a team, you can go down the homestretch and pull through for a win. That’s our experience with the Google Cloud Platform team.  

Recently, we approached Google Cloud Platform (GCP) to collaborate on behalf of Citrix customers and the broader enterprise market looking to migrate workloads.&nbsp;This migration required including the [NetScaler Docker load balancer](https://www.citrix.com/blogs/2016/06/20/the-best-docker-load-balancer-at-dockercon-in-seattle-this-week/), CPX, into Kubernetes nodes and resolving any issues with getting traffic into the CPX proxies. &nbsp;  

**Why NetScaler and Kubernetes?**  


1. Citrix customers want the same Layer 4 to Layer 7 capabilities from NetScaler that they have on-prem as they move to the cloud as they begin deploying their container and microservices architecture with Kubernetes&nbsp;
2. Kubernetes provides a proven infrastructure for running containers and VMs with automated workload delivery
3. NetScaler CPX provides Layer 4 to Layer 7 services and highly efficient telemetry data to a logging and analytics platform, [NetScaler Management and Analytics System](https://www.citrix.com/blogs/2016/05/24/introducing-the-next-generation-netscaler-management-and-analytics-system/)

I wish all our experiences working together with a technical partner were as good as working with GCP. We had a list of issues to enable our use cases and were able to collaborate swiftly on a solution. To resolve these, GCP team offered in depth technical assistance, working with Citrix such that NetScaler CPX can spin up and take over as a client-side proxy running on each host.&nbsp;  

Next, NetScaler CPX needed to be inserted in the data path of GCP ingress load balancer so that NetScaler CPX can spread traffic to front end web servers. The NetScaler team made modifications so that NetScaler CPX listens to API server events and configures itself to create a VIP, IP table rules and server rules to take ingress traffic and load balance across front end applications. Google Cloud Platform team provided feedback and assistance to verify modifications made to overcome the technical hurdles. Done!  

NetScaler CPX use case is supported in [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/). Citrix customers and the broader enterprise market will have the opportunity to leverage NetScaler with Kubernetes, thereby lowering the friction to move workloads to the cloud.&nbsp;

You can learn more about&nbsp;NetScaler CPX [here](https://www.citrix.com/networking/microservices.html).
