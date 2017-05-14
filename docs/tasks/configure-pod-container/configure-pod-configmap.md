---
title: Using ConfigMaps in Pods 
---

{% capture overview %}
This page provides a series of usage examples demonstrating how to configure Pods using data stored in ConfigMaps. 
{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}
* [Create a ConfigMap](/docs/tasks/configure-pod-container/configmap.html)
{% endcapture %}

{% capture steps %}


## Defining Pod environment variables using ConfigMap data

### Define a Pod environment variable with data from a single ConfigMap

1. Define an environment variable as a key-value pair in a ConfigMap:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very 
   ```

1. Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY` environment variable in the Pod specification.  

   ```shell
   kubectl edit pod dapi-test-pod
   ```

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: dapi-test-pod
   spec:
     containers:
       - name: test-container
         image: gcr.io/google_containers/busybox
         command: [ "/bin/sh", "-c", "env" ]
         env:
           # Define the environment variable
           - name: SPECIAL_LEVEL_KEY
             valueFrom:
               configMapKeyRef:
                 # The ConfigMap containing the value you want to assign to SPECIAL_LEVEL_KEY
                 name: special-config
                 # Specify the key associated with the value
                 key: special.how
     restartPolicy: Never
   ```

1. Save the changes to the Pod specification. Now, the Pod's output includes `SPECIAL_LEVEL_KEY=very`. 
 
### Define Pod environment variables with data from multiple ConfigMaps
 
1. As with the previous example, create the ConfigMaps first.

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: special-config
     namespace: default
   data:
     special.how: very
   ```

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: env-config
     namespace: default
   data:
     log_level: INFO
   ``` 

1. Define the environment variables in the Pod specification.   

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: dapi-test-pod
   spec:
     containers:
       - name: test-container
         image: gcr.io/google_containers/busybox
         command: [ "/bin/sh", "-c", "env" ]
         env:
           - name: SPECIAL_LEVEL_KEY
             valueFrom:
               configMapKeyRef:
                 name: special-config
                 key: special.how
           - name: LOG_LEVEL
             valueFrom:
               configMapKeyRef:
                 name: env-config
                 key: special.type
     restartPolicy: Never
   ```
 
1. Save the changes to the Pod specification. Now, the Pod's output includes `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=info`. 

## Configure all key-value pairs in a ConfigMap as Pod environment variables 

Note: This functionality is available to users running Kubernetes v1.6 and later.

1. Create a ConfigMap containing multiple key-value pairs. 

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: special-config
     namespace: default
   data:
     special_level: very
     special_type: charm
   ```

1. Use `env-from` to define all of the ConfigMap's data as Pod environment variables. The key from the ConfigMap becomes the environment variable name in the Pod.
   
   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: dapi-test-pod
   spec:
     containers:
       - name: test-container
         image: gcr.io/google_containers/busybox
         command: [ "/bin/sh", "-c", "env" ]
         envFrom:
           - configMapRef:
             name: special-config
      restartPolicy: Never
   ```

1. Save the changes to the Pod specification. Now, the Pod's output includes `SPECIAL_LEVEL=very` and `SPECIAL_TYPE=charm`. 


## Using ConfigMap-defined environment variables in Pod commands  

You can use ConfigMap-defined environment variables in the `command` section of the Pod specification using the `$(VAR_NAME)` Kubernetes substitution syntax.

For example:

The following Pod specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: [ "/bin/sh", "-c", "echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)" ]
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: special-config
              key: special.how
        - name: SPECIAL_TYPE_KEY
          valueFrom:
            configMapKeyRef:
              name: special-config
              key: special.type
  restartPolicy: Never
```

produces the following output in the `test-container` container:

```shell
very charm
```

## Using ConfigMap data in Volumes

### Add files stored in a ConfigMap to a Volume 

{$ endcapture %}

{% capture discussion %}
## Understanding ...

Here's an interesting thing to know about the steps you just did.
{% endcapture %}

{% capture whatsnext %}
* Learn more about [this](...).
* See this [related task](...).
{% endcapture %}

{% include templates/task.md %}




## Using ConfigMap via volume plugin

ConfigMaps can also be consumed in volumes.  Returning again to our example ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config
  namespace: default
data:
  special.how: very
  special.type: charm
```

We have a couple different options for consuming this ConfigMap in a volume.  The most basic
way is to populate the volume with files where the key is the filename and the content of the file
is the value of the key:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: [ "/bin/sh", "-c", "cat /etc/config/special.how" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: special-config
  restartPolicy: Never
```

When this pod is run, the output will be:

```shell
very
```

We can also control the paths within the volume where ConfigMap keys are projected:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: [ "/bin/sh","-c","cat /etc/config/path/to/special-key" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: special-config
        items:
        - key: special.how
          path: path/to/special-key
  restartPolicy: Never
```

When this pod is run, the output will be:

```shell
very
```

#### Projecting keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret/) user guide explains the syntax.

## Real World Example: Configuring Redis

Let's take a look at a real-world example: configuring redis using ConfigMap.  Say that we want to inject
redis with the recommendation configuration for using redis as a cache.  The redis config file
should contain:

```conf
maxmemory 2mb
maxmemory-policy allkeys-lru
```

Such a file is in `docs/user-guide/configmap/redis`; we can use the following command to create a
ConfigMap instance with it:

```shell
$ kubectl create configmap example-redis-config --from-file=docs/user-guide/configmap/redis/redis-config

$ kubectl get configmap example-redis-config -o yaml
```

```yaml
apiVersion: v1
data:
  redis-config: |
    maxmemory 2mb
    maxmemory-policy allkeys-lru
kind: ConfigMap
metadata:
  creationTimestamp: 2016-03-30T18:14:41Z
  name: example-redis-config
  namespace: default
  resourceVersion: "24686"
  selfLink: /api/v1/namespaces/default/configmaps/example-redis-config
  uid: 460a2b6e-f6a3-11e5-8ae5-42010af00002
```

Now, let's create a pod that uses this config:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
  - name: redis
    image: kubernetes/redis:v1
    env:
    - name: MASTER
      value: "true"
    ports:
    - containerPort: 6379
    resources:
      limits:
        cpu: "0.1"
    volumeMounts:
    - mountPath: /redis-master-data
      name: data
    - mountPath: /redis-master
      name: config
  volumes:
    - name: data
      emptyDir: {}
    - name: config
      configMap:
        name: example-redis-config
        items:
        - key: redis-config
          path: redis.conf
```

Notice that this pod has a ConfigMap volume that places the `redis-config` key of the
`example-redis-config` ConfigMap into a file called `redis.conf`.  This volume is mounted into the
`/redis-master` directory in the redis container, placing our config file at
`/redis-master/redis.conf`, which is where the image looks for the redis config file for the master.

```shell
$ kubectl create -f docs/user-guide/configmap/redis/redis-pod.yaml
```

If we `kubectl exec` into this pod and run the `redis-cli` tool, we can check that our config was
applied correctly:

```shell
$ kubectl exec -it redis redis-cli
127.0.0.1:6379> CONFIG GET maxmemory
1) "maxmemory"
2) "2097152"
127.0.0.1:6379> CONFIG GET maxmemory-policy
1) "maxmemory-policy"
2) "allkeys-lru"
```

## Restrictions

ConfigMaps must be created before they are consumed in pods unless they are
marked as optional.  References to ConfigMaps that do not exist will prevent
the pod from starting.  Controllers may be written to tolerate missing
configuration data; consult individual components configured via ConfigMap on
a case-by-case basis.

References via `configMapKeyRef` to keys that do not exist in a named ConfigMap
will prevent the pod from starting.

ConfigMaps used to populate environment variables via `envFrom` that have keys
that are considered invalid environment variable names will have those keys
skipped.  The pod will be allowed to start.  There will be an event whose
reason is `InvalidVariableNames` and the message will contain the list of
invalid keys that were skipped. The example shows a pod which refers to the
default/myconfig ConfigMap that contains 2 invalid keys, 1badkey and 2alsobad.

```shell
$ kubectl get events
LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
```

ConfigMaps reside in a namespace.   They can only be referenced by pods in the same namespace.

Quota for ConfigMap size is a planned feature.

Kubelet only supports use of ConfigMap for pods it gets from the API server.  This includes every pod
created using kubectl, or indirectly via a replication controller.  It does not include pods created
via the Kubelet's `--manifest-url` flag, its `--config` flag, or its REST API (these are not common
ways to create pods.)

