---
assignees:
- erictune
- mikedanese
- thockin

---

A security context defines the operating system security settings (uid, gid, capabilities, SELinux role, etc..) applied to a container. See [security context design](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/security_context.md) for more details.

There are two levels of security context: pod level security context, and container level security context.

## Pod Level Security Context
Setting security context at the pod applies those settings to all containers in the pod 

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-world
spec:
  containers:
  # specification of the pod’s containers
  # ...
  securityContext:
    fsGroup: 1234
    supplementalGroups: [5678]
    seLinuxOptions:
      level: "s0:c123,c456"
```

Please refer to the [API documentation](/docs/api-reference/v1/definitions/#_v1_podsecuritycontext) for a detailed listing and
description of all the fields available within the pod security
context.

### Volume Security context

Another functionality of pod level security context is that it applies
those settings to volumes where applicable. Specifically `fsGroup` and
`seLinuxOptions` are applied to the volume as follows:

#### `fsGroup`

Volumes which support ownership management are modified to be owned
and writable by the GID specified in `fsGroup`. See the
[Ownership Management design document](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/volume-ownership-management.md)
for more details.

#### `selinuxOptions`

Volumes which support SELinux labeling are relabled to be accessable
by the label specified unders `seLinuxOptions`. Usually you will only
need to set the `level` section. This sets the SELinux MCS label given
to all containers within the pod as well as the volume.

**Attention**: Once the MCS label is specified in the pod description
all pods with the same label will able to access the
volume. So if interpod protection is needed you must ensure each pod
is assigned a unique MCS label.

## Container Level Security Context

Container level security context settings are applied to the specific
container and override settings made at the pod level where there is
overlap. Container level settings however do not affect the pod's
volumes.

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

Please refer to the
[API documentation](/docs/api-reference/v1/definitions/#_v1_securitycontext) 
for a detailed listing and description of all the fields available
within the container security context.

