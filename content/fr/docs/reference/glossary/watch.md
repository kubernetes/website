---
title: Watch
id: watch
full_link: /docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  Verbe utilisé pour suivre les modifications d’un objet dans Kubernetes sous forme de flux.

aka:
tags:
- API verb
- fundamental
---

Verbe utilisé pour suivre les modifications d’un objet dans Kubernetes sous forme de flux.
Il permet de détecter efficacement les changements.

<!--more-->

Verbe utilisé pour suivre les modifications d’un objet dans Kubernetes sous forme de flux. Les watches permettent
une détection efficace des changements ; par exemple, un
{{< glossary_tooltip term_id="controller" text="contrôleur" >}} qui doit être informé lorsqu’un
ConfigMap est modifié peut utiliser un watch plutôt que de faire du polling.

Voir [Efficient Detection of Changes in API Concepts](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) pour plus d’informations.