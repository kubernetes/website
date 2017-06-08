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
in the Pod. Here is a configuration file for a Pod that specifies a security context:

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/tasks/configure-pod-container/pod.yaml" %}

In the configuration file, you can see TODO.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/security-context.yaml
```
Verify that the Pod's Container is running:

```shell
kubectl get pod security-context-demo
```

Get a shell to the running Container:

```shell
kubectl exec -it security-context-demo -- /bash/bin
```

In your shell, list the running processes:

```shell
I have no name!@security-context-demo:/$ ps aux
```

The output shows TODO:

```shell
USER   PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
1000     1  0.0  0.0   4336   724 ?     Ss   18:16   0:00 /bin/sh -c node server.js
1000     5  0.2  0.6 772124 22768 ?     Sl   18:16   0:00 node server.js
1000    10  0.0  0.0  20224  3076 ?     Ss   18:16   0:00 /bin/bash
1000    14  0.0  0.0  17500  2112 ?     R+   18:16   0:00 ps aux
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

{% include code.html language="yaml" file="security-context.yaml" ghlink="/docs/tasks/configure-pod-container/security-context.yaml" %}

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
