---
title: Controller manager metrics
---

{% capture overview %}
Controller manager metrics provide important insight into the performance and health of
the controller manager.

{% endcapture %}

{% capture body %}
## What are controller manager metrics

Controller manager metrics provide important insight into the performance and health of the controller manager.
These metrics include common Go language runtime metrics such as go_routine count and controller specific metrics such as
etcd request latencies or Cloudprovider (AWS, GCE, OpenStack) API latencies that can be used
to gauge the health of a cluster.

Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations for GCE, AWS, Vsphere and OpenStack.
These metrics can be used to monitor health of persistent volume operations.

For example, for GCE these metrics are called:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```



## Configuration


In a cluster, controller-manager metrics are available from `http://localhost:10252/metrics`
from the host where the controller-manager is running.

The metrics are emitted in [prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) and are human readable.

In a production environment you may want to configure prometheus or some other metrics scraper
to periodically gather these metrics and make them available in some kind of time series database.

{% endcapture %}

{% include templates/concept.md %}
