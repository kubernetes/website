---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  Verwaltet eine replizierte Anwendung in Ihrem Cluster.

aka: 
tags:
- fundamental
- core-object
- workload
---
 Ein API Object, das eine replizierte Anwendung verwaltet, typischerweise durch laufende Pods ohne lokalem Zustand.

<!--more--> 

Jedes Replikat wird durch ein {{< glossary_tooltip text="Pod" term_id="pod" >}} repräsentiert, und die Pods werden auf den {{< glossary_tooltip text="Knoten" term_id="node" >}} eines Clusters verteilt. Für Arbeitslasten, die einen lokalen Zustand benötigen, sollten Sie einen {{< glossary_tooltip term_id="StatefulSet" >}} verwenden.
