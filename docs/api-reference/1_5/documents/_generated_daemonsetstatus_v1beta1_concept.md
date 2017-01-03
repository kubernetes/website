

-----------
# DaemonSetStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DaemonSetStatus







DaemonSetStatus represents the current status of a daemon set.

<aside class="notice">
Appears In <a href="#daemonset-v1beta1">DaemonSet</a> </aside>

Field        | Description
------------ | -----------
currentNumberScheduled <br /> *integer*  | CurrentNumberScheduled is the number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod. More info: http://releases.k8s.io/HEAD/docs/admin/daemons.md
desiredNumberScheduled <br /> *integer*  | DesiredNumberScheduled is the total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod). More info: http://releases.k8s.io/HEAD/docs/admin/daemons.md
numberMisscheduled <br /> *integer*  | NumberMisscheduled is the number of nodes that are running the daemon pod, but are not supposed to run the daemon pod. More info: http://releases.k8s.io/HEAD/docs/admin/daemons.md
numberReady <br /> *integer*  | NumberReady is the number of nodes that should be running the daemon pod and have one or more of the daemon pod running and ready.






