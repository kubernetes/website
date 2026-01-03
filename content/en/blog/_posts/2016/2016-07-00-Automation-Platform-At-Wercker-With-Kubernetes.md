---
title: " Steering an Automation Platform at Wercker with Kubernetes "
date: 2016-07-15
slug: automation-platform-at-wercker-with-kubernetes
url: /blog/2016/07/Automation-Platform-At-Wercker-With-Kubernetes
author: >
  Andy Smith (Wercker)
---

At [Wercker](http://wercker.com/) we run millions of containers that execute our users’ CI/CD jobs. The vast majority of them are ephemeral and only last as long as builds, tests and deploys take to run, the rest are ephemeral, too -- aren't we all --, but tend to last a bit longer and run our infrastructure. As we are running many containers across many nodes, we were in need of a highly scalable scheduler that would make our lives easier, and as such, decided to implement Kubernetes.  

Wercker is a container-centric automation platform that helps developers build, test and deploy their applications. We support any number of pipelines, ranging from building code, testing API-contracts between microservices, to pushing containers to registries, and deploying to schedulers. All of these pipeline jobs run inside Docker containers and each artifact can be a Docker container.  

And of course we use Wercker to build Wercker, and deploy itself onto Kubernetes!  

**Overview**  

Because we are a platform for running multi-service cloud-native code we've made many design decisions around isolation. On the base level we use [CoreOS](http://coreos.com/) and [cloud-init](https://coreos.com/os/docs/latest/cloud-config.html) to bootstrap a cluster of heterogeneous nodes which I have named Patricians, Peasants, as well as controller nodes that don't have a cool name and are just called Controllers. Maybe we should switch to Constables.  


 ![k8s-architecture.jpg](https://lh5.googleusercontent.com/i_Gtd1J9dekCxy7jJYZDZX0XmAmGD4f8qhrYG60FdVqnM87l-si44BGHjFdEFACZcx2E-rgRZNxuvniYDninlHAl9ZHyF2-jJjKUl-QQH8Au29hwVTbnDc0tP1Rv_Yd8mvt1tfoX)




Patrician nodes are where the bulk of our infrastructure runs. These nodes have appropriate network interfaces to communicate with our backend services as well as be routable by various load balancers. This is where our logging is aggregated and sent off to logging services, our many microservices for reporting and processing the results of job runs, and our many microservices for handling API calls.



On the other end of the spectrum are the Peasant nodes where the public jobs are run. Public jobs consist of worker pods reading from a job queue and dynamically generating new runner pods to handle execution of the job. The job itself is an incarnation of our open source [CLI tool](http://github.com/wercker/wercker), the same one you can run on your laptop with Docker installed. These nodes have very limited access to the rest of the infrastructure and the containers the jobs themselves run in are even further isolated.



Controllers are controllers, I bet ours look exactly the same as yours.



**Dynamic Pods**

Our heaviest use of the Kubernetes API is definitely our system of creating dynamic pods to serve as the runtime environment for our actual job execution. After pulling job descriptions from the queue we define a new pod containing all the relevant environment for checking out code, managing a cache, executing a job and uploading artifacts. We launch the pod, monitor its progress, and destroy it when the job is done.



**Ingresses**

In order to provide a backend for HTTP API calls and allow self-registration of handlers we make use of the Ingress system in Kubernetes. It wasn't the clearest thing to set up, but reading through enough of the [nginx example](https://kubernetes.io/blog/2016/03/kubernetes-1-2-and-simplifying-advanced-networking-with-ingress/) eventually got us to a good spot where it is easy to connect services to the frontend.



**Upcoming Features in 1.3**



While we generally treat all of our pods and containers as ephemeral and expect rapid restarts on failures, we are looking forward to Pet Sets and Init Containers as ways to optimize some of our processes. We are also pleased with official support for [Minikube](https://github.com/kubernetes/minikube) coming along as it improves our local testing and development.&nbsp;



**Conclusion**



Kubernetes saves us the non-trivial task of managing many, many containers across many nodes. It provides a robust API and tooling for introspecting these containers, and it includes much built in support for logging, metrics, monitoring and debugging. Service discovery and networking alone saves us so much time and speeds development immensely.

Cheers to you Kubernetes, keep up the good work :)
