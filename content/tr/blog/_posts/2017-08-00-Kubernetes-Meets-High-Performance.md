---
title: " Kubernetes Meets High-Performance Computing "
date: 2017-08-22
slug: kubernetes-meets-high-performance
url: /blog/2017/08/Kubernetes-Meets-High-Performance
author: >
   Robert Lalonde (Univa) 
---

Anyone who has worked with Docker can appreciate the enormous gains in efficiency achievable with containers. While Kubernetes excels at orchestrating containers, high-performance computing (HPC) applications can be tricky to deploy on Kubernetes.

In this post, I discuss some of the challenges of running HPC workloads with Kubernetes, explain how organizations approach these challenges today, and suggest an approach for supporting mixed workloads on a shared Kubernetes cluster. We will also provide information and links to a case study on a customer, IHME, showing how Kubernetes is extended to service their HPC workloads seamlessly while retaining scalability and interfaces familiar to HPC users.

## HPC workloads unique challenges

In Kubernetes, the base unit of scheduling is a Pod: one or more Docker containers scheduled to a cluster host. Kubernetes assumes that workloads are containers. While Kubernetes has the notion of [Cron Jobs](/docs/concepts/workloads/controllers/cron-jobs/) and [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) that run to completion, applications deployed on Kubernetes are typically long-running services, like web servers, load balancers or data stores and while they are highly dynamic with pods coming and going, they differ greatly from HPC application patterns.

Traditional HPC applications often exhibit different characteristics:

- In financial or engineering simulations, a job may be comprised of tens of thousands of short-running tasks, demanding low-latency and high-throughput scheduling to complete a simulation in an acceptable amount of time.
- A computational fluid dynamics (CFD) problem may execute in parallel across many hundred or even thousands of nodes using a message passing library to synchronize state. This requires specialized scheduling and job management features to allocate and launch such jobs and then to checkpoint, suspend/resume or backfill them.
- Other HPC workloads may require specialized resources like GPUs or require access to limited software licenses. Organizations may enforce policies around what types of resources can be used by whom to ensure projects are adequately resourced and deadlines are met.

HPC workload schedulers have evolved to support exactly these kinds of workloads. Examples include [Univa Grid Engine](http://www.univa.com/products/), [IBM Spectrum LSF](https://www-03.ibm.com/systems/spectrum-computing/products/lsf/) and Altair’s [PBS Professional](http://www.pbsworks.com/PBSProduct.aspx?n=PBS-Professional&c=Overview-and-Capabilities). Sites managing HPC workloads have come to rely on capabilities like array jobs, configurable pre-emption, user, group or project based quotas and a variety of other features.  

## Blurring the lines between containers and HPC

HPC users believe containers are valuable for the same reasons as other organizations. Packaging logic in a container to make it portable, insulated from environmental dependencies, and easily exchanged with other containers clearly has value. However, making the switch to containers can be difficult.

HPC workloads are often integrated at the command line level. Rather than requiring coding, jobs are submitted to queues via the command line as binaries or simple shell scripts that act as wrappers. There are literally hundreds of engineering, scientific and analytic applications used by HPC sites that take this approach and have mature and certified integrations with popular workload schedulers.

While the notion of packaging a workload into a Docker container, publishing it to a registry, and submitting a YAML description of the workload is second nature to users of Kubernetes, this is foreign to most HPC users. An analyst running models in R, MATLAB or Stata simply wants to submit their simulation quickly, monitor their execution, and get a result as quickly as possible.

## Existing approaches

To deal with the challenges of migrating to containers, organizations running container and HPC workloads have several options:

- Maintain separate infrastructures

For sites with sunk investments in HPC, this may be a preferred approach. Rather than disrupt existing environments, it may be easier to deploy new containerized applications on a separate cluster and leave the HPC environment alone. The challenge is that this comes at the cost of siloed clusters, increasing infrastructure and management cost.

- Run containerized workloads under an existing HPC workload manager

For sites running traditional HPC workloads, another approach is to use existing job submission mechanisms to launch jobs that in turn instantiate Docker containers on one or more target hosts. Sites using this approach can introduce containerized workloads with minimal disruption to their environment. Leading HPC workload managers such as [Univa Grid Engine Container Edition](http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/) and [IBM Spectrum LSF](http://blogs.univa.com/2016/05/new-version-of-univa-grid-engine-now-supports-docker-containers/) are adding native support for Docker containers. [Shifter](https://github.com/NERSC/shifter) and [Singularity](http://singularity.lbl.gov/) are important open source tools supporting this type of deployment also. While this is a good solution for sites with simple requirements that want to stick with their HPC scheduler, they will not have access to native Kubernetes features, and this may constrain flexibility in managing long-running services where Kubernetes excels.

- Use native job scheduling features in Kubernetes

Sites less invested in existing HPC applications can use existing scheduling facilities in Kubernetes for [jobs that run to completion](/docs/concepts/workloads/controllers/jobs-run-to-completion/). While this is an option, it may be impractical for many HPC users. HPC applications are often either optimized towards massive throughput or large scale parallelism. In both cases startup and teardown latencies have a discriminating impact. Latencies that appear to be acceptable for containerized microservices today would render such applications unable to scale to the required levels.

All of these solutions involve tradeoffs. The first option doesn’t allow resources to be shared (increasing costs) and the second and third options require customers to pick a single scheduler, constraining future flexibility.

## Mixed workloads on Kubernetes

A better approach is to support HPC and container workloads natively in the same shared environment. Ideally, users should see the environment appropriate to their workload or workflow type.

One approach to supporting mixed workloads is to allow Kubernetes and the HPC workload manager to co-exist on the same cluster, throttling resources to avoid conflicts. While simple, this means that neither workload manager can fully utilize the cluster.

Another approach is to use a peer scheduler that coordinates with the Kubernetes scheduler. Navops Command by Univa is a solution that takes this third approach, augmenting the functionality of the Kubernetes scheduler. Navops Command provides its own web interface and CLI and allows additional scheduling policies to be enabled on Kubernetes without impacting the operation of the Kubernetes scheduler and existing containerized applications. Navops Command plugs into the Kubernetes architecture via the 'schedulerName' attribute in the pod spec as a peer scheduler that workloads can choose to use instead of the Kubernetes stock scheduler as shown below.

 ![Screen Shot 2017-08-15 at 9.15.45 AM.png](https://lh6.googleusercontent.com/nKTtfQVVmL4qBoSR0lBmBuLt8KOrVEyjn9YcAu7hrhhV-rwnxRY3p-Y5Qfddf7BI6u1KN85VKfeaaU74xDl-oDk5NzybdIxAp0SJ42x14gwzpmwLwjVy5nIng6K8Ih-bRDlOmA9j)

With this approach, Kubernetes acts as a resource manager, making resources available to a separate HPC scheduler. Cluster administrators can use a visual interface to allocate resources based on policy or simply drag sliders via a web UI to allocate different proportions of the Kubernetes environment to non-container (HPC) workloads, and native Kubernetes applications and services.

 ![](https://lh6.googleusercontent.com/wSBBl5d-YL4_UCYgvHpE_XzijtqftSi6PTHJLGfHr5nAxmTj945jQB-pMNIGLovWwKWGnEsPjCkCPrUMWZEs9UHnQPPDSWPEl-Gl76Yczd-Yn65pEE8mKC-Asj3zP5xyfZc-r2qU-YmmOyBhLQ)

From a client perspective, the HPC scheduler runs as a service deployed in Kubernetes pods, operating just as it would on a bare metal cluster. Navops Command provides additional scheduling features including things like resource reservation, run-time quotas, workload preemption and more. This environment works equally well for on-premise, cloud-based or hybrid deployments.

## Deploying mixed workloads at IHME

One client having success with mixed workloads is the Institute for Health Metrics & Evaluation (IHME), an independent health research center at the University of Washington. In support of their globally recognized Global Health Data Exchange (GHDx), IHME operates a significantly sized environment comprised of 500 nodes and 20,000 cores running a mix of analytic, HPC, and container-based applications on Kubernetes. [This case study](http://navops.io/ihme-case-study.html) describes IHME’s success hosting existing HPC workloads on a shared Kubernetes cluster using Navops Command.

 ![](https://lh5.googleusercontent.com/GJeP6e89r6drl72yzZM_OsZ81MYDp7Zm5xEFpItpmioian3lOp535H4jy1_eELKrzGMYr_wnjGwpK3Uku9dwg2-vqmMC1A1GrMtJc-PZR6GR6Z-fAZNJMEr_Uw3HqvWvi86mF_63XTozysaLpg)

For sites deploying new clusters that want access to the rich capabilities in Kubernetes but need the flexibility to run non-containerized workloads, this approach is worth a look. It offers the opportunity for sites to share infrastructure between Kubernetes and HPC workloads without disrupting existing applications and businesses processes. It also allows them to migrate their HPC workloads to use Docker containers at their own pace.
