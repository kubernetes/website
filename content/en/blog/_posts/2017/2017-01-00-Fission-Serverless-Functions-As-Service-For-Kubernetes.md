---
title: " Fission: Serverless Functions as a Service for Kubernetes "
date: 2017-01-30
slug: fission-serverless-functions-as-service-for-kubernetes
url: /blog/2017/01/Fission-Serverless-Functions-As-Service-For-Kubernetes
author: >
  Soam Vasani (Platform9 Systems)
---
[Fission](https://github.com/fission/fission) is a Functions as a Service (FaaS) / Serverless function framework built on Kubernetes.  

Fission allows you to easily create HTTP services on Kubernetes from functions. It works at the source level and abstracts away container images (in most cases). It also simplifies the Kubernetes learning curve, by enabling you to make useful services without knowing much about Kubernetes.  

To use Fission, you simply create functions and add them with a CLI. You can associate functions with HTTP routes, Kubernetes events, or other triggers. Fission supports NodeJS and Python today.  

Functions are invoked when their trigger fires, and they only consume CPU and memory when they're running. Idle functions don't consume any resources except storage.  

**Why make a FaaS framework on Kubernetes?**  

We think there's a need for a FaaS framework that can be run on diverse infrastructure, both in public clouds and on-premise infrastructure. Next, we had to decide whether to build it from scratch, or on top&nbsp;of an existing orchestration system. It was quickly clear that we shouldn't build it from&nbsp;scratch -- we would just end up having to re-invent cluster management, scheduling, network&nbsp;management, and lots more.  

Kubernetes offered a powerful and flexible orchestration system with a comprehensive API backed by&nbsp;a strong and growing community. Building on it meant Fission could leave container orchestration&nbsp;functionality to Kubernetes, and focus on FaaS features.  

The other reason we don't want a separate FaaS cluster is that FaaS works best in combination with&nbsp;other infrastructure. For example, it may be the right fit for a small REST API, but it needs to&nbsp;work with other services to store state. FaaS also works great as a mechanism for event handlers&nbsp;to handle notifications from storage, databases, and from Kubernetes itself. Kubernetes is a great&nbsp;platform for all these services to interoperate on top of.  

**Deploying and Using Fission**  

Fission can be installed with a `kubectl create` command: see the [project README](https://github.com/fission/fission#get-and-run-fission-minikube-or-local-cluster) for instructions.  

Here's how you’d write a "hello world" HTTP service:  



```
$ cat \> hello.py

def main(context):

 &nbsp;&nbsp;&nbsp;print "Hello, world!"


$ fission function create --name hello --env python --code hello.py --route /hello


$ curl http://\<fission router\>/hello

Hello, world!
 ```


Fission takes care of loading the function into a container, routing the request to it, and so on. We go into more details in the next section.  

**How Fission Is Implemented on Kubernetes**  

At its core, a FaaS framework must (1) turn functions into services and (2) manage the lifecycle of these services.  

There are a number of ways to achieve these goals, and each comes with different tradeoffs. Should the&nbsp;framework operate at the source-level, or at the level of Docker images (or something in-between,&nbsp;like "buildpacks")? What's an acceptable amount of overhead the first time a function runs?&nbsp;Choices made here affect platform flexibility, ease of use, resource usage and costs, and of&nbsp;course, performance.&nbsp;  

**Packaging, source code, and images**  

One of our goals is to make Fission very easy to use for new users. We chose to operate  
at the source level, so that users can avoid having to deal with container image building, pushing&nbsp;images to registries, managing registry credentials, image versioning, and so on.  

However, container images are the most flexible way to package apps. A purely source-level&nbsp;interface wouldn't allow users to package binary dependencies, for example.  

So, Fission goes with a hybrid approach -- container images that contain a dynamic loader for&nbsp;functions. This approach allows most users to use Fission purely at the source level, but enables&nbsp;them to customize the container image when needed.  

These images, called "environment images" in Fission, contain the runtime for the language (such as NodeJS or Python), a set of commonly used dependencies and a dynamic loader for functions. If these dependencies are sufficient for the function the user is writing, no image rebuilding is needed.&nbsp;Otherwise, the list of dependencies can be modified, and the image rebuilt.  

These environment images are the only language-specific parts of Fission. They present a uniform&nbsp;interface to the rest of the framework. This design allows Fission to be easily extended to more languages.  

**Cold start performance**  

One of the goals of the serverless functions is that functions use CPU/memory resources only when running. This optimizes the resource cost of functions, but it comes at the cost of some performance overhead when starting from idle (the "cold start" overhead).  

Cold start overhead is important in many use cases. In particular, with functions used in an interactive use case -- like a web or mobile app, where a user is waiting for the action to complete -- several-second cold start latencies would be unacceptable.  

To optimize cold start overheads, Fission keeps a running pool of containers for each environment. When a request for a function comes in, Fission doesn't have to deploy a new container -- it just chooses one that's already running, copies the function into the container, loads it dynamically, and routes the request to that instance. The overhead of this process takes on the order of 100msec for NodeJS and Python functions.  

**How Fission works on Kubernetes**  



 ![fission-arch.png](https://lh4.googleusercontent.com/ORaF9Kw0UGttnjKddHJkcu99udMUGqzQ4j9J5ONHi7kmpjpRSWe-VZv1eb6eF6TZgZRumDGfAaDM_ZWoj4TUavvlhBdf3j0-A2WNIjiAWYtMFw0yXxV6mGfh3zalgwckM0DBVpcw)
Fission is designed as a set of microservices. A Controller keeps track of functions, HTTP  
routes, event triggers, and environment images. A Pool Manager manages pools of idle environment&nbsp;containers, the loading of functions into these containers, and the killing of function instances&nbsp;when they're idle. A Router receives HTTP requests and routes them to function instances,&nbsp;requesting an instance from the Pool Manager if necessary.  

The controller serves the fission API. All the other components watch the controller for updates.&nbsp;The router is exposed as a Kubernetes Service of the LoadBalancer or NodePort type, depending on where the Kubernetes cluster is hosted.  

When the router gets a request, it looks up a cache to see if this request already has a service it&nbsp;should be routed to. If not, it looks up the function to map the request to, and requests the&nbsp;poolmgr for an instance. The poolmgr has a pool of idle pods; it picks one, loads the function&nbsp;into it (by sending a request into a sidecar container in the pod), and returns the address of the&nbsp;pod to the router. The router &nbsp;proxies over the request to this pod. The pod is cached for&nbsp;subsequent requests, and if it's been idle for a few minutes, it is killed.  

(For now, Fission maps one function to one container; autoscaling to multiple instances is planned for a later release. Re-using function pods to host multiple functions is also planned, for cases where isolation isn't a requirement.)  

**Use Cases for Fission**  

**Bots, Webhooks, REST APIs&nbsp;**  
Fission is a good framework to make small REST APIs, implement webhooks, and write chatbots for Slack or other services.  

As an example of a simple REST API, we've made a small guestbook app that uses functions for reading and writing to guestbook, and works with a redis instance to keep track of state. You can find the app [in the Fission GitHub repo](https://github.com/fission/fission/tree/master/examples/python/guestbook).  

The app contains two end points -- the GET endpoint lists out guestbook entries from redis and renders them into HTML. The POST endpoint adds a new entry to the guestbook list in redis. That’s all there is -- there’s no Dockerfile to manage, and updating the app is as simple as calling fission function update.&nbsp;  

**Handling Kubernetes Events**  
Fission also supports triggering functions based on Kubernetes watches. For example, you can&nbsp;setup a function to watch for all pods in a certain namespace matching a certain label. The&nbsp;function gets the serialized object and the watch event type (added/removed/updated) in its context.  

These event handler functions could be used for simple monitoring -- for example, you could send a slack message whenever a new service is added to the cluster. There are also more complex use cases, such as writing a custom controller by watching Kubernetes' Third Party Resources.  

**Status and Roadmap**  

Fission is in early alpha for now (Jan 2017). It's not ready for production use just yet. We're looking for early adopters and feedback.  

What's ahead for Fission? We're working on making FaaS on Kubernetes more convenient, easy to use&nbsp;and easier to integrate with. In the coming months we're working on adding support for unit testing, integration with Git, function monitoring and log aggregation. We're also working on integration with other sources of events.  

Creating more language environments is also in the works. NodeJS and Python are supported today. Preliminary support for C# .NET has been contributed by Klavs Madsen.  

You can find our current roadmap on our GitHub [issues](https://github.com/fission/fission/issues) and [projects](https://github.com/fission/fission/projects).  

**Get Involved**  

Fission is open source and developed in the open by [Platform9 Systems](http://platform9.com/fission). Check us out on [GitHub](https://github.com/fission/fission), and join our slack channel if you’d like to chat with us. We're also on twitter at [@fissionio](https://twitter.com/fissionio).  




- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates

