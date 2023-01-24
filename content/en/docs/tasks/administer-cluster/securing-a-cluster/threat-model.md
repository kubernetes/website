## Threat Model

When thinking about which security configuration options will make sense for your clusters, it is important to consider the threat model you’re working to. Depending on the profile of users who can make use of the cluster, and the exposure of the workloads, different configurations will make more sense.

Obviously, from a security standpoint, ideally every cluster would be fully hardened, but in most cases there are limited resources which can be applied to security activities, so prioritization of effort is important.

Threat models can sound like a bit of an abstract concept, but they don’t need to be really complex to help in securing a cluster. Some examples might be :

- The cluster will be Internet facing and have workloads running multiple web sites available to the general public all deployed by a single team. From this brief description we can see there’s some areas where we’d want to place more focus:
  -  Having the API server on the Internet means we need to ensure that our authentication options are robust and not susceptible to brute force attack.
  - Having multiple Internet facing web sites running in the cluster means we need to worry about what happens if one is compromised. Here controls like network policy and hardening the workloads with Security Contexts will be important.
  - With a single team managing the cluster, whilst RBAC is still important, we probably don’t need to spend as much effort tightening the rights of operators.
- The cluster will be on a corporate network running a large number of applications from different teams designed for internal use only. Each of the applications already has strong authentication controls to restrict who can make use of them and are not internet facing.
  - Here having a number of teams running applications on the cluster will mean that more attention should be paid to RBAC design to reduce the risk of one team getting access to anthers environment either accidentally or on purpose.
  - Also resource management will be more important to ensure that “noisy neighbours” don’t disrupt other applications.
  - Whilst network policy is still moderately important as there are a large number of applications, Security Context may be less so, as we’re running relatively trusted applications which have controls on who can access them.
