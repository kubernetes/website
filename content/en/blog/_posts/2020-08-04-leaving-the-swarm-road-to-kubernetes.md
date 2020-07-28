---
layout: blog
title: "Leaving the Swarm: The Road to Kubernetes"
date: 2020-08-04
slug: leaving-the-swarm-road-to-kubernetes
url: /blog/2020/08/leaving-the-swarm-road-to-kubernetes
---

**Author:** [Kevin Crawley](https://twitter.com/notsureifkevin), Containous

---

> A story of how a small Nashville-based startup grew from two engineers, a server in a garage, to over one thousand customers and dozens of services running on Kubernetes in Amazon EKS.

- [Introduction](#introduction)
- [The Beginning](#the-beginning)
- [Goodbye Swarm](#goodbye-swarm)
  - [The Trepid Todos](#the-trepid-todos)
  - [Setting the Goals](#setting-the-goals)
  - [The Experiment](#the-experiment)
- [Hello Kubernetes](#hello-kubernetes)
  - [Step 1: Developers Go First](#step-1-developers-go-first)
    - [Developers. Developers. Developers.](#developers-developers-developers)
    - [What is cmdr?](#what-is-cmdr)
  - [Step 2: The Migration](#step-2-the-migration)
    - [Migrating Traefik (Ingress)](#migrating-traefik-ingress)
    - [Migrating Infrastructure](#migrating-infrastructure)
    - [Ready ... Set ... Oops ...](#ready-set-oops)
  - [Step 3: Do it Live!](#step-3-do-it-live)
- [Retrospective](#retrospective)
- [Get Involved](#get-involved)

## Introduction

In order to tell this story, we have to go back a little over three years ago, when I was asked to join [Single Music](https://singlemusic.com/) as an investor, implement a platform to build their business, and advise them on technical matters over the course of their journey. In spite of all the divisiveness around microservice architecture and complexity, this is actually a success story about how a very small team of dedicated craftspersons have built a thriving startup atop the cloud-native ecosystem.

<p align="center">
  <a href="/images/blog/2020-08-04-leaving-the-swarm-road-to-kubernetes/single-service-map.png" target="_blank"><img height="300" src="/images/blog/2020-08-04-leaving-the-swarm-road-to-kubernetes/single-service-map.png"><i><b>distributed service map - single music</i></b></a>
</p>

A short introduction about myself, I’m Kevin Crawley, Developer Advocate for [Containous](https://containo.us) - the company that created Traefik and Maesh. My goal, at both Containous and Single, is to educate and enable the technologists involved in the development of their products with modern DevOps tools and practices. Join me on our journey, and learn how the entire cloud-native ecosystem, including [Kubernetes](https://kubernetes.io/) and [Traefik](https://containo.us/traefik/), has enabled Single to empower musicians like Travis Scott, Harry Styles, Lil Peep and TOOL to reach millions of their fans with their music and artwork.

## The Beginning

In 2016, Single was still a monolithic prototype, an idea that was being formed by lifelong friends Tommy and Taylor. The concept behind Single was aimed at empowering artists to sell their own music online, having their sales recognized by major reporting systems such as [Nielsen Soundscan](https://en.wikipedia.org/wiki/MRC_Data), and their revenue being delivered directly to their pockets. I had previously worked with Taylor on a massive project to “Digitally Transform” a mortgage company by implementing what is still referred to as [12 Factor Apps](https://12factor.net/), this was before “[Cloud Native](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/definition)” became the de facto buzzword around modern application design principles.

When I was asked to join Single in April 2017 the goal was straightforward: build and implement the tools required so developers who were responsible for the product had the ability to ship and manage their applications without having a dependency on me (or anyone else for that matter), at all. Taylor and I had both been working with [SwarmKit](https://github.com/docker/swarmkit) over the past year and were comfortable with it, so that’s ultimately what was destined to become our orchestrator for the next three years.

We considered Kubernetes at the time, but there wasn’t even a certified managed cloud provider yet. The CNCF didn’t certify GKE until [late 2017](https://www.cncf.io/announcement/2017/11/13/cloud-native-computing-foundation-launches-certified-kubernetes-program-32-conformant-distributions-platforms/), and Amazon’s EKS hastily announced at re:Invent in 2017 with a GA released later in 2018, which was met with some [mixed reception](https://www.reddit.com/r/aws/comments/8osr8c/amazon_eks_is_now_ga_official_discussion_thread/). In the past 2 years, AWS has been working hard on their support of K8s and ensuring that the capabilities of the platform and user experience are [on par with its competitors](https://www.stackrox.com/post/2020/02/eks-vs-gke-vs-aks/). As a team, we didn’t regret the decision we made, and ultimately because of that decision, the move to Kubernetes was probably the easiest platform migration I’ve ever done.

## Goodbye Swarm

Before I can explain the details of the move, I should probably explain why we decided to move. Over the course of nearly four years, we had collectively built up a number of bespoke tools and processes that managed our deployments and local development environment. These were a combination of CLI and GUI based tools that delivered capabilities including a management portal used to visualize and promote services across our environments, stand up local development environments, and manage common tasks across both environments - which wasn’t even the same - our production cluster used SwarmKit, while the developers just ran their services in plain old Docker. We had tools in place to audit and ensured the network plane in Swarm was healthy, and did a number of other tasks that were specific to deploying a compose based project (parsed/injected values into templates, etc).

In addition to the patchwork tooling, we were quickly reaching a point where we will be scaling out our critical infrastructure components such as [Redis](https://redis.io/) and [RabbitMQ](https://www.rabbitmq.com/) and while Swarm is great for scaling stateless applications, it’s less than ideal for managed stateful applications. With the introduction of [Operators](https://coreos.com/operators/) and the maturity of Kubernetes, stateful clustered applications are rapidly approaching the point where they can be relied upon in production.

### The Trepid Todos

Automation around quickly tearing down our cluster and rebuilding didn’t exist. As a result, my [runbook](https://en.wikipedia.org/wiki/Runbook) was populated with several pages of manual steps required to configure the instances, join them to the swarm, secure them, and manage the careful process of standing up the tooling and the Single Music services themselves. Much of this work could have been automated but that would have required weeks of work for something that happened, at most, twice a year.

This situation wasn’t ideal, if the management plane crashed we faced being offline for eight hours doing a manual rebuild. This was a huge business risk considering Single Music now handles distribution for several new releases a month from very well-known artists. I knew we had to solve this problem at some point, but I estimated the amount of time required to be somewhere between 80-120 hours. Single Music isn’t my full-time job, and migrations like these take continuous focus-oriented work, doing it piecemeal over several months of weekends wasn’t going to cut it. 

### Setting the Goals

Before the application could be moved, I had to ensure that we could meet the development and operational requirements for our software while only building a minimal set of tools to manage daily operations. I worked with the team to set sensible benchmarks and requirements for the migration:

1) All underlying platform services and tools required to operate in the cloud **MUST** be ready to serve our production applications, from scratch, in less than 1 hour.
2) The local development environment **MUST** be served using a platform capable of using exactly the same manifest, tools, along with compatible or identical infrastructure components, in addition to being fully configured / operational in 15 minutes or less.
3) Any bespoke tools used to promote and manage deployments **MUST** be used for local operations in addition to our continuous deployment systems.

This was an experiment at the core, while I was relatively confident we could meet these goals, I wasn’t sure how long it was going to take. Using Kubernetes was the obvious choice since our build tooling, applications, and architecture were already cloud-native compatible. Based on my experience building Kubernetes workshops and demos, I had confidence that I could meet the other goals with some help from the rest of the development team.

### The Experiment

Lifting and shifting applications aren’t nearly as easy some vendors might make it out to seem, but we had a few cards up our sleeves. We were already utilizing consistent patterns and tools across all of our applications, all of which fit well into the cloud-native ecosystem. I’ll list below for reference:

* [Maven](https://maven.apache.org) | [Fabric8](https://github.com/fabric8io/docker-maven-plugin) -- Consistent build patterns across all our apps, even non-Java apps, version management, testing, etc.
* [Gitlab](https://about.gitlab.com/stages-devops-lifecycle/) | [GitlabCI](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/) -- All of our applications were designed to be continuously built, with our images tagged, pushed into a docker image registry, and deployed into a pre-production environment.

The next phase was determining the tools which we were going to use to manage the lifecycle of our application, including deploying the platform itself, our services, and how we were going to monitor it. We settled on the following tools:

* [Helm](https://helm.sh/) - Pre-existing production-ready manifests for our back-end services, and I had experience already building charts for workshops and tutorials. Mature community and widely adopted, this enabled us to create a single universal chart for all our distributed applications and utilize community charts for our scalable backend components.
* [eksctl](https://eksctl.io/) - While not as flexible as kops, or writing your own cloud formation (yikes), this tool worked on the first pass and met our initial requirements for setting up our production cluster automatically.
* [kind](https://github.com/kubernetes-sigs/kind) - Well suited for local development and testing, this was a lightweight solution to creating disposable K8s environments required for local development without the dependency on large and slow VMs.
* [Kontena Lens](https://github.com/lensapp/lens) - A visualization tool for Kubernetes, this app was perfectly suited to handle managing our services and back-end components running in K8s locally and in the cloud. This replaced one of the bespoke tools we had built internally for Swarm which was handling most of the functions available in Lens, such as quick access to status, exec, log, and configuration details of the workloads.

## Hello Kubernetes

I’d been laid off from my full-time job at the end of March 2020 due to the projected economic impact of COVID-19. I decided it was now the time, as I had anticipated having trouble finding a new job in this economic hailstorm. Fortunately, Containous and I found each other, and within a week of being laid off, I was set to start an awesome new role. However, before I could start, I was determined to complete this migration, so let’s jump in.

### Step 1: Developers Go First

#### Developers. Developers. Developers.

It was important that the developers have an environment as close to what’s going to run in production as possible. Up until this point, they had been relying on `fabric8-maven-plugin` to boot up applications on their local docker network - which wasn’t even close to how we were running the same applications in the cloud. I knew that for this to work there had to be a fast local environment that was as close as possible to deploying to the new platform. The tooling I eventually built here would be used to stand up not only to local environments but our cloud stack as well.

Running your own Kubernetes cluster on your laptop isn’t exactly lightweight. We needed a solution that didn’t involve a VM or additional cloud resources. I also needed something that was lightweight, easily torn down and reconfigured, and worked on WSL2 (my environment) and Linux (the other Devs + our CI). 

Hello there, kind. [Kubernetes-IN-Docker](https://github.com/kubernetes-sigs/kind), who'da thunk it? This project, originally built to handle continuous integration testing for Kubernetes, was well suited to our requirements. I wanted our developers to go from scratch to a fully working application stack of over 20 services and accompanying infrastructure components in less than 15 minutes. In addition, deploying a new build needed to take seconds.

#### What is cmdr?

In order to manage the bootstrap process of standing up the local environment, I created a Python application, `cmdr`, that handles configuring kind, installing [Traefik](https://traefik.io), [MetalLB](https://metallb.universe.tf/), and deploying our infrastructure, application, and UI components through [Helm](https://helm.sh). We had already standardized how we name, build, and configure our services so everything was already abstracted and DRY - which makes creating new services fairly painless for the developers on the Single Music team. 

In addition to the local bootstrap, I created a `deploy` command accepting a project name, which is referenced inside an over-arching `projects.yaml` file, which then extracts environment-specific details (ingress endpoints, environment configuration) to apply to the correlating helm chart for that project. We use several open-source helm charts for infrastructure components such as MySQL, Postgres, Redis, RabbitMQ, and Confluent Cloud (Kafka). The deploy command also accepts env flags, image tags, application versions, all of which configure metadata and chart specific version tags which help us track application versions across our environments in EKS.

The developers also built a command `promote` that promotes applications from our staging environment through a GitLab pipeline (our CI is the only agent capable of deploying to our cluster). At this point, we were ready to stand up our service in the cloud running on a managed Kubernetes environment. We chose Amazon EKS as we were already running in that provider and had just purchased several thousand dollars worth of reserved instances. We also store all of our customers’ music securely in S3 and depend on their other data services, such as Redshift, and RDS, already. Vendor lock-in is real, y’all.

The `cmdr` tool has been [released](https://github.com/notsureifkevin/cmdr) for anyone to use on their own projects, as I’ll be using it for workshops and demos in the future.

### Step 2: The Migration

Single Music processes roughly 1.5 million transactions every day. Having an extended or failed migration would be a disaster. In addition to building the environment developers could work in, we had to ensure that we were using compatible infrastructure components as well -- which included upgrading from [Traefik 1.7 to 2.2](https://docs.traefik.io/migration/v1-to-v2/), leveraging their [new CRDs](https://docs.traefik.io/v2.0/reference/dynamic-configuration/kubernetes-crd/), and utilizing the Bitnami [Redis](https://github.com/bitnami/charts/tree/master/bitnami/redis) and [RabbitMQ](https://github.com/bitnami/charts/tree/master/bitnami/rabbitmq) charts so our caching and messaging systems are in a position to be scalable and highly available in the not-so-distant future.

#### Migrating Traefik (Ingress)

While continuing to operate using Traefik 1.7 and the “official/stable” helm chart would have worked, this didn’t make sense for three reasons:

1) Traefik 1.7 support is scheduled to [end in 2021](https://github.com/containous/traefik/issues/5475#issuecomment-594883941).
2) Traefik 2.x introduced [modern concepts](https://docs.traefik.io/migration/v1-to-v2/#frontends-and-backends-are-dead-long-live-routers-middlewares-and-services) such as services, routers, and middleware, and the new helm chart leverages CRDs which helps reduce annotation clutter. In addition they are introducing [Traefik Plugins](https://containo.us/blog/introducing-traefik-pilot-a-first-look-at-our-new-saas-control-platform-for-traefik/) so users can now create their own middleware.
3) Containous is in the [process of moving](https://github.com/containous/traefik-helm-chart/pull/104) from “stable” as the officially supported chart, as are many other maintainers since [it’s being deprecated](https://github.com/helm/charts#deprecation-timeline) at the end of this year (2020).

We also recognized that the migration from 1.7 to 2.x required a new approach to configuration and since we were already migrating from Swarm to Kubernetes we should just go ahead and go with the latest version now.

With the upgrade, we had the option of leveraging the existing Kubernetes Ingress pattern along with annotations or leverage CRDs -- for us, it made sense to use the CRD option as it reduced the clutter of adding and managing a slew of conditional annotations in our manifests.

#### Migrating Infrastructure

Prior to Kubernetes, we used single instances of [Redis](https://redis.io/) to handle caching and locking concerns, and [RabbitMQ](https://www.rabbitmq.com/) for async task queuing. At some point in the next year or two, our workload will require scaling those technologies out just to handle our projected transactional load. We are ramping up our analytics platform as well and have begun implementing [Kafka](https://kafka.apache.org/) and [Redshift](https://aws.amazon.com/redshift/) for that project.

Our production workloads completely rely on managed services for our transactional datastores (RDS, Redshift, Kafka), but our non-production environments leverage the open-source equivalents. Moving to Kubernetes means having the option of leveraging operators for those technologies when we will eventually have to handle scaling out RabbitMQ and Redis in production, as well as giving our non-production environments operational equivalents for our transactional components. We had no trouble implementing the bitnami charts for RabbitMQ and Redis while using the official [confluent helm chart](https://github.com/confluentinc/cp-helm-charts) for Kafka.

We haven’t begun scaling out those components yet, but the pieces are in place for us to begin experimenting with them locally first, then eventually moving to high availability in production. Having both the commercial and community support for this capability didn’t exist without first moving to Kubernetes.

#### Ready ... Set ... Oops ...

We had met our benchmarks for the development environment, had managed to stand up our platform in staging on EKS, and had successfully migrated our critical infrastructure components and worked out some kinks we’d found.

One notable issue we’d discovered was when we capture user geo-location data the service began to fail when processing the transaction. Modern load balancers generate an `X-Forwarded-For` header that allows the destination service to authenticate the transaction by validating the subnets of the proxies in the request chain, but it’s also the source of truth for our reporting system. At first, we just simply assigned the cause of the missing header to the oddities of Metallb and the local environment, but we quickly discovered the issue was also present in the staging environment in EKS, in what was eventually going to be our production environment.

Ensuring our clients have accurate reporting data on their customer’s purchases was a non-negotiable. The migration was blocked until we could determine the issue. Fortunately, my entire DevOps career is in reality just having random luck when searching on Google, and I discovered what was most likely causing [the issue](https://github.com/spring-projects/spring-boot/issues/19333). The most recent version of Spring Boot had introduced a behavioral change where the runtime was detecting that it was being run on Kubernetes and simply deleting the header, which caused our service to fail when trying to read the value of that key. 

### Step 3: Do it Live!

Once we had the cluster configured and all workloads confirmed as operational on our staging environment, the actual move was straightforward. Since our service is entirely webhook and message-based, we could let the queues drain and switch the workload once the database had been moved. We anticipated the move to take no more than 30 minutes, and in three stages:

1) Our critical infrastructure components such as Traefik, Redis, and RabbitMQ were already running in the production namespace. We proceeded to stand up our landing service running in maintenance mode and pointed all our A records in Route 53 to the new ALB that had registered the aforementioned Traefik service. Any requests would be answered with a 503 maintenance page.
2) This allowed the queues to drain on our Swarm cluster, at which point we stopped all production services in Swarm and began moving the RDS instance to the new VPC. We had no idea how long this would take, and it ended up taking the majority time required to make the move. Once the database was in the new VPC and we verified connectivity within the cluster and moved onto the next step.
3) We began the process of turning on services and turning off maintenance mode. We launched our event dispatcher, which handles incoming webhooks, along with our UI services and APIs. Once we confirmed work was being queued, we stood up our fulfillment services and kept an eye on our infrastructure metrics and trace telemetry using our APM provider DataDog for trouble.

After a few hours, we hadn’t noticed any issues, and all indications were pointing to a very successful and dumpster fire-less migration.

<p align="center">
  <a href="/images/blog/2020-08-04-leaving-the-swarm-road-to-kubernetes/lens-deployments.png" target="_blank"><img height="300" src="/images/blog/2020-08-04-leaving-the-swarm-road-to-kubernetes/lens-deployments.png"><i><b>it's alive - single music on kubernetes (28 deployments / 57 pods in production)</i></b></a>
</p>

## Retrospective

The entire migration process took roughly three weeks. This wouldn’t have been possible without the support of the developers on our team. They provided constant feedback while having their daily work disrupted as they moved to a new platform for development and tolerated the inconvenience which arises out of using and adapting to new tools. Overall, the migration to Kubernetes was a resounding success for Single Music. We addressed major risks to the operation of the business, increased our reliability, resiliency, and capacity for growth while reducing the development and operational cost of that growth at the same time.

Without open source projects like Kubernetes, Helm, Traefik, and others, a project like this would require significantly more engineers and complexity at the scale we’re operating today. Many thanks to the team at Docker for building SwarmKit as the initial platform we launched on and gave us the support, experience, and practices which enabled us to move effortlessly to Kubernetes. We are grateful for the community and the tools that have given us the opportunity to build a service that can help both small indie artists and some of the largest acts in the world bring their creations to their audience directly.

## Get Involved

While there are a number of critical components in our stack, one of which has been there from the beginning is Traefik. Both a member of the CNCF and being Open Source there are a number of different ways to get involved with the Traefik community and learn more about the products and solutions built at Containous:

* Engage with other Traefik users and developers on our [Community Forums](https://community.containo.us/)
* Contribute to various Containous projects on our [Github Repository](https://github.com/containous)
* Learn more about how Traefik empowers developers with flexible and easy to use [Kubernetes Ingress](https://containo.us/solutions/kubernetes-ingress/)

You can always find our Traefik Ambassadors and maintainers on the community forums including myself, or you may contact me directly via email [kevin.crawley@containo.us](mailto:kevin.crawley@containo.us) or via [Twitter](https://twitter.com/notsureifkevin).

