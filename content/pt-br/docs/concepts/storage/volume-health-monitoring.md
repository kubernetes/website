---
title: Monitoramento de Saúde do Volume
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

{{< glossary_tooltip text="CSI" term_id="csi" >}} O monitoramento de saúde de volume CSI permite que os drivers CSI detectem condições anormais de volume dos sistemas de armazenamento subjacentes e os relatem como eventos em {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} ou {{< glossary_tooltip text="Pods" term_id="pod" >}}.

<!-- body -->

## Monitoramento de Saúde do Volume

_O monitoramento de saúde do volume do Kubernetes_ é uma parte da forma como o Kubernetes implementa a Interface de Armazenamento de Contêiner (CSI). O recurso de monitoramento de saúde de volume é implementado em dois componentes: um controlador de Monitor Externo de Saúde e o {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}.

Se um driver CSI suporta o recurso de monitoramento de saúde do volume do lado do controlador, um evento será relatado no {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC) quando uma condição anormal de volume for detectada em um volume CSI.

O {{< glossary_tooltip text="controlador" term_id="controller" >}} de Monitor Externo de Saúde também observa eventos de falha de nós. Você pode habilitar o monitoramento de falha de nós configurando a flag `enable-node-watcher` como verdadeira. Quando o monitor de saúde externo detecta um evento de falha de nó, o controlador reporta um evento que será relatado no PVC para indicar que os pods que usam este PVC estão em um nó com falha.

Se um driver CSI suporta o recurso de monitoramento de saúde de volume do lado do nó, um evento será relatado em cada Pod que usa o PVC quando uma condição anormal de volume for detectada em um volume CSI. Além disso, as informações de saúde de volume são expostas como métricas Kubelet VolumeStats. Uma nova métrica kubelet_volume_stats_health_status_abnormal é adicionada. Essa métrica inclui dois rótulos:: `namespace` e `persistentvolumeclaim`.  A contagem é 1 ou 0. 1 indica que o volume está pouco saudável, 0 indica que o volume está saudável. Para mais informações, verifique [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor#kubelet-metrics-changes).

{{< note >}}
Você precisa habilitar o [recurso](/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth` para usar essa funcionalidade do lado do nó.
{{< /note >}}

## {{% heading "Próximos passos" %}}

Leia a [Documentação do driver CSI](https://kubernetes-csi.github.io/docs/drivers.html) para descobrir quais drivers CSI implementaram esse recurso.