---
title: " Building highly available applications using Kubernetes new multi-zone clusters (a.k.a. 'Ubernetes Lite') "
date: 2016-03-29
slug: building-highly-available-applications-using-kubernetes-new-multi-zone-clusters-a.k.a-ubernetes-lite
url: /blog/2016/03/Building-Highly-Available-Applications-Using-Kubernetes-New-Multi-Zone-Clusters-aka-Ubernetes-Lite
author: >
   Quinton Hoole (Google),
   Justin Santa Barbara (Google)
---
_**Editor's note:**  this is the third post in a [series of in-depth posts](/blog/2016/03/five-days-of-kubernetes-12) on what's new in Kubernetes 1.2_  



### Introduction&nbsp;
One of the most frequently-requested features for Kubernetes is the ability to run applications across multiple zones. And with good reason — developers need to deploy applications across multiple domains, to improve availability in thxe advent of a single zone outage.  

[Kubernetes 1.2](https://kubernetes.io/blog/2016/03/kubernetes-1-2-even-more-performance-upgrades-plus-easier-application-deployment-and-management), released two weeks ago, adds support for running a single cluster across multiple failure zones (GCP calls them simply "zones," Amazon calls them "availability zones," here we'll refer to them as "zones"). This is the first step in a broader effort to allow federating multiple Kubernetes clusters together (sometimes referred to by the affectionate nickname "[Ubernetes](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/federation.md)"). This initial version (referred to as "Ubernetes Lite") offers improved application availability by spreading applications across multiple zones within a single cloud provider.

Multi-zone clusters are deliberately simple, and by design, very easy to use — no Kubernetes API changes were required, and no application changes either. You simply deploy your existing Kubernetes application into a new-style multi-zone cluster, and your application automatically becomes resilient to zone failures.  


### Now into some details . . . &nbsp;
Ubernetes Lite works by leveraging the Kubernetes platform’s extensibility through labels. Today, when nodes are started, labels are added to every node in the system. With Ubernetes Lite, the system has been extended to also add information about the zone it's being run in. With that, the scheduler can make intelligent decisions about placing application instances.  

Specifically, the scheduler already spreads pods to minimize the impact of any single node failure. With Ubernetes Lite, via `SelectorSpreadPriority`, the scheduler will make a best-effort placement to spread across zones as well. We should note, if the zones in your cluster are heterogenous (e.g., different numbers of nodes or different types of nodes), you may not be able to achieve even spreading of your pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.  

This improved labeling also applies to storage. When persistent volumes are created, the `PersistentVolumeLabel` admission controller automatically adds zone labels to them. The scheduler (via the `VolumeZonePredicate` predicate) will then ensure that pods that claim a given volume are only placed into the same zone as that volume, as volumes cannot be attached across zones.  


### Walkthrough&nbsp;
We're now going to walk through setting up and using a multi-zone cluster on both [Google Compute Engine](https://cloud.google.com/compute/) (GCE) and Amazon EC2 using the default kube-up script that ships with Kubernetes. Though we highlight GCE and EC2, this functionality is available in any Kubernetes 1.2 deployment where you can make changes during cluster setup. This functionality will also be available in [Google Container Engine](https://cloud.google.com/container-engine/) (GKE) shortly.  


### Bringing up your cluster&nbsp;
Creating a multi-zone deployment for Kubernetes is the same as for a single-zone cluster, but you’ll need to pass an environment variable (`"MULTIZONE”`) to tell the cluster to manage multiple zones. We’ll start by creating a multi-zone-aware cluster on GCE and/or EC2.  

GCE:  

```
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=gce
KUBE_GCE_ZONE=us-central1-a NUM_NODES=3 bash
```
EC2:  

```
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=aws
KUBE_AWS_ZONE=us-west-2a NUM_NODES=3 bash
```
At the end of this command, you will have brought up a cluster that is ready to manage nodes running in multiple zones. You’ll also have brought up `NUM_NODES` nodes and the cluster's control plane (i.e., the Kubernetes master), all in the zone specified by `KUBE_{GCE,AWS}_ZONE`. In a future iteration of Ubernetes Lite, we’ll support a HA control plane, where the master components are replicated across zones. Until then, the master will become unavailable if the zone where it is running fails. However, containers that are running in all zones will continue to run and be restarted by Kubelet if they fail, thus the application itself will tolerate such a zone failure.  


### Nodes are labeled&nbsp;
To see the additional metadata added to the node, simply view all the labels for your cluster (the example here is on GCE):  

```
$ kubectl get nodes --show-labels

NAME STATUS AGE LABELS
kubernetes-master Ready,SchedulingDisabled 6m        
beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-master
kubernetes-minion-87j9 Ready 6m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv Ready 6m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q Ready 6m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-a12q
```
The scheduler will use the labels attached to each of the nodes (failure-domain.beta.kubernetes.io/region for the region, and failure-domain.beta.kubernetes.io/zone for the zone) in its scheduling decisions.  


### Add more nodes in a second zone&nbsp;
Let's add another set of nodes to the existing cluster, but running in a different zone (us-central1-b for GCE, us-west-2b for EC2). We run kube-up again, but by specifying `KUBE_USE_EXISTING_MASTER=1` kube-up will not create a new master, but will reuse one that was previously created.  

GCE:  

```
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce
KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```
On EC2, we also need to specify the network CIDR for the additional subnet, along with the master internal IP address:  

```
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws
KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24
MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```
View the nodes again; 3 more nodes will have been launched and labelled (the example here is on GCE):  

```
$ kubectl get nodes --show-labels

NAME STATUS AGE LABELS
kubernetes-master Ready,SchedulingDisabled 16m       
beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-master
kubernetes-minion-281d Ready 2m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kub
ernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-87j9 Ready 16m       
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv Ready 16m       
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q Ready 17m       
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-a12q
kubernetes-minion-pp2f Ready 2m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kub
ernetes.io/hostname=kubernetes-minion-pp2f
kubernetes-minion-wf8i Ready 2m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kub
ernetes.io/hostname=kubernetes-minion-wf8i
```
Let’s add one more zone:  

GCE:  

```
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce
KUBE_GCE_ZONE=us-central1-f NUM_NODES=3 kubernetes/cluster/kube-up.sh
```
EC2:  

```
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws
KUBE_AWS_ZONE=us-west-2c NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.2.0/24
MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```
Verify that you now have nodes in 3 zones:  

```
kubectl get nodes --show-labels
```
Highly available apps, here we come.  


### Deploying a multi-zone application&nbsp;
Create the guestbook-go example, which includes a ReplicationController of size 3, running a simple web app. Download all the files from [here](https://github.com/kubernetes/examples/tree/master/guestbook-go), and execute the following command (the command assumes you downloaded them to a directory named “guestbook-go”:  

```
kubectl create -f guestbook-go/
```
You’re done! Your application is now spread across all 3 zones. Prove it to yourself with the following commands:  

```
$ kubectl describe pod -l app=guestbook | grep Node
Node: kubernetes-minion-9vlv/10.240.0.5
Node: kubernetes-minion-281d/10.240.0.8
Node: kubernetes-minion-olsh/10.240.0.11

$ kubectl get node kubernetes-minion-9vlv kubernetes-minion-281d 
kubernetes-minion-olsh --show-labels
NAME STATUS AGE LABELS
kubernetes-minion-9vlv Ready 34m       
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kub
ernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-281d Ready 20m       
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kub
ernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-olsh Ready 3m        
beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.
io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-f,kub
ernetes.io/hostname=kubernetes-minion-olsh
```
Further, load-balancers automatically span all zones in a cluster; the guestbook-go example includes an example load-balanced service:  

```
$ kubectl describe service guestbook | grep LoadBalancer.Ingress
LoadBalancer Ingress: 130.211.126.21

ip=130.211.126.21

$ curl -s http://${ip}:3000/env | grep HOSTNAME
  "HOSTNAME": "guestbook-44sep",

$ (for i in `seq 20`; do curl -s http://${ip}:3000/env | grep HOSTNAME; done)  
```

```
| sort | uniq
  "HOSTNAME": "guestbook-44sep",
  "HOSTNAME": "guestbook-hum5n",
  "HOSTNAME": "guestbook-ppm40",
```
The load balancer correctly targets all the pods, even though they’re in multiple zones.  

### Shutting down the cluster&nbsp;
When you're done, clean up:  

GCE:  

```
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true 
KUBE_GCE_ZONE=us-central1-f kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true 
KUBE_GCE_ZONE=us-central1-b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a 
kubernetes/cluster/kube-down.sh
```
EC2:  

```
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2c 
kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2b 
kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a 
kubernetes/cluster/kube-down.sh
```


### Conclusion&nbsp;
A core philosophy for Kubernetes is to abstract away the complexity of running highly available, distributed applications. As you can see here, other than a small amount of work at cluster spin-up time, all the complexity of launching application instances across multiple failure domains requires no additional work by application developers, as it should be. And we’re just getting started!  

Please join our community and help us build the future of Kubernetes! There are many ways to participate. If you’re particularly interested in scalability, you’ll be interested in:  


- Our federation [slack channel&nbsp;](https://kubernetes.slack.com/messages/sig-federation/)
- The federation “Special Interest Group,” which meets every Thursday at 9:30 a.m. Pacific Time at [SIG-Federation hangout&nbsp;](https://plus.google.com/hangouts/_/google.com/ubernetes)


And of course for more information about the project in general, go to www.kubernetes.io
