---
title: Políticas do escalonador
content_type: concept
sitemap:
  priority: 0.2 # Scheduling priorities are deprecated
---

<!-- overview -->

Nas versões anteriores à v1.23 do Kubernetes, a política do escalonador pode ser usada para especificar os processos *predicates* e *priorities*. Por exemplo, você pode definir a política de escalonador rodando os seguintes comandos:
```
 `kube-scheduler --policy-config-file <filename>` 

 ou

  `kube-scheduler --policy-configmap <ConfigMap>`.
 ```

Essa política escalonadora não é compatível desde a v1.23 do Kubernetes. Flags associadas `policy-config-file`, `policy-configmap`, `policy-configmap-namespace` e `use-legacy-policy-config` também não são compatíveis. Em vez disso, veja [Scheduler Configuration](/docs/reference/scheduling/config/) para conseguir um comportamento similar.

## {{% heading "whatsnext" %}}

* Descubra mais sobre [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Descubra mais sobre [kube-scheduler Configuration](/docs/reference/scheduling/config/)
* Leia [kube-scheduler configuration reference (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)