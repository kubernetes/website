---
title: Set up placement policies in Federation
redirect_from:
- "/docs/tutorials/federation/set-up-placement-policies-federation/"
- "/docs/tutorials/federation/set-up-placement-policies-federation.html"
---

{% capture overview %}

This page shows you can enforce policy-based placement decisions over Federated
resources using an external policy engine.

{% endcapture %}


{% capture objectives %}

* Deploying Federation and configuring an exteranl policy engine
* Deploying an external policy engine
* Configuring placement policies with ConfigMaps
* Testing placement policies

{% endcapture %}


{% capture prerequisites %}

You need to have a running Kubernetes cluster (which is referenced as host
cluster). Please see one of the [getting started](/docs/getting-started-guides/)
guides for installation instructions for your platform.

{% endcapture %}


{% capture lessoncontent %}

## Deploying Federation and configuring an external policy engine

The Federation control plane can be deployed using `kubefed init`.

After deploying the Federation control plane, you must configure an Admission
Controller in the Federation API server that enforces placement decisions
received from the external policy engine.

    kubectl create -f Scheduling-Policy-Admission.yaml

Shown below is an example ConfigMap for the Admission Controller:

{% include code.html language="yaml" file="Scheduling-Policy-Admission.yaml"
ghlink="/docs/tutorials/federation/Scheduling-Policy-Admission.yaml" %}

The ConfigMap contains three files:

* `config.yml` specifies the location of the `SchedulingPolicy` Admission
  Controller config file.
* `scheduling-policy-config.yml` specifies the location of the kubeconfig file
  required to contact the external policy engine. This file can also include a
  `retryBackoff` value that controls the initial retry backoff delay in
  milliseconds.
* `opa-kubeconfig` is a standard kubeconfig containing the URL and credentials
  needed to contact the external policy engine.

Edit the Federation API server deployment to enable the `SchedulingPolicy`
Admission Controller.

	kubectl -n federation-system edit deployment federation-apiserver

Update the Federation API server command line arguments to enable the Admission
Controller and mount the ConfigMap into the container. If there's an existing
`--admission-control` flag, append `,SchedulingPolicy` instead of adding
another line.

    --admission-control=SchedulingPolicy
    --admission-control-config-file=/etc/kubernetes/admission/config.yml

Add the following volume to the Federation API server pod:

    - name: admission-config
      configMap:
        name: admission

Add the following volume mount the Federation API server `apiserver` container:

    volumeMounts:
    - name: admission-config
      mountPath: /etc/kubernetes/admission

## Deploying an external policy engine

The [Open Policy Agent (OPA)](http://openpolicyagent.org) is an open source,
general-purpose policy engine that you can use to enforce policy-based placement
decisions in the Federation control plane.

Create a Service in the host cluster to contact the external policy engine:

    kubectl create -f Policy-Engine-Service.yaml

Shown below is an example Service for OPA.

{% include code.html language="yaml" file="Policy-Engine-Service.yaml"
ghlink="/docs/tutorials/federation/Policy-Engine-Service.yaml" %}

Create a Deployment in the host cluster with the Federation control plane:

    kubectl create -f Policy-Engine-Deployment.yaml

Shown below is an example Deployment for OPA.

{% include code.html language="yaml" file="Policy-Engine-Deployment.yaml"
ghlink="/docs/tutorials/federation/Policy-Engine-Deployment.yaml" %}

## Configuring placement policies via ConfigMaps

The external policy engine will discover placement policies created in the
`kube-federation-scheduling-policy` namespace in the Federation API server.

Create the namespace if it does not already exist:

    kubectl --context=federation create namespace kube-federation-scheduling-policy

Configure a sample policy to test the external policy engine:

{% include code.html language="yaml" file="Policy.rego"
ghlink="/docs/tutorials/federation/Policy.rego" %}

Shown below is the command to create the sample policy:

    kubectl --context=federation -n kube-federation-scheduling-policy create configmap scheduling-policy --from-file=Policy.rego

This sample policy illustrates a few key ideas:

* Placement policies can refer to any field in Federated resources.
* Placement policies can leverage external context (for example, Cluster
  metadata) to make decisions.
* Administrative policy can be managed centrally.
* Policies can define simple interfaces (such as the `requires-pci` annotation) to
  avoid duplicating logic in manifests.

## Testing placement policies

Annotate one of the clusters to indicate that it is PCI certified.

    kubectl --context=federation annotate clusters cluster-name-1 pci-certified=true

Deploy a Federated ReplicaSet to test the placement policy.

{% include code.html language="yaml" file="ReplicaSet-Example-Policy.yaml"
ghlink="/docs/tutorials/federation/ReplicaSet-Example-Policy.yaml" %}

Shown below is the command to deploy a ReplicaSet that *does* match the policy.

    kubectl --context=federation create -f ReplicaSet-Example-Policy.yaml

Inspect the ReplicaSet to confirm the appropriate annotations have been applied:

    kubectl --context=federation get rs nginx-pci -o jsonpath='{.metadata.annotations}'

{% endcapture %}

{% include templates/tutorial.md %}
