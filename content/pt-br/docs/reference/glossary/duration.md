---
title: Duração
id: duration
date: 2024-10-05
full_link:
short_description: >
  Um valor em forma de string que representa uma quantidade de tempo.
tags:
- fundamental
---
Um valor em forma de string que representa uma quantidade de tempo.

<!--more-->

O formato de uma duração (no Kubernetes) é baseado no tipo
[`time.Duration`](https://pkg.go.dev/time#Duration) da linguagem de programação Go.

Nas APIs do Kubernetes que usam durações, o valor é expresso como uma série de inteiros
não negativos combinados com um sufixo de unidade de tempo. É possível ter mais de uma
quantidade de tempo, e a duração total é a soma dessas quantidades.  
As unidades de tempo válidas são: "ns", "µs" (ou "us"), "ms", "s", "m" e "h".

Por exemplo: `5s` representa uma duração de cinco segundos, e `1m30s` representa uma
duração de um minuto e trinta segundos.
