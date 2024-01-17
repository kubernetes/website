---
title: Aggregationsschicht
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  Die Aggregationsschicht erlaubt Ihnen die Installation zusätzlicher Kubernetes-artiger APIs in Ihrem Cluster.

aka: 
tags:
- architecture
- extension
- operation
---
 Die Aggregationsschicht erlaubt Ihnen die Installation zusätzlicher Kubernetes-artiger APIs in Ihrem Cluster.

<!--more-->

Wenn Sie den {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} konfiguriert haben um [zusätzliche APIs zu unterstützen](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), können Sie `APIService` Objekte hinzufügen, um einen URL Pfad in der Kubernetes API zu "belegen".
