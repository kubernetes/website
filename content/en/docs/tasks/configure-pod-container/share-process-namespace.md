---
title: Share Process Namespace between Containers in a Pod
reviewers:
- verb
- yujuhong
- dchen1107
content_type: task
weight: 200
---

<!-- overview -->

This page shows how to configure process namespace sharing for a pod. When
process namespace sharing is enabled, processes in a container are visible
to all other containers in the same pod.

You can use this feature to configure cooperating containers, such as a log
handler sidecar container, or to troubleshoot container images that don't
include debugging utilities like a shell.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Configure a Pod

Process namespace sharing is enabled using the `shareProcessNamespace` field of
`.spec` for a Pod. For example:

{{% code_sample file="pods/share-process-namespace.yaml" %}}

1. Create the pod `nginx` on your cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
   ```

1. Attach to the `shell` container and run `ps`:

   ```shell
   kubectl attach -it nginx -c shell
   ```

   If you don't see a command prompt, try pressing enter. In the container shell:

   ```shell
   # run this inside the "shell" container
   ps ax
   ```

   The output is similar to this:

   ```none
   PID   USER     TIME  COMMAND
       1 root      0:00 /pause
       8 root      0:00 nginx: master process nginx -g daemon off;
      14 101       0:00 nginx: worker process
      15 root      0:00 sh
      21 root      0:00 ps ax
   ```

You can signal processes in other containers. For example, send `SIGHUP` to
`nginx` to restart the worker process. This requires the `SYS_PTRACE` capability.

```shell
# run this inside the "shell" container
kill -HUP 8   # change "8" to match the PID of the nginx leader process, if necessary
ps ax
```

The output is similar to this:

```none
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

It's even possible to access the file system of another container using the
`/proc/$pid/root` link.

```shell
# run this inside the "shell" container
# change "8" to the PID of the Nginx process, if necessary
head /proc/8/root/etc/nginx/nginx.conf
```

The output is similar to this:

```none
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```

<!-- discussion -->

## Understanding process namespace sharing

Pods share many resources so it makes sense they would also share a process
namespace. Some containers may expect to be isolated from others, though,
so it's important to understand the differences:

1. **The container process no longer has PID 1.** Some containers refuse
   to start without PID 1 (for example, containers using `systemd`) or run
   commands like `kill -HUP 1` to signal the container process. In pods with a
   shared process namespace, `kill -HUP 1` will signal the pod sandbox
   (`/pause` in the above example).

1. **Processes are visible to other containers in the pod.** This includes all
   information visible in `/proc`, such as passwords that were passed as arguments
   or environment variables. These are protected only by regular Unix permissions.

1. **Container filesystems are visible to other containers in the pod through the
   `/proc/$pid/root` link.** This makes debugging easier, but it also means
   that filesystem secrets are protected only by filesystem permissions.

