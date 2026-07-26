---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  Les EndpointSlices suivent les adresses IP des Pods pour les Services.

aka:
tags:
- networking
---
Les EndpointSlices suivent les adresses IP des points de terminaison backend.  
Les EndpointSlices sont généralement associés à un  
{{< glossary_tooltip text="Service" term_id="service" >}} et les points de terminaison backend représentent typiquement des  
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

<!--more-->
Un Service peut être soutenu par plusieurs Pods. Kubernetes représente les points de terminaison backend d’un Service  
à l’aide d’un ensemble d’EndpointSlices associés à ce Service.  
Les points de terminaison backend sont généralement, mais pas toujours, des pods s’exécutant dans le cluster.

Le plan de contrôle gère habituellement les EndpointSlices automatiquement. Toutefois,  
les EndpointSlices peuvent être définis manuellement pour des {{< glossary_tooltip text="Services" term_id="service" >}}  
ne spécifiant pas de {{< glossary_tooltip text="sélecteurs" term_id="selector" >}}.
