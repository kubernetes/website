---
layout: blog
title: " Kubernetes and the Mesosphere DCOS "
date:  Thursday, April 22, 2015 

---
  

Today Mesosphere announced the addition of Kubernetes as a standard part of their [DCOS](https://mesosphere.com/product/) offering. &nbsp;This is a great step forwards in bringing cloud native application management to the world, and should lay to rest many questions we hear about ‘Kubernetes or Mesos, which one should I use?’. &nbsp;Now you can have your cake and eat it too: &nbsp;use both. &nbsp;Today’s announcement extends the reach of Kubernetes to a new class of users, and add some exciting new capabilities for everyone.

By way of background, Kubernetes is a cluster management framework that was started by Google nine months ago, inspired by the internal system known as Borg. &nbsp;You can learn a little more about Borg by checking out this [paper](http://research.google.com/pubs/pub43438.html). &nbsp;At the heart of it Kubernetes offers what has been dubbed ‘cloud native’ application management. &nbsp;To us, there are three things that together make something ‘cloud native’:
  

- 
Container oriented deployments. &nbsp;Package up your application components with all their dependencies and deploy them using technologies like Docker or Rocket. &nbsp;Containers radically simplify the deployment process, making rollouts repeatable and predictable.
- 
Dynamically managed. &nbsp;Rely on modern control systems to make moment-to-moment decisions around the health management and scheduling of applications to radically improve reliability and efficiency. &nbsp;There are some things that just machines do better than people, and actively running applications is one of those things. &nbsp;
- 
Micro-services oriented. &nbsp;Tease applications apart into small semi-autonomous services that can be consumed easily so that the resulting systems are easier to understand, extend and adapt.
  

Kubernetes was designed from the start to make these capabilities available to everyone, and built by the same engineers that built the system internally known as Borg. &nbsp;For many users the promise of ‘Google style app management’ is interesting, but they want to run these new classes of applications on the same set of physical resources as their existing workloads like Hadoop, Spark, Kafka, etc. &nbsp;Now they will have access to commercially supported offering that brings the two worlds together.
  

Mesosphere, one of the earliest supporters of the Kubernetes project, has been working closely with the core Kubernetes team to create a natural experience for users looking to get the best of both worlds, adding Kubernetes to every Mesos deployment they instantiate, whether it be in the public cloud, private cloud, or in a hybrid deployment model. &nbsp;This is well aligned with the overall Kubernetes vision of creating ubiquitous management framework that runs anywhere a container can. &nbsp;It will be interesting to see how you blend together the old world and the new on a commercially supported, versatile platform.
  

Craig McLuckie

Product Manager, Google and Kubernetes co-founder
