---
title: Use ConfigMap Data in Pods 
---

{% capture overview %}
This page provides a series of usage examples demonstrating how to configure Pods using data stored in ConfigMaps. 
{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}
* [Create a ConfigMap](/docs/tasks/configure-pod-container/configmap.html)
{% endcapture %}

{% capture steps %}


## Define Pod environment variables using ConfigMap data

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


## Use ConfigMap-defined environment variables in Pod commands  

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

## Add ConfigMap data to a Volume 

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
In this case, the `special.level` item will be mounted in the `config-volume` volume at `/etc/config/keys`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: [ "/bin/sh","-c","cat /etc/config/keys" ]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: special-config
        items:
        - key: special.level
          path: keys
  restartPolicy: Never
```

When the pod runs, the command (`"cat /etc/config/keys"`) produces the output below:

```shell
very
```

### Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret#using-secrets-as-files-from-a-pod) user guide explains the syntax.

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
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configmap/).
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).

{% endcapture %}

{% include templates/task.md %}
