---

approvers:
- cdrage

title: Kompose 概览
---

<!--`kompose` is a tool to help users who are familiar with `docker-compose` move to **Kubernetes**. `kompose` takes a Docker Compose file and translates it into Kubernetes resources.
-->
`kompose` 是一个将`docker-compose`迁移到 **Kubernetes** 的工具，`kompose` 会把Docker Compose文件翻译成Kubernetes资源文件。
<!--`kompose` is a convenience tool to go from local Docker development to managing your application with Kubernetes. Transformation of the Docker Compose format to Kubernetes resources manifest may not be exact, but it helps tremendously when first deploying an application on Kubernetes.
-->
`kompose` 是从本地Docker管理到使用Kubernetes管理你的应用程序的便利工具。Docker的转换撰写格式到Kubernetes资源清单可能不是精确的，但会起到参考作用，尤其是初次在Kubernetes上部署应用程序。

## 用例说明
<!--
If you have a Docker Compose `docker-compose.yml` or a Docker Distributed Application Bundle `docker-compose-bundle.dab` file, you can convert it into Kubernetes deployments and services like this:
-->
如果你有一个Docker Compose的`docker-compose.yml`文件或者一个Docker分布式应用捆绑包的`docker-compose-bundle.dab`文件，可以通过kompose命令将它们生成为Kubernetes的deplyment、service的资源文件，如下所示：

```console
$ kompose --bundle docker-compose-bundle.dab convert
WARN[0000]: Unsupported key networks - ignoring
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created

$ kompose -f docker-compose.yml convert
WARN[0000]: Unsupported key networks - ignoring
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created
```

## 安装说明

<!--Grab the latest [release](https://github.com/kubernetes-incubator/kompose/releases) for your OS, untar and extract the binary.
-->
下载最新的kompose[版本](https://github.com/kubernetes-incubator/kompose/releases)，解压并提取二进制文件。
### Linux

```sh
wget https://github.com/kubernetes-incubator/kompose/releases/download/v0.1.2/kompose_linux-amd64.tar.gz
tar -xvf kompose_linux-amd64.tar.gz --strip 1
sudo mv kompose /usr/local/bin
```
