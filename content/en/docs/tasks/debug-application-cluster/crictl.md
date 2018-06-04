---
reviewers:
- Random-Liu
- feiskyer
- mrunalp
title: Inspect Kubernetes node with crictl
---

crictl provides a CLI for CRI-compatible container runtimes. It helps users inspect and debug container runtime and applications on a Kubernetes node.

crictl is GA since v1.11.0 and is hosted at the [cri-tools](https://github.com/kubernetes-incubator/cri-tools) repository.

{{< toc >}}

## Install crictl

crictl can be downloaded from cri-tools [release page](https://github.com/kubernetes-incubator/cri-tools/releases):

```sh
VERSION="v1.11.0"
wget https://github.com/kubernetes-incubator/cri-tools/releases/download/$VERSION/crictl-$VERSION-linux-amd64.tar.gz
sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
rm -f crictl-$VERSION-linux-amd64.tar.gz
```

## Usage

```sh
crictl SUBCOMMAND [FLAGS]
```

Subcommands includes:

- `attach`:       Attach to a running container
- `create`:       Create a new container
- `exec`:         Run a command in a running container
- `version`:      Display runtime version information
- `images`:       List images
- `inspect`:      Display the status of one or more containers
- `inspecti`:     Return the status of one ore more images
- `inspectp`:     Display the status of one or more pods
- `logs`:         Fetch the logs of a container
- `port-forward`: Forward local port to a pod
- `ps`:           List containers
- `pull`:         Pull an image from a registry
- `runp`:         Run a new pod
- `rm`:           Remove one or more containers
- `rmi`:          Remove one or more images
- `rmp`:          Remove one or more pods
- `pods`:         List pods
- `start`:        Start one or more created containers
- `info`:         Display information of the container runtime
- `stop`:         Stop one or more running containers
- `stopp`:        Stop one or more running pods
- `update`:       Update one or more running containers
- `config`:       Get and set crictl options
- `stats`:        List container(s) resource usage statistics
- `completion`:   Output bash shell completion code
- `help, h`:      Shows a list of commands or help for one command

crictl connects to `unix:///var/run/dockershim.sock` by default. For other runtimes, the endpoint can be set in three ways:

- By setting flags `--runtime-endpoint` and `--image-endpoint`
- By setting environment variables `CONTAINER_RUNTIME_ENDPOINT` and `IMAGE_SERVICE_ENDPOINT`
- By setting the endpoint in the config file `--config=/etc/crictl.yaml`

```sh
$ cat /etc/crictl.yaml
runtime-endpoint: unix:///var/run/dockershim.sock
image-endpoint: unix:///var/run/dockershim.sock
timeout: 10
debug: true
```

## Additional options

- `--runtime-endpoint`, `-r`: CRI server runtime endpoint (default: "unix:///var/run/dockershim.sock").The default server is dockershim. If we want to debug other CRI server such as frakti, we can add flag `--runtime-endpoint=/var/run/frakti.sock`
- `--image-endpoint`, `-i`: CRI server image endpoint, default same as runtime endpoint.
- `--timeout`, `-t`: Timeout of connecting to server (default: 10s)
- `--debug`, `-D`: Enable debug output
- `--help`, `-h`: show help
- `--version`, `-v`: print the version information of crictl
- `--config`, `-c`: Config file in yaml format. Overrided by flags or environment variables.

## Examples

### List pods

List all pods:

```sh
$ crictl pods
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

List pods with specified name:

```sh
$ crictl pods --name nginx-65899c769f-wv2gp
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

List pods with specified labels:

```sh
$ crictl pods --label run=nginx
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

### List images

List all images:

```sh
$ crictl images
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s-gcrio.azureedge.net/hyperkube-amd64   v1.10.3             e179bbfe5d238       665MB
k8s-gcrio.azureedge.net/pause-amd64       3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

List images with specified repository:

```sh
$ crictl images nginx
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

Only list image IDs:

```sh
$ crictl images -q
sha256:8c811b4aec35f259572d0f79207bc0678df4c736eeec50bc9fec37ed936a472a
sha256:e179bbfe5d238de6069f3b03fccbecc3fb4f2019af741bfff1233c4d7b2970c5
sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e
sha256:cd5239a0906a6ccf0562354852fae04bc5b52d72a2aff9a871ddb6bd57553569
```

### List containers

List all containers:

```sh
crictl ps -a
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 minutes ago       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 minutes ago       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 hours ago        Running             kube-proxy                 0
```

List only running containers:

```sh
$ crictl ps
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 minutes ago       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 hours ago        Running             kube-proxy                 0
```

### Exec a command in container

```sh
$ crictl exec -i -t 1f73f2d81bf98 ls
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

### Get container logs

Get all container logs:

```sh
$ crictl logs 87d3992f84f74
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

Get only tailing lines of logs:

```sh
$ crictl logs --tail=1 87d3992f84f74
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

### Run pod sandbox

This in only used when debugging container runtime. It is not recommended to create pod sandbox on a Kubernetes nodes. It will be stopped and deleted by kubelet.

```sh
$ cat pod-config.json
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

$ crictl runp pod-config.json
f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f
```

### Create container

This in only used when debugging container runtime. It is not recommended to create container on a Kubernetes nodes. It will be stopped and deleted by kubelet.

Pull a busybox image

```sh
$ crictl pull busybox
Image is up to date for busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47
```

Create config for pod and container:

```sh
$ cat pod-config.json
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

$ cat container-config.json
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
  "log_path":"busybox/0.log",
  "linux": {
  }
}
```

Create the container:

```sh
$ crictl create f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f container-config.json pod-config.json
3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

List containers and check the container is in Created state:

```sh
$ crictl ps -a
CONTAINER ID        IMAGE               CREATED             STATE               NAME                ATTEMPT
3e025dd50a72d       busybox             32 seconds ago      Created             busybox             0
```

### Start container

This in only used when debugging container runtime. It is not recommended to start container on a Kubernetes nodes. It will be stopped by kubelet.

```sh
$ crictl start 3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60

$ crictl ps
CONTAINER ID        IMAGE               CREATED              STATE               NAME                ATTEMPT
3e025dd50a72d       busybox             About a minute ago   Running             busybox             0
```

## More information

Visit [kubernetes-incubator/cri-tools](https://github.com/kubernetes-incubator/cri-tools) for more information.
