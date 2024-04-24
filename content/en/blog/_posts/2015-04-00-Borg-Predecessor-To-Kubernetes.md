---
title: " Borg: The Predecessor to Kubernetes "
date: 2015-04-23
slug: borg-predecessor-to-kubernetes
url: /blog/2015/04/Borg-Predecessor-To-Kubernetes
---
Google has been running containerized workloads in production for more than a decade. Whether it's service jobs like web front-ends and stateful servers, infrastructure systems like [Bigtable](http://research.google.com/archive/bigtable.html) and [Spanner](http://research.google.com/archive/spanner.html), or batch frameworks like [MapReduce](http://research.google.com/archive/mapreduce.html) and [Millwheel](http://research.google.com/pubs/pub41378.html), virtually everything at Google runs as a container. Today, we took the wraps off of Borg, Google’s long-rumored internal container-oriented cluster-management system, publishing details at the academic computer systems conference [Eurosys](http://eurosys2015.labri.fr/). You can find the paper [here](https://research.google.com/pubs/pub43438.html).



Kubernetes traces its lineage directly from Borg. Many of the developers at Google working on Kubernetes were formerly developers on the Borg project. We've incorporated the best ideas from Borg in Kubernetes, and have tried to address some pain points that users identified with Borg over the years.



To give you a flavor, here are four Kubernetes features that came from our experiences with Borg:



1) [Pods](/docs/concepts/workloads/pods/). A pod is the unit of scheduling in Kubernetes. It is a resource envelope in which one or more containers run. Containers that are part of the same pod are guaranteed to be scheduled together onto the same machine, and can share state via local volumes.



Borg has a similar abstraction, called an alloc (short for “resource allocation”). Popular uses of allocs in Borg include running a web server that generates logs alongside a lightweight log collection process that ships the log to a cluster filesystem (not unlike fluentd or logstash); running a web server that serves data from a disk directory that is populated by a process that reads data from a cluster filesystem and prepares/stages it for the web server (not unlike a Content Management System); and running user-defined processing functions alongside a storage shard. Pods not only support these use cases, but they also provide an environment similar to running multiple processes in a single VM -- Kubernetes users can deploy multiple co-located, cooperating processes in a pod without having to give up the simplicity of a one-application-per-container deployment model.



2) [Services](/docs/concepts/services-networking/service/). Although Borg’s primary role is to manage the lifecycles of tasks and machines, the applications that run on Borg benefit from many other cluster services, including naming and load balancing. Kubernetes supports naming and load balancing using the service abstraction: a service has a name and maps to a dynamic set of pods defined by a label selector (see next section). Any container in the cluster can connect to the service using the service name. Under the covers, Kubernetes automatically load-balances connections to the service among the pods that match the label selector, and keeps track of where the pods are running as they get rescheduled over time due to failures.



3) [Labels](/docs/concepts/overview/working-with-objects/labels/). A container in Borg is usually one replica in a collection of identical or nearly identical containers that correspond to one tier of an Internet service (e.g. the front-ends for Google Maps) or to the workers of a batch job (e.g. a MapReduce). The collection is called a Job, and each replica is called a Task. While the Job is a very useful abstraction, it can be limiting. For example, users often want to manage their entire service (composed of many Jobs) as a single entity, or to uniformly manage several related instances of their service, for example separate canary and stable release tracks. At the other end of the spectrum, users frequently want to reason about and control subsets of tasks within a Job -- the most common example is during rolling updates, when different subsets of the Job need to have different configurations.



Kubernetes supports more flexible collections than Borg by organizing pods using labels, which are arbitrary key/value pairs that users attach to pods (and in fact to any object in the system). Users can create groupings equivalent to Borg Jobs by using a “job:\<jobname\>” label on their pods, but they can also use additional labels to tag the service name, service instance (production, staging, test), and in general, any subset of their pods. A label query (called a “label selector”) is used to select which set of pods an operation should be applied to. Taken together, labels and [replication controllers](/docs/concepts/workloads/controllers/replicationcontroller/) allow for very flexible update semantics, as well as for operations that span the equivalent of Borg Jobs.



4) IP-per-Pod. In Borg, all tasks on a machine use the IP address of that host, and thus share the host’s port space. While this means Borg can use a vanilla network, it imposes a number of burdens on infrastructure and application developers: Borg must schedule ports as a resource; tasks must pre-declare how many ports they need, and take as start-up arguments which ports to use; the Borglet (node agent) must enforce port isolation; and the naming and RPC systems must handle ports as well as IP addresses.



Thanks to the advent of software-defined overlay networks such as [flannel](https://coreos.com/blog/introducing-rudder/) or those built into [public clouds](https://cloud.google.com/compute/docs/networking), Kubernetes is able to give every pod and service its own IP address. This removes the infrastructure complexity of managing ports, and allows developers to choose any ports they want rather than requiring their software to adapt to the ones chosen by the infrastructure. The latter point is crucial for making it easy to run off-the-shelf open-source applications on Kubernetes--pods can be treated much like VMs or physical hosts, with access to the full port space, oblivious to the fact that they may be sharing the same physical machine with other pods.



With the growing popularity of container-based microservice architectures, the lessons Google has learned from running such systems internally have become of increasing interest to the external DevOps community. By revealing some of the inner workings of our cluster manager Borg, and building our next-generation cluster manager as both an open-source project (Kubernetes) and a publicly available hosted service ([Google Container Engine](http://cloud.google.com/container-engine)), we hope these lessons can benefit the broader community outside of Google and advance the state-of-the-art in container scheduling and cluster management. &nbsp;
