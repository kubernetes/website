---
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
<!--The container runtime is the software that is responsible for running containers.-->
short_description: >
Container runtime - це ПО, що відповідає за запуск контейнерів.

aka:
tags:
- fundamental
- workload
---
<!--The container runtime is the software that is responsible for running containers.-->
Container runtime - це ПО, що відповідає за запуск контейнерів.

<!--more-->

<!--Kubernetes supports container runtimes such as
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
and any other implementation of the [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).-->
Kubernetes має підтримку таких Container runtime як
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
, а також інші реалізації [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).