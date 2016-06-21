---
---

# Known issues

The following features all either do not operate or have large caveats when using the rkt container runtime.

### Non-existent host volume paths

When mounting a host volume path that does not exist, rkt will error out. Under the Docker runtime, an empty directory will be created at the referenced path.

An example of a pod which will error out:

```
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: mount-dne
  name: mount-dne
spec:
  volumes:
  - name: does-not-exist
    hostPath:
      path: /does/not/exist
  containers:
    - name: exit
      image: busybox
      command: ["sh", "-c", "ls /test; sleep 60"]
      volumeMounts:
      - mountPath: /test
        name: does-not-exist
```

### Kubectl attach

The `kubectl attach` command does not work under the rkt container runtime.


### Init containers
<!-- TODO link to init containers doc here -->

The alpha "init container" feature is currently not supported.

### Experimental NVIDIA GPU support

The `--experimental-nvidia-gpus` flag, and related features, are not supported.

### QoS Classes

Under rkt, QoS classes do not result in the `OOM Score` of containers being adjusted as occurs under Docker.

### HostPID and HostIPC namespaces

Setting a the hostPID or hostIPC flag on a pod is not supported.

For example, the following pod will not run correctly:

```
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: host-ipc-pid
  name: host-ipc-pid
spec:
  hostIPC: true
  hostPID: true
  containers:
    ...
```

### Container image updates (patch)


Patching a pod to change the image will result in the entire pod restarting, not just the container that was changed.

### Volume mounts specifying a subPath 

The subPath feature does not work correctly under rkt. In addition, the above-issue of Non-existent host volume paths being invalid would make many common use-cases for subPaths fail in that way as well.

In some cases, this issue can be worked around by creating and using subdirectories from within the container rather than relying on Kubernetes to do so.
