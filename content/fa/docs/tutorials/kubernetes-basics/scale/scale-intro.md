---
title: اجرای نسخه های مختلفی از برنامه هایتان
weight: 10
---

## {{% heading "objectives" %}}

* مقیاس دهی دستی یک برنامه توسط دستور kubectl.

## تغییر مقیاس برنامه ها

این آموزش قسمتی از دوره آموزش مقدماتی است و با این باور نوشته شده که شما [قسمت های قبلی](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/) دوره را کامل کرده اید.

در آموزش های گذشته ما یک [دیپلویمنت](http://localhost:1313/docs/concepts/workloads/controllers/deployment/) (Deployment) ایجاد کردیم و از طریق [سرویسی](http://localhost:1313/docs/concepts/services-networking/service/) (Service) آن را در خارج از کلاسترمان منتشر کردیم و دیپلویمنت آموزشی ما یک نسخه از برنامه را درون پاد اجرا کرد.
در صورتی که تعداد کاربران برنامه ما افزایش یابد ما باید مقیاس برنامه خود را افزایش دهیم.

{{< note >}}
اگر سرویس را در [آموزش قبلی](/docs/tutorials/kubernetes-basics/expose/expose-intro) حذف نکرده اید اول آن را حذف کنید و سپس از طریق اجرای دستور زیر یک سرویس جدید از نوع `LoadBalancer` را بسازید:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```

توجه داشته باشید که این آموزش با این پیش فرض نوشته شده که شما یک سرویس از نوع `LoadBalancer` دارید.
{{< /note >}}

## مرور کلی مقیاس دهی

<!-- animation -->
<div class="col-md-8">
  <div id="myCarousel" class="carousel" data-ride="carousel" data-interval="3000">
    <div class="carousel-inner" role="listbox">
      <div class="item carousel-item active">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg">
      </div>
      <div class="item carousel-item">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg">
      </div>
    </div>
  </div>
</div>

{{% alert %}}
_مقیاس دهی در دیپلویمنت ها از طریق تغییر تعداد کپی های همسان (replicas) امکان پذیر است._
{{% /alert %}}

Scaling out a Deployment will ensure new Pods are created and scheduled to Nodes
with available resources. Scaling will increase the number of Pods to the new desired
state. Kubernetes also supports [autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
of Pods, but it is outside of the scope of this tutorial. Scaling to zero is also
possible, and it will terminate all Pods of the specified Deployment.

Running multiple instances of an application will require a way to distribute the
traffic to all of them. Services have an integrated load-balancer that will distribute
network traffic to all Pods of an exposed Deployment. Services will monitor continuously
the running Pods using endpoints, to ensure the traffic is sent only to available Pods.

Once you have multiple instances of an application running, you would be able to
do Rolling updates without downtime. We'll cover that in the next section of the
tutorial. Now, let's go to the terminal and scale our application.

### مقیاس دهی دیپلویمنت

To list your Deployments, use the `get deployments` subcommand:

```shell
kubectl get deployments
```

The output should be similar to:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

We should have 1 Pod. If not, run the command again. This shows:

* _NAME_ lists the names of the Deployments in the cluster.
* _READY_ shows the ratio of CURRENT/DESIRED replicas
* _UP-TO-DATE_ displays the number of replicas that have been updated to achieve the desired state.
* _AVAILABLE_ displays how many replicas of the application are available to your users.
* _AGE_ displays the amount of time that the application has been running.

To see the ReplicaSet created by the Deployment, run:

```shell
kubectl get rs
```

Notice that the name of the ReplicaSet is always formatted as
<nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr>.
The random string is randomly generated and uses the pod-template-hash as a seed.

Two important columns of this output are:

* _DESIRED_ displays the desired number of replicas of the application, which you
define when you create the Deployment. This is the desired state.
* _CURRENT_ displays how many replicas are currently running.
Next, let’s scale the Deployment to 4 replicas. We’ll use the `kubectl scale` command,
followed by the Deployment type, name and desired number of instances:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

To list your Deployments once again, use `get deployments`:

```shell
kubectl get deployments
```

The change was applied, and we have 4 instances of the application available. Next,
let’s check if the number of Pods changed:

```shell
kubectl get pods -o wide
```

There are 4 Pods now, with different IP addresses. The change was registered in
the Deployment events log. To check that, use the `describe` subcommand:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

You can also view in the output of this command that there are 4 replicas now.

### Load Balancing

Let's check that the Service is load-balancing the traffic. To find out the exposed
IP and Port we can use `describe service` as we learned in the previous part of the tutorial:

```shell
kubectl describe services/kubernetes-bootcamp
```

Create an environment variable called NODE_PORT that has a value as the Node port:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Next, we’ll do a `curl` to the exposed IP address and port. Execute the command multiple times:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

We hit a different Pod with every request. This demonstrates that the load-balancing is working.

The output should be similar to:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
If you're running minikube with Docker Desktop as the container driver, a minikube
tunnel is needed. This is because containers inside Docker Desktop are isolated
from your host computer.

In a separate terminal window, execute:

```shell
minikube service kubernetes-bootcamp --url
```

The output looks like this:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Then use the given URL to access the app:

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

### کوچک کردن مقایس برنامه

To scale down the Deployment to 2 replicas, run again the `scale` subcommand:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

List the Deployments to check if the change was applied with the `get deployments` subcommand:

```shell
kubectl get deployments
```

The number of replicas decreased to 2. List the number of Pods, with `get pods`:

```shell
kubectl get pods -o wide
```

This confirms that 2 Pods were terminated.

## {{% heading "whatsnext" %}}

* Tutorial
[Performing a Rolling Update](/docs/tutorials/kubernetes-basics/update/update-intro/).
* Learn more about [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Learn more about [Autoscaling](/docs/concepts/workloads/autoscaling/).