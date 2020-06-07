---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  Agent, który działa na każdym węźle klastra. Odpowiada za uruchamianie kontenerów w ramach poda.

aka: 
tags:
- fundamental
- core-object
---
 Agent, który działa na każdym {{< glossary_tooltip text="węźle" term_id="node" >}} klastra. Odpowiada za uruchamianie {{< glossary_tooltip text="kontenerów" term_id="container" >}} w ramach {{< glossary_tooltip text="poda" term_id="pod" >}}.

<!--more-->

Kubelet korzysta z dostarczanych na różne sposoby PodSpecs i gwarantuje, że kontenery opisane przez te PodSpecs są uruchomione i działają poprawnie. Kubelet nie zarządza kontenerami, które nie zostały utworzone przez Kubernetes.
