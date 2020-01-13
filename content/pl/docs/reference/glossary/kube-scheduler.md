---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Składnik *master*, który monitoruje tworzenie nowych podów i przypisuje im węzły, na których powinny zostać uruchomione.

aka: 
tags:
- architecture
---
Składnik *master*, który monitoruje tworzenie nowych podów i przypisuje im węzły, na których powinny zostać uruchomione.

<!--more-->

Przy podejmowaniu decyzji o wyborze węzła brane pod uwagę są wymagania indywidualne i zbiorcze odnośnie zasobów, ograniczenia wynikające z polityk sprzętu i oprogramowania, wymagania *affinity* i *anty-affinity*, lokalizacja danych, zależności między zadaniami i wymagania czasowe.
