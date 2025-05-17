---
title: " Kompose Helps Developers Move Docker Compose Files to Kubernetes "
date: 2017-08-10
slug: kompose-helps-developers-move-docker
url: /blog/2017/08/Kompose-Helps-Developers-Move-Docker
author: >
  Charlie Drage (Red Hat)
---

I'm pleased to announce that [Kompose](https://github.com/kubernetes/kompose), a conversion tool for developers to transition Docker Compose applications to Kubernetes, has graduated from the [Kubernetes Incubator](https://github.com/kubernetes/community/blob/master/incubator.md) to become an official part of the project.   

Since our first commit on June 27, 2016, Kompose has achieved 13 releases over 851 commits, gaining 21 contributors since the inception of the project. Our work started at Skippbox (now part of [Bitnami](https://bitnami.com/)) and grew through contributions from Google and Red Hat.  

The Kubernetes Incubator allowed contributors to get to know each other across companies, as well as collaborate effectively under guidance from Kubernetes contributors and maintainers. Our incubation led to the development and release of a new and useful tool for the Kubernetes ecosystem.  

We’ve created a reliable, scalable Kubernetes environment from an initial Docker Compose file. We worked hard to convert as many keys as possible to their Kubernetes equivalent. Running a single command gets you up and running on Kubernetes:  kompose up.  

We couldn’t have done it without feedback and contributions from the community!  

If you haven’t yet tried [Kompose on GitHub](https://github.com/kubernetes/kompose) check it out!



Kubernetes guestbook  

The go-to example for Kubernetes is the famous [guestbook](https://github.com/kubernetes/examples/blob/master/guestbook), which we use as a base for conversion.


Here is an example from the official [kompose.io](https://kompose.io/) site, starting with a simple Docker Compose [file](https://raw.githubusercontent.com/kubernetes/kompose/master/examples/docker-compose.yaml)).  

First, we’ll retrieve the file:  


```
$ wget https://raw.githubusercontent.com/kubernetes/kompose/master/examples/docker-compose.yaml
 ```

You can test it out by first deploying to Docker Compose:  



```
$ docker-compose up -d

Creating network "examples\_default" with the default driver

Creating examples\_redis-slave\_1

Creating examples\_frontend\_1

Creating examples\_redis-master\_1
 ```

And when you’re ready to deploy to Kubernetes:  



```
$ kompose up


We are going to create Kubernetes Deployments, Services and PersistentVolumeClaims for your Dockerized application.


If you need different kind of resources, use the kompose convert and kubectl create -f commands instead.


INFO Successfully created Service: redis          

INFO Successfully created Service: web            

INFO Successfully created Deployment: redis       

INFO Successfully created Deployment: web         


Your application has been deployed to Kubernetes. You can run kubectl get deployment,svc,pods,pvc for details
 ```

Check out [other examples](https://github.com/kubernetes/kompose/tree/master/examples) of what Kompose can do.  

Converting to alternative Kubernetes controllers  

Kompose can also convert to specific Kubernetes controllers with the use of flags:

```
$ kompose convert --help  

Usage:

  kompose convert [file] [flags]


Kubernetes Flags:

      --daemon-set               Generate a Kubernetes daemonset object

  -d, --deployment               Generate a Kubernetes deployment object

  -c, --chart                    Create a Helm chart for converted objects

      --replication-controller   Generate a Kubernetes replication controller object

…
 ```

For example, let’s convert our [guestbook](https://github.com/kubernetes/examples/blob/master/guestbook) example to a DaemonSet:  



```
$ kompose convert --daemon-set

INFO Kubernetes file "frontend-service.yaml" created

INFO Kubernetes file "redis-master-service.yaml" created

INFO Kubernetes file "redis-slave-service.yaml" created

INFO Kubernetes file "frontend-daemonset.yaml" created

INFO Kubernetes file "redis-master-daemonset.yaml" created

INFO Kubernetes file "redis-slave-daemonset.yaml" created
 ```

Key Kompose 1.0 features   

With our graduation, comes the release of Kompose 1.0.0, here’s what’s new:



- Docker Compose Version 3: Kompose now supports Docker Compose Version 3. New keys such as ‘deploy’ now convert to their Kubernetes equivalent.
- Docker Push and Build Support: When you supply a ‘build’ key within your `docker-compose.yaml` file, Kompose will automatically build and push the image to the respective Docker repository for Kubernetes to consume.
- New Keys: With the addition of version 3 support, new keys such as pid and deploy are supported. For full details on what Kompose supports, view our [conversion document](http://kompose.io/conversion/).
- Bug Fixes: In every release we fix any bugs related to edge-cases when converting. This release fixes issues relating to converting volumes with ‘./’ in the target name.



What’s ahead?  

As we continue development, we will strive to convert as many Docker Compose keys as possible for all future and current Docker Compose releases, converting each one to their Kubernetes equivalent. All future releases will be backwards-compatible.  


- [Install Kompose](https://github.com/kubernetes/kompose/blob/master/docs/installation.md)
- [Kompose Quick Start Guide](https://github.com/kubernetes/kompose/blob/master/docs/installation.md)
- [Kompose Web Site](http://kompose.io/)
- [Kompose Documentation](https://github.com/kubernetes/kompose/tree/master/docs)


- Post questions (or answer questions) on[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on[K8sPort](http://k8sport.org/)
- Follow us on Twitter[@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on[Slack](http://slack.k8s.io/)
- Get involved with the Kubernetes project on[GitHub](https://github.com/kubernetes/kubernetes)
