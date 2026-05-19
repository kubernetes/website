---
title: Feed Oficial de CVE
weight: 25
layout: cve-feed
---

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

Esta é uma lista, mantida pela comunidade, de CVEs oficiais anunciadas pelo Comitê de Resposta de Segurança do Kubernetes. Veja [Informações de Segurança e Divulgação do Kubernetes](/docs/reference/issues-security/security/) para mais detalhes.

O projeto Kubernetes publica um [Feed JSON](/docs/reference/issues-security/official-cve-feed/index.json), que pode ser programaticamente acessado, de questões de segurança publicadas. Você pode acessá-lo executando o seguinte comando:

```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/index.json
```

{{< cve-feed >}}

Este feed é automaticamente atualizado, mas com um pequeno atraso perceptível (minutos a horas),
desde o momento em que um CVE é anunciado até o momento em que é acessível neste feed.

A fonte deste feed é um conjunto de issues do GitHub, filtrado pelo rótulo controlado e restrito `official-cve-feed`. Os dados brutos são armazenados em um Google Cloud Bucket que é somente escrito  por um pequeno número de membros confiáveis da Comunidade.