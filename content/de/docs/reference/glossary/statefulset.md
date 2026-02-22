---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Ein StatefulSet verwaltet die Bereitstellung und die Skalierung eines Satzes Pods, mit langlebigem Speicher und persistenter Identifzierung für jeden Pod.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 Verwaltet die Bereitstellung und Skalierung eines Satzes {{< glossary_tooltip text="Pods" term_id="pod" >}}, *und stellt Garantieen zur Reihenfolge und Einzigartigkeit bereit* für diese Pods.

<!--more--> 

Wie ein {{< glossary_tooltip text="Deployment" term_id="deployment" >}}, verwaltet ein StatefulSet Pods basierend auf eine identische Container Spezifikation. Anders als ein Deployment, verwaltet ein StatefulSet eine persistente Identität für jeden seiner Pods. Diese Pods werden anhand der gleichen Spezifikation erstellt, sind aber nicht austauschbar&#58; Jeder hat eine persistente Identifizierung, die über jede Verschiebung erhalten bleibt.

Wenn Sie Speichervolumen verwenden wollen, um Persistenz der Arbeitslast zu ermöglichen, können Sie einen StatefulSet as Teil der Lösung verwenden. Obwohl einzelne Pods in einem StatefulSet anfälling für Fehler sind, machen die persistente Podidentifizierungen es einfacher, existierende Volumen mit neuen Pods, die die fehlerhaften ersetzen, zu verbinden.
