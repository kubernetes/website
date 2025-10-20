---
layout: blog
title: "Kubernetes Deprecating cgroup v1: Completing the Transition to cgroup v2"
date: xx
slug: kubernetes-deprecating-cgroup-v1-transition-cgroup-v2
author: >
  [Kubernetes SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)
---

Following the [transition of cgroup v1 support to maintenance mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/) in Kubernetes v1.31, the Kubernetes project is taking the next step in our migration to cgroup v2. Starting with Kubernetes v1.35, the kubelet will refuse to start on systems using cgroup v1 by default, and complete removal of cgroup v1 code is planned for a future release. This change aligns Kubernetes with the broader Linux ecosystem's evolution toward cgroup v2.

## Understanding the migration timeline

The removal of cgroup v1 support follows a carefully planned timeline designed to provide users with adequate migration opportunities:

### Beta Phase (Kubernetes v1.35+)

- The `FailCgroupV1` kubelet configuration option defaults to `true`
- Kubelet will refuse to start on cgroup v1 systems by default
- Users can temporarily override this behavior with `FailCgroupV1=false` (not recommended for production)

### Stable Phase (Future Release)

- Complete removal of cgroup v1 code from the kubelet
- No earlier than Kubernetes v1.38 to maintain the project's deprecation policy

## Why remove cgroup v1 support?

### Linux ecosystem evolution

The broader Linux ecosystem has been moving away from cgroup v1 support:

**systemd**: Deprecated cgroup v1 in version 256 and removed it entirely in version 258, stating that "support for cgroup v1 ('legacy' and 'hybrid' hierarchies) is now considered obsolete."

**Ubuntu**: Versions 25.04 and above inherit systemd v256 restrictions

**Red Hat Enterprise Linux**: Deprecated cgroup v1 in RHEL 9.4 and announced it will be unavailable in RHEL 10.

**Fedora**: Versions 41+ inherit systemd v256 restrictions, and version 43 will completely remove cgroup v1 support.

**Amazon Linux 2023**: Declares that "cgroup v1 is unsupported and not recommended" and will be "completely removed in a future major release."

### Technical advantages of cgroup v2

The migration to cgroup v2 provides significant benefits:

**Unified Hierarchy**
: Simplifies resource management with a single, consistent hierarchy structure.

**Improved Performance**
: Better scalability and reduced overhead for large-scale deployments.

**Enhanced Features**
: Access to new kernel features and improvements that are only available in cgroup v2.

**Better Resource Control**
: More precise and predictable resource allocation and limits.

## Preparing for the transition

### For cluster administrators

To ensure a smooth transition, cluster administrators should:

1. **Verify cgroup version**: Check if your nodes are running cgroup v1 or v2:
   ```bash
   # Check cgroup version
   stat -fc %T /sys/fs/cgroup/
   # Output: cgroup2fs = cgroup v2, tmpfs = cgroup v1
   ```

2. **Migrate host systems**: Transition nodes to cgroup v2 before upgrading Kubernetes:
   - Update to a recent Linux distribution that defaults to cgroup v2
   - Configure systemd to use cgroup v2 if not already enabled
   - Restart nodes to apply cgroup v2 configuration

3. **Update container runtimes**: Ensure your container runtime supports cgroup v2:
   - containerd v1.4.0+
   - CRI-O v1.20.0+
   - Docker Engine v20.10.0+ (when using cri-dockerd)

### Application compatibility requirements

Some applications may require updates to work correctly with cgroup v2. Ensure you're using compatible versions:

**OpenJDK/HotSpot**
: Minimum versions: jdk8u372, 11.0.16, or 15+

**Node.js**
: Version 20.3.0 or later

**Other runtimes**
: Check with your application runtime documentation for cgroup v2 compatibility

### Testing your workloads

Before migrating production systems:

1. Test applications in a cgroup v2 environment
2. Verify resource monitoring and management tools work correctly
3. Validate that custom monitoring solutions are cgroup v2 compatible
4. Ensure CI/CD pipelines work with cgroup v2

## Migration assistance

### Checking your current setup

To determine if your cluster is ready for the transition:

```bash
# Check kubelet configuration
kubectl get nodes -o wide

# Verify cgroup version on nodes
kubectl debug node/NODE-NAME -it --image=busybox -- stat -fc %T /host/sys/fs/cgroup/
```

### Gradual migration strategy

For large deployments, consider a gradual migration approach:

1. Start with development and testing environments
2. Migrate non-critical workloads first
3. Plan maintenance windows for critical services
4. Keep rollback procedures ready during the transition

## What this means for the Kubernetes community

This change represents Kubernetes following industry best practices and aligning with the direction of the Linux kernel and major distributions. By removing legacy cgroup v1 support, Kubernetes can:

- Focus development efforts on cgroup v2 enhancements
- Reduce maintenance overhead and technical debt
- Provide better performance and features to users
- Maintain compatibility with modern Linux distributions

The removal of cgroup v1 support is part of Kubernetes' commitment to staying current with the evolving container ecosystem while providing users with adequate time to plan their migrations.

## Further reading

- [Cgroup v2 in Kubernetes](/docs/concepts/architecture/cgroups/)
- [KEP-5573: Remove cgroup v1 support](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/5573-remove-cgroup-v1/README.md)
- [Kubernetes 1.31: Moving cgroup v1 support into maintenance mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
- [Linux cgroups documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)