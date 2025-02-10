---
title: " AppC Support for Kubernetes through RKT "
date: 2015-05-04
slug: appc-support-for-kubernetes-through-rkt
url: /blog/2015/05/Appc-Support-For-Kubernetes-Through-Rkt
author: >
   Craig McLuckie (Google)
---
We very recently accepted a pull request to the Kubernetes project to add appc support for the Kubernetes community. &nbsp;Appc is a new open container specification that was initiated by CoreOS, and is supported through CoreOS rkt container runtime.



This is an important step forward for the Kubernetes project and for the broader containers community. &nbsp;It adds flexibility and choice to the container-verse and brings the promise of &nbsp;compelling new security and performance capabilities to the Kubernetes developer.



Container based runtimes (like Docker or rkt) when paired with smart orchestration technologies (like Kubernetes and/or Apache Mesos) are a legitimate disruption to the way that developers build and run their applications. &nbsp;While the supporting technologies are relatively nascent, they do offer the promise of some very powerful new ways to assemble, deploy, update, debug and extend solutions. &nbsp;I believe that the world has not yet felt the full potential of containers and the next few years are going to be particularly exciting! &nbsp;With that in mind it makes sense for several projects to emerge with different properties and different purposes. It also makes sense to be able to plug together different pieces (whether it be the container runtime or the orchestrator) based on the specific needs of a given application.



Docker has done an amazing job of democratizing container technologies and making them accessible to the outside world, and we expect Kubernetes to support Docker indefinitely. CoreOS has also started to do interesting work with rkt to create an elegant, clean, simple and open platform that offers some really interesting properties. &nbsp;It looks poised deliver a secure and performant operating environment for containers. &nbsp;The Kubernetes team has been working with the appc team at CoreOS for a while and in many ways they built rkt with Kubernetes in mind as a simple pluggable runtime component. &nbsp;



The really nice thing is that with Kubernetes you can now pick the container runtime that works best for you based on your workloads’ needs, change runtimes without having the replace your cluster environment, or even mix together applications where different parts are running in different container runtimes in the same cluster. &nbsp;Additional choices can’t help but ultimately benefit the end developer.
