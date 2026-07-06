
### Requirements:

- You need a machine that is running Linux or macOS.

- You need to have these tools installed:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/dl/), matching the version required by the `go.mod` file of the `reference-docs` module you're building (`gen-apidocs`, `gen-compdocs`, or `genref`)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)
  - [Docker](https://docs.docker.com/engine/installation/) (only required for the deprecated `gen-kubectldocs` generator)
  - [Python](https://www.python.org/downloads/) v3.7.x+, [Pip](https://pypi.org/project/pip/), and [PyYAML](https://pyyaml.org/) v5.1.2 (only required to run the deprecated `update-imported-docs.py` script)

  The `reference-docs` generators are Go modules, so you don't need to set a `GOPATH` or use `go get`.

- Your `PATH` environment variable must include the required build tools, such as the `Go` binary.

- You need to know how to create a pull request to a GitHub repository.
  This involves creating your own fork of the repository. For more
  information, see [Work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
