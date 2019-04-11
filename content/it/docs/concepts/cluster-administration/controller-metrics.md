---
title: Metriche del responsabile del controller
content_template: templates/concept
weight: 100
---

{{% capture overview %}}
Le metriche del controller controller forniscono informazioni importanti sulle prestazioni e la salute di
il responsabile del controller.
{{% /capture %}}

{{% capture body %}}

## Cosa sono le metriche del controller

Le metriche del controller forniscono informazioni importanti sulle prestazioni del controller. Queste metriche 
includono le comuni metriche di runtime del linguaggio Go, come il conteggio go_routine e le metriche specifiche del 
controller come latenze delle richieste etcd o latenze API Cloudprovider (AWS, GCE, OpenStack) che possono essere 
utilizzate per valutare la salute di un cluster.

A partire da Kubernetes 1.7, le metriche dettagliate di Cloudprovider sono disponibili per le operazioni di archiviazione 
per GCE, AWS, Vsphere e OpenStack. Queste metriche possono essere utilizzate per monitorare lo stato delle operazioni 
di volume persistenti.

Ad esempio, per GCE queste metriche sono chiamate:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

## Configurazione

In un cluster, le metriche di controller-manager sono disponibili da `http://localhost:10252/metrics`
dall'host su cui è in esecuzione il controller-manager.

Le metriche sono emesse in [formato prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/).

In un ambiente di produzione è possibile configurare prometheus o altri strumenti di misurazione delle metriche
per raccogliere periodicamente queste metriche e renderle disponibili in una sorta di database di serie temporali.

{{% /capture %}}
