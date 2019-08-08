---
title: drain
content_template: templates/tool-reference
---

### Overview
Drain node in preparation for maintenance.

 The given node will be marked unschedulable to prevent new pods from arriving. 'drain' evicts the pods if the APIServer supportshttp://kubernetes.io/docs/admin/disruptions/ . Otherwise, it will use normal DELETE to delete the pods. The 'drain' evicts or deletes all pods except mirror pods (which cannot be deleted through the API server).  If there are DaemonSet-managed pods, drain will not proceed without --ignore-daemonsets, and regardless it will not delete any DaemonSet-managed pods, because those pods would be immediately replaced by the DaemonSet controller, which ignores unschedulable markings.  If there are any pods that are neither mirror pods nor managed by ReplicationController, ReplicaSet, DaemonSet, StatefulSet or Job, then drain will not delete any pods unless you use --force.  --force will also allow deletion to proceed if the managing resource of one or more pods is missing.

 'drain' waits for graceful termination. You should not operate on the machine until the command completes.

 When you are ready to put the node back into service, use kubectl uncordon, which will make the node schedulable again.

 http://kubernetes.io/images/docs/kubectl_drain.svg

### Usage

`$ drain NODE`


### Example

 Drain node "foo", even if there are pods not managed by a ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet on it.

```shell
$ kubectl drain foo --force
```

 As above, but abort if there are pods not managed by a ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet, and use a grace period of 15 minutes.

```shell
$ kubectl drain foo --grace-period=900
```




### Flags

<div class="table-responsive"><table class="table table-bordered">
<thead class="thead-light">
<tr>
            <th>Name</th>
            <th>Shorthand</th>
            <th>Default</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
    
    <tr>
    <td>delete-local-data</td><td></td><td>false</td><td>Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained).</td>
    </tr>
    <tr>
    <td>dry-run</td><td></td><td>false</td><td>If true, only print the object that would be sent, without sending it.</td>
    </tr>
    <tr>
    <td>force</td><td></td><td>false</td><td>Continue even if there are pods not managed by a ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet.</td>
    </tr>
    <tr>
    <td>grace-period</td><td></td><td>-1</td><td>Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used.</td>
    </tr>
    <tr>
    <td>ignore-daemonsets</td><td></td><td>false</td><td>Ignore DaemonSet-managed pods.</td>
    </tr>
    <tr>
    <td>pod-selector</td><td></td><td></td><td>Label selector to filter pods on the node</td>
    </tr>
    <tr>
    <td>selector</td><td>l</td><td></td><td>Selector (label query) to filter on</td>
    </tr>
    <tr>
    <td>timeout</td><td></td><td>0s</td><td>The length of time to wait before giving up, zero means infinite</td>
    </tr>
</tbody>
</table></div>



