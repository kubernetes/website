---
title: Ressource API
id: api-resource
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Une entité Kubernetes représentant un point d’accès sur le serveur API Kubernetes.

aka:
 - Resource
tags:
- architecture
---

Une entité dans le système de types de Kubernetes, correspondant à un point d’accès sur l’API Kubernetes.

Une ressource représente généralement un objet.

Certaines ressources représentent des opérations sur d’autres objets, comme par exemple une vérification de permissions.

<!--more-->

Chaque ressource correspond à un endpoint HTTP (URI) sur le serveur API Kubernetes et définit le schéma des objets ou des opérations associées à cette ressource.