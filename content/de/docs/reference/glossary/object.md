---
title: Objekt
id: object
date: 2020-10-12
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   Eine Einheit im Kubernetessystem, die ein Teil des Zustands Ihres Clusters darstellt.
aka: 
tags:
- fundamental
---
Eine Einheit im Kubernetessystem. Die Kubernetes API verwendet diese Einheiten um den Zustand Ihres Clusters darzustellen.
<!--more-->
Ein Kubernetes Objekt ist typischerweise ein "Datenstatz der Absicht"—sobald Sie das Objekt erstellen, arbeitet die Kubernetes {{< glossary_tooltip text="Control Plane" term_id="control-plane" >}} ständig, um zu versichern, dass das Element, welches es darstellt, auch existiert.
Durch erstellen eines Objekts, erzählen Sie grundsätzlich dem Kubernetessystem wie dieser Teil der Arbeitslast Ihres Clusters aussehen soll; das ist der Wunschzustand Ihres Clusters.
