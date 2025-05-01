---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Компонент управляющего слоя, который запускает процессы контроллера.

aka:
tags:
- architecture
- fundamental
---
 Компонент управляющего слоя, который запускает процессы {{< glossary_tooltip text="контроллера" term_id="controller" >}}.

<!--more-->

С логической точки зрения каждый {{< glossary_tooltip text="контроллер" term_id="controller" >}} представляет собой отдельный процесс. Но для упрощения все они скомпилированы в один бинарный файл и выполняются в одном процессе.
