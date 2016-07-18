---
---

Kubernetes comes built-in with some basic resource utilization monitoring as described at the [Monitoring](/docs/user-guide/monitoring) user guide page. Here we describe how to utilize distributed, full-stack application monitoring and deep system troubleshooting for your Kubernetes cluster with Sysdig.

### Kubernetes and Sysdig
Sysdig offers native, first class support for Kubernetes. That includes [sysdig](http://www.sysdig.org/), an open source system troubleshooting tool, and [Sysdig Cloud](https://sysdig.com/), the  monitoring platform designed from the ground up to support containers and microservices.

At a high level, Sysdig products are aware of the entire Kubernetes cluster hierarchy, including namespaces, services, replication controllers and labels. So all of the rich system and application data gathered is now available in the context of your Kubernetes infrastructure. 

In this post we will quickly preview the Kubernetes visibility in both open source sysdig and Sysdig Cloud, and show off a couple of interesting use cases. Let’s start with the open source solution.

## Troubleshooting Kubernetes with sysdig 

Open source sysdig is designed to offer simple, intuitive, and incredibly rich insight into all activity on a Linux machine, including inside containers. Sysdig is scriptable in Lua and includes a command line interface and a powerful interactive UI, csysdig, that runs in your terminal. Think of sysdig as strace + tcpdump + htop + iftop + lsof. With state of the art container visibility on top.

Install sysdig on any Kubernetes node that you want to troubleshoot by following the install instructions on [github](https://github.com/draios/sysdig/wiki/How%20to%20Install%20Sysdig%20for%20Linux) or [sysdig.org](http://www.sysdig.org/install/).


### Getting Started
The easiest way to take advantage of sysdig’s Kubernetes support is by launching csysdig, the sysdig ncurses UI:

```
csysdig -k http://127.0.0.1:8080
```

Specify the address of your Kubernetes API server with the -k command, and sysdig will poll all the relevant information from the API.

Now that csysdig is running, hit F2 to bring up the views panel, and you'll notice the presence of a bunch of `K8s` views. The k8s Namespaces view can be used to see the list of namespaces and observe the amount of CPU, memory, network and disk resources each of them is using on this machine:  
 
![sysdig-1](/images/docs/sysdig/sysdig-1.png)

Similarly, you can select k8s Services to see the same information broken up by service:  
 
![sysdig-2](/images/docs/sysdig/sysdig-2.png)

or k8s Controllers to see the replication controllers:
 
![sysdig-3](/images/docs/sysdig/sysdig-3.png)

or k8s Pods to see the list of pods running on this machine and the resources they use:
 
![sysdig-4](/images/docs/sysdig/sysdig-4.png)

#### Drill Down-Based Navigation  
A cool feature in csysdig is the ability to drill down: just select an element, click on enter and – boom – now you're looking inside it. Drill down is also aware of the Kubernetes hierarchy, which means I can start from a service, get the list of its pods, see which containers run inside one of the pods, and go inside one of the containers to explore files, network connections, processes or even threads. Check out the video below.
 
![sysdig-5](/images/docs/sysdig/sysdig-5.gif)

#### Actions 
Csysdig also offers “control panel” functionality, making it possible to use hotkeys to execute command lines based on the element currently selected - accordingly, the Kubernetes views include a bunch of useful hotkeys. For example, you can delete a namespace or a service by pressing "x," or you can describe them by pressing "d."

Two particularly useful hotkeys are "f," to follow the logs that a pod is generating, and "b," which leverages kubectl exec to give you a shell inside a pod. 

## Monitoring Kubernetes with Sysdig Cloud 
Open source sysdig and csysdig are great for troubleshooting single instances.. but what happens if you want to monitor a distributed Kubernetes cluster? Enter [Sysdig Cloud](https://sysdig.com/).

### Installation
In order to instrument your Kubernetes environment with Sysdig Cloud, you simply need to install the Sysdig Cloud agent container on each underlying host in your Kubernetes cluster. The recommended way to accomplish this install is using a DaemonSet. Example files and install instructions can be found [in the Kubernetes Examples documentation](https://github.com/kubernetes/kubernetes/tree/master/examples/sysdig-cloud).

Sysdig Cloud’s support for Kubernetes works like this: 

1. By automatically connecting to a Kubernetes’ cluster API Server and querying the API, Sysdig Cloud is able to infer both the physical and the logical structure of your microservice application. 
2. In addition, Sysdig Cloud transparently extracts important metadata such as labels. 
3. This information is combined with Sysdig's ContainerVision technology, which makes it possible to inspect applications running inside containers without requiring any instrumentation of the container or application. 

Based on this, Sysdig Cloud can provide rich visibility and context from both an infrastructure-centric and an application-centric point of view. Let’s walk through what this actually looks like and how to use it.


### Getting Started with Sysdig Cloud
One of the core features of Sysdig Cloud is groups, which allow you to define the hierarchy of metadata for your applications and infrastructure. By applying the proper groups, you can explore your containers based on their physical hierarchy (for example, physical cluster > node machine > pod > container) or based on their logical microservice hierarchy (for example, namespace > replication controller > pod > container – as you can see in this example). 
 
![sysdig-7](/images/docs/sysdig/sysdig-7.png)

If you’re interested in the utilization of your underlying physical resource – e.g., identifying noisy neighbors – then the physical hierarchy is great. But if you’re looking to explore the performance of your applications and microservices, then the logical hierarchy is often the best place to start. 

For example: here you can see the overall performance of the WordPress service: 
 
![sysdig-8](/images/docs/sysdig/sysdig-8.png)

Keep in mind that the pods implementing this service are scattered across multiple machines, but we can still total request counts, response times and URL statistics aggregated together for this service. And don’t forget: this doesn’t require any configuration or instrumentation of wordpress, apache, or the underlying containers! 

And from this view, you can now easily create alerts for these service-level metrics, and  dig down into any individual container for deep inspection - down to the process level  – whenever you want, including back in time.

### Visualizing Your Kubernetes Services 
Sysdig Cloud’s zoomable topology visualization also includes Kubernetes awareness - at both the physical and logical level. 
 
The two gifs below show the exact same infrastructure and services. But the first one depicts the physical hierarchy, with a master  and a three node cluster:  

![sysdig-9](/images/docs/sysdig/sysdig-9.gif)

This second image groups containers into namespaces, services and pods, while abstracting the physical location of the containers:

![sysdig-10](/images/docs/sysdig/sysdig-10.gif)

## Further reading

* [3 ways that Kubernetes changes monitoring](https://sysdig.com/blog/3-ways-that-kubernetes-changes-monitoring/)
* [Troubleshooting Kubernetes: How container metadata changes your point of view](https://sysdig.com/blog/container-metadata/)
* [Greed is Good: Troubleshooting Kubernetes](https://sysdig.com/blog/greed-good-troubleshooting-kubernetes/)
* [A Sysdig + Kubernetes Adventure, Part 1: How Kubernetes Services Work](https://sysdig.com/blog/sysdigkubernetes-adventure-part-1-kubernetes-services-work/)
* [A Sysdig + Kubernetes Adventure, Part 2: Troubleshooting Kubernetes Services](https://sysdig.com/blog/a-sysdigkubernetes-adventure-part-2-troubleshooting-kubernetes-services/)

---  
  
*You can find open source sysdig on [github](https://github.com/draios/sysdig) and at [sysdig.org](http://www.sysdig.org/), and you can sign up for free trial of Sysdig Cloud at [sysdig.com](https://sysdig.com/).*  
  
---  
  
*Author: Chris Crane, VP Product, Sysdig*  
*A version of this article was originally posted on the [Kubernetes blog](http://blog.kubernetes.io/2015/11/monitoring-Kubernetes-with-Sysdig.html).*
