---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

This page provides a real world example of how to configure Redis using a ConfigMap and builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task. 



## {{% heading "objectives" %}}


- Create a ConfigMap for a Redis pod
- Adjust configuration in the ConfigMap with new custom values
- Verify configurations were applied


## {{% heading "prerequisites" %}}


- A Kubernetes cluster. You can use [minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/) or a Kubernetes playground, such as [Killercoda](https://killercoda.com/playgrounds/scenario/kubernetes), [KodeKloud](https://kodekloud.com/public-playgrounds), or [Play with Kubernetes](https://labs.play-with-k8s.com/).
- The `kubectl` command line tool, which must be configured to communicate with the cluster. This tutorial works with kubectl version 1.14 and above.

## Resources
You will use apply the following files as part of the tutorial:
- ConfigMap file (`example-redis-config.yaml`): a file we create to define the ConfigMap for custom Redis configurations
- Redis pod manifest (`redis-pod.yaml`): a file we reference to define a Redis pod and mount the ConfigMap

<!-- lessoncontent -->


## Steps

### Step 1: Create and apply the ConfigMap
1. Create an empty file called `example-redis-config.yaml` in the intended directory. This will be your ConfigMap.
2. Add the following code block to the file. You can learn more about the parameteres of the code block by opening the "About this code block..." dropdown.
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
```
  {{< details summary="About this code block" >}}
  | field | description |
  |---------------|----------------|
  | apiVersion | the API version of the Kubernetes resource |
  | kind | the type of Kubernetes object being created |
  | metadata | unique data for identifying the object such as a name |
  | data | a key-value map of configuration data, in this case defining an empty redis-config value |
  {{< /details >}}


3. Apply the ConfigMap file we just created with the following command in a bash terminal.
```bash
kubectl apply -f example-redis-config.yaml
```

### Step 2: Apply and examine the Redis pod manifest.
1. Apply the provided Redis pod manifest using the following bash command:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```
2. Examine the diagram below to understand how configuration data flows from the ConfigMap to the Redis pod. The full manifest and a table with descriptions can be found in the “Redis pod manifest explanation” dropdown.

{{< mermaid >}}
flowchart TD
    A["example-redis-config.yaml → data"] -- "contains key 'redis-config'<br>with config content" --> B["redis-pod.yaml →<br>spec.volumes.config"]
    B -- "defines path to this key as 'redis.conf'" --> C["redis-pod.yaml → spec.containers.volumeMounts"]
    C -- "mounts the config file at '/redis-master'" --> D["redis-pod.yaml → spec.containers.command"]
    D -- "runs two commands:</br>- redis-server starts the Redis server</br>- '/redis-master/redis.conf' applies configs" --> F["Redis pod created with ConfigMap configuration"]
{{< /mermaid >}}

{{< details summary="Redis pod manifest explanation" >}}
In the yaml block below, we can see how content from the ConfigMap file is applied to the Redis server. Pay special attention to the following values:

| field | description |
|---------------|----------------|
| spec.volumes | Contains the defined configMap that we created earlier (examples-redis-config). It takes the `data` key we defined earlier as `redis-config`, which is currently empty. It defines the path as `redis.conf`. |
| spec.containers.volumeMounts | Mounts the config value we defined under volumes and provides a mountPath of `/redis-master`.
| spec.containers.command | Defines two commands for when the pod manifest is applied–`redis-server` runs the server, and `/redis-master/redis.conf` finds the mounted volume location (/redis-master) and applies the configuration from the ConfigMap file (“redis.conf”).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
  - name: redis
    image: redis:8.0.2
    command:
      - redis-server
      - "/redis-master/redis.conf"
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
          path: redis.con
```
{{< /details >}}

### Step 3: Check the created objects and confirm the configuration has been applied
1. Examine the created objects using the following bash command, noting the creation of `pod/redis` (the Redis pod) and `configmap/example-redis-config` (the mounted ConfigMap).
```bash
kubectl get pod/redis configmap/example-redis-config
```
2. Enter the pod and check the configuration with the following bash command:
```bash
kubectl exec -it redis -- redis-cli
```
3. Run the following CLI command to confirm that we’ve set the `maxmemory` to the default, which is 0:
```
127.0.0.1:6379> CONFIG GET maxmemory
```
4. Run the following CLI command to confirm that we’ve set the `maxmemory-policy` to the default, `noeviction`:
```
127.0.0.1:6379> CONFIG GET maxmemory-policy
```
5. Exit the Redis CLI.

### Step 4: Adjust custom configurations
1. Return to the `example-redis-config.yaml` file and replace the contents with the following code block to add custom configurations to the `redis-config` key:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: |
    maxmemory 2mb
    maxmemory-policy allkeys-lru  
```
2. Apply the updated ConfigMap with the following bash command:
```bash
kubectl apply -f example-redis-config.yaml
```
### Step 5: Delete and recreate Redis pod with new configs
1. Delete the Redis pod with the default configuration values by running the following bash command:
```bash
kubectl delete pod redis
```
2. Recreate the Redis pod by applying the pod manifest, which will run the `"/redis-master/redis.conf"` command and apply our new configurations.
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```
### Step 6: Verify the custom configurations have been applied
1. Enter the pod and check the configuration with the following bash command:
```bash
kubectl exec -it redis -- redis-cli
```
2. Run the following CLI command to confirm that we’ve set the `maxmemory` to "2097152", which is 2mb:
```
127.0.0.1:6379> CONFIG GET maxmemory
```
3. Run the following CLI command to confirm that we’ve set the `maxmemory-policy` to  `allkeys-lru`:
```
127.0.0.1:6379> CONFIG GET maxmemory-policy
```
### Step 7: Clean up workspace
1. Clean up your work by deleting the created resources:
```bash
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}

* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).