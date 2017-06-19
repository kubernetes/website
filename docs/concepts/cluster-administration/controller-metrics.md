---
title: Controller manager metrics
---

{% capture overview %}
Controller manager metrics provide important insight into performance and health of
controller manager.

{% endcapture %}

{% capture body %}
## What are controller manager metrics

Controller manager metrics provide important insight into performance and health of the controller manager.
These metrics include common Go language runtime metrics such as go_routine count and controller specific metrics such as
etcd request latencies or cloudprovider (AWS, GCE, Openstack) API latencies that can be used
to gauge health of cluster.

Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations for GCE, AWS, Vsphere and Openstack.
These metrics can be used to monitor health of persistent volume operations.

For example for GCE these metrics are called:

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

In production environment you may want to configure prometheus or some other metrics scraper
to periodically gather these metrics and make them available in some kind of time series database.


Prometheus itself can gather controller metrics via built-in service discovery mechanism provided
controller's metrics URL is configured as an endpoint/service. It can be done by creating following service endpoint:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: controller-service
  labels:
    component: controller-metrics
spec:
  selector:
    component: kube-controller-manager
  ports:
  - name: api
    port: 10252
    protocol: TCP
```

After that prometheus's service discovery mechanism can automatically discover controller metrics and scrape them periodically as per configuration. Please refer to [Prometheus Configuration](https://prometheus.io/docs/operating/configuration/) for
more details.


{% endcapture %}

{% include templates/concept.md %}
