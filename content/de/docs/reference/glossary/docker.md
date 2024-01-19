---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker ist eine Software Technologie, die Virtualisierung auf Betriebssystemebene (auch bekannt als Container) bereitstellt.

aka:
tags:
- fundamental
---
Docker (genauer gesagt, Docker Engine) ist eine Software Technologie, die Virtualisierung auf Betriebssystemebene (auch bekannt als {{< glossary_tooltip text="Container" term_id="container" >}}) bereitstellt.

<!--more-->

Docker verwendet die Ressourcenisolierungsfunktionen des Linux Kernels, wie cgroups und Kernel Namespaces, und ein Unionsfähiges Dateisystem wie OverlayFS (unter anderem), um unabhängige Container auf einer einzigen Linux Instanz auszuführen. Dies vermeidet den Mehraufwand des Starten und Verwalten virtueller Maschinen (VMs).