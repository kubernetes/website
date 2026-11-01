---
title: Proxy de version mixte (MVP)
id: mvp
full_link: /docs/concepts/architecture/mixed-version-proxy/
short_description: >
  Fonctionnalité permettant à un kube-apiserver de proxyfier une requête vers un serveur API pair différent.

aka: ["MVP"]
tags:
- architecture
---

Fonctionnalité permettant au kube-apiserver de proxyfier une requête de ressource vers un serveur API pair différent.

<!--more-->

Lorsque plusieurs API servers d’un cluster exécutent des versions différentes de Kubernetes, cette fonctionnalité permet de servir les requêtes de {{< glossary_tooltip text="resource" term_id="api-resource" >}} par le serveur API approprié.

MVP est désactivé par défaut et peut être activé via le [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `UnknownVersionInteroperabilityProxy` au démarrage du {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}.
