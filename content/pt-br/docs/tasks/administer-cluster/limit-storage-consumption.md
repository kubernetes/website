---
title: Limitar o consumo de armazenamento
content_type: task
weight: 240
---

<!-- overview -->

Este exemplo demonstra como limitar a quantidade de armazenamento consumido em um namespace.

Os seguintes recursos são usados na demonstração: [ResourceQuota](/pt-br/docs/concepts/policy/resource-quotas/), [LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/), e [PersistentVolumeClaim](/pt-br/docs/concepts/storage/persistent-volumes/).

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->
## Cenário: Limitando o consumo de armazenamento.

O administrador do cluster está operando um cluster em nome de uma população de usuários e o administrador quer controlar quanto armazenamento um único namespace pode consumir para controlar custos.

O administrador gostaria de limitar:

1. O número de *persistent volume claims* em um namespace
2. A quantidade de armazenamento que cada *claim* pode solicitar
3. A quantidade total de armazenamento que o namespace pode ter.

## LimitRange para limitar solicitações de armazenamento

Adicionar um LimitRange a um namespace impõe tamanhos mínimos e máximos para solicitações de armazenamento. O armazenamento é solicitado através do PersistentVolumeClaim. O controlador de admissão que impõe os limites rejeitará qualquer PVC que esteja acima ou abaixo dos valores definidos pelo administrador.

Neste exemplo, um PVC que solicita 10Gi de armazenamento seria rejeitado porque excede o limite máximo de 2Gi.

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storagelimits
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 2Gi
    min:
      storage: 1Gi
```

As requisições de armazenamento mínimas são usadas quando o provedor de armazenamento subjacente exige certos valores mínimos. Por exemplo, os volumes do AWS EBS têm um requisito mínimo de 1 Gi.

## StorageQuota para limitar a quantidade de PVC e a capacidade de armazenamento cumulativa

Os administradores podem limitar o número de PVCs em um namespace, bem como a capacidade cumulativa desses PVCs. Novos PVCs que excedam qualquer um desses valores máximos serão rejeitados.

Neste exemplo, o sexto PVC no namespace seria rejeitado porque excede a contagem máxima de 5. Alternativamente, uma cota máxima de 5Gi, combinada com o limite máximo de 2Gi acima, não pode ter 3 PVCs, cada um com 2Gi. Isso seria um total de 6Gi solicitados para um namespace limitado a 5Gi.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

<!-- discussion -->

## Resumo

Um LimitRange pode colocar um limite na quantidade de armazenamento solicitado enquanto um ResourceQuota pode efetivamente limitar o armazenamento consumido por um namespace através do número de *claims* e da capacidade de armazenamento cumulativa. Isso permite que um administrador do cluster planeje o custo de armazenamento do seu cluster sem risco de qualquer projeto exceder sua cota.
