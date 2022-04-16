---
title: Dockershim
id: dockershim
date: 2022-04-15
Either omit the `full_link`, or change it to `/dockershim`.
short_description: >
   A component of Kubernetes v1.23 and earlier, which allows Kubernetes system components to communicate with Docker Engine.

aka:
tags:
- fundamental
---
The dockershim is a component of Kubernetes version 1.23 and earlier. It allows the kubelet
to communicate with {{< glossary_tooltip text="Docker Engine" term_id="docker" >}}.

<!--more-->

Starting with version 1.24, dockershim has been removed from Kubernetes. For more information, see [Dockershim FAQ](/dockershim).
