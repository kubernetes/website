---
title: "Update a Deployment Without Downtime"
description: Step-by-step guide on updating a running Kubernetes Deployment to a new version without downtime using rolling updates.
weight: 80
---


Your Kubernetes server must be at or later than version v1.2.
To check the version, enter `kubectl version`.

# Updating a Deployment with Rolling Updates

Kubernetes lets you update a running application **without downtime** by using [rolling updates](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update). It replaces old [Pods](https://kubernetes.io/docs/concepts/workloads/pods/) with new ones **gradually**, ensuring new Pods are ready before old ones are removed. This keeps the application available throughout the update process.


---

## Prerequisites

- A running Kubernetes cluster
- `kubectl` configured to access the cluster
- An existing Deployment (e.g., `nginx-deployment`)

---

## Step 1: Check the current Deployment

First, see the current Deployment and its version:

```bash
kubectl get deployments
kubectl describe deployment nginx-deployment
```
You should see the current image version, number of replicas, and Pod status.

## Step 2: Update the Deployment

Update the Deployment with a new container image version:

```bash
kubectl set image deployment/nginx-deployment nginx=nginx:1.25.0
```

- nginx-deployment – your Deployment name
- nginx – container name in the Deployment
- nginx:1.25.0 – new image version

You should see output simlar to this:

```bash
deployment.apps/nginx-deployment image updated
```

## Step 3: Verify the update

```bash
kubectl get deployment nginx-deployment -o=jsonpath='{.spec.template.spec.containers[0].image}'
```

Output:

```bash
nginx:1.25.0
```

That confirms the Deployment was updated.


## Check that all Pods are running the new version:

```bash
kubectl describe deployment nginx-deployment
```
Look for:

```bash
Image: nginx:1.25.0
```

This completes the rolling update process for a Kubernetes Deployment without interrupting the service.


## Step 4: Watch the rolling update progress
Monitor the update to ensure it is applied gradually and without downtime:

```bash
kubectl rollout status deployment/nginx-deployment
```
You should see output simlar to this:

```bash
deployment "nginx-deployment" successfully rolled out
```

## Roll back if needed

If something goes wrong, you can roll back to the previous version:

```bash
kubectl rollout undo deployment/nginx-deployment
```


## Notes

- Rolling updates avoid downtime by ensuring at least some Pods remain available at all times.


## If kubernetes is telling you it cannot find a Deployment called `nginx-deployment` in your current namespace. The `kubectl set image` command only works on existing resources.

## Step 1: Check what Deployments exist

Run:
```bash
kubectl get deployments
```
This will list all Deployments in the current namespace.

- If you see `nginx-deployment` listed → maybe you need to be in a different namespace.

- If nothing is listed → you haven’t created it yet.


## Step 2: Create the Deployment (if it doesn’t exist)

If you haven’t deployed nginx yet, here is how you can do that:

```bash
kubectl create deployment nginx-deployment --image=nginx:1.24.0
```

Then you can upgrade it:

```bash
kubectl set image deployment/nginx-deployment nginx=nginx:1.25.0
```

## Verify the update

 ```bash
kubectl get deployment nginx-deployment -o=jsonpath='{.spec.template.spec.containers[0].image}'
```

Output:

```bash
nginx:1.25.0
```

That confirms the Deployment was updated.


You can also:
## Check the deployment status

```bash
kubectl get deployment nginx-deployment
```
You should see output simlar to this:

```bash
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   1/1     1            1           110m
```
