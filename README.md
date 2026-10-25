SentinelOps - Security-Focused DevSecOps Portfolio
Security is built into the delivery pipeline-not added at the end.

SentinelOps is a portfolio project demonstrating how to build, test, scan, containerize, deploy, and monitor a FastAPI application using practical DevSecOps workflows. It brings application health checks together with automated testing, secret detection, container vulnerability scanning, Kubernetes deployment, and monitoring.
Evidence note: Scan results depend on the exact image, dependencies, scanner database, and scan date. Run the commands below and publish your real output. Do not treat example results or dashboard mockups as verified production evidence.

Contents
- Security goals
- Architecture
- Security controls
- Technology stack
- Run locally
- Run with Docker
- Tests and security scans
- Kubernetes and Helm
- Monitoring
- API endpoints
- Repository layout
- Evidence and screenshots
- Roadmap
Security goals
- Shift left: run tests and security checks before changes are merged or released.
- Protect secrets: detect accidentally committed credentials and tokens.
- Reduce image risk: scan container images and dependencies for known vulnerabilities.
- Use least privilege: run the application container as a non-root user.
- Deploy consistently: keep Kubernetes and Helm deployment configuration version-controlled.
- Observe service health: expose a health endpoint and support Prometheus/Grafana monitoring.
Architecture
Developer change
      |
      v
GitHub repository
      |
      v
GitHub Actions
  |-- Automated tests
  |-- Gitleaks secret detection
  |-- Trivy image vulnerability scan
  |
  v
Build container image
      |
      v
Kubernetes / Minikube
      |
      +---- FastAPI application
      |
      +---- Prometheus metrics collection
                    |
                    v
                  Grafana
The exact jobs and deployment stages depend on the workflows and manifests currently enabled in the repository.
Security controls
Area	Control	Purpose
Source code	Gitleaks	Detects potential secrets committed to Git
Application quality	pytest	Checks expected API behavior
Container image	Trivy	Reports known OS-package and dependency vulnerabilities
Runtime privileges	Non-root container user	Reduces privileges available to the app process
Delivery pipeline	GitHub Actions	Automates repeatable validation
Orchestration	Kubernetes / Helm	Makes deployment configuration repeatable
Observability	Prometheus / Grafana	Helps monitor service health and behavior


Container hardening
The Dockerfile uses a dedicated non-root user. Continue reviewing the base image, dependency pins, image size, file permissions, and vulnerability reports for each release.
Secret management
- Never commit .env files, passwords, access keys, API tokens, or private keys.
- Store CI credentials in GitHub Actions secrets.
- Rotate credentials that may have been exposed.
- Treat Gitleaks as a safety net, not a substitute for careful secret handling.
Vulnerability management
Triage scanner findings instead of ignoring them. Check the affected package, severity, available fix, exploitability, and whether the component is present in the final image. Record the scan date and image tag when publishing results.
Technology stack
- Python / FastAPI — API service
- pytest — automated tests
- Docker — container packaging
- GitHub Actions — CI workflows
- Gitleaks — secret scanning
- Trivy — vulnerability scanning
- Kubernetes / Minikube / Helm — deployment and orchestration
- Prometheus / Grafana — monitoring and dashboards
Run locally
git clone https://github.com/amzteam666/sentinelops.git
cd sentinelops
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Open these endpoints:
- http://127.0.0.1:8000/ — application home/dashboard
- http://127.0.0.1:8000/health — health response
- http://127.0.0.1:8000/docs — interactive API documentation
- http://127.0.0.1:8000/api/v1/info — application information
If port 8000 is already in use, choose another available port.
Run with Docker
Build the image:
docker build -t sentinelops-api:1.0 .
Run the container:
docker run -d \
  --name sentinelops-api \
  --publish 8002:8000 \
  --restart unless-stopped \
  sentinelops-api:1.0
Check the service:
curl -i http://127.0.0.1:8002/health
docker ps
docker logs sentinelops-api
This example maps host port 8002 to container port 8000. If the container name is already in use, inspect it before creating another container.
Tests and security scans
Run tests from the repository root:
python -m pytest -v
A passing test suite confirms only the behaviors covered by those tests; it does not by itself prove the application is secure.
Gitleaks
Use the version approved for your project:
gitleaks detect --source . --redact
Review findings carefully. Never paste real secrets into issues, logs, screenshots, or this README.
Trivy
Scan the image you actually built:
trivy image sentinelops-api:1.0
For a machine-readable report:
trivy image --format json --output trivy-report.json sentinelops-api:1.0
Review the report before sharing it publicly. Avoid committing large scanner databases or generated local cache directories. Publish only the real result, including the scan date and image tag.
Kubernetes and Helm
The repository contains Kubernetes and Helm-related configuration. Review manifests and chart values before applying them.

Check cluster access:
kubectl cluster-info
kubectl get nodes
Inspect available configuration:
find kubernetes k8s helm -maxdepth 3 -type f 2>/dev/null
Before deploying, verify namespace, image name and tag, resource requests/limits, probes, service exposure, RBAC, secret handling, and network policies. Use only the deployment commands that match the configuration present in this repository.
Monitoring
Prometheus and Grafana can collect and visualize operational metrics. Their availability depends on which monitoring resources are currently running.
kubectl get pods -A
kubectl get services -A
For portfolio evidence, use screenshots from the real running environment. Clearly label static mockups or sample dashboards as illustrative; never present them as live monitoring data.
API endpoints
Endpoint	Purpose
/	Serves the application home page/dashboard
/health	Reports application health
/api/v1/info	Returns basic application information
/docs	FastAPI interactive API documentation


Repository layout
sentinelops/
├── app/                 # FastAPI application
├── frontend/            # Static dashboard assets
├── tests/               # Automated tests
├── .github/workflows/   # CI and security workflows
├── docker/              # Docker-related resources
├── kubernetes/          # Kubernetes manifests, if used
├── k8s/                 # Kubernetes configuration, if used
├── helm/                # Helm chart
├── monitoring/          # Prometheus/Grafana resources
├── security/            # Security-related resources
├── ci-cd/               # CI/CD resources or documentation
└── docs/screenshots/    # Project evidence screenshots
Some directories may contain alternative or evolving configurations. Check the actual files before assuming every deployment path is active.
Evidence and screenshots
Place screenshots of real project output in docs/screenshots/. Suggested filenames:
- github-actions-tests.png
- gitleaks-scan.png
- trivy-image-scan.png
- docker-container.png
- kubernetes-pods.png
- prometheus-targets.png
- grafana-dashboard.png
- api-health.png
Once a screenshot exists, link it using a relative path, for example:
![API health endpoint](docs/screenshots/api-health.png)
Only link files that actually exist in the repository. Redact credentials, tokens, and private information before publishing.
Roadmap
- [ ] Keep test and security workflows passing on pull requests.
- [ ] Publish a dated Trivy report for the exact release image.
- [ ] Verify readiness/liveness probes and resource limits.
- [ ] Review Kubernetes RBAC, network policies, and secret handling.
- [ ] Document reproducible monitoring setup and add verified screenshots.
- [ ] Document release tagging and image provenance.
SentinelOps — Secure your code. Protect your infrastructure. Deliver with confidence.

Built as a hands-on DevSecOps portfolio project
