---
title: "Update a Deployment Without Downtime"
content_type: task
weight: 120
---

<!-- overview -->

This page shows how to update a running application without downtime.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Updating a deployment using rolling updates

Kubernetes lets you update a running application without downtime by using
[rolling updates](/docs/concepts/workloads/controllers/deployment/#rolling-update).
It replaces old [Pods](/docs/concepts/workloads/pods/) with
new ones gradually. This ensures that new Pods are ready before old ones are removed,
hence, keeping the application available throughout the update process.

Use the following steps to update a Deployment using rolling update:

1. Create a Deployment:

   {{% code_sample file="application/deployment.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment.yaml
   ```

   OR

   ```bash
   kubectl create deployment nginx-deployment --image=nginx:1.24.0
   ```

   The output is similar to this:

   ```output
   deployment.apps/nginx-deployment created
   ```

   This creates an nginx-deployment in your cluster.

1. View the existing Deployment then inspect its configuration and version:

   ```bash
   kubectl get deployments
   ```

   The output is similar to this:

   ```output
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   2/2     2            2           6m36s
   ```

1. Display information about the Deployment:

   ```bash
   kubectl describe deployment nginx-deployment
   ```

   The output is similar to this:

   ```output
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Wed, 28 Jan 2026 14:46:20 +0100
   Labels:                 <none>
   Annotations:            deployment.kubernetes.io/revision: 1
   Selector:               app=nginx
   Replicas:               2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
   Labels:  app=nginx
   Containers:
      nginx:
      Image:         nginx:1.14.2
      Port:          80/TCP
      Host Port:     0/TCP
      Environment:   <none>
      Mounts:        <none>
   Volumes:         <none>
   Node-Selectors:  <none>
   Tolerations:     <none>
   Conditions:
   Type           Status  Reason
   ----           ------  ------
   Available      True    MinimumReplicasAvailable
   Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-647677fc66 (2/2 replicas created)
   Events:
   Type    Reason             Age   From                   Message
   ----    ------             ----  ----                   -------
   Normal  ScalingReplicaSet  16m   deployment-controller  Scaled up replica set nginx-deployment-647677fc66 from 0 to 2
   ```

   You should see the current image version, number of replicas, and Pod status.

1. Update the Deployment with a new container image version:

   ```bash
   kubectl set image deployment/nginx-deployment nginx=nginx:1.25.0
   ```

   The followings describes the previous command:

   - `nginx-deployment`: Your Deployment name
   - `nginx`: Container name in the Deployment
   - `nginx:1.25.0`: New image version

   You should see an output simlar to this:

   ```output
   deployment.apps/nginx-deployment image updated
   ```

1. Verify the update

   ```bash
   kubectl get deployment nginx-deployment -o=jsonpath='{.spec.template.spec.containers[0].image}'
   ```

   The output is similar to this:

   ```output
   nginx:1.25.0
   ```

   This confirms the Deployment was successfully updated and is now running the new image version.

1. Check that all Pods are running the new version:

   ```bash
   kubectl describe deployment nginx-deployment
   ```

   Look for the following image version:

   ```output
   Image: nginx:1.25.0
   ```

   This completes the rolling update process for a Kubernetes Deployment without
   interrupting the service.

1. Watch the rolling update process progress and ensure it is applied gradually
and without downtime:

   ```bash
   kubectl rollout status deployment/nginx-deployment
   ```

   The output is similar to this:

   ```output
   deployment "nginx-deployment" successfully rolled out
   ```

1. If something goes wrong, you can roll back to the previous version:

   ```bash
   kubectl rollout undo deployment/nginx-deployment
   ```

{{< note >}}
Rolling updates avoid downtime by ensuring that at least some Pods remain available at all times.

If kubernetes is telling you it cannot find a Deployment called `nginx-deployment` in
your current namespace. It means no Deployment exists.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
