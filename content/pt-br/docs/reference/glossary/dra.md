---
title: Alocação Dinâmica de Recursos
id: dra
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Uma funcionalidade do Kubernetes para solicitar e compartilhar recursos, como aceleradores
  de hardware, entre Pods.

aka:
- DRA
tags:
- extension
---
 Uma funcionalidade do Kubernetes que permite solicitar e compartilhar recursos entre Pods.
Esses recursos frequentemente são
{{< glossary_tooltip text="dispositivos" term_id="device" >}} conectados, como aceleradores
de hardware.

<!--more-->

Com a DRA, drivers de dispositivo e administradores do cluster definem classes de dispositivo que
ficam disponíveis para serem requisitadas em cargas de trabalho. O Kubernetes aloca dispositivos compatíveis
a requisições específicas e posiciona os Pods correspondentes em nós que podem acessar os
dispositivos alocados.
