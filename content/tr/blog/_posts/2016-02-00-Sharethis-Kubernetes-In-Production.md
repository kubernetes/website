---
title: " ShareThis: Kubernetes In Production "
date: 2016-02-11
slug: sharethis-kubernetes-in-production
url: /blog/2016/02/Sharethis-Kubernetes-In-Production
author: >
   Juan Valencia (ShareThis)
---

ShareThis has grown tremendously since its first days as a tiny widget that allowed you to share to your favorite social services. It now serves over 4.5 million domains per month, helping publishers create a more authentic digital experience.

Fast growth came with a price. We leveraged technical debt to scale fast and to grow our products, particularly when it came to infrastructure. As our company expanded, the infrastructure costs mounted as well - both in terms of inefficient utilization and in terms of people costs. About 1 year ago, it became clear something needed to change.

### TL;DRKubernetes has been a key component for us to reduce technical debt in our infrastructure by:

* Fostering the Adoption of Docker
* Simplifying Container Management
* Onboarding Developers On Infrastructure
* Unlocking Continuous Integration and Delivery
We accomplished this by radically adopting Kubernetes and switching our DevOps team to a Cloud Platform team that worked in terms of containers and microservices. This included creating some tools to get around our own legacy debt.  

### The Problem

Alas, the cloud was new and we were young. We started with a traditional data-center mindset. &nbsp;We managed all of our own services: MySQL, Cassandra, Aerospike, Memcache, you name it. &nbsp;We set up VM’s just like you would traditional servers, installed our applications on them, and managed them in Nagios or Ganglia.

Unfortunately, this way of thinking was antithetical to a cloud-centric approach. Instead of thinking in terms of services, we were thinking in terms of servers. Instead of using modern cloud approaches such as autoscaling, microservices, or even managed VM’s, we were thinking in terms of scripted setups, server deployments, and avoiding vendor lock-in.

These ways of thinking were not bad per se, they were simply inefficient. They weren’t taking advantage of the changes to the cloud that were happening very quickly. It also meant that when changes needed to take place, we were treating those changes as big slow changes to a datacenter, rather than small fast changes to the cloud.

### The Solution

#### Kubernetes As A Tool To Foster Docker Adoption

As Docker became more of a force in our industry, engineers at ShareThis also started experimenting with it to good effect. It soon became obvious that we needed to have a working container for every app in our company just so we could simplify testing in our development environment.

Some apps moved quickly into Docker because they were simple and had few dependencies. &nbsp;For those that had small dependencies, we were able to manage using Fig (Fig was the original name of Docker Compose). Still, many of our data pipelines or interdependent apps were too gnarly to be directly dockerized. We still wanted to do it, but Docker was not enough.

In late 2015, we were frustrated enough with our legacy infrastructure that we finally bit the bullet. We evaluated Docker’s tools, ECS, Kubernetes, and Mesosphere. It was quickly obvious that Kubernetes was in a more stable and user friendly state than its competitors for our infrastructure. As a company, we could solidify our infrastructure on Docker by simply setting the goal of having all of our infrastructure on Kubernetes.

Engineers were skeptical at first. However, once they saw applications scale effortlessly into hundreds of instances per application, they were hooked. Now, not only was there the pain points driving us forward into Docker and by extension Kubernetes, but there was genuine excitement for the technology pulling us in. This has allowed us to make an incredibly difficult migration fairly quickly. We now run Kubernetes in multiple regions on about 65 large VMs and increasing to over 100 in the next couple months. Our Kubernetes cluster currently processes 800 million requests per day with the plan to process over 2 billion requests per day in the coming months.

#### Kubernetes As A Tool To Manage Containers

Our earliest use of Docker was promising for development, but not so much so for production. The biggest friction point was the inability to manage Docker components at scale. Knowing which containers were running where, what version of a deployment was running, what state an app was in, how to manage subnets and VPCs, etc, plagued any chance of it going to production. The tooling required would have been substantial.



When you look at Kubernetes, there are several key features that were immediately attractive:

* It is easy to install on AWS (where all our apps were running)
* There is a direct path from a Dockerfile to a replication controller through a yaml/json file
* Pods are able to scale in number easily
* We can easily scale the number of VM’s running on AWS in a Kubernetes cluster
* Rolling deployments and rollback are built into the tooling
* Each pod gets monitored through health checks
* Service endpoints are managed by the tool
* There is an active and vibrant community



Unfortunately, one of the biggest pain points was that the tooling didn’t solve our existing legacy infrastructure, it just provided an infrastructure to move onto. There were still a variety of network quirks which disallowed us from directly moving our applications onto a new VPC.&nbsp;In addition, the reworking of so many applications required developers to jump onto problems that have classically been solved by sys admins and operations teams.

#### Kubernetes As A Tool For Onboarding Developers On Infrastructure

When we decided to make the switch from what was essentially a Chef-run setup to Kubernetes, I do not think we understood all of the pain points that we would hit. &nbsp;We ran our servers in a variety of different ways in a variety of different network configurations that were considerably different than the clean setup that you find on a fresh Kubernetes VPC. &nbsp;

In production we ran in both AWS VPCs and AWS classic across multiple regions. This means that we managed several subnets with different access controls across different applications. Our most recent applications were also very secure, having no public endpoints. This meant that we had a combination of VPC peering, network address translation (NAT), and proxies running in varied configurations.

In the Kubernetes world, there’s only the VPC. &nbsp;All the pods can theoretically talk to each other, and services endpoints are explicitly defined. It’s easy for the developer to gloss over some of the details and it removes the need for operations (mostly). &nbsp;

We made the decision to convert all of our infrastructure / DevOps developers into application developers (really!). We had already started hiring them on the basis of their development skills rather than their operational skills anyway, so perhaps that is not as wild as it sounds.

We then made the decision to onboard our entire engineering organization onto Operations. Developers are flexible, they enjoy challenges, and they enjoy learning. It was remarkable. &nbsp;After 1 month, our organization went from having a few DevOps folks, to having every engineer capable of modifying our architecture.

The training ground for onboarding on networking, productionization, problem solving, root cause analysis, etc, was getting Kubernetes into prod at scale. After the first month, I was biting my nails and worrying about our choices. After 2 months, it looked like it might some day be viable. After 3 months, we were deploying 10 times per week. After 4 months, 40 apps per week. Only 30% of our apps have been migrated, yet the gains are not only remarkable, they are astounding. Kubernetes allowed us to go from an infrastructure-is-slowing-us-down-ugh! organization, to an infrastructure-is-speeding-us-up-yay! organization.

#### Kubernetes As A Means To Unlock Continuous Integration And Delivery

How did we get to 40+ deployments per week? Put simply, continuous integration and deployment (CI/CD) came as a byproduct of our migration. Our first application in Kubernetes was Jenkins, and every app that went in also was added to Jenkins. As we moved forward, we made Jenkins more automatic until pods were being added and taken from Kubernetes faster than we could keep track. &nbsp;

Interestingly, our problems with scaling are now about wanting to push out too many changes at once and people having to wait until their turn. Our goal is to get 100 deployments per week through the new infrastructure. This is achievable if we can continue to execute on our migration and on our commitment to a CI/CD process on Kubernetes and Jenkins.

### Next Steps

We need to finish our migration. At this point the problems are mostly solved, the biggest difficulties are in the tedium of the task at hand. To move things out of our legacy infrastructure meant changing the network configurations to allow access to and from the Kubernetes VPC and across the regions. This is still a very real pain, and one we continue to address. &nbsp;

Some services do not play well in Kubernetes -- think stateful distributed databases. Luckily, we can usually migrate those to a 3rd party who will manage it for us. At the end of this migration, we will only be running pods on Kubernetes. Our infrastructure will become much simpler.

All these changes do not come for free; committing our entire infrastructure to Kubernetes means that we need to have Kubernetes experts. &nbsp;Our team has been unblocked in terms of infrastructure and they are busy adding business value through application development (as they should). However, we do not (yet) have committed engineers to stay up to date with changes to Kubernetes and cloud computing. &nbsp;

As such, we have transferred one engineer to a new “cloud platform team” and will hire a couple of others (have I mentioned [we’re hiring](http://www.sharethis.com/hiring.html)!). They will be responsible for developing tools that we can use to interface well with Kubernetes and manage all of our cloud resources. In addition, they will be working in the Kubernetes source code, part of Kubernetes SIGs, and ideally, pushing code into the open source project.

### Summary
All in all, while the move to Kubernetes initially seemed daunting, it was far less complicated and disruptive than we thought. And the reward at the other end was a company that could respond as fast as our customers wanted._Editor's note: at a recent Kubernetes meetup, the team at ShareThis gave a talk about their production use of Kubernetes. Video is embedded below._  
