---
title: Downward API
id: downward-api
short_description: >
  Un mécanisme permettant d’exposer des informations sur le Pod et les conteneurs à une application en cours d’exécution.
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---

Un mécanisme de Kubernetes permettant d’exposer des informations sur le Pod et les conteneurs à une application exécutée dans un conteneur.

<!--more-->

Il peut être utile pour un conteneur d’avoir des informations sur lui-même sans avoir à modifier son code pour l’intégrer directement avec Kubernetes.

La Downward API permet aux conteneurs d’accéder à des informations sur leur propre contexte dans le cluster Kubernetes, sans que l’application ait besoin d’interagir directement avec l’API Kubernetes.

Il existe deux façons d’exposer ces informations à un conteneur en cours d’exécution :

- via des variables d’environnement  
- via un volume `downwardAPI`  

Ces deux mécanismes sont regroupés sous le nom de _Downward API_.