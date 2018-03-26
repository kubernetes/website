---
title: Validation - End-to-end Testing
---

{% capture overview %}
This page will outline how to ensure that a Juju-deployed Kubernetes
cluster has stood up correctly and is ready to accept workloads.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

{% capture steps %}
## End-to-end testing

End-to-end (e2e) tests for Kubernetes provide a mechanism to test end-to-end
behavior of the system, and is the last signal to ensure end user operations
match developer specifications. Although unit and integration tests provide a
good signal, in a distributed system like Kubernetes it is not uncommon that a
minor change may pass all unit and integration tests, but cause unforeseen
changes at the system level.

The primary objectives of the e2e tests are to ensure a consistent and reliable
behavior of the kubernetes code base, and to catch hard-to-test bugs before
users do, when unit and integration tests are insufficient.

End-to-end tests will pass on a properly running CDK cluster outside of bugs in the tests.

### Deploy kubernetes-e2e charm

To deploy the end-to-end test suite, you need to relate the `kubernetes-e2e` charm
to your existing kubernetes-master nodes and easyrsa:

```
juju deploy cs:~containers/kubernetes-e2e
juju add-relation kubernetes-e2e easyrsa
juju add-relation kubernetes-e2e:kubernetes-master kubernetes-master:kube-api-endpoint
juju add-relation kubernetes-e2e:kube-control kubernetes-master:kube-control
```

Once the relations have settled, you can do `juju status` until the workload status results in 
 `Ready to test.` - you may then kick off an end to end validation test.

### Running the e2e test

The e2e test is encapsulated as an action to ensure consistent runs of the
end to end test. The defaults are sensible for most deployments.

    juju run-action kubernetes-e2e/0 test


### Tuning the e2e test

The e2e test is configurable. By default it will focus on or skip the declared
conformance tests in a cloud agnostic way. Default behaviors are configurable.
This allows the operator to test only a subset of the conformance tests, or to
test more behaviors not enabled by default. You can see all tunable options on
the charm by inspecting the schema output of the actions:

    juju actions kubernetes-e2e --format=yaml --schema

Output: 

```
test:
  description: Run end-to-end validation test suite
  properties:
    focus:
      default: \[Conformance\]
      description: Regex focus for executing the test
      type: string
    skip:
      default: \[Flaky\]
      description: Regex of tests to skip
      type: string
    timeout:
      default: 30000
      description: Timeout in nanoseconds
      type: integer
  title: test
  type: object
```

As an example, you can run a more limited set of tests for rapid validation of
a deployed cluster. The following example will skip the `Flaky`, `Slow`, and
`Feature` labeled tests:

    juju run-action kubernetes-e2e/0 test skip='\[(Flaky|Slow|Feature:.*)\]'

**Note:** the escaping of the regex due to how bash handles brackets.
{: .note}

To see the different types of tests the Kubernetes end-to-end charm has access
to, we encourage you to see the [upstream documentation on the different types
of tests](https://git.k8s.io/community/contributors/devel/e2e-tests.md#kinds-of-tests),
and to thoroughly understand what subsets of the tests you are running.

### More information on end-to-end testing

Along with the above descriptions, end-to-end testing is a much larger subject
than this readme can encapsulate. There is far more information in the
[end-to-end testing guide](https://git.k8s.io/community/contributors/devel/e2e-tests.md).

### Evaluating end-to-end results

It is not enough to just simply run the test. Result output is stored in two
places. The raw output of the e2e run is available in the `juju show-action-output`
command, as well as a flat file on disk on the `kubernetes-e2e` unit that
executed the test.

**Note:** The results will only be available once the action has
completed the test run. End-to-end testing can be quite time consuming, often
taking more than 1 hour, depending on configuration.
{: .note}

##### Accessing the results in a flat file

Here's how to copy the output out as a file: 

    juju run-action kubernetes-e2e/0 test

Output:

    Action queued with id: 4ceed33a-d96d-465a-8f31-20d63442e51b

Copy output to your local machine:

    juju scp kubernetes-e2e/0:4ceed33a-d96d-465a-8f31-20d63442e51b.log .

##### Action result output

Or you can just show the output inline:

    juju run-action kubernetes-e2e/0 test

Output:

    Action queued with id: 4ceed33a-d96d-465a-8f31-20d63442e51b

Show the results in your terminal: 

    juju show-action-output 4ceed33a-d96d-465a-8f31-20d63442e51b


### Known issues

The e2e test suite assumes egress network access. It will pull container
images from `gcr.io`. You will need to have this registry unblocked in your
firewall to successfully run e2e test results. Or you may use the exposed
proxy settings [properly configured](https://github.com/juju-solutions/bundle-canonical-kubernetes#proxy-configuration)
on the kubernetes-worker units.

## Upgrading the e2e tests

The e2e tests are always expanding; you can see if there's an upgrade
available by running `juju status kubernetes-e2e`.

When an upgrade is available, upgrade your deployment:

    juju upgrade-charm kubernetes-e2e

{% endcapture %}

{% include templates/task.md %}

