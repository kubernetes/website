---
title: Azure Load-Balancer Annotations
content_type: concept
weight: 82
---

## Azure load-balancer annotations

### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset

Stage: Deprecated

Example: `service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

Used on: Service

This annotation only works for Azure standard load balancer backed service.
This annotation is used on the Service to specify whether the load balancer
should disable or enable TCP reset on idle timeout. If enabled, it helps
applications to behave more predictably, to detect the termination of a connection,
remove expired connections and initiate new connections. 
You can set the value to be either true or false.

See [Load Balancer TCP Reset](https://learn.microsoft.com/en-gb/azure/load-balancer/load-balancer-tcp-reset) for more information.

