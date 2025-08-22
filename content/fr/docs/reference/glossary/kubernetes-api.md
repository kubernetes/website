---
title: API Kubernetes
id: kubernetes-api
date: 2024-09-12
full_link: /fr/docs/concepts/overview/kubernetes-api/
short_description: >
  L'application qui offre les fonctionnalités de Kubernetes via une interface RESTful et stocke l'état du cluster.

aka: 
tags:
- fundamental
- architecture
---
 L'application qui offre les fonctionnalités de Kubernetes via une interface RESTful et stocke l'état du cluster.

<!--more--> 

Les ressources Kubernetes et les "enregistrements d'intention" sont tous stockés sous forme d'objets API et modifiés via des appels RESTful à l'API. L'API permet de gérer la configuration de manière déclarative. Les utilisateurs peuvent interagir directement avec l'API Kubernetes ou via des outils tels que `kubectl`. L'API principale de Kubernetes est flexible et peut également être étendue pour prendre en charge des ressources personnalisées.

