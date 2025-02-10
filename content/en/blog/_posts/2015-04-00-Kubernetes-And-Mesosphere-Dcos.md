---
title: " Kubernetes and the Mesosphere DCOS "
date: 2015-04-22
slug: kubernetes-and-mesosphere-dcos
url: /blog/2015/04/Kubernetes-And-Mesosphere-Dcos
author: >
   Craig McLuckie (Google)
---

# Kubernetes and the Mesosphere DCOS



Today Mesosphere announced the addition of Kubernetes as a standard part of their [DCOS][1] offering.  This is a great step forwards in bringing cloud native application management to the world, and should lay to rest many questions we hear about 'Kubernetes or Mesos, which one should I use?'.  Now you can have your cake and eat it too:  use both.  Today's announcement extends the reach of Kubernetes to a new class of users, and add some exciting new capabilities for everyone.

By way of background, Kubernetes is a cluster management framework that was started by Google nine months ago, inspired by the internal system known as Borg.  You can learn a little more about Borg by checking out this [paper][2].  At the heart of it Kubernetes offers what has been dubbed 'cloud native' application management.  To us, there are three things that together make something 'cloud native':



* **Container oriented deployments**  Package up your application components with all their dependencies and deploy them using technologies like Docker or Rocket.  Containers radically simplify the deployment process, making rollouts repeatable and predictable.
* **Dynamically managed**  Rely on modern control systems to make moment-to-moment decisions around the health management and scheduling of applications to radically improve reliability and efficiency.  There are some things that just machines do better than people, and actively running applications is one of those things.  
* **Micro-services oriented**  Tease applications apart into small semi-autonomous services that can be consumed easily so that the resulting systems are easier to understand, extend and adapt.

Kubernetes was designed from the start to make these capabilities available to everyone, and built by the same engineers that built the system internally known as Borg.  For many users the promise of 'Google style app management' is interesting, but they want to run these new classes of applications on the same set of physical resources as their existing workloads like Hadoop, Spark, Kafka, etc.  Now they will have access to commercially supported offering that brings the two worlds together.

Mesosphere, one of the earliest supporters of the Kubernetes project, has been working closely with the core Kubernetes team to create a natural experience for users looking to get the best of both worlds, adding Kubernetes to every Mesos deployment they instantiate, whether it be in the public cloud, private cloud, or in a hybrid deployment model.  This is well aligned with the overall Kubernetes vision of creating ubiquitous management framework that runs anywhere a container can.  It will be interesting to see how you blend together the old world and the new on a commercially supported, versatile platform.

[1]: https://mesosphere.com/product/
[2]: http://research.google.com/pubs/pub43438.html
