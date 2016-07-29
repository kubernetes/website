---
assignees:
- bgrant0607
- mikedanese

---


Kubernetes is an [open-source platform for automating deployment, scaling, and operations of application containers](http://www.slideshare.net/BrianGrant11/wso2con-us-2015-kubernetes-a-platform-for-automating-deployment-scaling-and-operations) across clusters of hosts, providing container-centric infrastructure.

With Kubernetes, you are able to quickly and efficiently respond to customer demand:

 - Deploy your applications quickly and predictably.
 - Scale your applications on the fly.
 - Seamlessly roll out new features.
 - Optimize use of your hardware by using only the resources you need.

Our goal is to foster an ecosystem of components and tools that relieve the burden of running applications in public and private clouds.

#### Kubernetes is:

* **portable**: public, private, hybrid, multi-cloud
* **extensible**: modular, pluggable, hookable, composable
* **self-healing**: auto-placement, auto-restart, auto-replication, auto-scaling

The Kubernetes project was started by Google in 2014. Kubernetes builds upon a [decade and a half of experience that Google has with running production workloads at scale](https://research.google.com/pubs/pub43438.html), combined with best-of-breed ideas and practices from the community.

##### Ready to [Get Started](/docs/getting-started-guides/)?

## Why containers?

Looking for reasons why you should be using [containers](http://aucouranton.com/2014/06/13/linux-containers-parallels-lxc-openvz-docker-and-more/)?

![Why Containers?](/images/docs/why_containers.svg)

The *Old Way* to deploy applications was to install the applications on a host using the operating system package manager. This had the disadvantage of entangling the applications' executables, configuration, libraries, and lifecycles with each other and with the host OS. One could build immutable virtual-machine images in order to achieve predictable rollouts and rollbacks, but VMs are heavyweight and non-portable.

The *New Way* is to deploy containers based on operating-system-level virtualization rather than hardware virtualization. These containers are isolated from each other and from the host: they have their own filesystems, they can't see each others' processes, and their computational resource usage can be bounded. They are easier to build than VMs, and because they are decoupled from the underlying infrastructure and from the host filesystem, they are portable across clouds and OS distributions.

Because containers are small and fast, one application can be packed in each container image. This one-to-one application-to-image relationship unlocks the full benefits of containers. With containers, immutable container images can be created at build/release time rather than deployment time, since each application doesn't need to be composed with the rest of the application stack, nor married to the production infrastructure environment. Generating container images at build/release time enables a consistent environment to be carried from development into production.
Similarly, containers are vastly more transparent than VMs, which facilitates monitoring and management. This is especially true when the containers' process lifecycles are managed by the infrastructure rather than hidden by a process supervisor inside the container. Finally, with a single application per container, managing the containers becomes tantamount to managing deployment of the application.

Summary of container benefits:

* **Agile application creation and deployment**:
    Increased ease and efficiency of container image creation compared to VM image use.
* **Continuous development, integration, and deployment**:
    Provides for reliable and frequent container image build and deployment with quick and easy rollbacks (due to image immutability).
* **Dev and Ops separation of concerns**:
    Create application container images at build/release time rather than deployment time, thereby decoupling applications from infrastructure.
* **Environmental consistency across development, testing, and production**:
    Runs the same on a laptop as it does in the cloud.
* **Cloud and OS distribution portability**:
    Runs on Ubuntu, RHEL, CoreOS, on-prem, Google Container Engine, and anywhere else.
* **Application-centric management**:
    Raises the level of abstraction from running an OS on virtual hardware to running an application on an OS using logical resources.
* **Loosely coupled, distributed, elastic, liberated [micro-services](http://martinfowler.com/articles/microservices.html)**:
    Applications are broken into smaller, independent pieces and can be deployed and managed dynamically -- not a fat monolithic stack running on one big single-purpose machine.
* **Resource isolation**:
    Predictable application performance.
* **Resource utilization**:
    High efficiency and density.

#### Why do I need Kubernetes and what can it do?

At a minimum, Kubernetes can schedule and run application containers on clusters of physical or virtual machines. However, Kubernetes also allows developers to 'cut the cord' to physical and virtual machines, moving from a **host-centric** infrastructure to a **container-centric** infrastructure, which provides the full advantages and benefits inherent to containers. Kubernetes provides the infrastructure to build a truly **container-centric** development environment.

Kubernetes satisfies a number of common needs of applications running in production, such as:

* [co-locating helper processes](/docs/user-guide/pods/), facilitating composite applications and preserving the one-application-per-container model,
* [mounting storage systems](/docs/user-guide/volumes/),
* [distributing secrets](/docs/user-guide/secrets/),
* [application health checking](/docs/user-guide/production-pods/#liveness-and-readiness-probes-aka-health-checks),
* [replicating application instances](/docs/user-guide/replication-controller/),
* [horizontal auto-scaling](/docs/user-guide/horizontal-pod-autoscaling/),
* [naming and discovery](/docs/user-guide/connecting-applications/),
* [load balancing](/docs/user-guide/services/),
* [rolling updates](/docs/user-guide/update-demo/),
* [resource monitoring](/docs/user-guide/monitoring/),
* [log access and ingestion](/docs/user-guide/logging/),
* [support for introspection and debugging](/docs/user-guide/introspection-and-debugging/), and
* [identity and authorization](/docs/admin/authorization/).

This provides the simplicity of Platform as a Service (PaaS) with the flexibility of Infrastructure as a Service (IaaS), and facilitates portability across infrastructure providers.

For more details, see the [user guide](/docs/user-guide/).

#### Why and how is Kubernetes a platform?

Even though Kubernetes provides a lot of functionality, there are always new scenarios that would benefit from new features. Application-specific workflows can be streamlined to accelerate developer velocity. Ad hoc orchestration that is acceptable initially often requires robust automation at scale. This is why Kubernetes was also designed to serve as a platform for building an ecosystem of components and tools to make it easier to deploy, scale, and manage applications.

[Labels](/docs/user-guide/labels/) empower users to organize their resources however they please. [Annotations](/docs/user-guide/annotations/) enable users to decorate resources with custom information to facilitate their workflows and provide an easy way for management tools to checkpoint state.

Additionally, the [Kubernetes control plane](/docs/admin/cluster-components) is built upon the same [APIs](/docs/api/) that are available to developers and users. Users can write their own controllers, [schedulers](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/scheduler.md), etc., if they choose, with [their own APIs](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/extending-api.md) that can be targeted by a general-purpose [command-line tool](/docs/user-guide/kubectl-overview/).

This [design](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/principles.md) has enabled a number of other systems to build atop Kubernetes.

#### Kubernetes is not:

Kubernetes is not a traditional, all-inclusive PaaS (Platform as a Service) system. We preserve user choice where it is important.

* Kubernetes does not limit the types of applications supported. It does not dictate application frameworks (e.g., [Wildfly](http://wildfly.org/)), restrict the set of supported language runtimes (e.g., Java, Python, Ruby), cater to only [12-factor applications](http://12factor.net/), nor distinguish "apps" from "services". Kubernetes aims to support an extremely diverse variety of workloads, including stateless, stateful, and data-processing workloads. If an application can run in a container, it should run great on Kubernetes.
* Kubernetes does not provide middleware (e.g., message buses), data-processing frameworks (e.g., Spark), databases (e.g., mysql), nor cluster storage systems (e.g., Ceph) as built-in services. Such applications run on Kubernetes.
* Kubernetes does not have a click-to-deploy service marketplace.
* Kubernetes is unopinionated in the source-to-image space. It does not deploy source code and does not build your application. Continuous Integration (CI) workflow is an area where different users and projects have their own requirements and preferences, so we support layering CI workflows on Kubernetes but don't dictate how it should work.
* Kubernetes allows users to choose the logging, monitoring, and alerting systems of their choice. (Though we do provide some integrations as proof of concept.)
* Kubernetes does not provide nor mandate a comprehensive application configuration language/system (e.g., [jsonnet](https://github.com/google/jsonnet)).
* Kubernetes does not provide nor adopt any comprehensive machine configuration, maintenance, management, or self-healing systems.

On the other hand, a number of PaaS systems run *on* Kubernetes, such as [Openshift](https://github.com/openshift/origin), [Deis](http://deis.io/), and [Gondor](https://gondor.io/). You could also roll your own custom PaaS, integrate with a CI system of your choice, or get along just fine with just Kubernetes: bring your container images and deploy them on Kubernetes.

Since Kubernetes operates at the application level rather than at just the hardware level, it provides some generally applicable features common to PaaS offerings, such as deployment, scaling, load balancing, logging, monitoring, etc. However, Kubernetes is not monolithic, and these default solutions are optional and pluggable.

Additionally, Kubernetes is not a mere "orchestration system"; it eliminates the need for orchestration. The technical definition of "orchestration" is execution of a defined workflow: do A, then B, then C. In contrast, Kubernetes is comprised of a set of independent, composable control processes that continuously drive current state towards the provided desired state. It shouldn't matter how you get from A to C: make it so. Centralized control is also not required; the approach is more akin to "choreography". This results in a system that is easier to use and more powerful, robust, resilient, and extensible.

#### What does *Kubernetes* mean? K8s?

The name **Kubernetes** originates from Greek, meaning "helmsman" or "pilot", and is the root of "governor" and ["cybernetic"](http://www.etymonline.com/index.php?term=cybernetics). **K8s** is an abbreviation derived by replacing the 8 letters "ubernete" with 8.
