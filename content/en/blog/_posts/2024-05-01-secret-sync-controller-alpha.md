---
layout: blog
title: "Introducing Secret Sync Controller Alpha for Kubernetes"
date: 2024-05-01
slug: secret-sync-controller-alpha
---

The [Secret Sync Controller](https://github.com/kubernetes-sigs/secrets-store-csi-driver/tree/feature/secrets-sync-controller) (SSC) provides cluster admins with a unified way of synchronizing cloud-stored secrets as Kubernetes secrets. This enables workloads to read these secrets via standard Kubernetes mechanisms, even with intermittent connectivity. The SSC will sit alongside the [existing secret store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver). The SSC will eventually replace the CSI driver's [sync as Kubernetes secret feature](https://secrets-store-csi-driver.sigs.k8s.io/topics/sync-as-kubernetes-secret). Still, the CSI driver will remain the recommended solution for cloud scenarios where connectivity is not a concern and persisting secrets within the cluster (syncing as Kubernetes secrets) is not desired. The SSC is an alpha feature and can be used with any [supported cloud provider](https://secrets-store-csi-driver.sigs.k8s.io/introduction#supported-providers).

## What is the motivation for this feature?

Many production-scale Kubernetes solutions use secrets stored in an external secret store such as a cloud provider secret management system. These solutions face the same problem: securely accessing those secrets within a Kubernetes cluster. Leveraging a secret store CSI driver allows access to secrets while a cluster is online; however, until now, the secret store CSI Driver has yet to provide a unified solution for access to external secrets while offline. The Secret Sync Controller provides a unified way of pulling secrets from a cloud provider and storing them in the Kubernetes secret store for offline/intermittent access.

## What is the benefit?

1. Offline Access: Many clusters running in production environments need to be resilient to intermittent connectivity. This includes continuing to have access to secrets when a cluster goes offline and a pod restarts. Workloads can continue to access secrets by storing secrets in the Kubernetes secret store instead of a directly mounted volume (which is how the existing secret store CSI driver enables accessing secrets).

2. Standard Kubernetes Secret Access: Secrets can be accessed via volume mounting, environment variables, or via the Kubernetes API. Workloads and ingress controllers do not need to be customized to access a cloud provider secret store and developers have options on how to access secrets.  

3. Security: The Secret Sync Controller (SSC) has limited permissions and leverages the latest Kubernetes security features (complete list below) so that cluster admins do not need to configure and restrict permissions themselves.  

## How to use the Secret Sync Controller

The Secret Sync Controller (SSC) must be used alongside a [secret store Cloud Provider](https://secrets-store-csi-driver.sigs.k8s.io/getting-started/installation.html#install-external-secret-providers) that implements the Secret Store CSI Driver provider interface to provide an end-to-end solution for synchronizing secrets from the cloud secret store to the Kubernetes secret store.  

1. Install the [secret sync controller](https://gist.github.com/aramase/46bd3d4270d9c44b59e8c2afe56fbc09) via a Helm chart, or YAML manifests alongside a secret store provider. If using the helm chart, users can configure parameters such as sync intervals and resource limitations at install time.

2. Configure an identity with permission to read the cloud provider's secrets.  

3. Configure the cloud provider with a secret provider class CustomResourceDefinition (CRD).  

4. Configure the Secret Sync Controller with a secret sync CRD that contains the associated cloud provider CRD, name of the secret in the cluster, target namespace, and the Kubernetes service account that has federated identity access to the Cloud Provider secret.  

5. Apply the CRDs in the cluster and secrets will automatically begin syncing.  

## Security features

By default, the Secret Sync Controller (SSC) enables the following security features:

1. Isolation of Functionality: The SSC splits out the functionality of syncing secrets from a cloud provider (via a secret sync Provider) and storing the secrets in a cluster (the SSC). Each component can have much more limited permissions, minimizing the risk of a cluster compromise.  

2. Limited Permissions via ValidatingAdmissionPolicies: The SSC is a privileged facility that should be in a protected namespace, such as `kube-system`. The SSC leverages ValidatingAdmissionPolicies to limit its capabilities, ensuring it cannot perform operations such as deleting Secrets, or editing Secrets beyond its designated scope (defined via labels and annotations). Validating admission policies will be generally available and enabled by default starting with Kubernetes 1.30; right now, they are beta and opt-in.

3. Cloud Provider vs Workload Configuration: Configuration of the secrets to be synced to the cluster are split into two layers – the cloud provider configuration and the workload specific configuration. This allows a cloud provider admin to create and define the cloud provider secret storage and cloud identity that has access to secrets. The workload developer can then define how the secret is stored in the cluster (name, namespace, etc) and which local Kubernetes identity has access to the secret.  

4. Namespace Boundaries: The SSC leverages the Kubernetes namespace security boundary to isolate Secrets so that only Pods in a namespace have access to Secrets in that namespace.

5. Federated Identity for Syncing Secrets: The SSC does not have its own global identity for accessing secrets. Instead, at deployment time, the admin configures a unique local identity (ServiceAccount) for each workload that uses secrets, and can federate this with a unique cloud identity that has access to the Secrets it requires.

In addition to the previous on by default security features, a cluster admin should enable the following security features:

6. Owner Reference Permission Enforcement: The SSC permissions can be further limited by enabling the _Owner Reference Permission Enforcement_ admission controller, which ensures that only the owners of a Secret have permissions to update and delete the Secret.

7. Encryption: Kubernetes secrets are stored encoded in etcd, and the secret storage [should be encrypted](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/). For example, a cluster admin should enable a KMS plugin for the cluster to encrypt secret data.  

## What’s next?

The SIG Auth and Secret Store CSI maintainers plan move the Secret Sync Controller to a dedicated repository in the near future. Depending on feedback and adoption, the project would then graduate to a beta stage later in 2024.

## How can I get involved?

This feature is driven by the [Kubernetes SIG Auth community](https://github.com/kubernetes/community/tree/master/sig-auth). Please try out the [Secret Sync Controller](https://github.com/kubernetes-sigs/secrets-store-csi-driver/tree/feature/secrets-sync-controller) and join us to connect with the [community](https://kubernetes.slack.com/messages/csi-secrets-store) and share your ideas and feedback around the above feature and beyond. We look forward to hearing from you!  
