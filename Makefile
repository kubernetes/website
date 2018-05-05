.PHONY: all build sass build-preview help serve

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

all: build ## Build site with production settings and put deliverables in _site.

sass: # Rebuild the SASS source into CSS
	node-sass --output-style compact ./src/sass/styles.sass ./static/css/styles.css
	node-sass --output-style compact ./src/sass/case_study_styles.sass ./static/css/case_study_styles.css

build: ## Build site with production settings and put deliverables in _site.
	hugo

build-preview: ## Build site with drafts and future posts enabled.
	hugo -D -F

serve: ## Boot the development server.
	hugo server

stage: ## This needs to be updated for Hugo
	#docker run -ti --rm -v "${PWD}":/k8sdocs -p 4000:4000 gcr.io/google-samples/k8sdocs:1.1
