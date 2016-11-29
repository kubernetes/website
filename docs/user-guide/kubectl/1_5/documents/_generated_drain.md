------------

# drain

>bdocs-tab:example Drain node "foo", even if there are pods not managed by a ReplicationController, ReplicaSet, Job, or DaemonSet on it.

```bdocs-tab:example_shell
$ kubectl drain foo --force
```

>bdocs-tab:example As above, but abort if there are pods not managed by a ReplicationController, ReplicaSet, Job, or DaemonSet, and use a grace period of 15 minutes.

```bdocs-tab:example_shell
$ kubectl drain foo --grace-period=900
```



Drain node in preparation for maintenance.

The given node will be marked unschedulable to prevent new pods from arriving.
The 'drain' deletes all pods except mirror pods (which cannot be deleted through
the API server).  If there are DaemonSet-managed pods, drain will not proceed
without --ignore-daemonsets, and regardless it will not delete any
DaemonSet-managed pods, because those pods would be immediately replaced by the
DaemonSet controller, which ignores unschedulable markings.  If there are any
pods that are neither mirror pods nor managed by ReplicationController,
ReplicaSet, DaemonSet or Job, then drain will not delete any pods unless you
use --force.

When you are ready to put the node back into service, use kubectl uncordon, which
will make the node schedulable again.

![Workflow](http://kubernetes.io/images/docs/kubectl_drain.svg)


### Usage

`$ drain NODE`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
delete-local-data |  | false | Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained). 
force |  | false | Continue even if there are pods not managed by a ReplicationController, ReplicaSet, Job, or DaemonSet. 
grace-period |  | -1 | Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used. 
ignore-daemonsets |  | false | Ignore DaemonSet-managed pods. 


