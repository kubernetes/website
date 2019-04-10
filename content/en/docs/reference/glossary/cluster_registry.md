title: Cluster Registry
 id: cluster-registry
 full-link: /docs/concepts/workloads/pods/cluster_registry/
 tags:
  - extension
  - tool
 short_description: >
   A Kubernetes-style API that provides an endpoint for interacting with a list of clusters and associated metadata.
 
 long-description: >
   A lightweight tool that maintains a list of {% glossary_tooltip text="Clusters" term_id="cluster" %} and their associated metadata. The API is defined as a {% glossary_tooltip text="Custom Resource Definition" term_id="customresourcedefinition" %}. The intent is provide a common abstraction for other tools that perform operations on multiple {% glossary_tooltip text="Clusters" term_id="cluster" %}.

