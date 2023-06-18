---
content_type: "reference"
title: Kubelet Checkpoint API
weight: 10
---


{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

Checkpointing a container is the functionality to create a stateful copy of 
a running container. Once you have a stateful copy of a container, you could
move it to a different computer for debugging or similar purposes.

If you move the checkpointed container data to a computer that's able to restore
it, that restored container continues to run at exactly the same
point it was checkpointed. You can also inspect the saved data, provided that you
have suitable tools for doing so.

Creating a checkpoint of a container might have security implications. Typically
a checkpoint contains all memory pages of all processes in the checkpointed
container. This means that everything that used to be in memory is now available
on the local disk. This includes all private data and possibly keys used for
encryption. The underlying CRI implementations (the container runtime on that node)
should create the checkpoint archive to be only accessible by the `root` user. It
is still important to remember if the checkpoint archive is transferred to another
system all memory pages will be readable by the owner of the checkpoint archive.

## Security Risks and `Mitigation` Strategies

1. **Exposure of sensitive data**: When a container is checkpointed, all memory pages,
   including private data and encryption keys, are saved to the local disk. If the 
   checkpoint archive is accessed by unauthorized users, it can lead to data exposure 
   and potential security breaches. `The mitigation` strategies include:

   - Restricting access: Ensure that the checkpoint archive is accessible only
     by authorized users. Set appropriate file permissions and access controls
     to limit access to the archive.
   
   - Encryption: Encrypt the checkpoint archive to protect the data stored 
     within it. This adds an additional layer of security in case the archive 
     falls into the wrong hands.

2. **Transfer of checkpoint archives**: Moving checkpoint archives to another 
   system introduces risks during the transfer process. If the archive is 
   intercepted or tampered with, the sensitive data it contains may be compromised.
   Consider the following `mitigation` strategies:

   - Secure file transfer: Use secure transfer protocols such as SSH or encrypted 
     file transfer protocols (SFTP, SCP) to transfer the checkpoint archive between 
     systems.This ensures that the data remains encrypted during transit.

   - Verification mechanisms: Implement mechanisms to verify the integrity and 
     authenticity of the checkpoint archive during transfer. Cryptographic checksums
     or digital signatures can be used to validate the archive's integrity, ensuring 
     that it hasn't been modified or tampered with.

3. **Access control and authorization**: Controlling access to the Kubelet Checkpoint API
   is crucial to prevent unauthorized checkpointing operations. Consider the following 
   security practices:

   - Role-based access control (RBAC): Implement RBAC policies to restrict access to the
     Kubelet Checkpoint API. Only authorized users or service accounts should have the 
     necessary permissions to initiate checkpoint operations.

   - Network segmentation: Deploy the Kubernetes cluster in a network environment with proper
     segmentation and firewall rules. Limiting access to the Kubelet's API endpoints reduces
     the attack surface and protects against unauthorized access.

4. **Secure storage of checkpoint archives**: Storing checkpoint archives securely is essential 
   to prevent unauthorized access and tampering. Consider the following measures:

   - Secure storage location: Store checkpoint archives in a secure directory with restricted 
     access permissions. The underlying CRI implementation should ensure that the checkpoint 
     archive is only accessible by the root user.

   - Monitoring and auditing: Implement monitoring and auditing mechanisms to track access to 
     the checkpoint archive storage location. This helps detect any unauthorized access attempts 
     and provides an audit trail for accountability.

5. **Secure deletion of checkpoint archives**: When checkpoint archives are no longer needed, 
   securely delete them to prevent unauthorized recovery of sensitive data. Ensure that deletion 
   processes comply with secure deletion standards and overwrite the data with random values to
   make it unrecoverable.

   By implementing these security measures, you can mitigate the risks associated with checkpointing 
   containers and protect sensitive data from unauthorized access or exposure.

## Operations {#operations}

### `post` checkpoint the specified container {#post-checkpoint}

Tell the kubelet to checkpoint a specific container from the specified Pod.

Consult the [Kubelet authentication/authorization reference](/docs/reference/access-authn-authz/kubelet-authn-authz)
for more information about how access to the kubelet checkpoint interface is
controlled.

The kubelet will request a checkpoint from the underlying
{{<glossary_tooltip term_id="cri" text="CRI">}} implementation. In the checkpoint
request the kubelet will specify the name of the checkpoint archive as
`checkpoint-<podFullName>-<containerName>-<timestamp>.tar` and also request to
store the checkpoint archive in the `checkpoints` directory below its root
directory (as defined by `--root-dir`).  This defaults to
`/var/lib/kubelet/checkpoints`.

The checkpoint archive is in _tar_ format, and could be listed using an implementation of
[`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html). The contents of the
archive depend on the underlying CRI implementation (the container runtime on that node).

#### HTTP Request {#post-checkpoint-request}

POST /checkpoint/{namespace}/{pod}/{container}

#### Parameters {#post-checkpoint-params}

- **namespace** (*in path*): string, required

  {{< glossary_tooltip term_id="namespace" >}}

- **pod** (*in path*): string, required

  {{< glossary_tooltip term_id="pod" >}}

- **container** (*in path*): string, required

  {{< glossary_tooltip term_id="container" >}}

- **timeout** (*in query*): integer

  Timeout in seconds to wait until the checkpoint creation is finished.
  If zero or no timeout is specified the default {{<glossary_tooltip
  term_id="cri" text="CRI">}} timeout value will be used. Checkpoint
  creation time depends directly on the used memory of the container.
  The more memory a container uses the more time is required to create
  the corresponding checkpoint.

#### Response {#post-checkpoint-response}

200: OK

401: Unauthorized

404: Not Found (if the `ContainerCheckpoint` feature gate is disabled)

404: Not Found (if the specified `namespace`, `pod` or `container` cannot be found)

500: Internal Server Error (if the CRI implementation encounter an error during checkpointing (see error message for further details))

500: Internal Server Error (if the CRI implementation does not implement the checkpoint CRI API (see error message for further details))

{{< comment >}}
TODO: Add more information about return codes once CRI implementation have checkpoint/restore.
      This TODO cannot be fixed before the release, because the CRI implementation need
      the Kubernetes changes to be merged to implement the new ContainerCheckpoint CRI API
      call. We need to wait after the 1.25 release to fix this.
{{< /comment >}}
