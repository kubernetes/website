---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Werkzeug, um Ressourcenverbrauch und Performance Charakteristiken von Container besser zu verstehen
aka:
tags:
- tool
---
cAdvisor (Container Advisor) ermöglicht Benutzer von Container ein besseres Verständnis des Ressourcenverbrauchs und der Performance Charakteristiken ihrer laufenden {{< glossary_tooltip text="Container" term_id="container" >}}.

<!--more-->

Es ist ein laufender Daemon, der Informationen über laufende Container sammelt, aggregiert, verarbeitet, und exportiert. Genauer gesagt, speichert es für jeden Container die Ressourcenisolationsparameter, den historischen Ressourcenverbrauch, die Histogramme des kompletten historischen Ressourcenverbrauchs und die Netzwerkstatistiken. Diese Daten werden pro Container und maschinenweit exportiert.
