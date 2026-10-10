---
title: Group Version Resource
id: gvr
short_description: >
  Le groupe d’API, la version d’API et le nom d’une ressource Kubernetes.

aka: ["GVR"]
tags:
- architecture
---

Un moyen de représenter de manière unique une API Kubernetes.

<!--more-->

Les Group Version Resource (GVR) définissent le groupe d’API, la version d’API et la ressource (le nom de l’objet tel qu’il apparaît dans l’URI) utilisés pour accéder à un objet Kubernetes spécifique.

Les GVR permettent de définir et de distinguer différents objets Kubernetes, ainsi que de fournir un moyen d’y accéder de manière stable, même lorsque les API évoluent.

Dans ce contexte, le terme _resource_ désigne une ressource HTTP.  
Étant donné que certaines API sont associées à des espaces de noms (namespaces), un GVR ne correspond pas nécessairement à une ressource API spécifique.