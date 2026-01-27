---
title: Deploy a Release Using A Canary Rollout
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

## Understanding canary deployments

A canary deployment is a strategy where you deploy a new version of your application alongside the existing version. The new version (canary) receives a small percentage of traffic, allowing you to:

* Test the new version with real production traffic
* Monitor for errors, performance issues, or unexpected behavior
* Roll back quickly if issues are detected
* Gradually increase traffic to the new version if it performs well

In this tutorial, you'll use the `track` label to differentiate between the stable and canary releases. The stable release uses `track: stable`, and the canary release uses `track: canary`. Both deployments share common labels (`app.kubernetes.io/name: rollout-demo`) that allow the Service to route traffic to both sets of Pods.

You'll deploy the stable version with 3 replicas and the canary version with 1 replica. Since both versions share the same Service selector (`app.kubernetes.io/name: rollout-demo`), Kubernetes will load-balance traffic across all 4 pods. With this ratio, approximately 25% of traffic goes to the canary and 75% to the stable version.

## Deploying the stable version

First, deploy the stable version of your application:

{{% code_sample file="application/canary/app-v1-deployment.yaml" %}}

Apply the stable Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v1-deployment.yaml
```

Verify that the Deployment was created and the Pods are running:

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

The output is similar to:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           10s
```

Check the Pods:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

The output is similar to:

```
NAME                                  READY   STATUS    RESTARTS   AGE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          15s
```

## Creating a service

Create a Service to expose your application. The Service selector uses the common label (`app.kubernetes.io/name: rollout-demo`) and omits the `track` label, which allows it to route traffic to both the stable and canary Pods:

{{% code_sample file="application/canary/app-service.yaml" %}}

Apply the Service:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-service.yaml
```

Verify the Service was created:

```shell
kubectl get service rollout-demo-service
```

The output is similar to:

```
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
rollout-demo-service   ClusterIP   10.96.123.45    <none>        80/TCP    5s
```

Test the Service by creating a temporary Pod and making a request:

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://rollout-demo-service
```

You should see responses from the stable Pods. Run this command multiple times to see different Pod hostnames, but all responses should show version v1.

At this point, your application is in a steady state. In a real-world scenario, you would typically pause here and operate the stable version until you have a new version to deploy. The next steps demonstrate how to introduce a canary version.

## Deploying the canary version

To create a canary Deployment, you can copy the stable Deployment manifest and make a few changes:

- Change the `metadata.name` (for example, to `rollout-demo-canary`)
- Change the `track` label from `stable` to `canary` in both `metadata.labels` and `spec.selector.matchLabels`/`spec.template.metadata.labels`
- Set a lower number of replicas (for example, 1)
- Update the container image to the new version

Now deploy the canary version alongside the stable version:

{{% code_sample file="application/canary/app-v2-deployment.yaml" %}}

Apply the canary Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v2-deployment.yaml
```

Verify both Deployments are running:

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

The output is similar to:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           2m
rollout-demo-canary    1/1     1            1           10s
```

Check all Pods:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -o wide
```

The output is similar to:

```
NAME                                  READY   STATUS    RESTARTS   AGE   IP           NODE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          2m    10.244.1.5   node1
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          2m    10.244.1.6   node1
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          2m    10.244.2.7   node2
rollout-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          15s   10.244.2.8   node2
```

Notice that you now have 4 Pods total: 3 stable Pods and 1 canary Pod.

## Testing traffic distribution

Since both Deployments use the same Service selector (`app.kubernetes.io/nam: rollout-demo`), the Service routes traffic to all Pods. With 3 stable Pods and 1 canary Pod, approximately 25% of requests go to the canary.

Test the Service multiple times to see traffic distribution:

```shell
for i in {1..10}; do kubectl run curl-test-$i --image=curlimages/curl:latest --rm -i --restart=Never -- curl -s http://rollout-demo-service && echo ""; done
```

You should see responses from both stable and canary versions. The ratio may vary, but you should see some canary responses mixed with stable responses.

Check the Service endpoints to verify both versions are receiving traffic:

```shell
kubectl get endpoints rollout-demo-service
```

The output shows all Pod IPs:

```
NAME                  ENDPOINTS                                          AGE
rollout-demo-service   10.244.1.5:8080,10.244.1.6:8080,10.244.2.7:8080,10.244.2.8:8080   3m
```

## Monitoring the canary deployment

Monitor your canary deployment for errors, performance issues, or unexpected behavior:

Check Pod logs for the canary:

```shell
kubectl logs -l app.kubernetes.io/name=rollout-demo,track=canary --tail=50
```

Monitor Pod status:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -w
```

Press Ctrl(Cmd)+C to stop watching.

Check resource usage:

```shell
kubectl top pods -l app.kubernetes.io/name=rollout-demo
```

{{< note >}}
The `kubectl top` command requires the [metrics-server](https://github.com/kubernetes-sigs/metrics-server) to be installed in your cluster. If it's not available, you can monitor using other methods like Prometheus or cloud provider monitoring tools.
{{< /note >}}

## Adjusting traffic distribution

If the canary is performing well, you can gradually increase traffic to it by scaling it up:

Scale the canary to 2 replicas (now 40% of traffic):

```shell
kubectl scale deployment/rollout-demo-canary --replicas=2
```

Verify the new Pod is running:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

Continue monitoring. If everything looks good, you can scale the canary further and scale down the stable version.

## Completing the rollout

Once you're confident that the canary is stable and performing well, complete the rollout:

Scale the canary to the desired number of replicas (e.g., 3):

```shell
kubectl scale deployment/rollout-demo-canary --replicas=3
```

Scale down the stable version to 0:

```shell
kubectl scale deployment/rollout-demo-stable --replicas=0
```

Verify all traffic is going to the canary:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

The output should show only canary Pods:

```
NAME                                  READY   STATUS    RESTARTS   AGE
rollout-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          5m
rollout-demo-canary-8e5c0d9f6a-abc12   1/1     Running   0          2m
rollout-demo-canary-8e5c0d9f6a-def34   1/1     Running   0          2m
```

Test the Service to confirm all responses are from the canary:

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://rollout-demo-service
```

All responses should now show version v2.


To complete the rollout, update the stable Deployment to use the new image and remove the canary Deployment. This ensures all traffic goes to the new version and keeps your deployment configuration simple:

```shell
kubectl set image deployment/rollout-demo-stable rollout-demo=gcr.io/google-samples/hello-app:2.0
kubectl scale deployment/rollout-demo-stable --replicas=3
kubectl delete deployment rollout-demo-canary
```

## Rolling back a canary deployment

If you detect issues with the canary version, you can quickly roll back:

Scale down the canary deployment:

```shell
kubectl scale deployment/rollout-demo-canary --replicas=0
```

Scale the stable version back up if needed:

```shell
kubectl scale deployment/rollout-demo-stable --replicas=3
```

Investigate the issues with the canary before attempting another canary deployment.

## Splitting traffic using HTTPRoute (optional)


If you're using the [Gateway API](https://gateway-api.sigs.k8s.io/), you can use HTTPRoute to have more precise control over traffic splitting between the stable and canary versions. This approach allows you to specify exact percentages for traffic distribution rather than relying on replica counts.

First, create separate Services for the stable and canary versions. This approach is also useful for debugging, even if you are not using Gateway API. By having separate Services, you can directly test or monitor each version independently.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-stable-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: stable
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-canary-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
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
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

This configuration routes 90% of traffic to the stable Service and 10% to the canary Service, regardless of the number of replicas.

You can also use header-based routing to send specific traffic to the canary:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  # Rule 1: Route traffic with canary header to canary service
  - matches:
    - headers:
      - type: Exact
        name: env
        value: canary
    backendRefs:
    - name: rollout-demo-canary-service
      port: 80
  # Rule 2: Split remaining traffic 90/10
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

This configuration sends all traffic with the `env: canary` header to the canary Service, while other traffic is split 90/10 between stable and canary.

{{< note >}}
The Gateway API requires a Gateway controller to be installed in your cluster. See the [Gateway API documentation](https://gateway-api.sigs.k8s.io/) for installation instructions and supported implementations.
{{< /note >}}

## Automating canary rollouts

In production environments, canary rollouts are typically managed by controllers or CI/CD systems that automate traffic shifting, monitoring, and promotion or rollback. Tools such as Flux, Argo Rollouts, GitLab, and many others can handle progressive delivery, analysis, and rollback for you. This reduces manual steps and helps ensure safe, repeatable deployments. For more information, see the documentation for your chosen deployment tool or controller.

## {{% heading "cleanup" %}}

Delete the resources created in this tutorial:

```shell
kubectl delete deployment rollout-demo-stable rollout-demo-canary
kubectl delete service rollout-demo-service
```

If you created separate Services for HTTPRoute, delete those as well:

```shell
kubectl delete service rollout-demo-stable-service rollout-demo-canary-service
kubectl delete httproute rollout-demo-route
```

## {{% heading "whatsnext" %}}

* Learn more about [canary deployments](/docs/concepts/workloads/management/#canary-deployments) in the Managing Workloads concept page.
* Read about [Deployments](/docs/concepts/workloads/controllers/deployment/) and how they manage your application lifecycle.
* Read about [Services](/docs/concepts/services-networking/service/) and how they enable service discovery and load balancing.
* Explore the [Gateway API](/docs/concepts/services-networking/gateway/) for advanced traffic management capabilities.
* Consider using [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/) to automatically adjust replica counts based on metrics.
