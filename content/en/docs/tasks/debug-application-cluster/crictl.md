---
reviewers:
- Random-Liu
- feiskyer
- mrunalp
title: Debugging Kubernetes nodes with crictl
content_template: templates/task
---


{{% capture overview %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`crictl` is a command-line interface for CRI-compatible container runtimes.
You can use it to inspect and debug container runtimes and applications on a
Kubernetes node. `crictl` and its source are hosted in the
[cri-tools](https://github.com/kubernetes-incubator/cri-tools) repository.

{{% /capture %}}

{{% capture prerequisites %}}

`crictl` requires a Linux operating system with a CRI runtime.

{{% /capture %}}

{{% capture steps %}}

## Installing crictl

You can download a compressed archive `crictl` from the cri-tools [release
page](https://github.com/kubernetes-incubator/cri-tools/releases), for several
different architectures. Download the version that corresponds to your version
of Kubernetes. Extract it and move it to a location on your system path, such as
`/usr/local/bin/`.

## General usage

The `crictl` command has several subcommands and runtime flags. Use
`crictl help` or `crictl <subcommand> help` for more details.

`crictl` connects to `unix:///var/run/dockershim.sock` by default. For other
runtimes, you can set the endpoint in multiple different ways:

- By setting flags `--runtime-endpoint` and `--image-endpoint`
- By setting environment variables `CONTAINER_RUNTIME_ENDPOINT` and `IMAGE_SERVICE_ENDPOINT`
- By setting the endpoint in the config file `--config=/etc/crictl.yaml`

You can also specify timeout values when connecting to the server and enable or
disable debugging, by specifying `timeout` or `debug` values in the configuration
file or using the `--timeout` and `--debug` command-line flags.

To view or edit the current configuration, view or edit the contents of `/etc/crictl.yaml`.

```shell
cat /etc/crictl.yaml
runtime-endpoint: unix:///var/run/dockershim.sock
image-endpoint: unix:///var/run/dockershim.sock
timeout: 10
debug: true
```

## Example crictl commands

The following examples show some `crictl` commands and example output.

{{< warning >}}
If you use `crictl` to create pod sandboxes or containers on a running
Kubernetes cluster, the Kubelet will eventually delete them. `crictl` is not a
general purpose workflow tool, but a tool that is useful for debugging.
{{< /warning >}}

### List pods

List all pods:

```shell
crictl pods
```
The output is similar to this:

```
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

List pods by name:

```shell
crictl pods --name nginx-65899c769f-wv2gp
```
The output is similar to this:

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

List pods by label:

```shell
crictl pods --label run=nginx
```
The output is similar to this:

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

### List images

List all images:

```shell
crictl images
```
The output is similar to this:

```
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s-gcrio.azureedge.net/hyperkube-amd64   v1.10.3             e179bbfe5d238       665MB
k8s-gcrio.azureedge.net/pause-amd64       3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

List images by repository:

```shell
crictl images nginx
```
The output is similar to this:

```
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

Only list image IDs:

```shell
crictl images -q
```
The output is similar to this:

```
sha256:8c811b4aec35f259572d0f79207bc0678df4c736eeec50bc9fec37ed936a472a
sha256:e179bbfe5d238de6069f3b03fccbecc3fb4f2019af741bfff1233c4d7b2970c5
sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e
sha256:cd5239a0906a6ccf0562354852fae04bc5b52d72a2aff9a871ddb6bd57553569
```

### List containers

List all containers:

```shell
crictl ps -a
```
The output is similar to this:

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 minutes ago       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 minutes ago       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 hours ago        Running             kube-proxy                 0
```

List running containers:

```
crictl ps
```
The output is similar to this:

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 minutes ago       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 hours ago        Running             kube-proxy                 0
```

### Execute a command in a running container

```shell
crictl exec -i -t 1f73f2d81bf98 ls
```
The output is similar to this:

```
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

### Get a container's logs

Get all container logs:

```shell
crictl logs 87d3992f84f74
```
The output is similar to this:

```
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

Get only the latest `N` lines of logs:

```shell
crictl logs --tail=1 87d3992f84f74
```
The output is similar to this:

```
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

### Run a pod sandbox

Using `crictl` to run a pod sandbox is useful for debugging container runtimes.
On a running Kubernetes cluster, the sandbox will eventually be stopped and
deleted by the Kubelet.

1.  Create a JSON file like the following:

      ```json
      {
          "metadata": {
              "name": "nginx-sandbox",
              "namespace": "default",
              "attempt": 1,
              "uid": "hdishd83djaidwnduwk28bcsb"
          },
          "logDirectory": "/tmp",
          "linux": {
          }
      }
      ```

2.  Use the `crictl runp` command to apply the JSON and run the sandbox.

      ```shell
      crictl runp pod-config.json
      ```

      The ID of the sandbox is returned.

### Create a container

Using `crictl` to create a container is useful for debugging container runtimes.
On a running Kubernetes cluster, the sandbox will eventually be stopped and
deleted by the Kubelet.

1.  Pull a busybox image

      ```shell
      crictl pull busybox
      Image is up to date for busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47
      ```

2.  Create configs for the pod and the container:

      **Pod config**:
      ```yaml
      {
          "metadata": {
              "name": "nginx-sandbox",
              "namespace": "default",
              "attempt": 1,
              "uid": "hdishd83djaidwnduwk28bcsb"
          },
          "log_directory": "/tmp",
          "linux": {
          }
      }
      ```

      **Container config**:
      ```yaml
      {
        "metadata": {
            "name": "busybox"
        },
        "image":{
            "image": "busybox"
        },
        "command": [
            "top"
        ],
        "log_path":"busybox.log",
        "linux": {
        }
      }
      ```

3.  Create the container, passing the ID of the previously-created pod, the
    container config file, and the pod config file. The ID of the container is
    returned.

      ```shell
      crictl create f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f container-config.json pod-config.json
      ```

4.  List all containers and verify that the newly-created container has its
    state set to `Created`.

      ```shell
      crictl ps -a
      ```
      The output is similar to this:
      
      ```
      CONTAINER ID        IMAGE               CREATED             STATE               NAME                ATTEMPT
      3e025dd50a72d       busybox             32 seconds ago      Created             busybox             0
      ```

### Start a container

To start a container, pass its ID to `crictl start`:

```shell
crictl start 3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```
The output is similar to this:

```
3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

Check the container has its state set to `Running`.

```shell
crictl ps
```
The output is similar to this:

```
CONTAINER ID        IMAGE               CREATED              STATE               NAME                ATTEMPT
3e025dd50a72d       busybox             About a minute ago   Running             busybox             0
```

{{% /capture %}}


{{% capture discussion %}}

See [kubernetes-incubator/cri-tools](https://github.com/kubernetes-incubator/cri-tools)
for more information.

{{% /capture %}}
