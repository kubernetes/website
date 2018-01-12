---
title: Horizontal Pod Autoscaling Custom Metric Walkthrough
---

Starting from Kubernetes 1.7, you have the capability to do the auto-scaling based on observed application-provided metrics. This document walks you through an example of enabling Horizontal Pod Autoscaling for a sample web application based on the exposed metric - number of incoming requests.

For more information on how Horizontal Pod Autoscaling behaves, see the [Horizontal Pod Autoscaling user guide](/docs/tasks/run-application/horizontal-pod-autoscale/).

## Prerequisites

This document requires a running Kubernetes cluster and kubectl, version 1.7 or later. Prometheus monitoring system must be deployed in the cluster in order to collect the application-provided metrics, particularly number of incoming requests to the sample application. The [Aggregator layer](/docs/concepts/api-extension/apiserver-aggregation/) must be enabled and configured to register a custom api server which plays the edge role between the monitoring system and HPA controller.

This document is tested on Kubernetes version 1.8.0 provisioned via [Kubeadm](https://github.com/kubernetes/kubeadm) 1.8.0. The custom API server is developed by [Solly Ross](https://github.com/directxman12/k8s-prometheus-adapter); and the Prometheus system is deployed via [Prometheus Operator from CoreOS](https://github.com/coreos/prometheus-operator). All manifests used in this document can be found at [here](https://github.com/kubeless/kubeless/tree/master/manifests/autoscaling)

## Step one: Cluster configuration

Before getting started, ensure that the Kubernetes control plane is configured to run autoscaling with custom metrics. As of Kubernetes 1.8, this requires enabling the Aggregator layer on the API server and configuring the controller manager to use metric APIs via their REST clients. By using Kubeadm to provision the Kubernetes cluster, the aggregator layer is enabled and configured automatically via these below configuration parameters:

```
$ kubectl get po kube-apiserver-kube-master -n kube-system -o yaml
...
  - command:
    - /hyperkube
    - apiserver
    - --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt
    - --requestheader-group-headers=X-Remote-Group
    - --requestheader-allowed-names=front-proxy-client
    - --requestheader-username-headers=X-Remote-User
    - --requestheader-extra-headers-prefix=X-Remote-Extra-
    - --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt
    - --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key
...
```

## Step 2: Deploy A Prometheus Monitoring System

The Prometheus setup contains a CoreOS Prometheus operator and a Prometheus instance. We will deploy both of them using the commands below:

```
$ kubectl create -f prometheus-operator.yaml
$ kubectl create -f sample-prometheus-instance.yaml
```

Check the cluster services in order to make sure that Prometheus has been successfully deployed:

```
$ kubectl get svc

NAME                  CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes            10.96.0.1       <none>        443/TCP          6d
prometheus-operated   None            <none>        9090/TCP         1h
```

## Step 3: Deploy A Custom API Server

The custom API server that we deploy provides the `custom-metrics.metrics.k8s.io/v1beta1` API group/version and allows the HPA controller query custom metrics from that. The custom API server we are using here is a Prometheus adapter which can collect metrics from Prometheus and send them to the HPA controller via REST queries (that's why we previously configured the HPA controller to use REST client via the `--horizontal-pod-autoscaler-use-rest-clients` flag):

```
$ kubectl create -f custom-metrics.yaml

namespace "custom-metrics" created
serviceaccount "custom-metrics-apiserver" created
clusterrolebinding "custom-metrics:system:auth-delegator" created
rolebinding "custom-metrics-auth-reader" created
clusterrole "custom-metrics-read" created
clusterrolebinding "custom-metrics-read" created
deployment "custom-metrics-apiserver" created
service "api" created
apiservice "v1beta1.custom-metrics.metrics.k8s.io" created
clusterrole "custom-metrics-server-resources" created
clusterrolebinding "hpa-controller-custom-metrics" created
```

In this step, we deploy and register the custom API server to the aggregator layer, so we can see it listed in the enabled api-versions:

```
$ kubectl api-versions

admissionregistration.k8s.io/v1alpha1
apiextensions.k8s.io/v1beta1
apiregistration.k8s.io/v1beta1
apps/v1beta1
authentication.k8s.io/v1
authentication.k8s.io/v1beta1
authorization.k8s.io/v1
authorization.k8s.io/v1beta1
autoscaling/v1
autoscaling/v2alpha1
batch/v1
batch/v2alpha1
certificates.k8s.io/v1beta1
**custom-metrics.metrics.k8s.io/v1beta1**
extensions/v1beta1
monitoring.coreos.com/v1alpha1
networking.k8s.io/v1
policy/v1beta1
rbac.authorization.k8s.io/v1alpha1
rbac.authorization.k8s.io/v1beta1
settings.k8s.io/v1alpha1
storage.k8s.io/v1
storage.k8s.io/v1beta1
v1
```

Now, the custom API server is running:

```
$ kubectl get po -n custom-metrics

NAME                                        READY     STATUS    RESTARTS   AGE
custom-metrics-apiserver-2956926076-wcgmw   1/1       Running   0          1h
kubectl get --raw /apis/custom-metrics.metrics.k8s.io/v1beta1

{"kind":"APIResourceList","apiVersion":"v1","groupVersion":"custom-metrics.metrics.k8s.io/v1beta1","resources":[]}
```

## Step four: Deploy A Sample Application

Now we can deploy a sample application and a sample HPA rule to autoscale with `http_requests` metric collected and exposed via Prometheus. The HPA rule allows us to scale the application pods between 2 and 10 replicas, and all pods serve a total of 100 requests per second.

```
$ cat sample-metrics-app.yaml
...
---
kind: HorizontalPodAutoscaler
apiVersion: autoscaling/v2alpha1
metadata:
  name: sample-metrics-app-hpa
  spec:
    scaleTargetRef:
        kind: Deployment
        name: sample-metrics-app
    minReplicas: 2
    maxReplicas: 10
    metrics:
    - type: Object
      object:
        target:
          kind: Service
          name: sample-metrics-app
        metricName: http_request
        targetValue: 100
```

Apply the recently created HPA rule as shown below:

```
$ kubectl create -f sample-metrics-app.yaml

deployment "sample-metrics-app" created
service "sample-metrics-app" created
servicemonitor "sample-metrics-app" created
horizontalpodautoscaler "sample-metrics-app-hpa" created

$ kubectl get hpa
NAME                     REFERENCE                       TARGETS      MINPODS   MAXPODS   REPLICAS   AGE
sample-metrics-app-hpa   Deployment/sample-metrics-app   866m / 100   1         10        1          14m
```

To see the HPA controller scale up the number of application pods, increase some loads by hitting the `sample-metrics-app` service.

## Step five: Increase load

Now, we will see how the autoscaler reacts to increased load. We will start a container, and send an infinite loop of queries to the `sample-metrics-app` service (please run it in a different terminal)

```
$ kubectl run -i --tty load-generator --image=busybox /bin/sh

Hit enter for command prompt

$ while true; do wget -q -O- http://sample-metrics-app.default.svc.cluster.local; done
```

Within a minute or so, we should see the higher load by executing:

```
$ kubectl get hpa
NAME                     REFERENCE                       TARGETS        MINPODS   MAXPODS   REPLICAS   AGE
sample-metrics-app-hpa   Deployment/sample-metrics-app   19866m / 100   1         10        1          20m
```

As a result, the deployment was resized to 4 replicas:

```
$ kubectl get deployment sample-metrics-app
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
sample-metrics-app   4         4         4            4           30m
```

**Note** Sometimes it may take a few minutes to stabilize the number of replicas. Since the amount of load is not controlled in any way it may happen that the final number of replicas will differ from this example.

## Step six: Stop load

We stop the user load by terminating the `load-generator` container . Then after a few minutes, HPA autoscale the number of replicas back down to 1.

```
$ kubectl get hpa
NAME                     REFERENCE                       TARGETS      MINPODS   MAXPODS   REPLICAS   AGE
sample-metrics-app-hpa   Deployment/sample-metrics-app   208m / 100   1         10        1          34m
```
