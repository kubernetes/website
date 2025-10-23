---
layout: blog
title: "Kubernetes v1.35: Kubelet Configuration Drop-in Directory Graduates to GA"
date: 2025-10-23
slug: kubelet-config-drop-in-directory-ga
author: >
  Sohan Kunkerkar (Red Hat)
---

Announcing the graduation to General Availability (GA) of the Kubelet Configuration Drop-in Directory feature in Kubernetes v1.35!

The Kubernetes SIG Node team is excited to announce that the Kubelet Configuration Drop-in Directory feature, first introduced as alpha in Kubernetes v1.28 and promoted to beta in v1.30, has now reached GA status and is officially part of the Kubernetes v1.35 release. This enhancement significantly simplifies the management of kubelet configurations across large, heterogeneous Kubernetes clusters.

With v1.35, the `--config-dir` flag is production-ready and fully supported, allowing you to specify a directory containing kubelet configuration drop-in files that will be automatically merged with your main kubelet configuration. This allows cluster administrators to maintain a cohesive base kubelet configuration while enabling targeted customizations for different node groups or use cases—all without complex tooling or manual configuration management.

## The problem: Managing kubelet configuration at scale

As Kubernetes clusters grow larger and more complex, they often include heterogeneous node pools with different hardware capabilities, workload requirements, and operational constraints. This diversity necessitates different kubelet configurations across node groups—yet managing these varied configurations at scale becomes increasingly challenging. Several pain points emerge:

- **Configuration drift**: Different nodes may have slightly different configurations, leading to inconsistent behavior
- **Node group customization**: GPU nodes, edge nodes, and standard compute nodes often require different kubelet settings
- **Operational overhead**: Maintaining separate, complete configuration files for each node type is error-prone and difficult to audit
- **Change management**: Rolling out configuration changes across heterogeneous node pools requires careful coordination

Previously, cluster administrators had to choose between using a single monolithic configuration file for all nodes, maintaining multiple complete configuration files, or implementing custom tooling—each approach with its own drawbacks. The Kubelet Configuration Drop-in Directory feature provides a native, built-in solution to this challenge.

## What changed?

With GA graduation in v1.35, the `--config-dir` flag is production-ready with stable API guarantees. This allows you to compose kubelet configuration from multiple drop-in files that are automatically merged, enabling you to maintain a base configuration while layering node-specific or environment-specific settings.

## Real-world use cases

### Managing heterogeneous node pools

Consider a cluster with multiple node types: standard compute nodes, GPU nodes for ML workloads, and edge nodes with specialized requirements.

**Base configuration** (`00-base.conf`):
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
  - "10.96.0.10"
clusterDomain: cluster.local
```

**GPU node override** (`50-gpu-nodes.conf`):
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
maxPods: 50
systemReserved:
  memory: "4Gi"
  cpu: "1000m"
```

**Edge node override** (`50-edge-nodes.conf`):
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "5%"
```

With this structure, GPU nodes apply both the base configuration and the GPU-specific overrides, while edge nodes apply the base configuration with edge-specific settings.

### Gradual configuration rollouts

When rolling out configuration changes, you can:

1. Add a new drop-in file with a high numeric prefix (e.g., `99-new-feature.conf`)
2. Test the changes on a subset of nodes
3. Gradually roll out to more nodes
4. Once stable, merge changes into the base configuration

## Viewing the merged configuration

Since configuration is now spread across multiple files, you can inspect the final merged configuration using the kubelet's `/configz` endpoint:

```bash
# Start kubectl proxy
kubectl proxy

# In another terminal, fetch the merged configuration
curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
```

This shows the actual configuration the kubelet is using after all merging has been applied.

## How to use it?

As this feature has graduated to GA, there's no need to enable a feature gate. Simply make sure you are running Kubernetes v1.35 or later.

For detailed setup instructions, configuration examples, and merging behavior, see the official documentation:
- [Set Kubelet Parameters Via A Configuration File](/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-conf-d)
- [Kubelet Configuration Directory Merging](/docs/reference/node/kubelet-config-directory-merging/)

## Best practices

When using kubelet configuration drop-in directories:

1. **Test configurations incrementally**: Always test new drop-in configurations on a subset of nodes before rolling out cluster-wide to minimize risk

2. **Version control your drop-ins**: Store your drop-in configuration files in version control alongside your infrastructure as code to track changes and enable easy rollbacks

3. **Use numeric prefixes for predictable ordering**: Name files with numeric prefixes (e.g., `00-`, `50-`, `90-`) to explicitly control merge order and make the configuration layering obvious to other administrators

## Acknowledgments

This feature was developed through the collaborative efforts of [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node). Special thanks to all contributors who helped design, implement, test, and document this feature across its journey from alpha in v1.28, through beta in v1.30, to GA in v1.35.

To provide feedback, join our [Kubernetes Node Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-node) or participate in discussions on our [public Slack channel](http://slack.k8s.io/) (#sig-node).

## Get involved

If you have feedback or questions about kubelet configuration management, or want to share your experience using this feature, join the discussion:

- [SIG Node community page](https://github.com/kubernetes/community/tree/master/sig-node)
- [Kubernetes Slack](http://slack.k8s.io/) in the #sig-node channel
- [SIG Node mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

We'd love to hear about your experiences using kubelet configuration drop-in directories in production!
