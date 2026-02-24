---
layout: blog
title: "Introducing kube-iptables-tailer: Better Networking Visibility in Kubernetes Clusters"
date: 2019-04-19
slug: introducing-kube-iptables-tailer
author: >
  Saifuding Diliyaer (Box)
---

At Box, we use Kubernetes to empower our engineers to own the whole lifecycle of their microservices. When it comes to networking, our engineers use Tigera’s [Project Calico](https://www.tigera.io/tigera-calico/) to declaratively manage network policies for their apps running in our Kubernetes clusters. App owners define a Calico policy in order to enable their Pods to send/receive network traffic, which is instantiated as iptables rules.

There may be times, however, when such network policy is missing or declared incorrectly by app owners. In this situation, the iptables rules will cause network packet drops between the affected Pods, which get logged in a file that is inaccessible to app owners. We needed a mechanism to seamlessly deliver alerts about those iptables packet drops based on their network policies to help app owners quickly diagnose the corresponding issues. To solve this, we developed a service called [kube-iptables-tailer](https://github.com/box/kube-iptables-tailer) to detect packet drops from iptables logs and report them as Kubernetes events. We are proud to open-source kube-iptables-tailer for you to utilize in your own cluster, regardless of whether you use Calico or other network policy tools.

## Improved Experience for App Owners
App owners do not have to apply any additional changes to utilize kube-iptables-tailer. They can simply run `kubectl describe pods` to check if any of their Pods' traffic has been dropped due to iptables rules. All the results sent from kube-iptables-tailer will be shown under the *Events* section, which is a much better experience for developers when compared to reading through raw iptables logs.

```shell
$ kubectl describe pods --namespace=YOUR_NAMESPACE

...
Events:
 Type     Reason      Age    From                    Message
 ----     ------      ----   ----                    -------    
 Warning  PacketDrop  5s     kube-iptables-tailer    Packet dropped when receiving traffic from example-service-2 (IP: 22.222.22.222).

 Warning  PacketDrop  10m    kube-iptables-tailer    Packet dropped when sending traffic to example-service-1 (IP: 11.111.11.111).
 ```
*\* output of events sent from kube-iptables-tailer to Kubernetes Pods having networking issues* 


## Process behind kube-iptables-tailer
Before we had kube-iptables-tailer, the only way for Box’s engineers to get information about packet drops related to their network policies was parsing through the raw iptables logs and matching their service IPs. This was a suboptimal experience because iptables logs only contain basic IP address information. Mapping these IPs to specific Pods could be painful, especially in the Kubernetes world where Pods and containers are ephemeral and IPs are frequently changing. This process involved a bunch of manual commands for our engineers. Additionally, iptables logs could be noisy due to a number of drops, and if IP addresses were being reused, the app owners might even have some stale data. With the help of kube-iptables-tailer, life now becomes much easier for our developers. As shown in the following diagram, the principle of this service can be divided into three steps:
![sequence diagram for kube-iptables-tailer](https://i.imgur.com/fGAIVuS.png)

*\* sequence diagram for kube-iptables-tailer*

### 1. Watch changes on iptables log file
Instead of requiring human engineers to manually decipher the raw iptables logs, we now use kube-iptables-tailer to help identify changes in that file. We run the service as a **DaemonSet** on every host node in our cluster, and it tails the iptables log file periodically. The service itself is written in Go, and it has multiple goroutines for the different service components running concurrently. We use channels to share information among those various components. In this step, for instance, the service will send out any changes it detected in iptables log file to a Go channel to be parsed later.

### 2. Parse iptables logs based on log prefix
Once the parser receives a new log message through a particular Go channel, it will first check whether the log message includes any network policy related packet drop information by parsing the log prefix. Packet drops based on our Calico policies will be logged containing “calico-drop:” as the log prefix in iptables log file. In this case, an object will be created by the parser with the data from the log message being stored as the object’s fields. These handy objects will be later used to locate the relevant Pods running in Kubernetes and post notifications directly to them. The parser is also able to identify duplicate logs and filter them to avoid causing confusion and consuming extra resources. After the parsing process, it will come to the final step for kube-iptables-tailer to send out the results.

### 3. Locate pods and send out events
Using the Kubernetes API, kube-iptables-tailer will try locating both senders and receivers in our cluster by matching the IPs stored in objects parsed from the previous step. As a result, an event will be posted to these affected Pods if they are located successfully. Kubernetes events are objects designed to provide information about what is happening inside a Kubernetes component. At Box, one of the use cases for Kubernetes events is to report errors directly to the corresponding applications (for more details, please refer to this [blog post](https://kubernetes.io/blog/2018/01/reporting-errors-using-kubernetes-events/)). The event generated by kube-iptables-tailer includes useful information such as traffic direction, IPs and the namespace of Pods from the other side. We have added DNS lookup as well because our Pods also send and receive traffic from services running on bare-metal hosts and VMs. Besides, exponential backoff is implemented to avoid overwhelming the Kubernetes API server.

## Summary
At Box, kube-iptables-tailer has saved time as well as made life happier for many developers across various teams. Instead of flying blind with regards to packet drops based on network policies, the service is able to help detect changes in iptables log file and get the corresponding information delivered right to the Pods inside Kubernetes clusters. If you’re not using Calico, you can still apply any other log prefix (configured as an environment variable in the service) to match whatever is defined in your iptables rules and get notified about the network policy related packet drops. You may also find other cases where it is useful to make information from host systems available to Pods via the Kubernetes API. As an open-sourced project, every contribution is more than welcome to help improve the project together. You can find this project hosted on Github at https://github.com/box/kube-iptables-tailer

*Special thanks to [Kunal Parmar](https://www.linkedin.com/in/kunalparmar/), [Greg Lyons](https://www.linkedin.com/in/greg-lyons-8277a188/) and [Shrenik Dedhia](https://www.linkedin.com/in/shrenikd/) for contributing to this project.*
