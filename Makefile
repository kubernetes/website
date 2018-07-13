DOCKER       = docker
HUGO_VERSION = 0.44
DOCKER_IMAGE = kubernetes-hugo
DOCKER_RUN   = $(DOCKER) run --rm --interactive --tty --volume $(PWD):/src

.PHONY: all build sass build-preview help serve

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

all: build ## Build site with production settings and put deliverables in _site.

build: ## Build site with production settings and put deliverables in _site.
	hugo

build-preview: ## Build site with drafts and future posts enabled.
	hugo -D -F

serve: ## Boot the development server.
	hugo server

docker-image:
	$(DOCKER) build . --tag $(DOCKER_IMAGE) --build-arg HUGO_VERSION=$(HUGO_VERSION)

docker-build:
	$(DOCKER_RUN) $(DOCKER_IMAGE) hugo

stage:
	$(DOCKER_RUN) -p 1313:1313 $(DOCKER_IMAGE) hugo server --watch --bind 0.0.0.0
