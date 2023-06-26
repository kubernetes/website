---
title: "Test Your Controller at Scale with KWOK"
date: 2023-07-01
slug: test-your-controller-at-scale-with-kwok
summary: |
  Are you a Kubernetes developer looking for a reliable way to test your controllers at scale?
  Look no further! KWOK makes it easy.
---

Are you a Kubernetes developer looking for a reliable way to test your controllers at scale?
Look no further! [KWOK] makes it easy.

In this article, we'll show you how to test your controllers with KWOK, such as Istio and Argo.

## Testing Istio with KWOK

Latest information can be found at [KWOK with Istio].

Istio is popular component for managing service meshes.
To test your Istio control plane with KWOK, you can follow these steps:

### Set up Cluster

``` bash
kwokctl create cluster --runtime kind
```

### Create Node

``` bash
kubectl apply -f https://kwok.sigs.k8s.io/examples/node.yaml
```

### Deploy Istio

``` bash
istioctl install -y
```

### Migrate Controllers to Real Node

The [KWOK] itself cannot actually run a Pod, so we need to bring in [KIND] to run the controller.

``` bash
kubectl patch deploy istiod -n istio-system --type=json -p='[{"op":"add","path":"/spec/template/spec/nodeName","value":"kwok-kwok-control-plane"}]'
kubectl patch deploy istio-ingressgateway -n istio-system --type=json -p='[{"op":"add","path":"/spec/template/spec/nodeName","value":"kwok-kwok-control-plane"}]'
```

### Create Pod and Inject Sidecar

``` bash
kubectl label namespace default istio-injection=enabled
kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/bookinfo/platform/kube/bookinfo.yaml
```

You will see that the Pod is running on a fake node, but it is still an injected sidecar.

## Testing Argo with KWOK

Latest information can be found at [KWOK with Argo].

Argo is a popular component for managing workflows.
To test your Argo workflows with KWOK, you can follow these steps:

### Custom Pod Behavior

The Argo Workflow is a custom resource for creating Pods, not using Job.
So we need to change the behavior of the Pod to make it work.

``` bash
wget https://github.com/kubernetes-sigs/kwok/raw/main/stages/pod-fast.yaml
sed 's/Job/Workflow/g' pod-fast.yaml > workflow-fast.yaml
```

### Set up Cluster

``` bash
kwokctl create cluster --runtime kind -c workflow-fast.yaml
```

### Create Node

``` bash
kubectl apply -f https://kwok.sigs.k8s.io/examples/node.yaml
```

### Deploy Argo

``` bash
kubectl create namespace argo
kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/v3.4.8/install.yaml
```

### Migrate Controllers to Real Node

The [KWOK] itself cannot actually run a Pod, so we need to bring in [KIND] to run the controller.

``` bash
kubectl patch deploy argo-server -n argo --type=json -p='[{"op":"add","path":"/spec/template/spec/nodeName","value":"kwok-kwok-control-plane"}]'
kubectl patch deploy workflow-controller -n argo --type=json -p='[{"op":"add","path":"/spec/template/spec/nodeName","value":"kwok-kwok-control-plane"}]'
```

### Test Workflow

``` bash
argo submit -n argo --watch https://raw.githubusercontent.com/argoproj/argo-workflows/master/examples/hello-world.yaml
```

You will see that the Pod is running on a fake node, it has finished running

## Getting Involved

If you're interested in participating in future discussions or development related to KWOK, there are several ways to get involved:

- Slack: [#kwok] for general usage discussion, [#kwok-dev] for development discussion. (visit [slack.k8s.io] for a workspace invitation)
- Open Issues/PRs/Discussions in [sigs.k8s.io/kwok]

We welcome feedback and contributions from anyone who wants to join us in this exciting project.

[KWOK]: https://kwok.sigs.k8s.io/
[KIND]: https://kind.sigs.k8s.io/
[KWOK with Istio]: https://kwok.sigs.k8s.io/docs/examples/istio/
[KWOK with Argo]: https://kwok.sigs.k8s.io/docs/examples/argo/
[sigs.k8s.io/kwok]: https://sigs.k8s.io/kwok/
[#kwok]: https://kubernetes.slack.com/messages/kwok/
[#kwok-dev]: https://kubernetes.slack.com/messages/kwok-dev/
[slack.k8s.io]: https://slack.k8s.io/
