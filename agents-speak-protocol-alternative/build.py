#!/usr/bin/env python3
"""Render the narrative Markdown into a static, offline Reveal.js deck."""
from pathlib import Path
import html
import re
import markdown

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / "agents-speak-protocol-alternative.md"


def render(text):
    def diagram(match):
        name = match.group(1)
        path = HERE / "assets" / f"{name}.svg"
        svg = path.read_text().strip()
        return f'<div class="diagram-wrap">\n{svg}\n</div>'
    text = re.sub(r"\{\{diagram:([a-z0-9-]+)\}\}", diagram, text)
    return markdown.markdown(text, extensions=["tables", "fenced_code"])


def build():
    source = SOURCE.read_text()
    blocks = re.split(r"(?m)^## (Slide \d+|A\d+) — (.+)\n", source)
    main, appendix, source_rows = [], [], []
    for i in range(1, len(blocks), 3):
        number, title, body = blocks[i:i + 3]
        metadata = re.search(r"<!-- (.*?) -->", body).group(1)
        config = dict(item.strip().split(": ", 1) for item in metadata.split(";"))
        body = re.sub(r"<!-- .*? -->\n", "", body, count=1)
        body = body.replace("\n# Appendix\n", "")
        content, notes = body.split("> **Speaker notes:**", 1)
        notes, _, sources = notes.partition("\nSources: ")
        notes = re.sub(r"(?m)^> ?", "", notes).strip()
        references = re.findall(r"\[([^]]+)\]\((https://[^)]+)\)", sources)
        if references:
            source_rows.append((config["id"], title, references))
        classes = html.escape(config.get("class", ""))
        slide_id = html.escape(config["id"])
        chapter = html.escape(config["chapter"])
        heading = "" if config.get("hide-title") == "true" else f"<h2>{html.escape(title)}</h2>"
        notes_html = markdown.markdown(notes)
        if references:
            notes_html += f'<p>Fonti: <a href="sources.html#{slide_id}" target="_blank" rel="noopener">documentazione di questa slide</a>.</p>'
        section = f'''<section id="{slide_id}" class="{classes}" data-chapter="{chapter}">
<div class="eyebrow">{chapter}</div>
{heading}
{render(content.strip())}
<aside class="notes">{notes_html}</aside>
</section>'''
        (main if number.startswith("Slide") else appendix).append(section)
    document = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Agents Speak Protocol — Narrative alternative</title>
<meta name="description" content="DevFest Milano 2026. A narrative deck about replaceable boundaries, MCP and A2A, by Stefano Maestri and Alessio Soldano.">
<link rel="stylesheet" href="reveal/reset.css"><link rel="stylesheet" href="reveal/reveal.css"><link rel="stylesheet" href="theme.css">
</head><body>
<div class="reveal"><div class="slides">
{chr(10).join(main)}
<section id="appendix">{chr(10).join(appendix)}</section>
</div></div>
<div class="deck-footer" aria-hidden="true"><span>DEVFEST MILANO 2026</span><span id="chapter-label">OPENING</span></div>
<script src="reveal/reveal.js"></script><script src="reveal/notes.js"></script><script src="deck.js"></script>
</body></html>'''
    (HERE / "index.html").write_text(document)
    rows = []
    for slide_id, title, refs in source_rows:
        links = "".join(f'<li><a href="{html.escape(url)}" target="_blank" rel="noopener">{html.escape(label)}</a></li>' for label, url in refs)
        rows.append(f'<section id="{slide_id}"><h2>{html.escape(title)}</h2><ul>{links}</ul></section>')
    (HERE / "sources.html").write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Agents Speak Protocol — Sources</title><link rel="stylesheet" href="theme.css"></head><body class="sources-page"><main><a href="index.html">← Back to the deck</a><h1>Sources &amp; further reading</h1><p>Primary documentation checked 6 October 2026. Diagrams are original conceptual illustrations. Historical analogies and adoption guidance are the speakers' interpretations.</p>{''.join(rows)}<p>Narrative and speaker notes: <a href="../agents-speak-protocol-alternative.md">Markdown source</a></p></main></body></html>''')
    print(f"Built {len(main)} main slides + {len(appendix)} appendix slides from {SOURCE.name}")


if __name__ == "__main__":
    build()
