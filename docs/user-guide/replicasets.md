---
assignees:
- Kashomon
- bprashanth
- madhusudancs

---

* TOC
{:toc}

## What is a _Replica Set_?

Replica Set is the next-generation Replication Controller. The only difference
between a _Replica Set_ and a
[_Replication Controller_](/docs/user-guide/replication-controller/) right now is
the selector support. Replica Set supports the new set-based selector requirements
as described in the [labels user guide](/docs/user-guide/labels/#label-selectors)
whereas a Replication Controller only supports equality-based selector requirements.

Most [`kubectl`](/docs/user-guide/kubectl/kubectl/) commands that support
Replication Controllers also support Replica Sets. One exception is the
[`rolling-update`](/docs/user-guide/kubectl/kubectl_rolling-update/) command. If
you want the rolling update functionality please consider using Deployments
instead. Also, the
[`rolling-update`](/docs/user-guide/kubectl/kubectl_rolling-update/) command is
imperative whereas Deployments are declarative, so we recommend using Deployments
through the [`rollout`](/docs/user-guide/kubectl/kubectl_rollout/) command.

While Replica Sets can be used independently, today it's mainly used by
[Deployments](/docs/user-guide/deployments/) as a mechanism to orchestrate pod
creation, deletion and updates. When you use Deployments you don't have to worry
about managing the Replica Sets that they create. Deployments own and manage
their Replica Sets.

## When to use a Replica Set?

A Replica Set ensures that a specified number of pod “replicas” are running at any given
time. However, a Deployment is a higher-level concept that manages Replica Sets and
provides declarative updates to pods along with a lot of other useful features.
Therefore, we recommend using Deployments instead of directly using Replica Sets, unless
you require custom update orchestration or don't require updates at all.

This actually means that you may never need to manipulate Replica Set objects:
use directly a Deployment and define your application in the spec section.

## Example

{% include code.html language="yaml" file="replicasets/frontend.yaml" ghlink="/docs/user-guide/replicasets/frontend.yaml" %}

Saving this config into `frontend.yaml` and submitting it to a Kubernetes cluster should
create the defined Replica Set and the pods that it manages.

```shell
$ kubectl create -f frontend.yaml
replicaset "frontend" created
$ kubectl describe rs/frontend
Name:		frontend
Namespace:	default
Image(s):	gcr.io/google_samples/gb-frontend:v3
Selector:	tier=frontend,tier in (frontend)
Labels:		app=guestbook,tier=frontend
Replicas:	3 current / 3 desired
Pods Status:	3 Running / 0 Waiting / 0 Succeeded / 0 Failed
No volumes.
Events:
  FirstSeen	LastSeen	Count	From				SubobjectPath	Type		Reason			Message
  ---------	--------	-----	----				-------------	--------	------			-------
  1m		1m		1	{replicaset-controller }			Normal		SuccessfulCreate	Created pod: frontend-qhloh
  1m		1m		1	{replicaset-controller }			Normal		SuccessfulCreate	Created pod: frontend-dnjpy
  1m		1m		1	{replicaset-controller }			Normal		SuccessfulCreate	Created pod: frontend-9si5l
$ kubectl get pods
NAME             READY     STATUS    RESTARTS   AGE
frontend-9si5l   1/1       Running   0          1m
frontend-dnjpy   1/1       Running   0          1m
frontend-qhloh   1/1       Running   0          1m
```

## Replica Set as an Horizontal Pod Autoscaler target

A Replica Set can also be a target for
[Horizontal Pod Autoscalers (HPA)](/docs/user-guide/horizontal-pod-autoscaling/),
i.e. a Replica Set can be auto-scaled by an HPA. Here is an example HPA targeting
the Replica Set we created in the previous example.

{% include code.html language="yaml" file="replicasets/hpa-rs.yaml" ghlink="/docs/user-guide/replicasets/hpa-rs.yaml" %}


Saving this config into `hpa-rs.yaml` and submitting it to a Kubernetes cluster should
create the defined HPA that autoscales the target Replica Set depending on the CPU usage
of the replicated pods.

```shell
kubectl create -f hpa-rs.yaml
```

Alternatively, you can just use the `kubectl autoscale` command to acommplish the same
(and it's easier!)

```shell
kubectl autoscale rs frontend
```
