---
title: Comparing Dynamic Resource Allocation to Device Plugins
content_type: tutorial
weight: 20
---

<!-- overview -->

Both Dynamic Resource Allocation (DRA) and device plugins enable Kubernetes
workloads to leverage specialized hardware from various vendors. This tutorial
will show how to configure the same GPU-enabled workload with DRA and device
plugins to illustrate the differences between the two sets of APIs.


## {{% heading "objectives" %}}

* Learn when to prefer using device plugins or DRA when configuring containers'
  requests for devices.


## {{% heading "prerequisites" %}}

* An NVIDIA GPU-enabled cluster with GPU Operator installed
* `kubectl`
* `helm`


<!-- lessoncontent -->

## Deploy a workload using GPUs configured via device plugin

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: device-plugin-deploy
  labels:
    app: device-plugin
spec:
  replicas: 1
  selector:
    matchLabels:
      app: device-plugin
  template:
    metadata:
      labels:
        app: device-plugin
    spec:
      containers:
      - name: ctr
        image: ubuntu:22.04
        command: ["bash", "-c"]
        args: ["export; trap 'exit 0' TERM; sleep 9999 & wait"]
        resources:
          limits:
            nvidia.com/gpu: 1
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
                - key: app
                  operator: In
                  values:
                    - device-plugin
            topologyKey: nvidia.com/gpu.imex-domain
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
                - key: app
                  operator: NotIn
                  values:
                    - device-plugin
            topologyKey: nvidia.com/gpu.imex-domain
```

- GPU resources are specified in the container's `resources.limits` and
  `resources.requests`
- `podAffinity` keeps this Deployment's Pods together distributed among Nodes
  within the same IMEX domain
- `podAntiAffinity` ensures this Deployment's Pods will all run 


## Deploy a workload using GPUs configured via DRA

```yaml
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata:
  name: test-gpu-claim
spec:
  spec:
    devices:
      requests:
      - name: gpu
        deviceClassName: gpu.nvidia.com
---
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaim
metadata:
  name: test-imex-claim
spec:
  devices:
    requests:
    - name: imex
      deviceClassName: imex.nvidia.com
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dra-deploy
  labels:
    app: dra
spec:
  replicas: 1
  selector:
    matchLabels:
      app: dra
  template:
    metadata:
      labels:
        app: dra
    spec:
      containers:
      - name: ctr
        image: ubuntu:22.04
        command: ["bash", "-c"]
        args: ["export; trap 'exit 0' TERM; sleep 9999 & wait"]
        resources:
          claims:
          - name: imex
          - name: gpu
      resourceClaims:
      - name: imex
        resourceClaimName: test-imex-claim
      - name: gpu
        resourceClaimTemplateName: test-gpu-claim
```

- GPU resources are specified in the container's `resources.claims` which maps
  to a ResourceClaimTemplate in this example.
- All of the Deployment's Pods share a single ResourceClaim for one distinct
  NVIDIA IMEX channel. This ensures all of these Pods are running within the same
  IMEX domain and that other Pods will not run in that IMEX domain without also
  referring to the same ResourceClaim.


## Clean up


## Conclusion

### Reasons to prefer device plugins

### Reasons to prefer DRA


## {{% heading "whatsnext" %}}

* Learn more about [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* Learn more about [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* See more examples of how to [Assign Resources to Containers and Pods with Dynamic Resource Allocation](/docs/tasks/configure-pod-container/assign-dra-resource/)