---
title: " Kompose: a tool to go from Docker-compose to Kubernetes "
date: 2016-11-22
slug: kompose-tool-go-from-docker-compose-to-kubernetes
url: /blog/2016/11/Kompose-Tool-Go-From-Docker-Compose-To-Kubernetes
author: >
  Sebastien Goasguen (Skippbox)
---

At [Skippbox](http://www.skippbox.com/), we developed **kompose** a tool to automatically transform your Docker Compose application into Kubernetes manifests. Allowing you to start a Compose application on a Kubernetes cluster with a single kompose up command. We’re extremely happy to have donated kompose to the [Kubernetes Incubator](https://github.com/kubernetes-incubator). So here’s a quick introduction about it and some motivating factors that got us to develop it.  

Docker is terrific for developers. It allows everyone to get started quickly with an application that has been packaged in a Docker image and is available on a Docker registry. To build a multi-container application, Docker has developed Docker-compose (aka Compose). Compose takes in a yaml based manifest of your multi-container application and starts all the required containers with a single command docker-compose up. However Compose only works locally or with a Docker Swarm cluster.  

But what if you wanted to use something else than Swarm? Like Kubernetes of course.  

The Compose format is not a standard for defining distributed applications. Hence you are left re-writing your application manifests in your container orchestrator of choice.  

We see kompose as a terrific way to expose Kubernetes principles to Docker users as well as to easily migrate from Docker Swarm to Kubernetes to operate your applications in production.  

Over the summer, Kompose has found a new gear with help from Tomas Kral and Suraj Deshmukh from Red Hat, and Janet Kuo from Google. Together with our own lead kompose developer Nguyen An-Tu they are making kompose even more exciting. We proposed Kompose to the Kubernetes Incubator within the SIG-apps and we received approval from the general Kubernetes community; you can now find kompose in the [Kubernetes Incubator](https://github.com/kubernetes-incubator/kompose).  

Kompose now supports Docker-compose v2 format, persistent volume claims have been added recently, as well as multiple container per pods. It can also be used to target OpenShift deployments, by specifying a different provider than the default Kubernetes. Kompose is also now available in Fedora packages and we look forward to see it in CentOS distributions in the coming weeks.  

kompose is a single Golang binary that you build or install from the [release on GitHub](https://github.com/kubernetes-incubator/kompose). Let’s skip the build instructions and dive straight into an example.  

Let's take it for a spin!  

**Guestbook application with Docker**  

The Guestbook application has become the canonical example for Kubernetes. In Docker-compose format, the **guestbook** can be started with this minimal file:  


```
version: "2"



services:

  redis-master:

    image: gcr.io/google\_containers/redis:e2e

    ports:

      - "6379"

  redis-slave:

    image: gcr.io/google\_samples/gb-redisslave:v1

    ports:

      - "6379"

    environment:

      - GET\_HOSTS\_FROM=dns

  frontend:

    image: gcr.io/google-samples/gb-frontend:v4

    ports:

      - "80:80"

    environment:

      - GET\_HOSTS\_FROM=dns
 ```


It consists of three services. A redis-master node, a set of redis-slave that can be scaled and find the redis-master via its DNS name. And a PHP frontend that exposes itself on port 80. The resulting application allows you to leave short messages which are stored in the redis cluster.  

To get it started with docker-compose on a vanilla Docker host do:  


```
$ docker-compose -f docker-guestbook.yml up -d

Creating network "examples\_default" with the default driver

Creating examples\_redis-slave\_1

Creating examples\_frontend\_1

Creating examples\_redis-master\_1
 ```


So far so good, this is plain Docker usage. Now let’s see how to get this on Kubernetes without having to re-write anything.  

**Guestbook with 'kompose'**  

Kompose currently has three main commands up, down and convert. Here for simplicity we will show a single usage to bring up the Guestbook application.  

Similarly to docker-compose, we can use the kompose up command pointing to the Docker-compose file representing the Guestbook application. Like so:  







```
$ kompose -f ./examples/docker-guestbook.yml up

We are going to create Kubernetes deployment and service for your dockerized application.

If you need more kind of controllers, use 'kompose convert' and 'kubectl create -f' instead.



INFO[0000] Successfully created service: redis-master

INFO[0000] Successfully created service: redis-slave

INFO[0000] Successfully created service: frontend

INFO[0000] Successfully created deployment: redis-master

INFO[0000] Successfully created deployment: redis-slave

INFO[0000] Successfully created deployment: frontend



Application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc' for details.
 ```


kompose automatically converted the Docker-compose file into Kubernetes objects. By default, it created one deployment and one service per **compose** services. In addition it automatically detected your current Kubernetes endpoint and created the resources onto it. A set of flags can be used to generate Replication Controllers, Replica Sets or Daemon Sets instead of Deployments.  

And that's it! Nothing else to do, the conversion happened automatically.  
Now, if you already now Kubernetes a bit, you’re familiar with the client kubectl and you can check what was created on your cluster.  





```
$ kubectl get pods,svc,deployments

NAME                             READY        STATUS        RESTARTS     AGE

frontend-3780173733-0ayyx        1/1          Running       0            1m

redis-master-3028862641-8miqn    1/1          Running       0            1m

redis-slave-3788432149-t3ejp     1/1          Running       0            1m

NAME                             CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE

frontend                         10.0.0.34    \<none\>        80/TCP       1m

redis-master                     10.0.0.219   \<none\>        6379/TCP     1m

redis-slave                      10.0.0.84    \<none\>        6379/TCP     1m

NAME                             DESIRED      CURRENT       UP-TO-DATE



AVAILABLE   AGE

frontend                         1            1             1            1           1m

redis-master                     1            1             1            1           1m

redis-slave                      1            1             1            1           1m
 ```

Indeed you see the three services, the three deployments and the resulting three pods. To access the application quickly, access the _frontend_ service locally and enjoy the Guestbook application, but this time started from a Docker-compose file.  

 ![kompose.png](https://lh6.googleusercontent.com/2vTmKcVs-4nl6eYCwJcqCDEaSQ1uUtEmZ2ND0HMO-h8c_5CfU1OwJOuqOc6Eb_nymqdyvLbQK114xRp5U_hmeRHTyn1W_C7gJ6vf3E37CLKrx172XQWVkyko55Q3TfotX76tbMOZ)

Hopefully this gave you a quick tour of kompose and got you excited. They are more exciting features, like creating different type of resources, creating Helm charts and even using the experimental Docker bundle format as input. Check Lachlan Evenson’s blog on [using a Docker bundle with Kubernetes](https://deis.com/blog/2016/push-docker-dab-kubernetes-cluster/). For an overall demo, see our talk from [KubeCon](https://www.youtube.com/watch?v=zqUfPPNVjI8&index=42&list=PLj6h78yzYM2PqgIGU1Qmi8nY7dqn9PCr4)



Head over to the [Kubernetes Incubator](https://github.com/kubernetes-incubator/kompose) and check out kompose, it will help you move easily from your Docker compose applications to Kubernetes clusters in production.






- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
