---
layout: blog
title: "Defining Network Policy Conformance for Container Network Interface (CNI) providers"
date: 2021-03-21
slug: defining-networkpolicy-conformance-cni-providers
---

Authors: Matt Fenwick (Synopsys), Jay Vyas (VMWare), Ricardo Katz, Amim Knabben (Loadsmart), Douglas Schilling Landgraf (Red Hat)

Special thanks to Tim Hockin and Bowie Du (Google), Dan Winship and Antonio Ojea (Red Hat),
Casey Davenport and Shaun Crampton (Tigera), and Abhishek Raut and Antonin Bas (VMware) for
being supportive of this work, and working with us to resolve issues in different Container Network Interfaces (CNIs) over time.

A brief conversation around "node local" Network Policies in April of 2020 inspired the creation of a NetworkPolicy subproject from SIG Network. It became clear that as a community,
we need a rock-solid story around how to do pod network security on Kubernetes, and this story needed a community around it, so as to grow the cultural adoption of enterprise security patterns in K8s.

In this post we'll discuss:

- Why we created a Subproject for [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- How we changed the Kubernetes e2e framework to `visualize` NetworkPolicy implementation of your CNI provider
- The initial results of our comprehensive NetworkPolicy conformance validator, _Cyclonus_, built around these principles
- Improvements we've made to the NetworkPolicy user experience

## Why we created a subproject for NetworkPolicies

In April of 2020 it was becoming clear that many CNIs were emerging, and many vendors
implement these CNIs in different ways.  Users were beginning to express a little bit
of confusion around how to implement policies for different scenarios, and asking for new features.
It was clear that we needed to begin unifying the way we think about Network Policies
in Kubernetes, if we wanted to avoid becoming an ancient API overrun by implementation divergences.

For example:
- Calico as a CNI provider can be run using IPIP or VXLAN mode.  CNI's such as Antrea
  and Cilium offer similar configuration divergences as well.
- Some CNI plugins rely on iptables for NetworkPolicies, whereas others use a completely
  different technology stack (for example, the Antrea project uses Open vSwitch rules).
- Some CNI plugins only implement a subset of the Kubernetes NetworkPolicy API, or
  don't offer the latest features. For example, certain plugins don't support the
  ability to target a named port; others don't work with certain IP address types, and there are diverging semantics for similar policy types).
- Some CNI plugins combine with OTHER CNI plugins in order to implement NetworkPolicies (canal), some CNI's might mix implementations (multus), and some clouds do routing separately from NetworkPolicy implementation.

Thus, end-users need to follow a multistep process to implement Network Policies to secure their applications:
- Confirm that their network plugin supports NetworkPolicies (some don't, such as Flannel)
- Confirm that their cluster's network plugin supports the specific NetworkPolicy features that they are interested in (again, the named port or port range examples come to mind here)
- Confirm that their application's Network Policy definitions are doing the right thing
- Find out the vendor specific implementation of a policy, and check whether or not that implementation had a CNI neutral implementation (which is preferable for most users)

The NetworkPolicy project in upstream Kubernetes aims at providing a community where
people can learn about, and contribute to, the Kubernetes NetworkPolicy API and the surrounding ecosystem.

## The First step: A validation framework for NetworkPolicies that was intuitive to use and understand

The Kubernetes end to end suite has always had NetworkPolicy tests, but these weren't
run in CI, and the way they were implemented didn't provide holistic, easily consumable
information about how a policy was working in a cluster.
This is because the original tests didn't provide any kind of visual summary of connectivity
across a cluster.   We thus initially set out to make it easy to confirm CNI support for NetworkPolicies by
making the end to end tests (which are often used by administrators or users to diagnose cluster conformance) easy to interpret.

To solve the problem of confirming that CNIs support the basic features one cares about
for a policy, we built a new NetworkPolicy validation tool into the Kubernetes e2e
framework which allows for visual inspection of policies and their effect on a standard set of pods in a cluster.
For example, take the following test output.  We found a bug in
[ovn kubernetes](https://github.com/ovn-org/ovn-kubernetes/issues/1782) with this tool
that was really easy to characterize, wherein certain policies caused a state-modification that,
later on, caused traffic to incorrectly be blocked (even after all Network Policies, cluster wide, were deleted).

This is the network policy for the test in question:
```yaml
metadata:
  creationTimestamp: null
  name: allow-ingress-port-80
spec:
  ingress:
  - ports:
    - port: serve-80-tcp
  podSelector: {}
```

These are the expected connectivity results.  The test setup is 9 pods (3 namespaces: x, y, and z;
and 3 pods in each namespace of a, b, and c); each pod runs a server on the same port and protocol
that can be reached through HTTP calls in the absence of network policies.  Connectivity is verified
by using the [agnhost](https://github.com/kubernetes/kubernetes/tree/master/test/images/agnhost) network utility to issue HTTP calls on a port and protocol that other pods are
expected to be serving.  A test scenario first
runs a connectivity check to ensure that each pod can reach each other pod, for 81 (= 9 x 9) data
points.  This is the "control".  Then pertubations are applied, depending on the test scenario:
policies are created, updated, and deleted; labels are added and removed from pods and namespaces,
and so on.  After each change, the connectivity matrix is recollected and compared to the expected
connectivity.

These results give a visual indication of connectivity.  Going down the leftmost column is the "source"
pod, or the pod issuing the request; going across the topmost row is the "destination" pod, or the pod
receiving the request.  A `.` means that the connection was allowed; an `X` means the connection was
blocked.

```
Nov  4 16:58:43.449: INFO: expected:

-   x/a x/b x/c y/a y/b y/c z/a z/b z/c
x/a .   .   .   .   .   .   .   .   .
x/b .   .   .   .   .   .   .   .   .
x/c .   .   .   .   .   .   .   .   .
y/a .   .   .   .   .   .   .   .   .
y/b .   .   .   .   .   .   .   .   .
y/c .   .   .   .   .   .   .   .   .
z/a .   .   .   .   .   .   .   .   .
z/b .   .   .   .   .   .   .   .   .
z/c .   .   .   .   .   .   .   .   .
```

Here are the observed connectivity results.  Notice how the top three rows indicate that
all requests from namespace x regardless of pod and destination were blocked.  Since these
experimental results do not match the expected results, a failure will be reported.  Note
how the specific pattern of failure provides clear insight into the nature of the problem --
since all requests from a specific namespace fail, we have a clear clue to start our
investigation.

```
Nov  4 16:58:43.449: INFO: observed:

-   x/a x/b x/c y/a y/b y/c z/a z/b z/c
x/a X   X   X   X   X   X   X   X   X
x/b X   X   X   X   X   X   X   X   X
x/c X   X   X   X   X   X   X   X   X
y/a .   .   .   .   .   .   .   .   .
y/b .   .   .   .   .   .   .   .   .
y/c .   .   .   .   .   .   .   .   .
z/a .   .   .   .   .   .   .   .   .
z/b .   .   .   .   .   .   .   .   .
z/c .   .   .   .   .   .   .   .   .
```

This was one of our earliest wins in the Network Policy group, as we were able to
identify and work with the OVN Kubernetes group to fix a bug in egress policy processing.

However, even though this tool has made it easy to validate roughly 30 common scenarios,
it doesn't validate *all* Network Policy scenarios - because there are an enormous permutation of possible
policies that one might create (well, technically, we might say this number is
infinite given that there's an infinite number of possible namespace/pod/port/protocol variations one can create).

Once these tests were in play, we worked with the Upstream SIG Network and SIG Testing communities
(thanks to Antonio Ojea and Ben Elder) to put a testgrid Network Policy job in place.  This job
continuously runs the entire suite of Network Policy tests against
[GCE with Calico as a Network Policy provider](https://testgrid.k8s.io/sig-network-gce#presubmit-network-policies,%20google-gce).

Part of our role as a subproject is to help make sure that, when these tests break, we can help triage them effectively.

## Cyclonus: The next step towards Network Policy conformance {#cyclonus}

Around the time that we were finishing the validation work, it became clear from the community that,
in general, we needed to solve the overall problem of testing ALL possible Network Policy implementations.
For example, a KEP was recently written which introduced the concept of micro versioning to
Network Policies to accommodate [describing this at the API level](https://github.com/kubernetes/enhancements/pull/2137/files), by Dan Winship.

In response to this increasingly obvious need to comprehensively defined Network
Policy for all vendors, Matt Fenwick decided to evolve our approach to Network Policy validation again by creating Cyclonus.

Cyclonus is a comprehensive Network Policy fuzzing tool which verifies a CNI provider
against 100s of different Network Policy scenarios, by defining the same truth table/policy
combinations as done in the end to end tests, while also providing a hierarchical
representation of policy "categories".  We've found some interesting missing
implementations in almost every CNI we've tested, so far, and have even contributed some fixes back.

To perform a Cyclonus validation run, you create a Job manifest similar to:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: cyclonus
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - command:
            - ./cyclonus
            - generate
            - --perturbation-wait-seconds=15
            - --server-protocol=tcp,udp
          name: cyclonus
          imagePullPolicy: IfNotPresent
          image: mfenwick100/cyclonus:latest
      serviceAccount: cyclonus
```

Cyclonus outputs a report of all the test cases it will run:
```
test cases to run by tag:
- target: 6
- peer-ipblock: 4
- udp: 16
- delete-pod: 1
- conflict: 16
- multi-port/protocol: 14
- ingress: 51
- all-pods: 14
- egress: 51
- all-namespaces: 10
- sctp: 10
- port: 56
- miscellaneous: 22
- direction: 100
- multi-peer: 0
- any-port-protocol: 2
- set-namespace-labels: 1
- upstream-e2e: 0
- allow-all: 6
- namespaces-by-label: 6
- deny-all: 10
- pathological: 6
- action: 6
- rule: 30
- policy-namespace: 4
- example: 0
- tcp: 16
- target-namespace: 3
- named-port: 24
- update-policy: 1
- any-peer: 2
- target-pod-selector: 3
- IP-block-with-except: 2
- pods-by-label: 6
- numbered-port: 28
- protocol: 42
- peer-pods: 20
- create-policy: 2
- policy-stack: 0
- any-port: 14
- delete-namespace: 1
- delete-policy: 1
- create-pod: 1
- IP-block-no-except: 2
- create-namespace: 1
- set-pod-labels: 1
testing 112 cases
```

Note that Cyclonus tags its tests based on the type of policy being created, because
of the fact that the policies themselves are auto-generated, and thus have no meaningful names to be recognized by.

For each test, Cyclonus outputs a truth table, which is again similar to that of the
E2E tests, along with the policy being validated:

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  creationTimestamp: null
  name: base
  namespace: x
spec:
  egress:
  - ports:
    - port: 81
    to:
    - namespaceSelector:
        matchExpressions:
        - key: ns
          operator: In
          values:
          - "y"
          - z
      podSelector:
        matchExpressions:
        - key: pod
          operator: In
          values:
          - a
          - b
  - ports:
    - port: 53
      protocol: UDP
  ingress:
  - from:
    - namespaceSelector:
        matchExpressions:
        - key: ns
          operator: In
          values:
          - x
          - "y"
      podSelector:
        matchExpressions:
        - key: pod
          operator: In
          values:
          - b
          - c
    ports:
    - port: 80
      protocol: TCP
  podSelector:
    matchLabels:
      pod: a
  policyTypes:
  - Ingress
  - Egress

0 wrong, 0 ignored, 81 correct
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| TCP/80 | X/A | X/B | X/C | Y/A | Y/B | Y/C | Z/A | Z/B | Z/C |
| TCP/81 |     |     |     |     |     |     |     |     |     |
| UDP/80 |     |     |     |     |     |     |     |     |     |
| UDP/81 |     |     |     |     |     |     |     |     |     |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| x/a    | X   | X   | X   | X   | X   | X   | X   | X   | X   |
|        | X   | X   | X   | .   | .   | X   | .   | .   | X   |
|        | X   | X   | X   | X   | X   | X   | X   | X   | X   |
|        | X   | X   | X   | X   | X   | X   | X   | X   | X   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| x/b    | .   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| x/c    | .   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| y/a    | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| y/b    | .   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| y/c    | .   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| z/a    | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| z/b    | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
| z/c    | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
|        | X   | .   | .   | .   | .   | .   | .   | .   | .   |
+--------+-----+-----+-----+-----+-----+-----+-----+-----+-----+
```

Both Cyclonus and the e2e tests use the same strategy to validate a Network Policy of probing pods over TCP or UDP.
As an example of how we use Cyclonus to help make CNI implementations better from a Network Policy perspective, you can see the following issues:

- [Antrea: NetworkPolicy: unable to allow ingress by CIDR](https://github.com/vmware-tanzu/antrea/issues/1764)
- [Calico: default missing protocol to TCP; don't let single port overwrite all ports](https://github.com/projectcalico/libcalico-go/pull/1373)
- [Cilium: Egress Network Policy allows traffic that should be denied](https://github.com/cilium/cilium/issues/14678)

The good news is, all of these issues are actively being fixed and iterated on between SIG Network,
the CNI providers, and the Network Policy subproject.

Are you interested in verifying NetworkPolicy functionality on your cluster?
(if you care about security or offer multi-tenant SaaS, you should be)
If so, you can run the upstream end to end tests, or Cyclonus, or both.
- If you're just getting started with NetworkPolicies and want to simply
  verify the "common" NetworkPolicy cases that most CNIs should be
  implementing correctly, in a way that is quick to diagnose, then you're
  better off running the e2e tests only.
- If you are deeply curious about your CNI provider's NetworkPolicy
  implementation, and want to verify it: use Cyclonus.
- If you want to test *hundreds* of policies, and evaluate your CNI plugin
  for comprehensive functionality, for deep discovery of potential security
  holes: use Cyclonus, and also consider running end-to-end cluster tests.
- If you're thinking of getting involved with the upstream NetworkPolicy efforts:
  use Cyclonus, and read at least an outline of what e2e tests are relevant.

## Where to start with NetworkPolicy testing?

- Cyclonus is easy to run on your cluster, check out the [instructions on github](https://github.com/mattfenwick/cyclonus#run-as-a-kubernetes-job),
  and determine whether *your* specific CNI configuration is fully conformant to the hundreds of different
  Kubernetes Network Policy API constructs.
- Alternatively, you can use a tool like [sonobuoy](https://github.com/vmware-tanzu/sonobuoy)
  to run the existing E2E tests in Kubernetes, with the `--ginkgo.focus=NetworkPolicy` flag.
  Note that only versions of sonobuoy built for k8s 1.21 and above will have the *new* Network Policy tests in them.

## Improvements to the NetworkPolicy API and user experience

In addition to cleaning up the validation story for CNI plugins that implement NetworkPolicies,
we've also spent some time improving the Kubernetes NetworkPolicy API for a few commonly requested features.
After months of deliberation, we eventually settled on a few core areas for improvement:

- Port Range policies: We now allow you to specify a *range* of ports for a policy.
  This allows users interested in scenarios like FTP or virtualization to enable advanced policies.
  The port range option for network policies will be available to use in Kubernetes 1.21.
  You can read more about this [here](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/2079-network-policy-port-range).
- Namespace as name policies: Allowing users in Kubernetes >= 1.21 to target namespaces using names,
  when building Network Policy objects.  This was done in collaboration with Jordan Liggitt and Tim Hockin on the API Machinery side.
  This change allowed us to improve the Network Policy user experience without actually
  changing the API! For more details, you can read
  [Automatic labelling](/docs/concepts/overview/working-with-objects/namespaces/#automatic-labelling) in the page about Namespaces.
  The TL,DR; is that for Kubernetes 1.21 and later, **all namespaces** have the following label added by default:

    ```
    kubernetes.io/metadata.name: <name-of-namespace>
    ```

This means you can write a namespace policy against this namespace, even if you can't edit its labels.
For example, this policy, will 'just work', without needing to run a command such as `kubectl edit namespace`.
In fact, it will even work if you can't edit or view this namespace's data at all, because of the magic of API server defaulting.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  # Allow inbound traffic to Pods labelled role=db, in the namespace 'default'
  # provided that the source is a Pod in the namespace 'my-namespace'
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: my-namespace
```

## Results

In our tests, we found that:

- Antrea and Calico are at a point where they support all of cyclonus's scenarios, modulo a few very minor tweaks which we've made.
- Cilium also conformed to the majority of the policies, outside known features that aren't fully supported (for example, related to the way cillium deals pod CIDR policies).

If you are a CNI provider and interested in helping us to do a better job curating large tests of network policies, please reach out!  We are continuing to curate the Network Policy conformance results from Cyclonus [here](https://raw.githubusercontent.com/K8sbykeshed/cyclonus-artifacts/), but
we are not capable of maintaining all of the subtleties in NetworkPolicy testing data on our own.  For now, we use github actions and Kind to test in CI.

## The Future

We're also working on some improvements for the future of Network Policies, including:

- Fully qualified Domain policies: The Google Cloud team created a prototype (which
  we are really excited about) of [FQDN policies](https://github.com/GoogleCloudPlatform/gke-fqdnnetworkpolicies-golang).
  This tool uses the Network Policy API to enforce policies against L7 URLs, by finding
  their IPs and blocking them proactively when requests are made.
- Cluster Administrative policies: We're working hard at enabling *administrative* or
  *cluster scoped* Network Policies for the future. These are being presented iteratively to the NetworkPolicy subproject.
  You can read about them here in [Cluster Scoped Network Policy](https://docs.google.com/presentation/d/1Jk86jtS3TcGAugVSM_I4Yds5ukXFJ4F1ZCvxN5v2BaY/).

The Network Policy subproject meets on mondays at 4PM EST. For details, check out the
[SIG Network community repo](https://github.com/kubernetes/community/tree/master/sig-network).  We'd love
to hang out with you, hack on stuff, and help you adopt K8s Network Policies for your cluster wherever possible.

### A quick note on User Feedback

We've gotten a lot of ideas and feedback from users on Network Policies.  A lot of people have interesting ideas about Network Policies,
but we've found that as a subproject, very few people were deeply interested in implementing these ideas to the full extent.

Almost every change to the NetworkPolicy API includes weeks or months of discussion to cover different cases, and ensure no CVEs are being introduced.  Thus, long term ownership
is the biggest impediment in improving the NetworkPolicy user experience for us, over time.

- We've documented a lot of the history of the Network Policy dialogue [here](https://github.com/jayunit100/network-policy-subproject/blob/master/history.md).
- We've also taken a poll of users, for what they'd like to see in the Network Policy API [here](https://github.com/jayunit100/network-policy-subproject/blob/master/history.md).

We encourage anyone to provide us with feedback, but our most pressing issues right now
involve finding *long term owners to help us drive changes*.  

This doesn't require a lot of technical knowledge, but rather, just a long term commitment to helping us stay organized, do paperwork,
and iterate through the many stages of the K8s feature process.  If you want to help us and get involved, please reach out on the SIG Network mailing list, or in the SIG Network room in the k8s.io slack channel!

Anyone can put an oar in the water and help make NetworkPolices better !
