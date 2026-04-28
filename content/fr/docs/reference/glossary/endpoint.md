---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: /docs/concepts/services-networking/service/#endpoints
short_description: >
  (Déprécié) API représentant les points de terminaison d’un Service

tags:
- networking
---
Une API dépréciée qui représente l’ensemble des points de terminaison d’un  
{{< glossary_tooltip text="Service" term_id="service" >}}.

<!--more-->

Depuis la version 1.21, Kubernetes utilise les  
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}  
plutôt que les Endpoints ; l’API Endpoints originale a été dépréciée en raison  
de problèmes de scalabilité.

Pour en savoir plus sur les Endpoints, consultez [Endpoints](/docs/concepts/services-networking/service/#endpoints).
