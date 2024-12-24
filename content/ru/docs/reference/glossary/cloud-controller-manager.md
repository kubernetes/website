---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Компонент управляющего слоя, который интегрирует Kubernetes со сторонними облачными провайдерами.
aka: 
tags:
- core-object
- architecture
- operation
---
Диспетчер облачных контроллеров (Cloud Controller Manager, CCM) — компонент
{{< glossary_tooltip text="управляющего слоя" term_id="control-plane" >}}
Kubernetes, встраивающий специфику облака в логику управления. Он позволяет
связать кластер с API поставщика облачных услуг и отделить компоненты,
взаимодействующие с этой облачной платформой, от компонентов,
взаимодействующих только с вашим кластером.

<!--more-->

Отделяя логику взаимодействия между Kubernetes и базовой облачной инфраструктурой,
компонент cloud-controller-manager позволяет поставщикам облачных услуг
выпускать функции, не привязываясь к релизам основного проекта Kubernetes.
