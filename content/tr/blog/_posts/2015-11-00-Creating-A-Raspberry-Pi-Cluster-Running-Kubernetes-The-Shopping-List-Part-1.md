---
title: " Creating a Raspberry Pi cluster running Kubernetes, the shopping list (Part 1) "
date: 2015-11-25
slug: creating-a-raspberry-pi-cluster-running-kubernetes-the-shopping-list-part-1
url: /blog/2015/11/Creating-A-Raspberry-Pi-Cluster-Running-Kubernetes-The-Shopping-List-Part-1
author: >
   Arjen Wassink (Quintor)
---
At Devoxx Belgium and Devoxx Morocco, Ray Tsang and I showed a Raspberry Pi cluster we built at Quintor running HypriotOS, Docker and Kubernetes. For those who did not see the talks, you can check out [an abbreviated version of the demo](https://www.youtube.com/watch?v=AAS5Mq9EktI) or the full talk by Ray on [developing and deploying Java-based microservices](https://www.youtube.com/watch?v=kT1vmK0r184) in Kubernetes. While we received many compliments on the talk, the most common question was about how to build a Pi cluster themselves! We’ll be doing just that, in two parts. This first post will cover the shopping list for the cluster, and the second will show you how to get it up and running . . .

### Wait! Why the heck build a Raspberry Pi cluster running Kubernetes?&nbsp;

We had two big reasons to build the Pi cluster at Quintor. First of all we wanted to experiment with container technology at scale on real hardware. You can try out container technology using virtual machines, but Kubernetes runs great on bare metal too. To explore what that’d be like, we built a Raspberry Pi cluster just like we would build a cluster of machines in a production datacenter. This allowed us to understand and simulate how Kubernetes would work when we move it to our data centers.  

Secondly, we did not want to blow the budget to do this exploration. And what is cheaper than a Raspberry Pi! If you want to build a cluster comprising many nodes, each node should have a good cost to performance ratio. Our Pi cluster has 20 CPU cores, which is more than many servers, yet cost us less than $400. Additionally, the total power consumption is low and the form factor is small, which is great for these kind of demo systems.  

So, without further ado, let’s get to the hardware.  

### The Shopping List:

|   |   |   |
| ------------ | ------------ | ------------ |
| 5 | Raspberry Pi 2 model B | [~$200](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/) |
| 5 | 16 GB micro SD-card class 10 | ~ $45 |
| 1 | D-Link Switch GO-SW-8E 8-Port | [~$15](http://www.dlink.com/uk/en/home-solutions/connect/go/go-sw-8e) |
| 1 | Anker 60W 6-Port PowerPort USB Charger (white) | [~$35](http://www.ianker.com/product/A2123122) |
| 3 | ModMyPi Multi-Pi Stackable Raspberry Pi Case | [~$60](http://www.modmypi.com/raspberry-pi/cases/multi-pi-stacker/multi-pi-stackable-raspberry-pi-case) |
| 1 | ModMyPi Multi-Pi Stackable Raspberry Pi Case - Bolt Pack | [~$7](http://www.modmypi.com/raspberry-pi/cases/multi-pi-stacker/multi-pi-stackable-raspberry-pi-case-bolt-pack) |
| 5 | Micro USB cable (white) 1ft long | ~ $10 |
| 5 | UTP cat5 cable (white) 1ft long | ~ $10 |


<br>
For a total of approximately $380 you will have a building set to create a Raspberry Pi cluster like we built! [1](#1)  


### Some of our considerations&nbsp;

We used the Raspberry Pi 2 model B boards in our cluster rather than the Pi 1 boards because of the CPU power (quadcore @ 900MHz over a dualcore @ 700MHz) and available memory (1 GB over 512MB). These specs allowed us to run multiple containers on each Pi to properly experiment with Kubernetes.  

We opted for a 16GB SD-card in each Pi to be at the save side on filesystem storage. In hindsight, 8GB seemed to be enough.  

Note the GeauxRobot Stackable Case looks like an alternative for the ModMyPi Stackable Case, but it’s smaller which can cause a problem fitting in the Anker USB Adapter and placing the D-Link Network Switch. So, we stuck with the ModMyPi case.  


### Putting it together&nbsp;

Building the Raspberry Pi cluster is pretty straight forward. Most of the work is putting the stackable casing together and mounting the Pi boards on the plexiglass panes. We mounted the network switch and USB Adapter using double side foam tape, which feels strong enough for most situations. Finally, we connected the USB and UTP cables. Next, we installed HypriotOS on every Pi. HypriotOS is a Raspbian based Linux OS for Raspberry Pi’s extended with Docker support. The Hypriot team has an excellent tutorial on [Getting started with Docker on your Raspberry Pi](http://blog.hypriot.com/getting-started-with-docker-on-your-arm-device/). Follow this tutorial to get Linux and Docker running on all Pi’s.  

With that, you’re all set! Next up will be running Kubernetes on the Raspberry Pi cluster. We’ll be covering this the [next post](https://kubernetes.io/blog/2015/12/creating-raspberry-pi-cluster-running), so stay tuned!  





** ## [1] ## **
**[1]&nbsp;**To save ~$90 by making a stack of four Pi’s (instead of five). This also means you can use a 5-Port Anker USB Charger instead of the 6-Port one.  
