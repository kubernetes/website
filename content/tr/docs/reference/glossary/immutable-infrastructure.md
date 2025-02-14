---
title: Immutable Infrastructure
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed

aka: 
tags:
- architecture
---
 Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed.

<!--more-->

Immutability can be enforced by an automated process that overwrites unauthorized changes or through a system that won’t allow changes in the first place.
{{< glossary_tooltip text="Containers" term_id="container" >}} are a good example of immutable infrastructure because persistent changes to containers
can only be made by creating a new version of the container or recreating the existing container from its image.

By preventing or identifying unauthorized changes, immutable infrastructures make it easier to identify and mitigate security risks. 
Operating such a system becomes a lot more straightforward because administrators can make assumptions about it.
After all, they know no one made mistakes or changes they forgot to communicate.
Immutable infrastructure goes hand-in-hand with infrastructure as code where all automation needed
to create infrastructure is stored in version control (such as Git).
This combination of immutability and version control means that there is a durable audit log of every authorized change to a system.
