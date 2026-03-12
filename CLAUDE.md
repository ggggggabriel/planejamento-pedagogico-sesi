# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Flask web application for SESI (Serviço Social da Indústria) teachers to fill out and download pedagogical planning forms as `.docx` files. Teachers select a discipline, pick skills from a dynamically loaded list, fill in lesson details, and download a pre-filled Word document.

## Running the App

The active application lives in `teste_plan_web/`. The root `app.py` is a duplicate.

```bash
cd teste_plan_web
pip install flask python-docx pandas openpyxl
python app.py
```

The app runs at `http://localhost:5000` in debug mode.

## Architecture

**Data flow:**
1. `HABILIDADES FUND.xlsx` — Excel file loaded at startup via pandas. Each column is a discipline; rows are skills (habilidades). This is the sole data source.
2. `/get-habilidades?disciplina=<name>` — AJAX endpoint called by `form.html` when the user changes the discipline dropdown. Returns a JSON list of skills for that column.
3. `/create-plan` POST — collects form data, calls `inserir_texto_no_modelo()`, which opens `static/docx/Folha do Planejamento Pedagógico.docx` as a base template, appends each field as a new paragraph, saves to `static/docx/<nome_arquivo>.docx`, and serves it as a download.

**Key paths (relative to `teste_plan_web/`):**
- `HABILIDADES FUND.xlsx` — skill data, must be present at startup
- `static/docx/Folha do Planejamento Pedagógico.docx` — Word template used as base for every generated plan
- `static/docx/` — output directory for generated `.docx` files
- `templates/index.html` — landing page
- `templates/form.html` — planning form with JS for dynamic skill loading
- `templates/success.html` — empty placeholder (unused)

## Known Issues / Design Notes

- `inserir_texto_no_modelo()` appends data as new paragraphs to the end of the template document rather than replacing placeholders inside it — generated files accumulate the template content plus appended fields.
- The root `app.py` is identical to `teste_plan_web/app.py` and appears to be a leftover copy.
- Generated `.docx` files accumulate in `static/docx/` and are not cleaned up automatically.
- The `success.html` template exists but is never rendered.
