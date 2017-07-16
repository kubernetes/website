---
assignees:
- jessfraz
title: Inject Information into Pods Using a PodPreset
redirect_from:
- "/docs/user-guide/pod-preset/index/"
- "/docs/user-guide/pod-preset/index.html"
- "/docs/tasks/run-application/podpreset/"
- "/docs/tasks/run-application/podpreset.html"
---

You can use a `podpreset` object to inject certain information into pods at creation
time. This information can include secrets, volumes, volume mounts, and environment
variables.

See [PodPreset proposal](https://git.k8s.io/community/contributors/design-proposals/pod-preset.md) for more information.

* TOC
{:toc}

## What is a Pod Preset?

A _Pod Preset_ is an API resource that you can use to inject additional runtime
requirements into a Pod at creation time. You use label selectors to specify
the Pods to which a given Pod Preset applies. Check out more information on [label
selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors).

Using a Pod Preset allows pod template authors to not have to explicitly set
information for every pod. This way, authors of pod templates consuming a
specific service do not need to know all the details about that service.

## Admission Control

_Admission control_ is how Kubernetes applies Pod Presets to incoming pod
creation requests. When a pod creation request occurs, the system does the
following:

1. Retrieve all `PodPresets` available for use.
1. Match the label selector of the `PodPreset` to the pod being created.
1. Attempt to merge the various defined resources for the `PodPreset` into the
   Pod being created.
1. On error, throw an event documenting the merge error on the pod, and create
   the pod _without_ any injected resources from the `PodPreset`.

### Behavior

When a `PodPreset` is applied to one or more Pods, Kubernetes modifies the pod
spec. For changes to `Env`, `EnvFrom`, and `VolumeMounts`, Kubernetes modifies
the container spec for all containers in the Pod; for changes to Volume,
Kubernetes modifies the Pod Spec.

Kubernetes annotates the resulting modified pod spec to show that it was
modified by a `PodPreset`. The annotation is of the form
`podpreset.admission.kubernetes.io/podpreset-<pod-preset name>": "<resource version>"`.


## Enable Pod Preset

In order to use Pod Presets in your cluster you must ensure the
following

1.  You have enabled the api type `settings.k8s.io/v1alpha1/podpreset`
1.  You have enabled the admission controller `PodPreset`
1.  You have defined your pod presets

## Disable Pod Preset for a pod

There may be instances where you wish for a pod to not be altered by any pod
preset mutations. For these events, one can add an annotation in the pod spec
of the form: `podpreset.admission.kubernetes.io/exclude: "true"`.

## Create a Pod Preset

### Simple Pod Spec Example

This is a simple example to show how a Pod spec is modified by the Pod
Preset.

**User submitted pod spec:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      ports:
        - containerPort: 80
```

**Example Pod Preset:**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

**Pod spec after admission controller:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
  annotations:
    podpreset.admission.kubernetes.io/allow-database: "resource version"
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      ports:
        - containerPort: 80
      env:
        - name: DB_PORT
          value: "6379"
  volumes:
    - name: cache-volume
      emptyDir: {}
```

### Pod Spec with `ConfigMap` Example

This is an example to show how a Pod spec is modified by the Pod Preset 
that defines a `ConfigMap` for Environment Variables.

**User submitted pod spec:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      ports:
        - containerPort: 80
```

**User submitted `ConfigMap`:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: etcd-env-config
data:
  number_of_members: "1"
  initial_cluster_state: new
  initial_cluster_token: DUMMY_ETCD_INITIAL_CLUSTER_TOKEN
  discovery_token: DUMMY_ETCD_DISCOVERY_TOKEN
  discovery_url: http://etcd_discovery:2379
  etcdctl_peers: http://etcd:2379
  duplicate_key: FROM_CONFIG_MAP
  REPLACE_ME: "a value"
```

**Example Pod Preset:**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: 6379
    - name: duplicate_key
      value: FROM_ENV
    - name: expansion
      value: $(REPLACE_ME)
  envFrom:
    - configMapRef:
        name: etcd-env-config
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
    - mountPath: /etc/app/config.json
      readOnly: true
      name: secret-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
    - name: secret-volume
      secretName: config-details
```

**Pod spec after admission controller:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
  annotations:
    podpreset.admission.kubernetes.io/allow-database: "resource version"
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
        - mountPath: /etc/app/config.json
          readOnly: true
          name: secret-volume
      ports:
        - containerPort: 80
      env:
        - name: DB_PORT
          value: "6379"
        - name: duplicate_key
          value: FROM_ENV
        - name: expansion
          value: $(REPLACE_ME)
      envFrom:
        - configMapRef:
          name: etcd-env-config
  volumes:
    - name: cache-volume
      emptyDir: {}
    - name: secret-volume
      secretName: config-details
```

### ReplicaSet with Pod Spec Example

The following example shows that only the pod spec is modified by the Pod
Preset.

**User submitted ReplicaSet:**

```yaml
apiVersion: settings.k8s.io/v1alpha1
kind: ReplicaSet
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
    matchExpressions:
      - {key: tier, operator: In, values: [frontend]}
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        env:
          - name: GET_HOSTS_FROM
            value: dns
        ports:
          - containerPort: 80
```

**Example Pod Preset:**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      tier: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

**Pod spec after admission controller:**

```yaml
kind: Pod
  metadata:
    labels:
      app: guestbook
      tier: frontend
    annotations:
    podpreset.admission.kubernetes.io/allow-database: "resource version"
  spec:
    containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        volumeMounts:
          - mountPath: /cache
            name: cache-volume
        env:
          - name: GET_HOSTS_FROM
            value: dns
          - name: DB_PORT
            value: "6379"
        ports:
          - containerPort: 80
    volumes:
      - name: cache-volume
        emptyDir: {}
```

### Multiple PodPreset Example

This is an example to show how a Pod spec is modified by multiple Pod
Injection Policies.

**User submitted pod spec:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      ports:
        - containerPort: 80
```

**Example Pod Preset:**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

**Another Pod Preset:**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: proxy
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  volumeMounts:
    - mountPath: /etc/proxy/configs
      name: proxy-volume
  volumes:
    - name: proxy-volume
      emptyDir: {}
```

**Pod spec after admission controller:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
  annotations:
    podpreset.admission.kubernetes.io/allow-database: "resource version"
    podpreset.admission.kubernetes.io/proxy: "resource version"
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
        - mountPath: /etc/proxy/configs
          name: proxy-volume
      ports:
        - containerPort: 80
      env:
        - name: DB_PORT
          value: "6379"
  volumes:
    - name: cache-volume
      emptyDir: {}
    - name: proxy-volume
      emptyDir: {}
```

### Conflict Example

This is an example to show how a Pod spec is not modified by the Pod Preset 
when there is a conflict.

**User submitted pod spec:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      ports:
  volumes:
    - name: cache-volume
      emptyDir: {}
        - containerPort: 80
```

**Example Pod Preset:**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: other-volume
  volumes:
    - name: other-volume
      emptyDir: {}
```

**Pod spec after admission controller will not change because of the conflict:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      ports:
  volumes:
    - name: cache-volume
      emptyDir: {}
        - containerPort: 80
```

**If we run `kubectl describe...` we can see the event:**

```
$ kubectl describe ...
....
Events:
  FirstSeen             LastSeen            Count   From                    SubobjectPath               Reason      Message
  Tue, 07 Feb 2017 16:56:12 -0700   Tue, 07 Feb 2017 16:56:12 -0700 1   {podpreset.admission.kubernetes.io/allow-database }    conflict  Conflict on pod preset. Duplicate mountPath /cache.
```

## Deleting a Pod Preset

Once you don't need a pod preset anymore, you can delete it with `kubectl`:

```shell
$ kubectl delete podpreset allow-database
podpreset "allow-database" deleted
```

