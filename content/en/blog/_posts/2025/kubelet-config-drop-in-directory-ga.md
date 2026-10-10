---
layout: blog
title: "Kubernetes v1.35: Kubelet Configuration Drop-in Directory Graduates to GA"
date: 2025-12-22T10:30:00-08:00
slug: kubernetes-v1-35-kubelet-config-drop-in-directory-ga
author: >
  Sohan Kunkerkar (Red Hat)
---

With the recent v1.35 release of Kubernetes, support for a kubelet configuration drop-in directory is generally available.
The newly stable feature simplifies the management of kubelet configuration across large, heterogeneous clusters.

With v1.35, the kubelet command line argument `--config-dir` is production-ready and fully supported,
allowing you to specify a directory containing kubelet configuration drop-in files.
All files in that directory will be automatically merged with your main kubelet configuration.
This allows cluster administrators to maintain a cohesive _base configuration_ for kubelets while enabling targeted customizations for different node groups or use cases, and without complex tooling or manual configuration management.

## The problem: managing kubelet configuration at scale

As Kubernetes clusters grow larger and more complex, they often include heterogeneous node pools with different hardware capabilities, workload requirements, and operational constraints. This diversity necessitates different kubelet configurations across node groups—yet managing these varied configurations at scale becomes increasingly challenging. Several pain points emerge:

- **Configuration drift**: Different nodes may have slightly different configurations, leading to inconsistent behavior
- **Node group customization**: GPU nodes, edge nodes, and standard compute nodes often require different kubelet settings
- **Operational overhead**: Maintaining separate, complete configuration files for each node type is error-prone and difficult to audit
- **Change management**: Rolling out configuration changes across heterogeneous node pools requires careful coordination

Before this support was added to Kubernetes, cluster administrators had to choose between using a single monolithic configuration file for all nodes,
manually maintaining multiple complete configuration files, or relying on separate tooling. Each approach had its own drawbacks.
This graduation to stable gives cluster administrators a fully supported fourth way to solve that challenge.

## Example use cases

### Managing heterogeneous node pools

Consider a cluster with multiple node types: standard compute nodes, high-capacity nodes (such as those with GPUs or large amounts of memory), and edge nodes with specialized requirements.

#### Base configuration

File: `00-base.conf`
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
  - "10.96.0.10"
clusterDomain: cluster.local
```

#### High-capacity node override

File: `50-high-capacity-nodes.conf`
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
maxPods: 50
systemReserved:
  memory: "4Gi"
  cpu: "1000m"
```

#### Edge node override

File: `50-edge-nodes.conf` (edge compute typically has lower capacity)
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "5%"
```

With this structure, high-capacity nodes apply both the base configuration and the capacity-specific overrides, while edge nodes apply the base configuration with edge-specific settings.

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
# Change the '<node-name>' placeholder before running the curl command
curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
```

This shows the actual configuration the kubelet is using after all merging has been applied.
The merged configuration also includes any configuration settings that were specified via kubelet command-line arguments.

For detailed setup instructions, configuration examples, and merging behavior, see the official documentation:
- [Set Kubelet Parameters Via A Configuration File](/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-conf-d)
- [Kubelet Configuration Directory Merging](/docs/reference/node/kubelet-config-directory-merging/)

## Good practices

When using the kubelet configuration drop-in directory:

1. **Test configurations incrementally**: Always test new drop-in configurations on a subset of nodes before rolling out cluster-wide to minimize risk

2. **Version control your drop-ins**: Store your drop-in configuration files in version control (or the configuration source from which these are generated) alongside your infrastructure as code to track changes and enable easy rollbacks

3. **Use numeric prefixes for predictable ordering**: Name files with numeric prefixes (e.g., `00-`, `50-`, `90-`) to explicitly control merge order and make the configuration layering obvious to other administrators

4. **Be mindful of temporary files**: Some text editors automatically create backup files (such as `.bak`, `.swp`, or files with `~` suffix) in the same directory when editing. Ensure these temporary or backup files are not left in the configuration directory, as they may be processed by the kubelet

## Acknowledgments

This feature was developed through the collaborative efforts of [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node). Special thanks to all contributors who helped design, implement, test, and document this feature across its journey from alpha in v1.28, through beta in v1.30, to GA in v1.35.

To provide feedback on this feature, join the [Kubernetes Node Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-node), participate in discussions on the [public Slack channel](http://slack.k8s.io/) (#sig-node), or file an issue on [GitHub](https://github.com/kubernetes/kubernetes/issues).

## Get involved

If you have feedback or questions about kubelet configuration management, or want to share your experience using this feature, join the discussion:

- [SIG Node community page](https://github.com/kubernetes/community/tree/master/sig-node)
- [Kubernetes Slack](http://slack.k8s.io/) in the #sig-node channel
- [SIG Node mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)

SIG Node would love to hear about your experiences using this feature in production!
