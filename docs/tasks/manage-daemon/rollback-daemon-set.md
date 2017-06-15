---
assignees:
- janetkuo
title: Performing a Rollback on a DaemonSet
---

{% capture overview %}

This page shows how to perform a rollback on a DaemonSet. 

{% endcapture %}


{% capture prerequisites %}

* The DaemonSet rollout history and DaemonSet rollback feature are only
  supported in `kubectl` in Kubernetes version 1.7 or later.
* Make sure you know how to [perform a rolling update on a
  DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/)

{% endcapture %}


{% capture steps %}

## Performing a Rollback on a DaemonSet

1. Find the DaemonSet revision you want to roll back to:

   ```shell
   kubectl rollout history daemonset <daemonset-name>
   ```

   This returns a list of DaemonSet revisions:

   ```shell
   daemonsets "<daemonset-name>"
   REVISION        CHANGE-CAUSE
   1               ...
   2               ...
   ...
   ```

   To see the details of a specific revision:

   ```shell
   kubectl rollout history daemonset <daemonset-name> --revision=1
   ```

   This returns the details of that revision:

   ```shell
   daemonsets "<daemonset-name>" with revision #1
   Pod Template:
   Labels:       foo=bar
   Containers:
    app:
     Image:       ...
     Port:        ...
     Environment: ...
     Mounts:      ...
   Volumes:       ...
   ```

1. Roll back to a specific revision:

   ```shell
   kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
   ```

   If it succeeds, the command returns:

   ```shell
   daemonset "<daemonset-name>" rolled back
   ```

   If `--to-revision` flag is not specified, the last revision will be picked.

1. Watch the progress of the DaemonSet rollback:

   `kubectl rollout undo daemonset` tells the server to start rolling back the
   DaemonSet. The real rollback is done asynchronously on the server side.

   To watch the progress of the rollback:

   ```shell 
   kubectl rollout status ds/<daemonset-name> 
   ```

   When the rollback is complete, the output is similar to this:

   ```shell
   daemon set "<daemonset-name>" successfully rolled out
   ```

{% endcapture %}


{% capture discussion %}

## Understanding DaemonSet Revisions

In the previous `kubectl rollout history` step, you get a list of DaemonSet
revisions. Each revision is stored in a resource named `ControllerRevision`.
`ControllerRevision` is a resource only available in Kubernetes release 1.7 or
later.

To see what is stored in each revision, find the DaemonSet revision raw
resources:

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

This returns a list of `ControllerRevisions`:

```shell
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

Each `ControllerRevision` stores the annotations and template of a DaemonSet
revision.

`kubectl rollout undo` takes a specific `ControllerRevision`, and replaces
DaemonSet template with the template stored in the `ControllerRevision`.
`kubectl rollout undo` is equivalent to updating DaemonSet template to a
previous revision through other commands, such as `kubectl edit` or `kubectl
apply`.

Note that DaemonSet revisions only roll forward. That is to say, after a
rollback is complete, the revision number (`.revision` field) of the
`ControllerRevision` being rolled back to will advance. For example, if you
have revision 1 and 2 in the system, and roll back from revision 2 to revision
1, the `ControllerRevision` with `.revision: 1` will become `.revision: 3`.

## Troubleshooting

* See [troubleshooting DaemonSet rolling
  update](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting)

{% endcapture %}

{% include templates/task.md %}
