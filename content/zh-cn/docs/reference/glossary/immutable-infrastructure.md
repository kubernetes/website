---
title: 不可变基础设施
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  不可变基础设施指的是一旦部署就不能变更的计算机基础设施（虚拟机、容器和网络设施）

aka: 
tags:
- architecture
---

<!--
title: Immutable Infrastructure
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed

aka: 
tags:
- architecture
-->

<!--
Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed.
-->
不可变基础设施指的是一旦部署就不能变更的计算机基础设施（虚拟机、容器和网络设施）。

<!--more-->

<!--
Immutability can be enforced by an automated process that overwrites unauthorized changes or through a system that won’t allow changes in the first place.
{{< glossary_tooltip text="Containers" term_id="container" >}} are a good example of immutable infrastructure because persistent changes to containers
can only be made by creating a new version of the container or recreating the existing container from its image.
-->
不可变性可以通过某个自动化进程或某种系统来强制执行，前者会覆盖未经授权的变更，而后者从源头上就不允许进行变更。
{{< glossary_tooltip text="容器" term_id="container" >}}是不可变基础设施的一个很好的例子，
这是因为对容器的持久变更只能通过创建新版本的容器或从其镜像重新创建现有容器来进行。

<!--
By preventing or identifying unauthorized changes, immutable infrastructures make it easier to identify and mitigate security risks. 
Operating such a system becomes a lot more straightforward because administrators can make assumptions about it.
After all, they know no one made mistakes or changes they forgot to communicate.
Immutable infrastructure goes hand-in-hand with infrastructure as code where all automation needed
to create infrastructure is stored in version control (such as Git).
This combination of immutability and version control means that there is a durable audit log of every authorized change to a system.
-->
通过防止或识别未经授权的变更，不可变基础设施可以更容易地识别和缓解安全风险。
操作此类系统变得更加简单明了，因为管理员可以对其作一些假设。
毕竟，他们可以确认没有人犯错，也没人做了变更而又忘记沟通。
不可变基础设施与基础设施即代码关系紧密，后者将所有创建基础设施所需的自动化都存储在版本控制中（如 Git）。
不可变性和版本控制的结合意味着对系统的每个经过授权的变更都会对应一个持久的审计日志记录。
