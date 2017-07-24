---
title: Container Capabilities
---

{% capture overview %}

You can specify Container capabilities by using the `securityContext` field of a
Container's configuration.

{% endcapture %}

{% capture body %}

## Capabilities

By default, Docker containers are unprivileged. For example, in the default case,
you cannot run a Docker daemon inside a Docker container. To give you control
over a container's capabilities, Docker supports `cap-add`
and `cap-drop`. For more details, see
[Runtime privilege and Linux capabilities](https://docs.docker.com/engine/reference/run/#/runtime-privilege-and-linux-capabilities).

This table shows the relationship between Docker capabilities and
[Linux capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html):

| Docker's capabilities | Linux capabilities |
| ---- | ---- |
| SETPCAP |  CAP_SETPCAP |
| SYS_MODULE |  CAP_SYS_MODULE |
| SYS_RAWIO |  CAP_SYS_RAWIO |
| SYS_PACCT |  CAP_SYS_PACCT |
| SYS_ADMIN |  CAP_SYS_ADMIN |
| SYS_NICE |  CAP_SYS_NICE |
| SYS_RESOURCE |  CAP_SYS_RESOURCE |
| SYS_TIME |  CAP_SYS_TIME |
| SYS_TTY_CONFIG |  CAP_SYS_TTY_CONFIG |
| MKNOD |  CAP_MKNOD |
| AUDIT_WRITE |  CAP_AUDIT_WRITE |
| AUDIT_CONTROL |  CAP_AUDIT_CONTROL |
| MAC_OVERRIDE |  CAP_MAC_OVERRIDE |
| MAC_ADMIN |  CAP_MAC_ADMIN |
| NET_ADMIN |  CAP_NET_ADMIN |
| SYSLOG |  CAP_SYSLOG |
| CHOWN |  CAP_CHOWN |
| NET_RAW |  CAP_NET_RAW |
| DAC_OVERRIDE |  CAP_DAC_OVERRIDE |
| FOWNER |  CAP_FOWNER |
| DAC_READ_SEARCH |  CAP_DAC_READ_SEARCH |
| FSETID |  CAP_FSETID |
| KILL |  CAP_KILL |
| SETGID |  CAP_SETGID |
| SETUID |  CAP_SETUID |
| LINUX_IMMUTABLE |  CAP_LINUX_IMMUTABLE |
| NET_BIND_SERVICE |  CAP_NET_BIND_SERVICE |
| NET_BROADCAST |  CAP_NET_BROADCAST |
| IPC_LOCK |  CAP_IPC_LOCK |
| IPC_OWNER |  CAP_IPC_OWNER |
| SYS_CHROOT |  CAP_SYS_CHROOT |
| SYS_PTRACE |  CAP_SYS_PTRACE |
| SYS_BOOT |  CAP_SYS_BOOT |
| LEASE |  CAP_LEASE |
| SETFCAP |  CAP_SETFCAP |
| WAKE_ALARM |  CAP_WAKE_ALARM |
| BLOCK_SUSPEND |  CAP_BLOCK_SUSPEND |

In Kubernetes, you can add or drop capabilities in the
[`SecurityContext`](/docs/resources-reference/v1.5/#securitycontext-v1)
field of a Container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-world
spec:
  containers:
  - name: friendly-container
    image: "alpine:3.4"
    command: ["/bin/echo", "hello", "world"]
    securityContext:
      capabilities:
        add:
        - SYS_NICE
        drop:
        - KILL
```

{% endcapture %}

{% capture whatsnext %}

* [Security Context](/docs/user-guide/security-context/)

* [Pod Security Policy](/docs/user-guide/pod-security-policy/)

* [SecurityContext](/docs/resources-reference/v1.5/#securitycontext-v1)

* [Container](/docs/api-reference/v1/definitions/#_v1_container)

{% endcapture %}

{% include templates/concept.md %}

