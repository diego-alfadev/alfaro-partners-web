# IONOS deployment

## Recommended path: IONOS Deploy Now

IONOS Deploy Now can deploy static websites from a GitHub repository, detects Astro projects, creates a GitHub Actions workflow, and publishes the generated output to IONOS infrastructure.

Project settings:

- Framework/template: Astro, or static site if manual selection is required.
- Install command: `bun install --frozen-lockfile`
- Build command: `PUBLIC_SITE_URL=https://alfaropartners.es PUBLIC_BASE_PATH=/ bun run build`
- Output/dist folder: `dist`
- Node requirement: `>=22.12.0`

Required production variables:

```bash
PUBLIC_SITE_URL=https://alfaropartners.es
PUBLIC_BASE_PATH=/
```

Use a non-root `PUBLIC_BASE_PATH` only if the site is deployed under a subdirectory.

## Manual webspace/SFTP path

If the project is deployed to classic IONOS Web Hosting instead of Deploy Now:

1. Build locally:
   ```bash
   PUBLIC_SITE_URL=https://alfaropartners.es bun run build:ionos
   ```
2. Upload the **contents** of `dist/` to the document root for the domain.
3. Keep `.htaccess` in the uploaded files; it provides directory-index hardening, security headers, caching and the 404 document.


## Traditional Web Hosting + GitHub Actions

Use this path if Deploy Now is unavailable. The repository includes `.github/workflows/deploy-ionos.yml`, which builds Astro and uploads `dist/` to IONOS via **SFTP**.

### FTPS vs SFTP

- **FTPS** = classic FTP wrapped in TLS. It commonly uses port `21`.
- **SFTP** = file transfer over SSH. It commonly uses port `22`.

IONOS gave us SFTP credentials, so this project uses the SFTP workflow.

### IONOS setup

1. In IONOS, open **Web Hosting** for José's contract.
2. Open **FTP/SSH & Webfiles** or **FTP access**.
3. Use the SFTP account data from IONOS:
   - server/host;
   - username;
   - password;
   - port `22`;
   - target folder/document root for `alfaropartners.es`.

Do not commit credentials. Put them only in GitHub Actions secrets.

### GitHub secrets

Add these in GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Example | Notes |
|---|---|---|
| `IONOS_SFTP_SERVER` | `homeXXXXXXXXX.1and1-data.host` | IONOS SFTP host. |
| `IONOS_SFTP_PORT` | `22` | IONOS SFTP port. |
| `IONOS_SFTP_USERNAME` | `uXXXXXXXX` | IONOS SFTP user. |
| `IONOS_SFTP_PASSWORD` | `...` | SFTP password. Never commit this. |
| `IONOS_SFTP_REMOTE_PATH` | `/` or `/htdocs/alfaropartners/` | Remote document root. Must point to the folder served by the domain. |

### First run

1. Go to **Actions → Deploy to IONOS Web Hosting**.
2. Run manually with `deploy=false`. This builds and audits only.
3. If build passes, run manually with `deploy=true`.
4. After the first successful deploy, pushes to `main` will build and deploy automatically.

### SSH config on a Mac

You can add the host to `~/.ssh/config`, but SSH config stores host/user/port, **not passwords**. Example:

```sshconfig
Host ionos-alfaro
  HostName homeXXXXXXXXX.1and1-data.host
  User uXXXXXXXX
  Port 22
```

Then connect with:

```bash
sftp ionos-alfaro
```

For passwordless login, create an SSH key and add the public key in IONOS if the panel supports it. If not, use the password only as a GitHub Secret.

## Pre-deploy checklist

- Use `PUBLIC_SITE_URL=https://alfaropartners.es`.
- Confirm the IONOS domain points to the deployment target.
- Confirm SSL is active before opening indexing.
- Confirm the Google Appointment Schedule URL still points to José María's live booking page.
- Replace provisional legal/privacy/cookie text before indexing those pages.
