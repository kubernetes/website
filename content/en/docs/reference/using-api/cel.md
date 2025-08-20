---
title: Common Expression Language in Kubernetes
reviewers:
- jpbetz
- cici37
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
---

<!-- overview -->

The [Common Expression Language (CEL)](https://github.com/google/cel-go) is used
in the Kubernetes API to declare validation rules, policy rules, and other
constraints or conditions.

CEL expressions are evaluated directly in the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}, making CEL a
convenient alternative to out-of-process mechanisms, such as webhooks, for many
extensibility use cases. Your CEL expressions continue to execute so long as the
control plane's API server component remains available.

<!-- body -->

## Language overview

The [CEL language](https://github.com/google/cel-spec/blob/master/doc/langdef.md)
has a straightforward syntax that is similar to the expressions in C, C++, Java,
JavaScript and Go.

CEL was designed to be embedded into applications. Each CEL "program" is a
single expression that evaluates to a single value. CEL expressions are
typically short "one-liners" that inline well into the string fields of Kubernetes
API resources.

Inputs to a CEL program are "variables". Each Kubernetes API field that contains
CEL declares in the API documentation which variables are available to use for
that field. For example, in the `x-kubernetes-validations[i].rules` field of
CustomResourceDefinitions, the `self` and `oldSelf` variables are available and
refer to the previous and current state of the custom resource data to be
validated by the CEL expression. Other Kubernetes API fields may declare
different variables. See the API documentation of the API fields to learn which
variables are available for that field.

Example CEL expressions:

<table>
<caption>Examples of CEL expressions and the purpose of each</caption>
<thead>
<tr>
  <th>Rule</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>self.minReplicas &lt;= self.replicas && self.replicas &lt;= self.maxReplicas</tt></td>
  <td>Validate that the three fields defining replicas are ordered appropriately</td>
</tr>
<tr>
  <td><tt>'Available' in self.stateCounts</tt></td>
  <td>Validate that an entry with the 'Available' key exists in a map</td>
</tr>
<tr>
  <td><tt>(self.list1.size() == 0) != (self.list2.size() == 0)</tt></td>
  <td>Validate that one of two lists is non-empty, but not both</td>
</tr>
<tr>
  <td><tt>self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))</tt></td>
  <td>Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'</td>
</tr>
<tr>
  <td><tt>has(self.expired) && self.created + self.ttl &lt; self.expired</tt></td>
  <td>Validate that 'expired' date is after a 'create' date plus a 'ttl' duration</td>
</tr>
<tr>
  <td><tt>self.health.startsWith('ok')</tt></td>
  <td>Validate a 'health' string field has the prefix 'ok'</td>
</tr>
<tr>
  <td><tt>self.widgets.exists(w, w.key == 'x' && w.foo &lt; 10)</tt></td>
  <td>Validate that the 'foo' property of a listMap item with a key 'x' is less than 10</td>
</tr>
<tr>
  <td><tt>type(self) == string ? self == '99%' : self == 42</tt></td>
  <td>Validate an int-or-string field for both the int and string cases</td>
</tr>
<tr>
  <td><tt>self.metadata.name == 'singleton'</tt></td>
  <td>Validate that an object's name matches a specific value (making it a singleton)</td>
</tr>
<tr>
  <td><tt>self.set1.all(e, !(e in self.set2))</tt></td>
  <td>Validate that two listSets are disjoint</td>
</tr>
<tr>
  <td><tt>self.names.size() == self.details.size() && self.names.all(n, n in self.details)</tt></td>
  <td>Validate the 'details' map is keyed by the items in the 'names' listSet</td>
</tr>
<tr>
  <td><tt>self.details.all(key, key.matches('^[a-zA-Z]*$'))</tt></td>
  <td>Validate the keys of the 'details' map</td>
</tr>
<tr>
  <td><tt>self.details.all(key, self.details[key].matches('^[a-zA-Z]*$'))</tt></td>
  <td>Validate the values of the 'details' map</td>
</tr>
</tbody>
</table>

## CEL options, language features, and libraries

CEL is configured with the following options, libraries and language features,
introduced at the specified Kubernetes versions:

<table>
<thead>
<tr>
  <th>CEL option, library or language feature</th>
  <th>Included</th>
  <th>Availability</th>
</tr>
</thead>
<tbody>
<tr>
  <td><a href="https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros">Standard macros</a></td>
  <td><code>has</code>, <code>all</code>, <code>exists</code>, <code>exists_one</code>, <code>map</code>, <code>filter</code></td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td><a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">Standard functions</a></td>
  <td>See
    <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">
      official list of standard definitions
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#HomogeneousAggregateLiterals">
      Homogeneous Aggregate Literals
    </a>
  </td>
  <td>-</td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone">Default UTC Time Zone</a></td>
  <td>-</td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#EagerlyValidateDeclarations">
      Eagerly Validate Declarations
    </a>
  </td>
  <td>-</td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Extended strings library</a>, Version 1</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td>Kubernetes versions between 1.25 and 1.30</td>
</tr>
<tr>
  <td><a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Extended strings library</a>, Version 2</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td>Kubernetes versions 1.30+</td>
</tr>
<tr>
  <td>Kubernetes list library</td>
  <td>See
    <a href="#kubernetes-list-library">
      Kubernetes list library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes regex library</td>
  <td>See
    <a href="#kubernetes-regex-library">
      Kubernetes regex library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes URL library</td>
  <td>See
    <a href="#kubernetes-url-library">
      Kubernetes URL library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes IP address library</td>
  <td>See
    <a href="#kubernetes-ip-address-library">
      Kubernetes IP address library
    </a>
  </td>
  <td>Kubernetes versions 1.31+</td>
</tr>
<tr>
  <td>Kubernetes CIDR library</td>
  <td>See
    <a href="#kubernetes-cidr-library">
      Kubernetes CIDR library
    </a>
  </td>
  <td>Kubernetes versions 1.31+</td>
</tr>
<tr>
<tr>
  <td>Kubernetes authorizer library</td>
  <td>See
    <a href="#kubernetes-authorizer-library">
      Kubernetes authorizer library
    </a>
  </td>
  <td>All Kubernetes versions</td>
</tr>
<tr>
  <td>Kubernetes quantity library</td>
  <td>See
    <a href="#kubernetes-quantity-library">
      Kubernetes quantity library
    </a>
  </td>
  <td>Kubernetes versions 1.29+</td>
</tr>
<tr>
  <td>Kubernetes semver library</td>
  <td>See
    <a href="#kubernetes-semver-library">
      Kubernetes semver library
    </a>
  </td>
  <td>Kubernetes versions 1.34+</td>
</tr>
<tr>
  <td>Kubernetes format library</td>
  <td>See
    <a href="#kubernetes-format-library">
      Kubernetes format library
    </a>
  </td>
  <td>Kubernetes versions 1.32+</td>
</tr>
<tr>
  <td>CEL optional types</td>
  <td>See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes">
      CEL optional types
    </a>
  </td>
  <td>Kubernetes versions 1.29+</td>
</tr>
<tr>
  <td>CEL CrossTypeNumericComparisons</td>
  <td>See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons">
      CEL CrossTypeNumericComparisons
   </a>
  </td>
  <td>Kubernetes versions 1.29+</td>
<tr>
  <td>CEL TwoVarComprehensions</td>
  <td>See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.25.0/ext#readme-twovarcomprehensions">
      CEL TwoVarComprehensions
   </a>
  </td>
  <td>Kubernetes versions 1.33+</td>
</tr>
</tbody>
</table>

CEL functions, features and language settings support Kubernetes control plane
rollbacks. For example, _CEL Optional Values_ was introduced at Kubernetes 1.29
and so only API servers at that version or newer will accept write requests to
CEL expressions that use _CEL Optional Values_. However, when a cluster is
rolled back to Kubernetes 1.28 CEL expressions using "CEL Optional Values" that
are already stored in API resources will continue to evaluate correctly.

## Kubernetes CEL libraries

In additional to the CEL community libraries, Kubernetes includes CEL libraries
that are available everywhere CEL is used in Kubernetes.

### Kubernetes list library

The list library includes `indexOf` and `lastIndexOf`, which work similar to the
strings functions of the same names. These functions either the first or last
positional index of the provided element in the list.

The list library also includes `min`, `max` and `sum`. Sum is supported on all
number types as well as the duration type. Min and max are supported on all
comparable types.

`isSorted` is also provided as a convenience function and is supported on all
comparable types.

Examples:

<table>
<caption>Examples of CEL expressions using list library functions</caption>
<thead>
<tr>
  <td>CEL Expression</td>
  <td>Purpose</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>names.isSorted()</tt></td>
  <td>Verify that a list of names is kept in alphabetical order</td>
</tr>
<tr>
  <td><tt>items.map(x, x.weight).sum() == 1.0</tt></td>
  <td>Verify that the "weights" of a list of objects sum to 1.0</td>
</tr>
<tr>
  <td><tt>lowPriorities.map(x, x.priority).max() &lt; highPriorities.map(x, x.priority).min()</tt></td>
  <td>Verify that two sets of priorities do not overlap</td>
</tr>
<tr>
  <td><tt>names.indexOf('should-be-first') == 1</tt></td>
  <td>Require that the first name in a list if a specific value</td>
</tr>
</tbody>
</table>

See the [Kubernetes List Library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists)
godoc for more information.

### Kubernetes regex library

In addition to the `matches` function provided by the CEL standard library, the
regex library provides `find` and `findAll`, enabling a much wider range of
regex operations.

Examples:

<table>
<caption>Examples of CEL expressions using regex library functions</caption>
<thead>
<tr>
  <td>CEL Expression</td>
  <td>Purpose</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>"abc 123".find('[0-9]+')</tt></td>
  <td>Find the first number in a string</td>
</tr>
<tr>
  <td><tt>"1, 2, 3, 4".findAll('[0-9]+').map(x, int(x)).sum() &lt; 100</tt></td>
  <td>Verify that the numbers in a string sum to less than 100</td>
</tr>
</tbody>
</table>

See the [Kubernetes regex library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)
godoc for more information.

### Kubernetes URL library

To make it easier and safer to process URLs, the following functions have been added:

- `isURL(string)` checks if a string is a valid URL according to the
  [Go's net/url](https://pkg.go.dev/net/url#URL) package. The string must be an
  absolute URL.
- `url(string) URL` converts a string to a URL or results in an error if the
  string is not a valid URL.

Once parsed via the `url` function, the resulting URL object has `getScheme`,
`getHost`, `getHostname`, `getPort`, `getEscapedPath` and `getQuery` accessors.

Examples:

<table>
<caption>Examples of CEL expressions using URL library functions</caption>
<thead>
<tr>
  <td>CEL Expression</td>
  <td>Purpose</td>
</tr>
</thead>
<tbody>
</tr>
<tr>
  <td><tt>url('https://example.com:80/').getHost()</tt></td>
  <td>Gets the 'example.com:80' host part of the URL</td>
</tr>
<tr>
  <td><tt>url('https://example.com/path with spaces/').getEscapedPath()</tt></td>
  <td>Returns '/path%20with%20spaces/'</td>
</tr>
</tbody>
</table>

See the [Kubernetes URL library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs)
godoc for more information.

### Kubernetes IP address library

To make it easier and safer to process IP addresses, the following functions have been added:

- `isIP(string)` checks if a string is a valid IP address.
- `ip(string) IP` converts a string to an IP address object or results in an error if the string is not a valid IP address.

For both functions, the IP address must be an IPv4 or IPv6 address.
IPv4-mapped IPv6 addresses (e.g. `::ffff:1.2.3.4`) are not allowed.
IP addresses with zones (e.g. `fe80::1%eth0`) are not allowed.
Leading zeros in IPv4 address octets are not allowed.

Once parsed via the `ip` function, the resulting IP object has the
following library of member functions:

<table>
<caption>Available member functions of an IP address object</caption>
<thead>
<tr>
  <th>Member Function</th>
  <th>CEL Return Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isCanonical()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is in its canonical form.
    There is exactly one canonical form for every IP address, so fields containing
    IPs in canonical form can just be treated as strings when checking for equality or uniqueness.
  </td>
</tr>
<tr>
  <td><tt>family()</tt></td>
  <td>int</td>
  <td>Returns the IP address family, <tt>4</tt> for IPv4 and <tt>6</tt> for IPv6.</td>
</tr>
<tr>
  <td><tt>isUnspecified()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is the unspecified address.
    Either the IPv4 address "0.0.0.0" or the IPv6 address "::".
  </td>
</tr>
<tr>
  <td><tt>isLoopback()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is the loopback address.
    Either an IPv4 address with a value of 127.x.x.x or an IPv6 address with a value of ::1.
  </td>
</tr>
<tr>
  <td><tt>isLinkLocalMulticast()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is a link-local multicast address.
    Either an IPv4 address with a value of 224.0.0.x or an IPv6 address in the network ff00::/8.
  </td>
</tr>
<tr>
  <td><tt>isLinkLocalUnicast()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is a link-local unicast address.
    Either an IPv4 address with a value of 169.254.x.x or an IPv6 address in the network fe80::/10.
  </td>
</tr>
<tr>
  <td><tt>isGlobalUnicast()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is a global unicast address.
    Either an IPv4 address that is not zero or 255.255.255.255 or an IPv6 address that is not a link-local unicast, loopback or multicast address.
  </td>
</tr>
</tbody>
</table>

Examples:

<table>
<caption>Examples of CEL expressions using IP address library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isIP('127.0.0.1')</tt></td>
  <td>Returns true for a valid IP.</td>
</tr>
<tr>
  <td><tt>ip('2001:db8::abcd').isCanonical()</tt></td>
  <td>Returns true for a canonical IPv6.</td>
</tr>
<tr>
  <td><tt>ip('2001:DB8::ABCD').isCanonical()</tt></td>
  <td>Returns false because the canonical form is lowercase.</td>
</tr>
<tr>
  <td><tt>ip('127.0.0.1').family() == 4</tt></td>
  <td>Check the address family of an IP.</td>
</tr>
<tr>
  <td><tt>ip('::1').isLoopback()</tt></td>
  <td>Check if an IP is a loopback address.</td>
</tr>
<tr>
  <td><tt>ip('192.168.0.1').isGlobalUnicast()</tt></td>
  <td>Check if an IP is a global unicast address.</td>
</tr>
</tbody>
</table>

See the [Kubernetes IP address library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#IP) godoc for more information.

### Kubernetes CIDR library

CIDR provides a CEL function library extension of {{< glossary_tooltip text="CIDR" term_id="CIDR" >}} notation parsing functions.

#### `cidr`

Converts a string in CIDR notation to a network address representation or results in an error if the string is not a valid CIDR notation.
The CIDR must be an IPv4 or IPv6 subnet address with a mask.
Leading zeros in IPv4 address octets are not allowed.
IPv4-mapped IPv6 addresses (e.g. `::ffff:1.2.3.4/24`) are not allowed.

<tt>cidr(&lt;string&gt;) &lt;CIDR&gt;</tt>

Examples:

<tt>cidr('192.168.0.0/16')</tt> // returns an IPv4 address with a CIDR mask
<tt>cidr('::1/128')</tt> // returns an IPv6 address with a CIDR mask
<tt>cidr('192.168.0.0/33')</tt> // error
<tt>cidr('::1/129')</tt> // error
<tt>cidr('192.168.0.1/16')</tt> // error, because there are non-0 bits after the prefix

#### `isCIDR`

Returns true if a string is a valid CIDR notation representation of a subnet with mask.
The CIDR must be an IPv4 or IPv6 subnet address with a mask.
Leading zeros in IPv4 address octets are not allowed.
IPv4-mapped IPv6 addresses (e.g. `::ffff:1.2.3.4/24`) are not allowed.

<tt>isCIDR(&lt;string&gt;) &lt;bool&gt;</tt>

Examples:

<tt>isCIDR('192.168.0.0/16')</tt> // returns true
<tt>isCIDR('::1/128')</tt> // returns true
<tt>isCIDR('192.168.0.0/33')</tt> // returns false
<tt>isCIDR('::1/129')</tt> // returns false

#### `containsIP` / `containsCIDR` / `ip` / `masked` / `prefixLength`



- `containsIP`: Returns true if a the CIDR contains the given IP address.
The IP address must be an IPv4 or IPv6 address.
May take either a string or IP address as an argument.

- `containsCIDR`: Returns true if a the CIDR contains the given CIDR.
The CIDR must be an IPv4 or IPv6 subnet address with a mask.
May take either a string or CIDR as an argument.

- `ip`: Returns the IP address representation of the CIDR.

- `masked`: Returns the CIDR representation of the network address with a masked prefix.
This can be used to return the canonical form of the CIDR network.

- `prefixLength`: Returns the prefix length of the CIDR in bits.
This is the number of bits in the mask.

Examples:

<table>
<caption>Examples of CEL expressions using CIDR library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.0.1'))</tt></td>
  <td>Checks if a CIDR contains a given IP address (IP object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.1.1'))</tt></td>
  <td>Checks if a CIDR contains a given IP address (IP object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.0.1')</tt></td>
  <td>Checks if a CIDR contains a given IP address (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.1.1')</tt></td>
  <td>Checks if a CIDR contains a given IP address (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR(cidr('192.168.10.0/24'))</tt></td>
  <td>Checks if a CIDR contains another given CIDR (CIDR object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR(cidr('192.168.2.0/24'))</tt></td>
  <td>Checks if a CIDR contains another given CIDR (CIDR object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR('192.168.10.0/24')</tt></td>
  <td>Checks if a CIDR contains another given CIDR (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR('192.168.2.0/24')</tt></td>
  <td>Checks if a CIDR contains another given CIDR (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip()</tt></td>
  <td>Returns the IP address part of a CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip().family()</tt></td>
  <td>Returns the family of the IP address part of a CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip()</tt></td>
  <td>Returns the IP address part of an IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip().family()</tt></td>
  <td>Returns the family of the IP address part of an IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').masked()</tt></td>
  <td>Returns the canonical form of a CIDR network.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').masked()</tt></td>
  <td>Returns the canonical form of a CIDR network, masking non-prefix bits.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24') == cidr('192.168.0.0/24').masked()</tt></td>
  <td>Compares a CIDR to its canonical form (already canonical).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24') == cidr('192.168.0.1/24').masked()</tt></td>
  <td>Compares a CIDR to its canonical form (not canonical).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').prefixLength()</tt></td>
  <td>Returns the prefix length of an IPv4 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').prefixLength()</tt></td>
  <td>Returns the prefix length of an IPv6 CIDR.</td>
</tr>
</tbody>
</table>

See the [Kubernetes CIDR library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#CIDR) godoc for more information.

### Kubernetes authorizer library

For CEL expressions in the API where a variable of type `Authorizer` is available,
the authorizer may be used to perform authorization checks for the principal
(authenticated user) of the request.

API resource checks are performed as follows:

1. Specify the group and resource to check: `Authorizer.group(string).resource(string) ResourceCheck`
1. Optionally call any combination of the following builder functions to further narrow the authorization check.
   Note that these functions return the receiver type and can be chained:
   - `ResourceCheck.subresource(string) ResourceCheck`
   - `ResourceCheck.namespace(string) ResourceCheck`
   - `ResourceCheck.name(string) ResourceCheck`
1. Call `ResourceCheck.check(verb string) Decision` to perform the authorization check.
1. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.

Non-resource authorization performed are used as follows:

1. Specify only a path: `Authorizer.path(string) PathCheck`
1. Call `PathCheck.check(httpVerb string) Decision` to perform the authorization check.
1. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.

To perform an authorization check for a service account:

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

<table>
<caption>Examples of CEL expressions using URL library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').namespace('default').check('create').allowed()</tt></td>
  <td>Returns true if the principal (user or service account) is allowed create pods in the 'default' namespace.</td>
</tr>
<tr>
  <td><tt>authorizer.path('/healthz').check('get').allowed()</tt></td>
  <td>Checks if the principal (user or service account) is authorized to make HTTP GET requests to the /healthz API path.</td>
</tr>
<tr>
  <td><tt>authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()<tt></td>
  <td>Checks if the service account is authorized to delete deployments.</td>
</tr>
</tbody>
</table>

{{< feature-state state="alpha" for_k8s_version="v1.31" >}}

With the alpha `AuthorizeWithSelectors` feature enabled, field and label selectors can be added to authorization checks.

<table>
<caption>Examples of CEL expressions using selector authorization functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').fieldSelector('spec.nodeName=mynode').check('list').allowed()</tt></td>
  <td>
    Returns true if the principal (user or service account) is allowed
    to list pods with the field selector <tt>spec.nodeName=mynode</tt>.
  </td>
</tr>
<tr>
  <td><tt>authorizer.group('').resource('pods').labelSelector('example.com/mylabel=myvalue').check('list').allowed()</tt></td>
  <td>
    Returns true if the principal (user or service account) is allowed
    to list pods with the label selector <tt>example.com/mylabel=myvalue</tt>.
  </td>
</tr>
</tbody>
</table>

See the [Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)
and [Kubernetes AuthzSelectors library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)
godoc for more information.

### Kubernetes format library

The `format` library provides functions for validating common Kubernetes string formats.
This can be useful in the `messageExpression` of validation rules to provide more specific error messages.

The library provides `format()` functions for each named format, and a generic `format.named()` function.

- `format.named(string)` &rarr; `?Format`: Returns the `Format` object for the given format name, if it exists. Otherwise, returns `optional.none`.
- `format.<formatName>() -> Format`: Convenience functions for all the named formats are also available. For example, `format.dns1123Label()` returns the `Format` object for DNS-1123 labels.
- `<Format>.validate(string) -> list<string>?`: Validates the given string against the format. Returns `optional.none` if the string is valid, otherwise an optional containing a list of validation error strings.

**Available Formats:**

The following format names are supported:

<table>
<caption>Available formats for the format library</caption>
<thead>
<tr>
  <th>Format Name</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>dns1123Label</tt></td>
  <td>Validates if the string is a valid DNS-1123 label.</td>
</tr>
<tr>
  <td><tt>dns1123Subdomain</tt></td>
  <td>Validates if the string is a valid DNS-1123 subdomain.</td>
</tr>
<tr>
  <td><tt>dns1035Label</tt></td>
  <td>Validates if the string is a valid DNS-1035 label.</td>
</tr>
<tr>
  <td><tt>qualifiedName</tt></td>
  <td>Validates if the string is a valid qualified name.</td>
</tr>
<tr>
  <td><tt>dns1123LabelPrefix</tt></td>
  <td>Validates if the string is a valid DNS-1123 label prefix.</td>
</tr>
<tr>
  <td><tt>dns1123SubdomainPrefix</tt></td>
  <td>Validates if the string is a valid DNS-1123 subdomain prefix.</td>
</tr>
<tr>
  <td><tt>dns1035LabelPrefix</tt></td>
  <td>Validates if the string is a valid DNS-1035 label prefix.</td>
</tr>
<tr>
  <td><tt>labelValue</tt></td>
  <td>Validates if the string is a valid label value.</td>
</tr>
<tr>
  <td><tt>uri</tt></td>
  <td>Validates if the string is a valid URI. Uses the same pattern as `isURL`, but returns an error list.</td>
</tr>
<tr>
  <td><tt>uuid</tt></td>
  <td>Validates if the string is a valid UUID.</td>
</tr>
<tr>
  <td><tt>byte</tt></td>
  <td>Validates if the string is a valid base64 encoded string.</td>
</tr>
<tr>
  <td><tt>date</tt></td>
  <td>Validates if the string is a valid date in `YYYY-MM-DD` format.</td>
</tr>
<tr>
  <td><tt>datetime</tt></td>
  <td>Validates if the string is a valid datetime in RFC3339 format.</td>
</tr>
</tbody>
</table>

**Examples:**

<table>
<caption>Examples of CEL expressions using format library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>!format.dns1123Label().validate(self.metadata.name).hasValue()</tt></td>
  <td>A validation rule that checks if an object's name is a valid DNS-1123 label.</td>
</tr>
<tr>
  <td><tt>format.dns1123Label().validate(self.metadata.name).orValue([]).join("\\n")</tt></td>
  <td>A `messageExpression` that returns specific validation errors for a field. If the field is valid, `validate` returns `optional.none`, and `orValue` provides an empty list, resulting in an empty string.</td>
</tr>
</tbody>
</table>

See the [Kubernetes Format library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Format) godoc for more information.

### Kubernetes quantity library

Kubernetes 1.28 adds support for manipulating quantity strings (ex 1.5G, 512k, 20Mi)

- `isQuantity(string)` checks if a string is a valid Quantity according to
  [Kubernetes' resource.Quantity](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity).
- `quantity(string) Quantity` converts a string to a Quantity or results in an error if the
  string is not a valid quantity.

Once parsed via the `quantity` function, the resulting Quantity object has the
following library of member functions:

<table>
<caption>Available member functions of a Quantity</caption>
<thead>
<tr>
  <th>Member Function</th>
  <th>CEL Return Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isInteger()</tt></td>
  <td>bool</td>
  <td>Returns true if and only if asInteger is safe to call without an error</td>
</tr>
<tr>
  <td><tt>asInteger()</tt></td>
  <td>int</td>
  <td>
    Returns a representation of the current value as an <tt>int64</tt> if possible
    or results in an error if conversion would result in overflowor loss of precision.
  </td>
</tr>
<tr>
  <td><tt>asApproximateFloat()</tt></td>
  <td>float</td>
  <td>
    Returns a <tt>float64</tt> representation of the quantity which may lose precision.
    If the value of the quantity is outside the range of a <tt>float64</tt>,
    <tt>+Inf/-Inf</tt> will be returned.</td>
</tr>
<tr>
  <td><tt>sign()</tt></td>
  <td>int</td>
  <td>
    Returns <tt>1</tt> if the quantity is positive, <tt>-1</tt> if it is negative.
    <tt>0</tt> if it is zero.
  </td>
</tr>
<tr>
  <td><tt>add(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns sum of two quantities</td>
</tr>
<tr>
  <td><tt>add(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns sum of quantity and an integer</td>
  <td>
<tr>
  <td><tt>sub(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns difference between two quantities</td>
</tr>
<tr>
  <td><tt>sub(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td>Returns difference between a quantity and an integer</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is less than the operand</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is greater than the operand</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Quantity&gt;)</tt></td>
  <td>int</td>
  <td>
    Compares receiver to operand and returns 0 if they are equal,
    1 if the receiver is greater, or -1 if the receiver is less than the operand
  </td>
</tr>
</tbody>
</table>

Examples:

<table>
<caption>Examples of CEL expressions using URL library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>quantity("500000G").isInteger()</tt></td>
  <td>Test if conversion to integer would throw an error</td>
</tr>
<tr>
  <td><tt>quantity("50k").asInteger()</tt></td>
  <td>Precise conversion to integer</td>
</tr>
<tr>
  <td><tt>quantity("9999999999999999999999999999999999999G").asApproximateFloat()</tt></td>
  <td>Lossy conversion to float</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(quantity("20k"))</tt></td>
  <td>Add two quantities</td>
</tr>
<tr>
  <td><tt>quantity("50k").sub(20000)</tt></td>
  <td>Subtract an integer from a quantity</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(20).sub(quantity("100k")).sub(-50000)</tt></td>
  <td>Chain adding and subtracting integers and quantities</td>
</tr>
<tr>
  <td><tt>quantity("200M").compareTo(quantity("0.2G"))</tt></td>
  <td>Compare two quantities</td>
</tr>
<tr>
  <td><tt>quantity("150Mi").isGreaterThan(quantity("100Mi"))</tt></td>
  <td>Test if a quantity is greater than the receiver</td>
</tr>
<tr>
  <td><tt>quantity("50M").isLessThan(quantity("100M"))</tt></td>
  <td>Test if a quantity is less than the receiver</td>
</tr>
</tbody>
</table>

### Kubernetes semver library

Kubernetes v1.34 adds support for parsing and comparing strings that follow the Semantic Versioning 2.0.0 specification.
Refer to the [semver.org](https://semver.org/) documentation for information on accepted patterns.

- `isSemver(string)` checks if a string is a valid semantic version.
- `semver(string)` converts a string to a Semver object or results in an error.

An optional boolean `normalize` argument can be passed to `isSemver` and `semver`. If `true`, normalization removes any "v" prefix, adds a 0 minor and patch numbers to versions with only major or major.minor components specified, and removes any leading 0s.

Once parsed via the `semver` function, the resulting Semver object has the
following library of member functions:

<table>
<caption>Available member functions of a Semver object</caption>
<thead>
<tr>
  <th>Member Function</th>
  <th>CEL Return Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>major()</tt></td>
  <td>int</td>
  <td>Returns the major version number.</td>
</tr>
<tr>
  <td><tt>minor()</tt></td>
  <td>int</td>
  <td>Returns the minor version number.</td>
</tr>
<tr>
  <td><tt>patch()</tt></td>
  <td>int</td>
  <td>Returns the patch version number.</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is less than the operand.</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is greater than the operand.</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Semver&gt;)</tt></td>
  <td>int</td>
  <td>
    Compares receiver to operand and returns 0 if they are equal,
    1 if the receiver is greater, or -1 if the receiver is less than the operand.
  </td>
</tr>
</tbody>
</table>

Examples:

<table>
<caption>Examples of CEL expressions using semver library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isSemver('1.0.0')</tt></td>
  <td>Returns true for a valid Semver string.</td>
</tr>
<tr>
  <td><tt>isSemver('v1.0', true)</tt></td>
  <td>Returns true for a normalizable Semver string.</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').major()</tt></td>
  <td>Returns the major version of a Semver.</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').compareTo(semver('2.0.0')) &lt; 0</tt></td>
  <td>Compare two Semver strings.</td>
</tr>
</tbody>
</table>

See the [Kubernetes Semver library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#SemverLib) godoc for more information.

## Type checking

CEL is a [gradually typed language](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

Some Kubernetes API fields contain fully type checked CEL expressions. For example,
[CustomResourceDefinitions Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
are fully type checked.

Some Kubernetes API fields contain partially type checked CEL expressions. A
partially type checked expression is an expressions where some of the variables
are statically typed but others are dynamically typed. For example, in the CEL
expressions of
[ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
the `request` variable is typed, but the `object` variable is dynamically typed.
As a result, an expression containing `request.namex` would fail type checking
because the `namex` field is not defined. However, `object.namex` would pass
type checking even when the `namex` field is not defined for the resource kinds
that `object` refers to, because `object` is dynamically typed.

The `has()` macro in CEL may be used in CEL expressions to check if a field of a
dynamically typed variable is accessible before attempting to access the field's
value. For example:

```cel
has(object.namex) ? object.namex == 'special' : request.name == 'special'
```

## Type system integration

<table>
<caption>Table showing the relationship between OpenAPIv3 types and CEL types</caption>
<thead>
<tr>
  <th>OpenAPIv3 type</th>
  <th>CEL type</th>
</tr>
</thead>
<tbody>
<tr>
  <td>'object' with Properties</td>
  <td>
    object / "message type"
    (<tt>type(&lt;object&gt;)</tt> evaluates to
     <tt>selfType&lt;uniqueNumber&gt;.path.to.object.from.self</tt>)
  </td>
</tr>
<tr>
  <td>'object' with <tt>additionalProperties</tt></td>
  <td>map</td>
</tr>
<tr>
  <td>'object' with <tt>x-kubernetes-embedded-type</tt></td>
  <td>
    object / "message type", 'apiVersion', 'kind', 'metadata.name'
    and 'metadata.generateName' are implicitly included in schema
  </td>
</tr>
<tr>
  <td>'object' with x-kubernetes-preserve-unknown-fields</td>
  <td>object / "message type", unknown fields are NOT accessible in CEL expression</td>
</tr>
<tr>
  <td><tt>x-kubernetes-int-or-string</tt></td>
  <td>
    Union of <tt>int</tt> or <tt>string</tt>,
    <tt>self.intOrString < 100 | self.intOrString == '50%'</tt>
    evaluates to true for both <tt>50</tt> and <tt>"50%"</tt>
  </td>
</tr>
<tr>
  <td>'array'</td>
  <td>list</td>
</tr>
<tr>
  <td>'array' with <tt>x-kubernetes-list-type=map</tt></td>
  <td>list with map based Equality & unique key guarantees</td>
</tr>
<tr>
  <td>'array' with <tt>x-kubernetes-list-type=set</tt></td>
  <td>list with set based Equality & unique entry guarantees</td>
</tr>
<tr>
  <td>'boolean'</td>
  <td>boolean</td>
</tr>
<tr>
  <td>'number' (all formats)</td>
  <td>double</td>
</tr>
<tr>
  <td>'integer' (all formats)</td>
  <td>int (64)</td>
</tr>
<tr>
  <td><i>no equivalent</i></td>
  <td>uint (64)</td>
</tr>
<tr>
  <td>'null'</td>
  <td>null_type</td>
</tr>
<tr>
  <td>'string'</td>
  <td>string</td>
</tr>
<tr>
  <td>'string' with format=byte (base64 encoded)</td>
  <td>bytes</td>
</tr>
<tr>
  <td>'string' with format=date</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td>'string' with format=datetime</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td>'string' with format=duration</td>
  <td>duration (<tt>google.protobuf.Duration</tt>)</td>
</tr>
</tbody>
</table>

Also see: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values),
[OpenAPI types](https://swagger.io/specification/#data-types),
[Kubernetes Structural Schemas](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

Equality comparison for arrays with `x-kubernetes-list-type` of `set` or `map` ignores element
order. For example `[1, 2] == [2, 1]` if the arrays represent Kubernetes `set` values.

Concatenation on arrays with `x-kubernetes-list-type` use the semantics of the
list type:

`set`
: `X + Y` performs a union where the array positions of all elements in
  `X` are preserved and non-intersecting elements in `Y` are appended, retaining
  their partial order.

`map`
: `X + Y` performs a merge where the array positions of all keys in `X`
  are preserved but the values are overwritten by values in `Y` when the key
  sets of `X` and `Y` intersect. Elements in `Y` with non-intersecting keys are
  appended, retaining their partial order.

## Escaping

Only Kubernetes resource property names of the form
`[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible from CEL. Accessible property
names are escaped according to the following rules when accessed in the
expression:

<table>
<caption>Table of CEL identifier escaping rules</caption>
<thead>
<tr>
  <th>escape sequence</th>
  <th>property name equivalent</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>__underscores__</tt></td>
  <td><tt>__</tt></td>
</tr>
<tr>
  <td><tt>__dot__</tt></td>
  <td><tt>.</tt></td>
</tr>
<tr>
  <td><tt>__dash__</tt></td>
  <td><tt>-</tt></td>
</tr>
<tr>
  <td><tt>__slash__</tt></td>
  <td><tt>/</tt></td>
</tr>
<tr>
  <td><tt>__{keyword}__</tt></td>
  <td>
    <a href="https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax">
      CEL <b>RESERVED</b> keyword
    </a>
  </td>
</tr>
</tbody>
</table>

When you escape any of CEL's **RESERVED** keywords you need to match the exact property name
use the underscore escaping
(for example, `int` in the word `sprint` would not be escaped and nor would it need to be).

Examples on escaping:

<table>
<caption>Examples escaped CEL identifiers</caption>
<thead>
<tr>
  <th>property name</th>
  <th>rule with escaped property name</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>namespace</tt></td>
  <td><tt>self.__namespace__ &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>x-prop</tt></td>
  <td><tt>self.x__dash__prop &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>redact_d</tt></td>
  <td><tt>self.redact__underscores__d &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>string</tt></td>
  <td><tt>self.startsWith('kube')</tt></td>
</tr>
</tbody>
</table>

## Resource constraints

CEL is non-Turing complete and offers a variety of production safety controls to
limit execution time. CEL's _resource constraint_ features provide feedback to
developers about expression complexity and help protect the API server from
excessive resource consumption during evaluation. CEL's resource constraint
features are used to prevent CEL evaluation from consuming excessive API server
resources.

A key element of the resource constraint features is a _cost unit_ that CEL
defines as a way of tracking CPU utilization. Cost units are independent of
system load and hardware. Cost units are also deterministic; for any given CEL
expression and input data, evaluation of the expression by the CEL interpreter
will always result in the same cost.

Many of CEL's core operations have fixed costs. The simplest operations, such as
comparisons (e.g. `<`) have a cost of 1. Some have a higher fixed cost, for
example list literal declarations have a fixed base cost of 40 cost units.

Calls to functions implemented in native code approximate cost based on the time
complexity of the operation. For example: operations that use regular
expressions, such as `match` and `find`, are estimated using an approximated
cost of `length(regexString)*length(inputString)`. The approximated cost
reflects the worst case time complexity of Go's RE2 implementation.

### Runtime cost budget

All CEL expressions evaluated by Kubernetes are constrained by a runtime cost
budget. The runtime cost budget is an estimate of actual CPU utilization
computed by incrementing a cost unit counter while interpreting a CEL
expression. If the CEL interpreter executes too many instructions, the runtime
cost budget will be exceeded, execution of the expressions will be halted, and
an error will result.

Some Kubernetes resources define an additional runtime cost budget that bounds
the execution of multiple expressions. If the sum total of the cost of
expressions exceed the budget, execution of the expressions will be halted, and
an error will result. For example the validation of a custom resource has a
_per-validation_ runtime cost budget for all
[Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
evaluated to validate the custom resource.

### Estimated cost limits

For some Kubernetes resources, the API server may also check if worst case
estimated running time of CEL expressions would be prohibitively expensive to
execute. If so, the API server prevent the CEL expression from being written to
API resources by rejecting create or update operations containing the CEL
expression to the API resources. This feature offers a stronger assurance that
CEL expressions written to the API resource will be evaluated at runtime without
exceeding the runtime cost budget.
