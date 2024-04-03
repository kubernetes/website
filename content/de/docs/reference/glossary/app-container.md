---
title: App Container
id: app-container
date: 2019-02-12
full_link:
short_description: >
  Ein Container, der verwendet wird um einen Teil einer Arbeitslast auszuführen. Vergleiche mit init Container.

aka:
tags:
- workload
---
 Anwendungscontainer (oder App Container) sind die {{< glossary_tooltip text="Container" term_id="container" >}} in einem {{< glossary_tooltip text="Pod" term_id="pod" >}}, die gestartet werden, nachdem jegliche {{< glossary_tooltip text="Init Container" term_id="init-container" >}} abgeschlossen haben.

<!--more-->

Ein Init Container erlaubt es Ihnen Initialisierungsdetails, die wichtig sind für die gesamte {{< glossary_tooltip text="Arbeitslast" term_id="workload" >}}, und die nicht mehr weiter laufen müssen, sobald der Anwendungscontainer startet, sauber abzutrennen. Wenn ein Pod keine Init Container konfiguriert hat, sind alle Container in diesem Pod App Container.
