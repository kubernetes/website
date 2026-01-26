---
title: Deploy a Canary Release
content_type: tutorial
weight: 10
card:
  name: tutorials
  weight: 40
  title: "Deploy a Canary Release"
---

<!-- overview -->

This tutorial walks you through deploying a canary release in Kubernetes. A canary deployment allows you to safely test a new application version with a small portion of production traffic before rolling it out completely. This approach helps minimize risk and enables rapid feedback from real users.

For an overview of canary deployments, see [Canary deployments](/docs/concepts/workloads/management/#canary-deployments) in the Managing Workloads concept page.

## {{% heading "objectives" %}}

* Deploy a stable version of an application
* Deploy a canary version alongside the stable version
* Route traffic to both versions using a Service
* Monitor the canary deployment
* Complete the rollout by scaling the canary and removing the stable version

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- lessoncontent -->

## Understanding Canary Deployments

A canary deployment is a strategy where you deploy a new version of your application alongside the existing version. The new version (canary) receives a small percentage of traffic, allowing you to:

* Test the new version with real production traffic
* Monitor for errors, performance issues, or unexpected behavior
* Roll back quickly if issues are detected
* Gradually increase traffic to the new version if it performs well

In this tutorial, you'll use the `track` label to differentiate between the stable and canary releases. The stable release uses `track: stable`, and the canary release uses `track: canary`. Both deployments share common labels (`app: canary-demo`) that allow the Service to route traffic to both sets of Pods.

You'll deploy the stable version with 3 replicas and the canary version with 1 replica. Since both versions share the same Service selector (`app: canary-demo`), Kubernetes will load-balance traffic across all 4 pods. With this ratio, approximately 25% of traffic goes to the canary and 75% to the stable version.

## Deploying the Stable Version

First, deploy the stable version of your application:

{{% code_sample file="application/canary/app-v1-deployment.yaml" %}}

Apply the stable Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v1-deployment.yaml
```

Verify that the Deployment was created and the Pods are running:

```shell
kubectl get deployments -l app=canary-demo
```

The output is similar to:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
canary-demo-stable    3/3     3            3           10s
```

Check the Pods:

```shell
kubectl get pods -l app=canary-demo
```

The output is similar to:

```
NAME                                  READY   STATUS    RESTARTS   AGE
canary-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          15s
canary-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          15s
canary-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          15s
```

## Creating a Service

Create a Service to expose your application. The Service selector uses the common label (`app: canary-demo`) and omits the `track` label, which allows it to route traffic to both the stable and canary Pods:

{{% code_sample file="application/canary/app-service.yaml" %}}

Apply the Service:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-service.yaml
```

Verify the Service was created:

```shell
kubectl get service canary-demo-service
```

The output is similar to:

```
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
canary-demo-service   ClusterIP   10.96.123.45    <none>        80/TCP    5s
```

Test the Service by creating a temporary Pod and making a request:

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://canary-demo-service
```

You should see responses from the stable Pods. Run this command multiple times to see different Pod hostnames, but all responses should show version v1.

## Deploying the Canary Version

Now deploy the canary version alongside the stable version:

{{% code_sample file="application/canary/app-v2-deployment.yaml" %}}

Apply the canary Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v2-deployment.yaml
```

Verify both Deployments are running:

```shell
kubectl get deployments -l app=canary-demo
```

The output is similar to:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
canary-demo-stable    3/3     3            3           2m
canary-demo-canary    1/1     1            1           10s
```

Check all Pods:

```shell
kubectl get pods -l app=canary-demo -o wide
```

The output is similar to:

```
NAME                                  READY   STATUS    RESTARTS   AGE   IP           NODE
canary-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          2m    10.244.1.5   node1
canary-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          2m    10.244.1.6   node1
canary-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          2m    10.244.2.7   node2
canary-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          15s   10.244.2.8   node2
```

Notice that you now have 4 Pods total: 3 stable Pods and 1 canary Pod.

## Testing Traffic Distribution

Since both Deployments use the same Service selector (`app: canary-demo`), the Service routes traffic to all Pods. With 3 stable Pods and 1 canary Pod, approximately 25% of requests go to the canary.

Test the Service multiple times to see traffic distribution:

```shell
for i in {1..10}; do kubectl run curl-test-$i --image=curlimages/curl:latest --rm -i --restart=Never -- curl -s http://canary-demo-service && echo ""; done
```

You should see responses from both stable and canary versions. The ratio may vary, but you should see some canary responses mixed with stable responses.

Check the Service endpoints to verify both versions are receiving traffic:

```shell
kubectl get endpoints canary-demo-service
```

The output shows all Pod IPs:

```
NAME                  ENDPOINTS                                          AGE
canary-demo-service   10.244.1.5:8080,10.244.1.6:8080,10.244.2.7:8080,10.244.2.8:8080   3m
```

## Monitoring the Canary Deployment

Monitor your canary deployment for errors, performance issues, or unexpected behavior:

Check Pod logs for the canary:

```shell
kubectl logs -l app=canary-demo,track=canary --tail=50
```

Monitor Pod status:

```shell
kubectl get pods -l app=canary-demo -w
```

Press Ctrl(Cmd)+C to stop watching.

Check resource usage:

```shell
kubectl top pods -l app=canary-demo
```

{{< note >}}
The `kubectl top` command requires the [metrics-server](https://github.com/kubernetes-sigs/metrics-server) to be installed in your cluster. If it's not available, you can monitor using other methods like Prometheus or cloud provider monitoring tools.
{{< /note >}}

## Adjusting Traffic Distribution

If the canary is performing well, you can gradually increase traffic to it by scaling it up:

Scale the canary to 2 replicas (now 40% of traffic):

```shell
kubectl scale deployment/canary-demo-canary --replicas=2
```

Verify the new Pod is running:

```shell
kubectl get pods -l app=canary-demo
```

Continue monitoring. If everything looks good, you can scale the canary further and scale down the stable version.

## Completing the Rollout

Once you're confident that the canary is stable and performing well, complete the rollout:

Scale the canary to the desired number of replicas (e.g., 3):

```shell
kubectl scale deployment/canary-demo-canary --replicas=3
```

Scale down the stable version to 0:

```shell
kubectl scale deployment/canary-demo-stable --replicas=0
```

Verify all traffic is going to the canary:

```shell
kubectl get pods -l app=canary-demo
```

The output should show only canary Pods:

```
NAME                                  READY   STATUS    RESTARTS   AGE
canary-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          5m
canary-demo-canary-8e5c0d9f6a-abc12   1/1     Running   0          2m
canary-demo-canary-8e5c0d9f6a-def34   1/1     Running   0          2m
```

Test the Service to confirm all responses are from the canary:

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://canary-demo-service
```

All responses should now show version v2.

Optionally, you can update the stable Deployment to use the new image and remove the canary Deployment:

```shell
kubectl set image deployment/canary-demo-stable canary-demo=gcr.io/google-samples/hello-app:2.0
kubectl scale deployment/canary-demo-stable --replicas=3
kubectl delete deployment canary-demo-canary
```

## Rolling Back a Canary Deployment

If you detect issues with the canary version, you can quickly roll back:

Scale down the canary deployment:

```shell
kubectl scale deployment/canary-demo-canary --replicas=0
```

Scale the stable version back up if needed:

```shell
kubectl scale deployment/canary-demo-stable --replicas=3
```

Investigate the issues with the canary before attempting another canary deployment.

## Splitting Traffic Using HTTPRoute (Optional)

If you're using the [Gateway API](https://gateway-api.sigs.k8s.io/), you can use `HTTPRoute` to have more precise control over traffic splitting between the stable and canary versions. This approach allows you to specify exact percentages for traffic distribution rather than relying on replica counts.

First, create separate Services for the stable and canary versions:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: canary-demo-stable-service
spec:
  selector:
    app: canary-demo
    track: stable
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: canary-demo-canary-service
spec:
  selector:
    app: canary-demo
    track: canary
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

Then create an HTTPRoute that splits traffic between the two Services:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: canary-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "canary-demo.example.com"
  rules:
  - backendRefs:
    - name: canary-demo-stable-service
      port: 80
      weight: 90
    - name: canary-demo-canary-service
      port: 80
      weight: 10
```

This configuration routes 90% of traffic to the stable Service and 10% to the canary Service, regardless of the number of replicas.

You can also use header-based routing to send specific traffic to the canary:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: canary-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "canary-demo.example.com"
  rules:
  # Rule 1: Route traffic with canary header to canary service
  - matches:
    - headers:
      - type: Exact
        name: env
        value: canary
    backendRefs:
    - name: canary-demo-canary-service
      port: 80
  # Rule 2: Split remaining traffic 90/10
  - backendRefs:
    - name: canary-demo-stable-service
      port: 80
      weight: 90
    - name: canary-demo-canary-service
      port: 80
      weight: 10
```

This configuration sends all traffic with the `env: canary` header to the canary Service, while other traffic is split 90/10 between stable and canary.

{{< note >}}
The Gateway API requires a Gateway controller to be installed in your cluster. See the [Gateway API documentation](https://gateway-api.sigs.k8s.io/) for installation instructions and supported implementations.
{{< /note >}}

## {{% heading "cleanup" %}}

Delete the resources created in this tutorial:

```shell
kubectl delete deployment canary-demo-stable canary-demo-canary
kubectl delete service canary-demo-service
```

If you created separate Services for HTTPRoute, delete those as well:

```shell
kubectl delete service canary-demo-stable-service canary-demo-canary-service
kubectl delete httproute canary-demo-route
```

## {{% heading "whatsnext" %}}

* Learn more about [canary deployments](/docs/concepts/workloads/management/#canary-deployments) in the Managing Workloads concept page.
* Read about [Deployments](/docs/concepts/workloads/controllers/deployment/) and how they manage your application lifecycle.
* Read about [Services](/docs/concepts/services-networking/service/) and how they enable service discovery and load balancing.
* Explore the [Gateway API](/docs/concepts/services-networking/gateway/) for advanced traffic management capabilities.
* Consider using [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/) to automatically adjust replica counts based on metrics.
