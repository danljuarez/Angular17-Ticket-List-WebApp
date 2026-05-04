# Mend.IO

**Mend.io** is an **application security platform focused on identifying and managing security risks in software dependencies and code throughout the development lifecycle (DevSecOps)**.

Mend.io (through its **AppSec platform + CLI/Unified Agent**) is designed to plug into CI/CD pipelines like GitLab and perform **multi-layer application security analysis** during builds and merge requests.

In a GitLab pipeline context, Mend.io primarily covers **open-source security, code security, and supply-chain risk analysis**.

In simple terms, it helps organizations make sure the software they build is not using vulnerable or risky components before it reaches production.

Here’s a clear breakdown of what it actually analyzes.

 ## Mend.io pipeline coverage (Angular + .NET Core)

Mend.io focuses mainly on **dependency security, supply-chain risk, and compliance** across both ecosystems, with some optional code analysis.

## 1. Software Composition Analysis (SCA) — Core feature (both stacks)

This is the main capability for both Angular and .NET Core.

### What it scans:

### Angular 20/21

* `package.json`, lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
* npm dependencies (Angular, RxJS, TypeScript, build tools, UI libraries)

### .NET Core

* `.csproj`, `packages.config`, `project.assets.json`
* NuGet packages (direct + transitive dependencies)

### What it detects:

* Known Common Vulnerabilities and Exposures (CVEs)
* Outdated or deprecated packages
* Security issues in transitive dependencies
* License compliance risks (GPL/AGPL, etc.)


## 2. Reachability analysis (noise reduction)

Mend.io evaluates whether vulnerabilities are actually relevant.

### It determines:

* Is the vulnerable code path used by your app?
* Is the dependency function reachable at runtime?

### Result:

* “Real risk in your Angular/.NET app”
* “Present but not exploitable in your code path”



## 3. Software Bill of Materials (SBOM)

Works for both stacks.

### Generates:

* Full dependency inventory (frontend + backend)
* Version tracking
* License mapping
* Vulnerability mapping

### Formats:

* SPDX
* CycloneDX

Useful for compliance (enterprise, government, regulated industries).

## 4. Supply chain security

Applies strongly to both npm and NuGet ecosystems.

### Detects:

* Malicious packages
* Typosquatting (fake Angular/NuGet packages)
* Dependency confusion attacks
* Suspicious package updates or maintainers

## 5. CI/CD policy enforcement (GitLab pipelines)

Mend.io acts as a **quality gate in pipelines**.

## Common rules:

* Fail build on **Critical CVEs**
* Block reachable high-risk vulnerabilities
* Enforce license compliance rules
* Allow warnings for low-risk issues

Works equally for:

* Angular build stage (Node.js)
* .NET build stage (dotnet CLI)

## 6. Optional Static Application Security Testing (SAST)

Applies to source code (less central than SCA).

### Angular (TypeScript frontend):

* XSS patterns (unsafe DOM usage)
* Unsafe `innerHTML` usage
* Secrets in frontend code
* Weak sanitization patterns

### .NET Core:

* Injection risks (SQL, command injection)
* Unsafe deserialization
* Hardcoded secrets
* insecure API handling patterns

## 7. Container & OS scanning (if used)

If either app is containerized:

### Scans:

* Base OS vulnerabilities (Alpine, Debian, Ubuntu)
* Node runtime (Angular containers)
* .NET runtime images (ASP.NET Core containers)
* Installed system packages

## 8. Continuous monitoring (post-CI)

After pipeline execution:

* Tracks new CVEs affecting existing dependencies
* Alerts on emerging vulnerabilities
* Suggests upgrade paths
* Can integrate with automated PR tools (like Mend.io Renovate)

## Final mental model

### For Angular 20/21:
- “Mend.io secures everything npm brings into your frontend build.”

### For .NET Core:

- “Mend.io secures everything NuGet brings into your backend build.”

## Summary table

| Feature                   | Angular 20/21        | C# .NET Core         |
| ------------------------- | -------------------- | -------------------- |
| Dependency scanning (SCA) | ✔ npm ecosystem      | ✔ NuGet ecosystem    |
| CVE detection             | ✔                    | ✔                    |
| Reachability analysis     | ✔                    | ✔                    |
| SBOM generation           | ✔                    | ✔                    |
| Supply-chain protection   | ✔                    | ✔                    |
| CI/CD policy gating       | ✔                    | ✔                    |
| SAST (code analysis)      | ⚠ limited            | ⚠ limited            |
| Container scanning        | ✔ (if containerized) | ✔ (if containerized) |


## One-line definition for your setup

Mend.io in a GitLab pipeline for Angular 20/21 and .NET Core is a **dependency and supply-chain security scanner that enforces policies, detects vulnerabilities, and generates compliance reports across both frontend (npm) and backend (NuGet) ecosystems.**