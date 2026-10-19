---
title: Modèle Operator
id: operator-pattern
full_link: /docs/concepts/extend-kubernetes/operator/
short_description: >
  Un contrôleur spécialisé utilisé pour gérer une ressource personnalisée

aka:
tags:
- architecture
---
Le [modèle Operator](/docs/concepts/extend-kubernetes/operator/) est une approche
de conception qui lie un {{< glossary_tooltip term_id="controller" >}} à une ou plusieurs ressources personnalisées.

<!--more-->

Il est possible d'étendre Kubernetes en ajoutant des contrôleurs à votre cluster, au-delà
des contrôleurs intégrés fournis avec Kubernetes.

Si une application en cours d'exécution agit comme un contrôleur et dispose d'un accès API
pour exécuter des tâches sur une ressource personnalisée définie dans le plan de contrôle,
c'est un exemple du modèle Operator.