---
reviewers:
- matthyx
title: Kubescape for NetworkPolicy
content_type: task
weight: 50
---

<!-- overview -->

This page shows how to use Kubescape for NetworkPolicy generation.

## {{% heading "prerequisites" %}}

You need to have a Kubernetes cluster. Follow the
[kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/) to bootstrap one.

<!-- steps -->

## Installing Kubescape operator

Kubescape Network Policy generation is built into the Kubescape Operator [Helm chart](https://github.com/kubescape/helm-charts/tree/main/charts/kubescape-operator) and is enabled by default.
To `enable`/`disable` this capability, you need to `enable`/`disable` it when installing the chart:
```bash
--set capabilities.networkPolicyService=enable
```

Once you apply the chart with the capability enabled, Kubescape will continuously listen to the workloads traffic, and you could then generate network policies for them.

## Generating network policies

To generate a Network Policy for a workload, all you need to do is run the following command:
```
kubectl -n <namespace> get generatednetworkpolicies <workload-kind>-<workload-name> -o yaml
```
For example, if you want to generate a Network Policy for a `Deployment` named `nginx` in the `default` namespace, you would run the following command:
```
kubectl -n default get generatednetworkpolicies deployment-nginx -o yaml
```
This will return you a CRD of Kind `GeneratedNetworkPolicy`. This CRD will contain on its `spec` the generated Network Policy. You can then apply this Network Policy to your cluster.

This is an example of a generated CRD:
```yaml
apiVersion: spdx.softwarecomposition.kubescape.io/v1beta1
kind: GeneratedNetworkPolicy
metadata:
  creationTimestamp: "2023-12-12T08:46:30Z"
  labels:
    kubescape.io/workload-api-group: apps
    kubescape.io/workload-api-version: v1
    kubescape.io/workload-kind: deployment
    kubescape.io/workload-name: operator
    kubescape.io/workload-namespace: kubescape
    kubescape.io/workload-resource-version: "76459062"
  name: deployment-operator
  namespace: kubescape
policyRef:
- dns: report.armo.cloud.
  ipBlock: 16.171.184.118/32
  name: ""
  originalIP: 16.171.184.118
  server: ""
spec:
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    annotations:
      generated-by: kubescape
    creationTimestamp: null
    labels:
      kubescape.io/workload-api-group: apps
      kubescape.io/workload-api-version: v1
      kubescape.io/workload-kind: deployment
      kubescape.io/workload-name: operator
      kubescape.io/workload-namespace: kubescape
      kubescape.io/workload-resource-version: "76459062"
    name: deployment-operator
    namespace: kubescape
  spec:
    egress:
    - ports:
      - port: 4317
        protocol: TCP
      to:
      - podSelector:
          matchLabels:
            app: otel-collector
    - ports:
      - port: 8001
        protocol: TCP
      to:
      - podSelector:
          matchLabels:
            app: gateway
    - ports:
      - port: 8080
        protocol: TCP
      to:
      - podSelector:
          matchLabels:
            app: kubescape
    - ports:
      - port: 443
        protocol: TCP
      to:
      - ipBlock:
          cidr: 16.171.184.118/32
    - ports:
      - port: 53
        protocol: UDP
      to:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: kube-system
        podSelector:
          matchLabels:
            k8s-app: kube-dns
    - ports:
      - port: 8080
        protocol: TCP
      to:
      - podSelector:
          matchLabels:
            app: kubevuln
    - ports:
      - port: 443
        protocol: TCP
      to:
      - ipBlock:
          cidr: 10.128.0.90/32
    podSelector:
      matchLabels:
        app.kubernetes.io/instance: kubescape
        app.kubernetes.io/name: operator
        tier: ks-control-plane
    policyTypes:
    - Egress
```

`spec` - contains the Kubernetes native Network Policy to be applied on the cluster.  
`policyRef` - contains enrichment information about the generated Network Policy. Each entry refers to a single `cidr` on the Network Policy.  
`policyRef.originalIP` - the original IP that was captured on the traffic.  
`policyRef.ipBlock` - the IP Block that was generated based on the original IP.  
`policyRef.dns` - the DNS resolution of the original IP. This enrichment is done by the node-agent component.  
`policyRef.server` - the server to which the IP belongs to. This enrichment is done by the storage component, based on the `KnownServer` CRDs (see "Advanced Usage").  
`policyRef.name` - this is a user identifier for the IP. This is used to identify the IP in a user-friendly manner. This enrichment is done by the storage component, based on the `KnownServer` CRDs (see "Advanced Usage").

Since the Network Policy generation is based on the traffic that is captured, it is recommended to generate the Network Policy after the workload has been running for a while. This will ensure that the Network Policy will contain all the required rules.
We also recommend going over the generated Network Policy and making sure that it contains all the required rules. You can then apply the Network Policy to your cluster.

## {{% heading "whatsnext" %}}

When generating Network Policies based on captured traffic, we will often encounter IPs which, by themselves, don't have any meaning. They may be part of a bigger network on which every IP actually belongs to the same service, and thus, the entire network should be represented on the policy. Or it may be unclear for someone looking at the policy what this IP actually means, and what service it represents.    
The `KnownServer` CRD comes to take care of both situations. You can define for an IP the network which is equivalent to it, and also the server to which it belongs to. You can also name it in a user-friendly manner, so it will be easier to understand what this IP actually means.

Example of a `KnownServer` CRD:
```yaml
apiVersion: spdx.softwarecomposition.kubescape.io/v1beta1
kind: KnownServer
metadata:
  name: github
spec:
- ipBlock: 142.250.1.100/24
  name: github-workflows
  server: github.com
```

This KnownServer is saying that the IP network of `142.250.1.100/24` is equivalent to the server `github.com`, and on this example we name it `github-workflows`, to give more details about what this service is used for.  
When generating a Network Policy, Kubescape will use this information to enrich the generated Network Policy.


So if, for example, we encounter the IP `142.250.1.104` in the captured traffic, the generated network policy will have `142.250.1.100/24` as the `ipBlock` for the rule which was generated based on this IP. And the `policyRef` section will include an entry as follows:
```yaml
policyRef:
- server: github.com
  ipBlock: 142.250.1.100/24
  name: github-workflows
  originalIP: 142.250.1.104
  dns: ""
```
The `dns` field will be populated depending on the data retrieved from the node-agent and stored in the `NetworkNeighbors`.

You can generate as many `KnownServer` CRDs as you want. Kubescape will use all of them when generating the Network Policy.