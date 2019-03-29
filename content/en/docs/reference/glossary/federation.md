title: Federation
id: federation
full-link: /docs/concepts/workloads/pods/federation/
tags:
 - architecture
 - operation
 - workload
short_description: >
  The ability to distribute Kubernetes resources to multiple {% glossary_tooltip text="Clusters" term_id="cluster" %} using a single API.

long-description: >  
  All {% glossary_tooltip text="Clusters" term_id="cluster" %} managed using [Federation](https://kubernetes.io/docs/concepts/cluster-administration/federation/) are maintained in a {% glossary_tooltip text="Cluster Registry" term_id="cluster registry" %}. {% glossary_tooltip text="Clusters" term_id="cluster" %} within the registry are then managed using a Federation controller along with external DNS resource records for [Ingress](/docs/concepts/services-networking/ingress/) and [Service](/docs/concepts/services-networking/service/) objects.  
  
