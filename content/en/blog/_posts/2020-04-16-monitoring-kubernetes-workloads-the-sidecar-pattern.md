---
layout: blog
title: 'Monitoring Kubernetes Workloads: The Sidecar Pattern'
date: 2020-04-16
slug: monitoring-kubernetes-sidecar-pattern
---

Kubernetes has entirely changed the way we build infrastructure, speeding up deployments and letting us replicate and scale microservice architectures. That speed comes with a new set of challenges around how we maintain visibility and monitor infrastructure.

In this post, I’ll recap the [webinar Sensu CEO Caleb Hailey did with the CNCF](https://www.youtube.com/watch?v=X14nPCoNUg0), where he discussed some of the existing and popular patterns for monitoring Kubernetes (like Prometheus) and why traditional methods fall short in a cloud-native world. I’ll also go over current best practices for monitoring workloads on Kubernetes, including the sidecar pattern for monitoring.

## Containers: the new reality

We’ve long been relying on microservices to ship software faster and more reliably in the cloud. Containerization was the natural next step in that evolution and — in conjunction with Kubernetes for container orchestration — has enabled us (and forced us, really) to rethink how we deploy and monitor applications. 

Cloud computing is here to stay, and while Kubernetes is a powerful platform for deploying applications no matter where they run, that kind of power introduces a lot more complexity. 

## Monitoring Kubernetes: the challenges and data sources

Adopting Kubernetes means contending with an enormous variety of data sources. These data sources are all abstractions, so to gain visibility into the health and performance of the system, you need access to monitoring data down the stack.

Sensu CTO Sean Porter [outlines the data sources in detail in this post](https://www.cncf.io/blog/2019/01/09/monitoring-kubernetes-part-1-the-challenges-data-sources/). In short, you need to be able to collect data from four primary sources:

1. **The Kubernetes hosts running the Kubelet**. The most common way to get data out of these hosts is to use the [Prometheus node exporter](https://github.com/prometheus/node_exporter), which scrapes data from the Kubernetes host and exposes system resource telemetry data on an HTTP endpoint.
2. **The Kubernetes process, AKA Kubelet metrics**. These provide details on Kubernetes nodes and the jobs they run.
3. **The Kubelet’s built-in [cAdvisor](https://github.com/google/cadvisor)**, which helps keep track of resource usage for running containers.  
4. **Kube-state-metrics** for a big picture view at the Kubernetes cluster level.

The dynamic nature of Kubernetes requires a dynamic approach to monitoring that can contend with high volumes of distributed applications and ephemeral infrastructure.

## Kubernetes monitoring strategies

Broadly speaking, here are the monitoring strategies as I see them:
 
- **Remote polling** - The traditional service check approach that polls devices and reports on their health.
- **Node-based (agent per host)** - A monitoring agent lives on the Kubernetes host or is operated as a DaemonSet inside the Kubernetes cluster with the appropriate configuration to gain access to info about system resources.
- **Sidecars (agent per pod)** - The approach we’ll discuss below that monitors the Kubernetes system as well as the workloads it’s running. 
- **Logs & APMs** - Management of both log data and application performance, which is out of scope for today’s discussion.

With these observability approaches in mind, let’s take a closer look at one of the more traditional ways for monitoring Kubernetes: using Prometheus. 

### Prometheus + Kubernetes

Sean writes about [the ways that Prometheus can be a great telemetry-based monitoring companion to Kubernetes](https://blog.sensu.io/monitoring-kubernetes-docker-part-2-prometheus). In particular, if you don’t want your developers to have to think about modifying their deployment YAML, Prometheus is great for that. You can instrument your apps and expose telemetry-focused metrics. Developers can reference a ConfigMap to make use of a sidecar pattern, (more details on that below).

However, if you need the additional functional service health checking, you can’t really map “Is this thing healthy or not?” to a 1 and a 0 with Prometheus. To check functional service health, you need to look elsewhere.  

### A more comprehensive approach: the sidecar pattern

The sidecar pattern of monitoring Kubernetes is a more dynamic approach, and the early days of its adoption have been fun to follow. In fact, sidecars as a pattern aren’t a formal convention of Kubernetes, but they’ve picked up speed as the Kubernetes community experiments and figure out what works. 

Examples of Kubernetes sidecars include:

- Service mesh
- Logging platforms with agents that run as sidecars
- Monitoring solutions like Sensu with an agent that runs as a sidecar, giving you a 1:1 pairing of a monitoring agent per collection of services.

When you use the sidecar pattern, your Kubernetes pod holds the container that runs your app alongside the container that runs the Sensu agent. These containers share the same network space so your applications can talk to Sensu as if they were running in the same container or host. 

![sidecar pattern for kubernetes](https://user-images.githubusercontent.com/38439765/76876119-785fe400-683f-11ea-8567-7c97dc035211.png)

The benefits of sidecars align with the very same values that give microservices an advantage in a cloud-native context. Sidecars are:

- Modular
- Composable
- Reusable

For more info on what makes the sidecar pattern the most flexible way to monitor Kubernetes, [check out this blog post](https://blog.sensu.io/monitoring-kubernetes-part-4-the-sensu-native-approach). 

### Demos: Getting started with sidecars

In this tutorial, we’ll deploy an example application (a default NGINX website) in Kubernetes [using Kubectl to manage the deployment](https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/). In the second part of the demo, we’ll look at how to monitor the application we’ve deployed. 

If you want to follow along at home, you’ll need to install Kubernetes (or set up the [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/) tool to run Kubernetes locally) and [deploy Sensu into Kubernetes](https://github.com/sensu/sensu-kube-demo). As a companion to Sensu, I also have InfluxDB as my time-series database and Grafana for building custom visualization dashboards. 

First, deploy your NGINX deployment using `kubectl apply`:

```
$ kubectl create namespace webinar
$ kubectl --namespace webinar apply -f kubernetes/nginx-deployment.yaml
$ kubectl --namespace webinar get services
NAME    TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
nginx   LoadBalancer   10.27.251.183   35.230.122.31   8000:30161/TCP   33d
```

The NGINX container by default runs on port 80. I expose that outside of the Kubernetes cluster at port 8000.

Now, visit your example application in your browser, accessible at [http://35.230.122.31:8000](http://35.230.122.31:8000) And, voilà! We’ve launched a new service, all powered by Kubernetes.

![Welcome-to-nginx](https://user-images.githubusercontent.com/38439765/76876437-ee644b00-683f-11ea-90e3-a3c5a344dc58.png)

This is the stage that a lot of you may have reached: You’ve deployed an app or service in Kubernetes, but want to figure out the best way to monitor it. 

Let’s look at how to add the Sensu Go agent as a sidecar to your application. (This works with all Kubernetes controllers: deployments, Statefulsets, DaemonSets, and so on.) 

Update your deployment using `kubectl apply`:

```
$ kubectl --namespace webinar apply -f 
kubernetes/nginx-deployment-with-sensu-sidecar.yaml
```

Visit the Sensu dashboard, and you’ll see Sensu auto-register the sidecars. (Sensu also automatically de-registers nodes, so you can tell the difference between a node that’s down versus one that’s been de-provisioned.)

![Sensu dashboard monitoring Kubernetes](https://user-images.githubusercontent.com/38439765/76876664-3d11e500-6840-11ea-8fac-baa96eb5bbc9.png)

Here’s the excerpt from the `.spec.template.spec.containers` scope in the Kubernetes deployment that makes this possible: 

```
- name: sensu-agent
  image: sensu/sensu:5.11.1
  command: ["/opt/sensu/bin/sensu-agent", "start", "--log-level=debug", "--insecure-skip-tls-verify", "--keepalive-interval=5", "--keepalive-timeout=10"]
  env:
  - name: SENSU_BACKEND_URL
    value: wss://sensu-backend-0.sensu.sensu-system.svc.cluster.local:8081 wss://sensu-backend-1.sensu.sensu-system.svc.cluster.local:8081 wss://sensu-backend-2.sensu.sensu-system.svc.cluster.local:8081
  - name: SENSU_NAMESPACE
    value: webinar
  - name: SENSU_SUBSCRIPTIONS
    value: linux kubernetes nginx
  - name: SENSU_DEREGISTER
    value: "true"
  - name: SENSU_STATSD_EVENT_HANDLERS
    value: statsd
```

Now that you have this configuration in place, you can scale resources easily. 

```
$ kubectl --namespace webinar scale deployment nginx --replicas 10
```

Before we configure the monitoring check, I’ll provide some background on Sensu’s architecture and how the services communicate. The Sensu agent communicates with the Sensu backend in a pub-sub model, and the agent only requires outbound network access so we don’t have to open ports in the agent or on the pod to get access to them. Agents have TLS-encrypted web sockets in Sensu Go, and they maintain this connection with the Sensu backend, with built-in support for high availability. 

When the agent connects, it self-describes its role. In the case of a sidecar, it says, “I’m on Kubernetes, I’m a Docker container, and my role is an nginx service.” The agents subscribe to topics, called subscriptions, on the backend in order to gather data. Sensu supports a wide variety of plugins, from [Nagios plugins](https://blog.sensu.io/the-story-of-nagios-plugin-support-in-sensu) to your localhost [StatsD socket](https://docs.sensu.io/sensu-go/latest/reference/agent/#create-monitoring-events-using-the-statsd-listener) to [Prometheus endpoints](https://blog.sensu.io/the-sensu-prometheus-collector-972c441d45e) and more. 

In this tutorial, we’ll configure a simple check with the Nagios `check_http` plugin.

First, you need to provide the Sensu configuration, which includes four main attributes: resource type, API version, metadata, and spec. These get registered in the control plane and associate with the monitoring check configuration.

For example, here’s a monitoring check in Sensu with the plugins needed to register that check:

![Sensu monitoring check](https://user-images.githubusercontent.com/38439765/76876928-ab56a780-6840-11ea-84c4-c0e0555ff9d8.png)

The output is in the format of `nagios_perfdata`, and I want it to write to InfluxDB.

Let’s configure the monitoring check:

```
$ sensuctl --namespace webinar create -f sensu/checks/check-nginx.yaml
```

You’ll see the configuration appear in your Sensu dashboard, where it can be edited if needed, and it’ll automatically execute on all three of your Kubernetes pods. 

![Sensu configuration in dashboard](https://user-images.githubusercontent.com/38439765/76877049-d04b1a80-6840-11ea-948e-c09e7a744739.png)

Here’s your service check result:

![Sensu check result in dashboard](https://user-images.githubusercontent.com/38439765/76877080-df31cd00-6840-11ea-8b51-447fcb66243b.png)

Eventually, we want a dashboard of this data, and that’s why [Sensu’s monitoring event pipeline](https://blog.sensu.io/workflow-automation-for-monitoring) makes a big impact. You can configure an InfluxDB handler in Sensu that converts the data from its Nagios format to InfluxDB format, so it can be written into InfluxDB and you can start seeing the metrics on your Granfana dashboard. 

Here’s how to configure the telemetry pipeline (InfluxDB handler):

```
$ sensuctl --namespace webinar create -f sensu/handlers/influxdb.yaml
```

You can revisit these configurations [in GitHub](https://github.com/calebhailey/monitoring-k8s-workloads), and I’d love to hear your feedback on this tutorial.

## Over to you

There you have it! Now you’ve got a simple pipeline set up that collects metrics from Kubernetes via a sidecar pattern and is able to send the data to Grafana for visualization.  

If you’d like to learn more about the InfluxDB handler (or any of the other handlers that you can use with Sensu Go, including handlers for PagerDuty, ElasticSearch, Splunk, etc.), visit [Bonsai](https://bonsai.sensu.io/), the Sensu community’s directory of open source assets.
