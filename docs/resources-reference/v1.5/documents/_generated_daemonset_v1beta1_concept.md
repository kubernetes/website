

-----------
# DaemonSet v1beta1

>bdocs-tab:example DaemonSet Config to print the `hostname` on each Node in the cluster every 10 seconds.

```bdocs-tab:example_yaml

apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  # Unique key of the DaemonSet instance
  name: daemonset-example
spec:
  template:
    metadata:
      labels:
        app: daemonset-example
    spec:
      containers:
      # This container is run once on each Node in the cluster
      - name: daemonset-example
        image: ubuntu:trusty
        command:
        - /bin/sh
        args:
        - -c
        # This script is run through `sh -c <script>`
        - >-
          while [ true ]; do
          echo "DaemonSet running on $(hostname)" ;
          sleep 10 ;
          done

```


Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DaemonSet







DaemonSet represents the configuration of a daemon set.

<aside class="notice">
Appears In <a href="#daemonsetlist-v1beta1">DaemonSetList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[DaemonSetSpec](#daemonsetspec-v1beta1)*  | Spec defines the desired behavior of this daemon set. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[DaemonSetStatus](#daemonsetstatus-v1beta1)*  | Status is the current status of this daemon set. This data may be out of date by some window of time. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### DaemonSetSpec v1beta1

<aside class="notice">
Appears In <a href="#daemonset-v1beta1">DaemonSet</a> </aside>

Field        | Description
------------ | -----------
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Selector is a label query over pods that are managed by the daemon set. Must match in order to be controlled. If empty, defaulted to labels on Pod template. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template is the object that describes the pod that will be created. The DaemonSet will create exactly one copy of this pod on every node that matches the template's node selector (or on every node if no node selector is specified). More info: http://kubernetes.io/docs/user-guide/replication-controller#pod-template

### DaemonSetStatus v1beta1

<aside class="notice">
Appears In <a href="#daemonset-v1beta1">DaemonSet</a> </aside>

Field        | Description
------------ | -----------
currentNumberScheduled <br /> *integer*  | CurrentNumberScheduled is the number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod. More info: http://releases.k8s.io/HEAD/docs/admin/daemons.md
desiredNumberScheduled <br /> *integer*  | DesiredNumberScheduled is the total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod). More info: http://releases.k8s.io/HEAD/docs/admin/daemons.md
numberMisscheduled <br /> *integer*  | NumberMisscheduled is the number of nodes that are running the daemon pod, but are not supposed to run the daemon pod. More info: http://releases.k8s.io/HEAD/docs/admin/daemons.md
numberReady <br /> *integer*  | NumberReady is the number of nodes that should be running the daemon pod and have one or more of the daemon pod running and ready.

### DaemonSetList v1beta1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[DaemonSet](#daemonset-v1beta1) array*  | Items is a list of daemon sets.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata





