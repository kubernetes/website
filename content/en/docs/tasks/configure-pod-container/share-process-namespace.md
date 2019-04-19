---
title: Share Process Namespace between Containers in a Pod
min-kubernetes-server-version: v1.10
reviewers:
- verb
- yujuhong
- dchen1107
content_template: templates/task
weight: 160
---

{{% capture overview %}}

{{< feature-state state="beta" >}}

This page shows how to configure process namespace sharing for a pod. When
process namespace sharing is enabled, processes in a container are visible
to all other containers in that pod.

You can use this feature to configure cooperating containers, such as a log
handler sidecar container, or to troubleshoot container images that don't
include debugging utilities like a shell.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Process Namespace Sharing is a **beta** feature that is enabled by default. It
may be disabled by setting `--feature-gates=PodShareProcessNamespace=false`.

{{% /capture %}}

{{% capture steps %}}

## Configure a Pod

Process Namespace Sharing is enabled using the `ShareProcessNamespace` field of
`v1.PodSpec`. For example:

{{< codenew file="pods/share-process-namespace.yaml" >}}

1. Create the pod `nginx` on your cluster:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
    ```

1. Attach to the `shell` container and run `ps`:

    ```shell
    kubectl attach -it nginx -c shell
    ```

    If you don't see a command prompt, try pressing enter.

    ```
    / # ps ax
    PID   USER     TIME  COMMAND
        1 root      0:00 /pause
        8 root      0:00 nginx: master process nginx -g daemon off;
       14 101       0:00 nginx: worker process
       15 root      0:00 sh
       21 root      0:00 ps ax
    ```

You can signal processes in other containers. For example, send `SIGHUP` to
nginx to restart the worker process. This requires the `SYS_PTRACE` capability.

```
/ # kill -HUP 8
/ # ps ax
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

It's even possible to access another container image using the
`/proc/$pid/root` link.

```
/ # head /proc/8/root/etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```

{{% /capture %}}

{{% capture discussion %}}

## Understanding Process Namespace Sharing

Pods share many resources so it makes sense they would also share a process
namespace. Some container images may expect to be isolated from other
containers, though, so it's important to understand these differences:

1. **The container process no longer has PID 1.** Some container images refuse
   to start without PID 1 (for example, containers using `systemd`) or run
   commands like `kill -HUP 1` to signal the container process. In pods with a
   shared process namespace, `kill -HUP 1` will signal the pod sandbox.
   (`/pause` in the above example.)

1. **Processes are visible to other containers in the pod.** This includes all
   information visible in `/proc`, such as passwords that were passed as arguments
   or environment variables. These are protected only by regular Unix permissions.

1. **Container filesystems are visible to other containers in the pod through the
   `/proc/$pid/root` link.** This makes debugging easier, but it also means
   that filesystem secrets are protected only by filesystem permissions.

{{% /capture %}}


