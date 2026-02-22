---
title: Runtime Container
id: container-runtime
date: 2019-06-05
full_link: /id/docs/setup/production-environment/container-runtimes
short_description: >
 _Runtime_ Container adalah perangkat lunak yang bertanggung jawab untuk menjalankan Container.
aka:
tags:
- fundamental
- workload
---
_Runtime_ Container adalah perangkat lunak yang bertanggung jawab untuk menjalankan Container.

<!--more-->

Kubernetes mendukung beberapa _runtime_ Container: {{< glossary_tooltip term_id="docker">}}, {{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}}, dan implementasi apapun dari [Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
