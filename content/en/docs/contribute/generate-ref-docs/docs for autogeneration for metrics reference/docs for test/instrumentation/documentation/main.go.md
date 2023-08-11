

## Kubernetes Metrics Documentation Generator

This code is a Go program that generates documentation for Kubernetes metrics exported by various components. The generated documentation is in Markdown format and provides details about the metrics, their stability levels, types, descriptions, labels, and other relevant information.

### Dependencies

The code relies on the following Go packages:

- `bytes`: Used for working with byte slices.
- `fmt`: Used for formatting output.
- `os`: Provides access to operating system functionality.
- `sort`: Used for sorting collections.
- `strings`: Offers string manipulation functions.
- `text/template`: Used for text templating.
- `time`: Provides time-related functionality.
- `gopkg.in/yaml.v2`: Used for YAML parsing.
- `k8s.io/component-base/metrics`: A Kubernetes package for handling metrics.



```bash
go get gopkg.in/yaml.v2
go get k8s.io/component-base/metrics
```
###instructions
This directory contains the regression test for controlling the list of stable metrics

If you add or remove a stable metric, this test will fail and you will need
to update the golden list of tests stored in `testdata/`.  Changes to that file
require review by sig-instrumentation.

To update the list, run

```console
./hack/update-generated-stable-metrics.sh
```

Add the changed file to your PR, then send for review.

If you want to test the stability framework, you can add metrics to the file in
`test/instrumentation/testdata/pkg/kubelet/metrics/metrics.go` and run test
verification via:

```console
./test/instrumentation/test-verify.sh
```

To update the golden test list, you can run:

```console
./test/instrumentation/test-update.sh
```

To update the list of documented metrics, please run:

```console
./test/instrumentation/update-documentation-metrics.sh
```

To update the documented list of metrics for k8s/website, please run:

```console
./test/instrumentation/update-documentation.sh
```

Then you need to copy the output to the appropriate website directory. Please
define the directory in which the website repo lives in an env variable like so:

```shell
export WEBSITE_ROOT=<path to website root>
```

And then from the root of the k8s/k8s repository, please run this command:

```shell
cp ./test/instrumentation/documentation/documentation.md $WEBSITE_ROOT/content/en/docs/reference/instrumentation/metrics.md
```



### YAML Metric Definitions

Place your metric definitions in the `test/instrumentation/testdata/documentation-list.yaml` file using the following format:

```yaml
- name: metric_name
  subsystem: subsystem_name
  namespace: namespace_name
  help: Metric description here.
  type: counter
  stabilityLevel: stable
  labels:
    - label1
    - label2
  # Other metric properties...
```

### Generated Documentation

The program generates Markdown documentation in the following format:

```markdown
## Metrics (auto-generated {{.GeneratedDate.Format "2006 Jan 02"}})

This page details the metrics that different Kubernetes components export. You can query the metrics endpoint for these components using an HTTP scrape, and fetch the current metrics data in Prometheus format.

### List of Kubernetes Metrics

| Name              | Stability Level | Type   | Help                    | Labels       | Const Labels |
|-------------------|-----------------|--------|-------------------------|--------------|--------------|
| metric_name       | stable          | counter| Metric description here.| label1, label2| constLabels  |
...
```


### Constants

- `GOROOT`: The path to the Go root directory.
- `GOOS`: The target operating system for compilation.
- `KUBE_ROOT`: The path to the Kubernetes root directory.
- `funcMap`: A map of custom template functions, including one to convert strings to lowercase.

### Constants

- `templ`: A template string in Markdown format used to generate the documentation.

### Data Structures

- `metric`: A struct representing a metric, with fields for its name, subsystem, namespace, help text, type, stability level, labels, and other metadata.

- `templateData`: A struct containing the data needed for the documentation template, including a slice of `metric` objects and the generated date.

### Functions

- `main()`: The main function of the program. It reads a YAML file containing metric definitions, parses the YAML data, sorts the metrics, processes the template, and generates the documentation.

- `metric.BuildFQName()`: A method that constructs and returns the fully qualified metric name using the `metrics.BuildFQName()` function.

- `byFQName`: A custom type implementing the `sort.Interface` interface, allowing metrics to be sorted first by stability level and then by their fully qualified names.

### Workflow

1. The program reads the metric definitions from the YAML file.
2. It parses the YAML data into a slice of `metric` objects.
3. The metrics are sorted based on their stability levels and fully qualified names.
4. The template is loaded and parsed, and custom template functions are registered.
5. Each metric's help text is processed to remove newlines and then the fully qualified names are built.
6. The template is executed with the processed data, generating the Markdown documentation.
7. The generated documentation is printed to the standard output.

### Usage

1. Ensure the required Go packages are installed.
2. Place the YAML file containing metric definitions in the specified location.
3. Run the program.
4. The generated Markdown documentation is printed to the standard output.


