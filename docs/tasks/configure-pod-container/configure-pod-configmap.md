---
title: Using ConfigMap Data in Pods 
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

## Adding ConfigMap data to a Volume 

As explained in [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configmap.html), when you create a ConfigMap using ``--from-file``, the filename becomes a key stored in the `data` section of the ConfigMap. The file contents become the key's value. 

The examples in this section refer to a ConfigMap named special-config, shown below.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config
  namespace: default
data:
  special.level: very
  special.type: charm
```

### Populate a Volume with data stored in a ConfigMap

Add the ConfigMap name under the `volumes` section of the Pod specification. 
This adds the ConfigMap data to the directory specified as `volumeMount.mountPath` (in this case, `/etc/config`).
The `command` section references the `special.level` item stored in the ConfigMap.

```yaml
apiVersion: v1
kind: Pod
metadata:
name: dapi-test-pod
spec:
containers:
  - name: test-container
    image: gcr.io/google_containers/busybox
    command: [ "/bin/sh", "-c", "ls /etc/config/" ]
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
volumes:
  - name: config-volume
    configMap:
      # Provide the name of the ConfigMap containing the files you want 
      # to add to the container
      name: special-config
restartPolicy: Never
```

When the pod runs, the command (`"ls /etc/config/"`) produces the output below:

```shell
special.level
special.type
```

### Add ConfigMap data to a specific path in the Volume:

Use the `path` field to specify the desired file path for specific ConfigMap items. 
In this case, the `special.key` item will be mounted in the `config-volume` volume at `/etc/config/keys`.

```yaml
apiVersion: v1
kind: Pod
metadata:
name: dapi-test-pod
spec:
containers:
  - name: test-container
    image: gcr.io/google_containers/busybox
    command: [ "/bin/sh","-c","cat /etc/config/keys/special.level" ]
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
volumes:
  - name: config-volume
    configMap:
      name: special-config
      items:
      - key: special.level
        path: /keys
restartPolicy: Never
```

When the pod runs, the command (`"cat /etc/config/keys/special.level"`) produces the output below:

```shell
very
```

### Projecting keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret#using-secrets-as-files-from-a-pod) user guide explains the syntax.

<<<<<<< HEAD
## Real World Example: Configuring Redis using a ConfigMap

You can follow the steps below to configure a Redis cache using data stored in a ConfigMap.

1. Create a ConfigMap from the `docs/user-guide/configmap/redis/redis-config` file

   ```shell
   kubectl create configmap example-redis-config --from-file=docs/user-guide/configmap/redis/redis-config

   kubectl get configmap example-redis-config -o yaml
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

1. Create a pod specification that uses the config data stored in the ConfigMap:

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
1. Create the pod.

  ```shell
  kubectl create -f docs/user-guide/configmap/redis/redis-pod.yaml
  ```

In the example, the config volume is mounted at `/redis-master`. 
It uses `path` to add the `redis-config` key to a file named `redis.conf`. 
The file path for the redis config, therefore, is `/redis-master/redis.conf`.    
This is where the image will look for the config file for the redis master.

1. Use `kubectl exec` to enter the pod and run the `redis-cli` tool to verify that the configuration was correctly applied:

   ```shell
   kubectl exec -it redis redis-cli
   127.0.0.1:6379> CONFIG GET maxmemory
   1) "maxmemory"
   2) "2097152"
   127.0.0.1:6379> CONFIG GET maxmemory-policy
   1) "maxmemory-policy"
   2) "allkeys-lru"
   ```

=======
>>>>>>> upstream/master
{% endcapture %}

{% capture discussion %}

## Understanding ConfigMaps and Pods

### Restrictions

1. You must create a ConfigMap before referencing it in a Pod specification (unless you mark the ConfigMap as "optional"). If you reference a ConfigMaps that doesn't exist, the Pod won't start. Likewise, references to keys that don't exist in the ConfigMap will prevent the pod from starting.

1. If you use `envFrom` to define environment variables from ConfigMaps, keys that are considered invalid will be skipped. The pod will be allowed to start, but the invalid names will be recorded in the event log (`InvalidVariableNames`). The log message lists each skipped key. For example:

   ```shell
   kubectl get events
   LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
   0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
   ```

1. ConfigMaps reside in a specific [namespace](/docs/user-guide/namespaces/). A ConfigMap can only be referenced by pods residing in the same namespace.

1. Kubelet doesn't support the use of ConfigMaps for pods not found on the API server. 
   This includes every pod created using kubectl or indirectly via a replication controller. 
   It does not include pods created via the Kubelet's `--manifest-url` flag, `--config` flag, or the Kubelet REST API. (Note: these are not commonly-used ways to create pods.)
   
{% endcapture %}

{% capture whatsnext %}
<<<<<<< HEAD
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configmap.html).
=======
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configmap/).
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
>>>>>>> upstream/master

{% endcapture %}

{% include templates/task.md %}
