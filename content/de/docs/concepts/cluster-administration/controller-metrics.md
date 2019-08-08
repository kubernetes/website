---
title: Controller Manager Metriken
content_template: templates/concept
weight: 100
---

{{% capture overview %}}
Controller Manager Metriken liefern wichtige Erkenntnisse über die Leistung und den Zustand von den Controller Managern.

{{% /capture %}}

{{% capture body %}}
## Was sind Controller Manager Metriken

Die Kennzahlen des Controller Managers liefert wichtige Erkenntnisse über die Leistung und den Zustand des Controller Managers.
Diese Metriken beinhalten gängige Go Language Laufzeitmetriken wie go_routine count und controller-spezifische Metriken wie z.B.
etcd Request Latenzen oder Cloud Provider (AWS, GCE, OpenStack) API Latenzen, die verwendet werden können um den Zustand eines Clusters zu messen.

Ab Kubernetes 1.7 stehen detaillierte Cloud Provider Metriken für den Speicherbetrieb für GCE, AWS, Vsphere und OpenStack zur Verfügung.
Diese Metriken können verwendet werden, um den Zustand persistenter Datenträgeroperationen zu überwachen.

Für GCE werden diese Metriken beispielsweise wie folgt aufgerufen:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

## Konfiguration

In einem Cluster sind die Controller Manager Metriken unter `http://localhost:10252/metrics` auf dem Host verfügbar, auf dem der Controller Manager läuft.

Die Metriken werden im [Prometheus Format](https://prometheus.io/docs/instrumenting/exposition_formats/) ausgegeben. 

In einer Produktionsumgebung können Sie Prometheus oder einen anderen Metrik Scraper konfigurieren, um diese Metriken regelmäßig zu sammeln und in einer Art Zeitreihen Datenbank verfügbar zu machen.

{{% /capture %}}