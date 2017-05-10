---
assignees:
- erictune
- mikedanese
- thockin
title: Configuring Pod and Container Capabilities Using a Security Context
redirect_from:
- "/docs/user-guide/security-context/"
- "/docs/user-guide/security-context.html" 
---

{% capture overview %}

This page shows how to 

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Security context

A security context defines the operating system security settings applied to
a Pod or a Container. Examples of security settings are UID, GID, capabilities,
and SELinux role. See
[security context design](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/security_context.md)
for more details.

## Setting the security context for a Pod

To specify security settings for a Pod, include the `securityContext` field
in the PodPec. Security settings that you specify for a Pod apply to all Containers
in the Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-world
spec:
  securityContext:
    fsGroup: 1234
    supplementalGroups: [5678]
    seLinuxOptions:
      level: "s0:c123,c456"
 containers:
  # specification of the pod's containers
  # ...
```

The security context for a Pod also applies to the Pod's volumes when applicable.
Specifically `fsGroup` and `seLinuxOptions` are applied to volumes as follows:

* `fsGroup`: Volumes that support ownership management are modified to be owned
and writable by the GID specified in `fsGroup`. See the
[Ownership Management design document](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/volume-ownership-management.md)
for more details.

* `selinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
by the label specified under `seLinuxOptions`. Usually you only
need to set the `level` section. This sets the SELinux MCS label given
to all Containers in the Pod as well as the volumes.

**Attention**: Once the MCS label is specified in the Pod description
all Pods with the same label will able to access the
volume. So if interpod protection is needed, you must ensure each Pod
is assigned a unique MCS label.

## Setting the security context for a Container

To specify security settings for a Container, include the `securityContext` field
in the Container manifest. Security settings that you specify for a Container apply only to
the individual container, and they override settings made at the Pod level when
there is overlap. Container settings do not affect the Pod's volumes.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-world
spec:
  containers:
    - name: hello-world-container
      # The container definition
      # ...
      securityContext:
        privileged: true
        seLinuxOptions:
          level: "s0:c123,c456"
```

{% endcapture %}

{% capture whatsnext %}

* [SecurityContext](https://kubernetes.io/docs/api-reference/v1.6/#podsecuritycontext-v1-core)

{% endcapture %}

{% include templates/task.md %}
