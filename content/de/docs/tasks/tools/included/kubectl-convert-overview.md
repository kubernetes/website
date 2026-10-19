---
title: "kubectl-convert Übersicht"
description: >-
  Ein kubectl Plugin welches es ermöglicht, Manifeste von einer Version
  der Kubernetes API zu einer anderen zu konvertieren.

headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Ein Plugin für das Kubernetes Kommandozeilentool `kubectl`, welches es ermöglicht Manifeste von einer Version der 
Kubernetes API zu einer anderen zu konvertieren. Kann zum Beispiel hilfreich sein, Manifeste zu einer nicht als veraltet (deprecated) 
markierten API Version mit einem neuerem Kubernetes Release zu migrieren.
Weitere Infos finden Sich unter: [zu nicht veralteten APIs migrieren](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)