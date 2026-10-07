#!/usr/bin/env node
// Exercise the same data assembly used by the pages, without starting Next.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
const load = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, ...args) {
  return resolve.call(this, id.startsWith("@/") ? path.join(root, "src", id.slice(2)) : id, ...args);
};
const compile = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  module._compile(result.outputText, filename);
};
load.extensions[".ts"] = compile;
load.extensions[".tsx"] = compile;
const { sites, works, stories, storiesForWork, storiesForSite, siteById, neighbours } = load("../src/data/atlas/index.ts");
const { coverFor } = load("../src/data/media.ts");
const atlas = load("../src/data/atlas/atlas.json");
const audit = load("../research/review/web-integration.json");

test("production stories are preserved, including every original field", () => {
  const original = atlas.stories.slice(0, audit.existing_story_count);
  // Match Python's canonical JSON serialization, including its spaces.
  const canonical = (value) => {
    if (Array.isArray(value)) return `[${value.map(canonical).join(", ")}]`;
    if (value && typeof value === "object") return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}: ${canonical(value[k])}`).join(", ")}}`;
    return JSON.stringify(value);
  };
  assert.equal(crypto.createHash("sha256").update(canonical(original)).digest("hex"), audit.existing_stories_sha256);
});

test("IDs, relationships and work sequences resolve through the production assembly", () => {
  for (const entities of [sites, works, stories]) assert.equal(new Set(entities.map(x => x.id)).size, entities.length);
  for (const story of stories) {
    assert.ok(siteById(story.siteId), story.id);
    assert.ok(works.some(w => w.id === story.workId), story.id);
    assert.ok(story.hook.en && story.evidence.sources.length, story.id);
    assert.ok(story.relations.length && story.categories.length, story.id);
    assert.ok(storiesForSite(story.siteId).includes(story));
  }
  for (const work of works) {
    const sequence = storiesForWork(work.id);
    assert.ok(sequence.length, work.id);
    assert.deepEqual(sequence.map(s => s.order), sequence.map((_, i) => i + 1));
    sequence.forEach((s, i) => {
      assert.equal(neighbours(s).previous, sequence[i - 1]);
      assert.equal(neighbours(s).next, sequence[i + 1]);
    });
    assert.ok(fs.existsSync(path.join(root, "public", coverFor(work.id).src)), work.id);
  }
});

test("new places have sourced coordinates and no duplicate pins or identities", () => {
  const coordinates = new Set();
  const names = new Set();
  for (const site of sites) {
    assert.ok(Number.isFinite(site.lat) && Number.isFinite(site.lng), site.id);
    assert.ok(site.lat > 48.8 && site.lat < 48.92 && site.lng > 2.2 && site.lng < 2.42, site.id);
    const point = `${site.lat.toFixed(6)},${site.lng.toFixed(6)}`;
    assert.ok(!coordinates.has(point), `Duplicate coordinate: ${site.id}`);
    coordinates.add(point);
    const identity = `${site.name.toLocaleLowerCase()}|${site.address.toLocaleLowerCase()}`;
    assert.ok(!names.has(identity), `Duplicate place: ${site.id}`);
    names.add(identity);
  }
  const newSiteIds = audit.coordinates.filter(c => !c.reused).map(c => c.site_id);
  assert.equal(new Set(newSiteIds).size, newSiteIds.length);
  for (const coordinate of audit.coordinates) {
    const site = siteById(coordinate.site_id);
    assert.ok(site);
    if (!coordinate.reused) {
      assert.equal(site.lat, coordinate.lat);
      assert.equal(site.lng, coordinate.lng);
      assert.ok(coordinate.wikidata && coordinate.source_sha256);
    }
  }
});

test("all five works have audited stops, and weak evidence stays visibly uncertain", () => {
  const ids = ["of-human-bondage", "razors-edge", "good-morning-midnight", "tropic-of-cancer", "education-sentimentale"];
  for (const id of ids) {
    const sequence = storiesForWork(id);
    assert.ok(sequence.length);
    for (const story of sequence) {
      const checked = audit.imported.find(s => s.story_id === story.id);
      assert.ok(checked, story.id);
      assert.ok(story.evidence.sources.includes(checked.source_url));
      assert.equal(story.anchor, "");
      assert.equal(story.path, undefined); // No invented walking geometry.
      if (checked.status === "probable") {
        assert.equal(story.evidence.confidence, "medium");
        assert.ok(story.uncertainty.en.startsWith("Probable:"));
        assert.ok(story.relations.includes("inferred"));
      }
    }
  }
  for (const deferred of audit.decisions.filter(d => d.decision === "defer")) {
    assert.ok(!audit.imported.some(s => s.relationship_id === deferred.relationship_id));
  }
  assert.equal(storiesForWork("good-morning-midnight").length, 2);
  assert.notEqual(siteById("rue-de-fleurus").id, siteById("rue-de-fleurus-27").id);
  assert.notEqual(siteById("boulevard-des-capucines").id, siteById("cafe-napolitain").id);
});

test("the actual walk pages render all five works in every supported locale", async () => {
  const React = load("react");
  const { renderToStaticMarkup } = load("react-dom/server");
  const { PathnameContext, SearchParamsContext } = load("next/dist/shared/lib/hooks-client-context.shared-runtime");
  const { LocaleProvider } = load("../src/i18n/client.tsx");
  const { getDictionary } = load("../src/i18n/dictionaries.ts");
  const page = load("../src/app/[lang]/walks/[work]/page.tsx");
  const newIds = new Set(audit.imported.map(s => stories.find(x => x.id === s.story_id).workId));
  const routes = page.generateStaticParams().filter(p => newIds.has(p.work));
  assert.equal(routes.length, 15);
  for (const params of routes) {
    const content = await page.default({ params: Promise.resolve(params) });
    const pathname = `/${params.lang}/walks/${params.work}`;
    const html = renderToStaticMarkup(
      React.createElement(PathnameContext.Provider, { value: pathname },
        React.createElement(SearchParamsContext.Provider, { value: new URLSearchParams() },
          React.createElement(LocaleProvider, { locale: params.lang, dict: getDictionary(params.lang) }, content))),
    );
    const escape = s => s.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.ok(html.includes(escape(works.find(w => w.id === params.work).title)), pathname);
    assert.ok(html.includes(`walk=${params.work}`), pathname);
    for (const story of storiesForWork(params.work)) assert.ok(html.includes(`/places/${story.siteId}`), `${pathname}: ${story.id}`);
    assert.ok(!html.includes("undefined"), pathname);
  }
});
