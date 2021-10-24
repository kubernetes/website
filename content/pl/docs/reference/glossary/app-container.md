---
title: Kontener aplikacji
id: app-container
date: 2019-02-12
full_link:
short_description: >
  Kontener używany do uruchomenia części grupy zadań w podzie.

aka:
tags:
- workload
---
Kontenery aplikacji są w {{< glossary_tooltip text="podzie" term_id="pod" >}} grupą {{< glossary_tooltip text="kontenerów" term_id="container" >}}, które są uruchamiane po wszystkich zakończonych sukcesem kontenerach inicjalizujących.

<!--more-->
Kontenery inicjalizujące pozwalają odseparować szczegóły inicjalizacji, które są charakterystyczne dla ogólnego {{< glossary_tooltip text="zadania" term_id="workload" >}} w podzie. Kontenery inicjalizujące mają określony cykl życia, i po ich poprawnym zakończenu uruchamiana jest aplikacja główna. Jeśli pod nie posiada kontenerów inicjalizujących, wtedy wszystkie kontenery w podzie są kontenerami aplikacyjnymi.