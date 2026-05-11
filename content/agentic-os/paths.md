# paths.json

Filesystem path map. Tells skills where each workspace folder lives so they don't have to hardcode paths.

```json
{
  "workspaceRoot": "C:\\Users\\kevin\\Workspace",
  "portfolioSiteDir": "portfolio-site/ktncodes",
  "ideaverseDir": "MyIdeaverse/Ideaverse",
  "interviewPrepDir": "interview-prep",
  "codingProjectsDir": "coding-projects",
  "skillsDir": "MyIdeaverse/Ideaverse/60-skills"
}
```

When a skill needs to know where the wiki lives, it reads `ideaverseDir` from this file. Add a new path, run no migrations. Move the workspace tomorrow, edit one line, all skills follow.
