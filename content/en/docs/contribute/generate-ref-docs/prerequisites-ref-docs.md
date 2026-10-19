
### Requirements:

- You need a machine that is running Linux or macOS. On Windows, use
  [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install),
  since the build tooling relies on `make` and Bash scripts.

- You need to have these tools installed:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Go](https://go.dev/dl/), any recent release (Go downloads the exact toolchain a generator needs automatically)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)
  - [Docker](https://docs.docker.com/engine/installation/) (required only for the local website preview with `make container-serve`)

- You need to know how to create a pull request to a GitHub repository.
  This involves creating your own fork of the repository. For more
  information, see [Work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
