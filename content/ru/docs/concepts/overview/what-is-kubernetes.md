---
reviewers:
- bgrant0607
- mikedanese
title: Что такое Kubernetes
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 10
---

{{% capture overview %}}
На этой странице обзор Kubernetes.
{{% /capture %}}

{{% capture body %}}
Kubernetes - это портативная, расширяемая платформа с открытым исходным кодом для управления контейниризированной рабочей нагрузкой и сервисами, обеспечивающая одновременно декларативному конфигурированию и автоматизации. Для Kubernetes есть постоянно развивающаяся, большая экосистема. Сервисы Kubernetes, поддержка и инструменты широко доступны.

Google открыл доступ к исходному коду Kubernetes в 2014 году. Kubernetes создан после [полутора десятилетий опыта, который Google обрёл при работе с масштабированием рабочей нагрузки](https://research.google.com/pubs/pub43438.html), объединённым с лучшими идеями и практиками комьюнити.

## Зачем мне Kubernetes и что можно сделать с его помощью

В Kubernetes реализовано большое количество возможностей. Можно обобщить их следующим образом:

- платформа для контейнеров
- платформа для микросервисов
- портативная облачная платформа
а также многое другое.

Kubernetes предоставляет **контейнеро-ориентированное** окружение для управления. Оно оркестрирует вычислительную и сетевую инфраструктуру, а также инфраструктуру хранения от имени рабочей нагрузки от пользователей. Это позволяет добиться большей простоты Платформы как сервиса (PaaS) не теряя гибкости Инфраструктуры как сервиса (IaaS), а также даёт возможность портативности среди поставщиков инфраструктуры. 

## Почему Kubernetes это платформа

Не смотря на то, что Kubernetes предоставляет большой спектр возможностей, всегда есть сценарии, требующие новых функций. Последовательности действий, специфичные для конкретного приложения, могут быть оптимизированны для ускорения скорости разработки. Специализированная оркестрация, которая вначале подходила, при масштабировании может требовать надёжной автоматизации. По этим причинам Kubernetes создавался как платформа для создания экосистемы из компонентов и инструментов для облегчения развёртывания, масштабирования и управления приложениями.

[Лейблы](/docs/concepts/overview/working-with-objects/labels/) позволяют пользователям организовывать ресурсы по собственному желанию. [Аннотации](/docs/concepts/overview/working-with-objects/annotations/)
дают возможность пользователям сопровождать ресурсы дополнительной информацией, чтобы упростить их рабочие процессы и предоставить простой способ управления инструментами для проверки состояния.

Также [панель управления Kubernetes](/docs/concepts/overview/components/) построена на том же [API](/docs/reference/using-api/api-overview/), которое доступно разработчикам и пользователям. Пользователи могут сами разрабатывать контролдеры, например [планировщики](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/scheduler.md), [с собственным 
API](/docs/concepts/api-extension/custom-resources/), которые могут быть предназначены для [инструментов командной строки](/docs/user-guide/kubectl-overview/) общего назначения.

Такая 
[конструкция](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md)
позволила создать несколько других систем на базе Kubernetes.

## What Kubernetes is not

Kubernetes is not a traditional, all-inclusive PaaS (Platform as a
Service) system. Since Kubernetes operates at the container level
rather than at the hardware level, it provides some generally
applicable features common to PaaS offerings, such as deployment,
scaling, load balancing, logging, and monitoring. However, Kubernetes
is not monolithic, and these default solutions are optional and
pluggable. Kubernetes provides the building blocks for building developer
platforms, but preserves user choice and flexibility where it is
important.

Kubernetes:

* Does not limit the types of applications supported. Kubernetes aims
  to support an extremely diverse variety of workloads, including
  stateless, stateful, and data-processing workloads. If an
  application can run in a container, it should run great on
  Kubernetes.
* Does not deploy source code and does not build your
  application. Continuous Integration, Delivery, and Deployment
  (CI/CD) workflows are determined by organization cultures and preferences
  as well as technical requirements.
* Does not provide application-level services, such as middleware
  (e.g., message buses), data-processing frameworks (for example,
  Spark), databases (e.g., mysql), caches, nor cluster storage systems (e.g.,
  Ceph) as built-in services. Such components can run on Kubernetes, and/or
  can be accessed by applications running on Kubernetes through portable
  mechanisms, such as the Open Service Broker.
* Does not dictate logging, monitoring, or alerting solutions. It provides
  some integrations as proof of concept, and mechanisms to collect and
  export metrics.
* Does not provide nor mandate a configuration language/system (e.g.,
  [jsonnet](https://github.com/google/jsonnet)). It provides a declarative
  API that may be targeted by arbitrary forms of declarative specifications.
* Does not provide nor adopt any comprehensive machine configuration,
  maintenance, management, or self-healing systems.

Additionally, Kubernetes is not a mere *orchestration system*. In
fact, it eliminates the need for orchestration. The technical
definition of *orchestration* is execution of a defined workflow:
first do A, then B, then C. In contrast, Kubernetes is comprised of a
set of independent, composable control processes that continuously
drive the current state towards the provided desired state. It
shouldn't matter how you get from A to C. Centralized control is also
not required. This results in a system that is easier to use and more
powerful, robust, resilient, and extensible.

## Why containers

Looking for reasons why you should be using containers?

![Why Containers?](/images/docs/why_containers.svg)

The *Old Way* to deploy applications was to install the applications
on a host using the operating-system package manager. This had the
disadvantage of entangling the applications' executables,
configuration, libraries, and lifecycles with each other and with the
host OS. One could build immutable virtual-machine images in order to
achieve predictable rollouts and rollbacks, but VMs are heavyweight
and non-portable.

The *New Way* is to deploy containers based on operating-system-level
virtualization rather than hardware virtualization. These containers
are isolated from each other and from the host: they have their own
filesystems, they can't see each others' processes, and their
computational resource usage can be bounded. They are easier to build
than VMs, and because they are decoupled from the underlying
infrastructure and from the host filesystem, they are portable across
clouds and OS distributions.

Because containers are small and fast, one application can be packed
in each container image. This one-to-one application-to-image
relationship unlocks the full benefits of containers. With containers,
immutable container images can be created at build/release time rather
than deployment time, since each application doesn't need to be
composed with the rest of the application stack, nor married to the
production infrastructure environment. Generating container images at
build/release time enables a consistent environment to be carried from
development into production.  Similarly, containers are vastly more
transparent than VMs, which facilitates monitoring and
management. This is especially true when the containers' process
lifecycles are managed by the infrastructure rather than hidden by a
process supervisor inside the container. Finally, with a single
application per container, managing the containers becomes tantamount
to managing deployment of the application.

Summary of container benefits:

* **Agile application creation and deployment**:
    Increased ease and efficiency of container image creation compared to VM image use.
* **Continuous development, integration, and deployment**:
    Provides for reliable and frequent container image build and
    deployment with quick and easy rollbacks (due to image
    immutability).
* **Dev and Ops separation of concerns**:
    Create application container images at build/release time rather
    than deployment time, thereby decoupling applications from
    infrastructure.
* **Observability**
    Not only surfaces OS-level information and metrics, but also application
    health and other signals.
* **Environmental consistency across development, testing, and production**:
    Runs the same on a laptop as it does in the cloud.
* **Cloud and OS distribution portability**:
    Runs on Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine, and anywhere else.
* **Application-centric management**:
    Raises the level of abstraction from running an OS on virtual
    hardware to running an application on an OS using logical resources.
* **Loosely coupled, distributed, elastic, liberated [micro-services](https://martinfowler.com/articles/microservices.html)**:
    Applications are broken into smaller, independent pieces and can
    be deployed and managed dynamically -- not a monolithic stack
    running on one big single-purpose machine.
* **Resource isolation**:
    Predictable application performance.
* **Resource utilization**:
    High efficiency and density.

## What Kubernetes and K8s mean

The name **Kubernetes** originates from Greek, meaning *helmsman* or
*pilot*, and is the root of *governor* and
[cybernetic](http://www.etymonline.com/index.php?term=cybernetics). *K8s*
is an abbreviation derived by replacing the 8 letters "ubernete" with
"8".

{{% /capture %}}

{{% capture whatsnext %}}
*   Ready to [Get Started](/docs/setup/)?
*   For more details, see the [Kubernetes Documentation](/docs/home/).
{{% /capture %}}


