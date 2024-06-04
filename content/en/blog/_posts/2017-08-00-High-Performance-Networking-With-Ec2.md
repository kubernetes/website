---
title: " High Performance Networking with EC2 Virtual Private Clouds "
date: 2017-08-11
slug: high-performance-networking-with-ec2
url: /blog/2017/08/High-Performance-Networking-With-Ec2
author: >
  Juergen Brendel (Pani Networks)
  Chris Marino (Pani Networks)
---


One of the most popular platforms for running Kubernetes is Amazon Web Services’ Elastic Compute Cloud (AWS EC2). With more than a decade of experience delivering IaaS, and expanding over time to include a rich set of services with easy to consume APIs, EC2 has captured developer mindshare and loyalty worldwide.


When it comes to networking, however, EC2 has some limits that hinder performance and make deploying Kubernetes clusters to production unnecessarily complex. The preview release of Romana v2.0, a network and security automation solution for Cloud Native applications, includes features that address some well known network issues when running Kubernetes in EC2.


## Traditional VPC Networking Performance Roadblocks


A Kubernetes pod network is separate from an Amazon Virtual Private Cloud (VPC) instance network; consequently, off-instance pod traffic needs a route to the destination pods. Fortunately, VPCs support setting these routes. When building a cluster network with the [kubenet](/docs/concepts/cluster-administration/network-plugins/#kubenet) plugin, whenever new nodes are added, the AWS cloud provider will automatically add a VPC route to the pods running on that node.


Using kubenet to set routes provides native VPC network performance and visibility. However, since kubenet does not support more advanced network functions like network policy for pod traffic isolation, many users choose to run a Container Network Interface (CNI) provider on the back end.


Before Romana v2.0, all CNI network providers required an overlay when used across Availability Zones (AZs), leaving CNI users who want to deploy HA clusters unable to get the performance of native VPC networking.


Even users who don’t need advanced networking encounter restriction, since the VPC route tables support a maximum of 50 entries, which limits the size of a cluster to 50 nodes (or less, if some VPC routes are needed for other purposes). Until Romana v2.0, users also needed to run an overlay network to get around this limit.


Whether you were interested in advanced networking for traffic isolation or running large production HA clusters (or both), you were unable to get the performance and visibility of native VPC networking.


![](https://ia601500.us.archive.org/12/items/hpc-ec2-vpc-2/hpn-ec2-vpc.png)


## Kubernetes on Multi-Segment Networks



The way to avoid running out of VPC routes is to use them sparingly by making them forward pod traffic for multiple instances. From a networking perspective, what that means is that the VPC route needs to forward to a router, which can then forward traffic on to the final destination instance.


Romana is a CNI network provider that configures routes on the host to forward pod network traffic without an overlay. Since inter-node routes are installed on hosts, no VPC routes are necessary at all. However, when the VPC is split into subnets for an HA deployment across zones, VPC routes are necessary.


Fortunately, inter-node routes on hosts allows them to act as a network router and forward traffic inbound from another zone just as it would for traffic from local pods. This makes any Kubernetes node configured by Romana able to accept inbound pod traffic from other zones and forward it to the proper destination node on the subnet.


Because of this local routing function, top-level routes to pods on other instances on the subnet can be aggregated, collapsing the total number of routes necessary to as few as one per subnet. To avoid using a single instance to forward all traffic, more routes can be used to spread traffic across multiple instances, up to the maximum number of available routes (i.e. equivalent to kubenet).


The net result is that you can now build clusters of any size across AZs without an overlay. Romana clusters also support network policies for better security through network isolation.


## Making it All Work


While the combination of aggregated routes and node forwarding on a subnet eliminates overlays and avoids the VPC 50 route limitation, it imposes certain requirements on the CNI provider. For example, hosts should be configured with inter-node routes only to other nodes in the same zone on the local subnet. Traffic to all other hosts must use the default route off host, then use the (aggregated) VPC route to forward traffic out of the zone. Also: when adding a new host, in order to maintain aggregated VPC routes, the CNI plugin needs to use IP addresses for pods that are reachable on the new host.


The latest release of Romana also addresses questions about how VPC routes are installed; what happens when a node that is forwarding traffic fails; how forwarding node failures are detected; and how routes get updated and the cluster recovers.


Romana v2.0 includes a new AWS route configuration function to set VPC routes. This is part of a new set of network advertising features that automate route configuration in L3 networks. Romana v2.0 includes topology-aware IP address management (IPAM) that enables VPC route aggregation to stay within the 50 route limit as described here, as well as new health checks to update VPC routes when a routing instance fails. For smaller clusters, Romana configures VPC routes as kubenet does, with a route to each instance, taking advantage of every available VPC route.


## Native VPC Networking Everywhere


When using Romana v2.0, native VPC networking is now available for clusters of any size, with or without network policies and for HA production deployment split across multiple zones.


![](https://archive.org/download/hpc-ec2-vpc-2/hpc-ec2-vpc-2.png)
