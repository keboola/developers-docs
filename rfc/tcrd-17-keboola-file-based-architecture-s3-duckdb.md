# RFC: Keboola bez backendu — File-based architektura na S3 + DuckDB

**Linear issue:** [TCRD-17](https://linear.app/keboola/issue/TCRD-17/keboola-bez-backendu-file-based-architektura-na-s3-duckdb-transformace)
**Autor:** Zdenek Srotyr / Team CEO's R&D
**Datum:** 2026-03-18
**Status:** Draft / PoC Proposal

---

## Obsah

1. [Executive Summary](#1-executive-summary)
2. [Motivace a business case](#2-motivace-a-business-case)
3. [Současný stav Keboola platformy](#3-současný-stav-keboola-platformy)
4. [Navrhovaná architektura](#4-navrhovaná-architektura)
5. [Detailní návrh jednotlivých vrstev](#5-detailní-návrh-jednotlivých-vrstev)
6. [Data Catalog a metadata](#6-data-catalog-a-metadata)
7. [Limity a breakpointy vs. warehouse](#7-limity-a-breakpointy-vs-warehouse)
8. [Návrh PoC pipeline](#8-návrh-poc-pipeline)
9. [Srovnání nákladů](#9-srovnání-nákladů)
10. [Rizika a otevřené otázky](#10-rizika-a-otevřené-otázky)
11. [Roadmap a další kroky](#11-roadmap-a-další-kroky)

---

## 1. Executive Summary

Tento dokument zkoumá koncept Keboola platformy, která běží **bez tradičního warehouse backendu** (Snowflake/BigQuery). Namísto toho veškerá data proudí jako soubory přes object storage (S3/GCS/ABS) ve formátu **Parquet**, a transformace se provádí pomocí **DuckDB** — embedded analytické databáze, která umí pracovat s Parquet soubory na S3 nativně.

### Klíčové závěry

| Aspekt | Hodnocení | Poznámka |
|--------|-----------|----------|
| **Technická proveditelnost** | Vysoká | Keboola už má S3 staging, File Storage, DuckDB procesor |
| **Nákladová úspora** | Významná | Eliminace warehouse poplatků ($2-4/kredit Snowflake) |
| **Vhodný segment** | Menší zákazníci | Datasety do ~50-100 GB, jednoduché transformace |
| **Breakpoint vs. warehouse** | ~100-200 GB | Nad tímto objemem warehouse začíná dávat smysl |
| **Největší výzva** | Data Catalog | Metadata management bez warehouse vyžaduje nové řešení |
| **Doporučení** | Realizovat PoC | Jeden extraktor → S3 → DuckDB → S3 → writer |

---

## 2. Motivace a business case

### 2.1 Proč?

Keboola dnes vyžaduje pro každý projekt warehouse backend — Snowflake nebo BigQuery. To přináší:

- **Fixní náklady** — i projekt, který zpracovává 100 MB dat denně, platí warehouse poplatky
- **Vendor lock-in** — závislost na jednom warehouse poskytovateli
- **Komplexita** — pro jednoduché ETL pipeline (CSV → transformace → výstup) je warehouse zbytečně těžký

### 2.2 Pro koho je to relevantní?

| Segment | Typický objem dat | Dnešní náklady na warehouse | Potenciální úspora |
|---------|-------------------|-----------------------------|--------------------|
| **Malí zákazníci** (startup, SMB) | 1-10 GB | $50-200/měsíc | 80-95% |
| **Střední zákazníci** (jednoduchý ETL) | 10-50 GB | $200-1000/měsíc | 60-80% |
| **PoC / trial projekty** | < 1 GB | $30-100/měsíc | ~100% |
| **Data sharing / distribuce** | variabilní | záleží na backendu | významná |

### 2.3 Klíčová myšlenka

```
Dnešní flow:
  Extraktor → [warehouse import] → SQL transformace v warehouse → [warehouse export] → Writer

Nový flow:
  Extraktor → S3 (Parquet) → DuckDB transformace nad S3 → S3 (Parquet) → Writer
```

Warehouse se stává **volitelným** — pro zákazníky, kteří ho nepotřebují, platforma funguje čistě na souborech.

---

## 3. Současný stav Keboola platformy

### 3.1 Storage architektura

Keboola Storage se skládá ze dvou hlavních vrstev:

```
┌─────────────────────────────────────────┐
│            Keboola Storage              │
├────────────────────┬────────────────────┤
│   Table Storage    │   File Storage     │
│  (Snowflake/BQ)    │  (S3/GCS/ABS)      │
│                    │                    │
│  • Buckets         │  • Raw files       │
│  • Tables          │  • CSV uploady     │
│  • SQL interface   │  • Sliced files    │
│  • Metadata        │  • Staging area    │
└────────────────────┴────────────────────┘
```

**Table Storage** je vrstva nad warehouse backendem — data jsou uložena v Snowflake/BigQuery a přístupná přes Storage API.

**File Storage** je vrstva nad object storage (Amazon S3, Azure Blob Storage, Google Cloud Storage) — slouží pro raw soubory, staging při importu/exportu tabulek, a jako transport layer mezi komponentami.

### 3.2 Jak dnes funguje data flow v komponentách

1. **Input mapping:** Storage API exportuje tabulky z warehouse do CSV souborů na `/data/in/tables/`
2. **S3 staging:** Při použití S3 stagingu se data stahují přímo z S3 (manifest obsahuje S3 credentials)
3. **Komponenta zpracuje data:** Čte z `/data/in/`, zapisuje do `/data/out/`
4. **Output mapping:** Storage API importuje výstupní CSV soubory zpět do warehouse

### 3.3 Co už existuje a můžeme využít

| Komponenta | Stav | Relevance |
|------------|------|-----------|
| **S3 Staging** | Produkční | Komponenty už umí číst data přímo z S3 místo z lokálních souborů |
| **File Storage** | Produkční | S3/GCS/ABS už slouží jako transport layer |
| **DuckDB Procesor** ([keboola/processor-duckdb](https://github.com/keboola/processor-duckdb)) | Produkční (beta) | SQL transformace nad tabulkami/soubory pomocí DuckDB |
| **Common Interface** | Produkční | Standardizovaný formát pro výměnu dat mezi komponentami |
| **Parquet podpora** | Částečná | DuckDB procesor umí číst Parquet; některé extraktory umí Parquet output |

---

## 4. Navrhovaná architektura

### 4.1 Celkový pohled

```
┌─────────────────────────────────────────────────────────────────┐
│                    Keboola Platform                             │
│                                                                 │
│  ┌───────────┐    ┌──────────────┐    ┌───────────────┐         │
│  │           │    │              │    │               │         │
│  │ Extractor ├───►│  S3 Bucket   ├───►│  DuckDB       │         │
│  │           │    │  (Parquet)   │    │  Transformace │         │
│  └───────────┘    │              │    │               │         │
│                   │  ┌────────┐  │    └───────┬───────┘         │
│                   │  │metadata│  │            │                 │
│                   │  │catalog │  │            ▼                 │
│                   │  └────────┘  │    ┌───────────────┐         │
│                   │              │◄───┤               │         │
│                   │              │    │  S3 Bucket     │         │
│                   │              │    │  (výstup)      │         │
│                   └──────────────┘    └───────┬───────┘         │
│                                               │                 │
│                                               ▼                 │
│                                       ┌───────────────┐         │
│                                       │               │         │
│                                       │    Writer     │         │
│                                       │               │         │
│                                       └───────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Orchestrace (Flow Engine)                   │    │
│  │         (beze změny — řídí pořadí kroků)                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Metadata Catalog (NOVÝ)                     │    │
│  │    Schema registry + Data lineage + File index           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Nový storage backend: "File Backend"

Navrhujeme nový typ storage backendu — **File Backend** — jako alternativu k Snowflake/BigQuery:

```
Storage Backend Types:
  ├── Snowflake (stávající)
  ├── BigQuery (stávající)
  └── File Backend (NOVÝ)
       ├── Storage: S3 / GCS / ABS
       ├── Formát: Parquet (primární), CSV (fallback)
       ├── Compute: DuckDB (embedded, serverless)
       └── Catalog: DuckLake / vlastní metadata DB
```

**Klíčový princip:** Projekt s File Backendem se chová navenek stejně jako projekt s warehouse backendem. Storage API poskytuje stejné rozhraní — buckety, tabulky, import/export — jen interně jsou data uložena jako Parquet soubory na object storage namísto v databázi.

### 4.3 Datový formát: Proč Parquet?

| Vlastnost | CSV | Parquet | JSON |
|-----------|-----|---------|------|
| Komprese | Žádná/gzip | Snappy/ZSTD (5-10x) | Žádná/gzip |
| Columnar | Ne | Ano | Ne |
| Schema | Ne | Ano (embedded) | Schemaless |
| DuckDB podpora | Dobrá | Nativní, optimální | Dobrá |
| S3 predicate pushdown | Ne | Ano | Ne |
| Row-group pruning | Ne | Ano | Ne |
| Typová informace | Ne | Ano | Částečná |

**Parquet je jasná volba** — nativní podpora v DuckDB, efektivní komprese, columnar layout pro analytické dotazy, a embedded schema eliminuje potřebu externího schema registru pro základní use-case.

---

## 5. Detailní návrh jednotlivých vrstev

### 5.1 Extrakce → S3 (Parquet)

#### Jak to funguje dnes

Extraktory dnes zapisují data jako CSV soubory do `/data/out/tables/`. Storage API pak tyto CSV importuje do warehouse backendu.

#### Navrhovaná změna

Pro File Backend se mění pouze to, co se děje **po** zápisu dat komponentou:

```
Extraktor (beze změny)
  ↓ zapisuje CSV do /data/out/tables/
  ↓
Storage API (File Backend mode)
  ↓ konvertuje CSV → Parquet (pomocí DuckDB nebo pyarrow)
  ↓ nahraje Parquet na S3 s hive-style partitioning
  ↓ aktualizuje metadata catalog
  ↓
S3 Bucket
  s3://kbc-project-{id}/tables/{bucket}/{table}/
    ├── _metadata.json          (schema, stats, partitions)
    ├── year=2026/month=03/
    │   ├── part-00000.parquet
    │   └── part-00001.parquet
    └── ...
```

**Klíčové:** Extraktory se nemusí měnit. Common Interface zůstává stejný. Změna je transparentní na úrovni Storage API.

#### Alternativa: Nativní Parquet output z extraktorů

Některé extraktory by mohly přímo produkovat Parquet soubory. To by ušetřilo konverzní krok, ale vyžadovalo by změny v mnoha komponentách. Doporučujeme to jako **optimalizaci v druhé fázi**, ne jako požadavek pro PoC.

#### S3 organizace souborů

```
s3://kbc-file-backend-{project-id}/
├── tables/
│   ├── in.c-main/
│   │   ├── orders/
│   │   │   ├── _manifest.json     # schema, partitioning info, stats
│   │   │   ├── data/
│   │   │   │   ├── part-0000.parquet
│   │   │   │   └── part-0001.parquet
│   │   │   └── _snapshots/        # pro time-travel (volitelné)
│   │   │       ├── snap-20260318T120000.json
│   │   │       └── ...
│   │   └── customers/
│   │       └── ...
│   └── out.c-transform/
│       └── ...
├── files/                          # raw file storage (beze změny)
│   └── ...
└── staging/                        # temp area pro import/export
    └── ...
```

### 5.2 DuckDB transformace

#### Architektura

DuckDB běží jako **embedded engine** v rámci transformačního kontejneru. Nepotřebuje žádný server — je to single-binary proces, který se spustí, provede transformaci, a ukončí se.

```
┌──────────────────────────────────────────┐
│       DuckDB Transformation Container     │
│                                          │
│  1. Načti config.json (SQL dotazy)       │
│  2. Připoj S3 jako remote filesystem     │
│     SET s3_region = '...';               │
│     SET s3_access_key_id = '...';        │
│  3. Vytvoř views nad vstupními tabulkami  │
│     CREATE VIEW orders AS                │
│       SELECT * FROM read_parquet(         │
│         's3://bucket/tables/in.c-main/   │
│         orders/data/*.parquet');          │
│  4. Spusť transformační SQL              │
│     CREATE TABLE output AS               │
│       SELECT ... FROM orders             │
│       JOIN customers ON ...;             │
│  5. Zapiš výsledek zpět na S3            │
│     COPY output TO                       │
│       's3://bucket/tables/out.c-trans/   │
│       result/data/' (FORMAT PARQUET,     │
│       PARTITION_BY (year, month));        │
│  6. Aktualizuj metadata catalog          │
│                                          │
└──────────────────────────────────────────┘
```

#### Existující DuckDB procesor

Keboola už má [processor-duckdb](https://github.com/keboola/processor-duckdb), který podporuje:

- **Simple Mode:** SQL dotaz nad jednou tabulkou
- **Advanced Mode:** Import více zdrojů, multiple transformace, export více tabulek
- Podpora pro tabulky ze Storage, soubory z URL, Parquet/JSON soubory

**Pro File Backend by se procesor rozšířil o:**
- Přímé čtení z S3 (bez stahování do lokálního filesystem)
- Přímý zápis výsledků na S3
- Automatické vytváření views z metadata catalogu
- Podpora pro partitioning a incremental processing

#### DuckDB konfigurace a optimalizace

```sql
-- Základní S3 setup
INSTALL httpfs;
LOAD httpfs;
SET s3_region = 'eu-central-1';
SET s3_access_key_id = '${AWS_ACCESS_KEY_ID}';
SET s3_secret_access_key = '${AWS_SECRET_ACCESS_KEY}';

-- Optimalizace pro S3
SET enable_object_cache = true;       -- cache remote chunks
SET threads = 4;                      -- paralelismus dle kontejneru
SET memory_limit = '2GB';             -- dle alokace
SET temp_directory = '/tmp/duckdb';   -- spill-to-disk

-- Čtení z S3 s predicate pushdown
SELECT * FROM read_parquet(
  's3://bucket/tables/in.c-main/orders/data/*.parquet',
  hive_partitioning = true
)
WHERE year = 2026 AND month = 3;      -- pushdown → čte jen relevantní soubory
```

### 5.3 Writers

Writers čtou ze Storage tabulek (dnes z warehouse). Pro File Backend:

```
Storage API (File Backend mode)
  ↓ obdrží request na export tabulky
  ↓ vrátí S3 presigned URL na Parquet soubory
  ↓ nebo konvertuje Parquet → CSV (pro kompatibilitu)
  ↓
Writer
  ↓ čte data (přes S3 staging nebo lokální CSV)
  ↓ zapisuje do cílového systému
```

**Klíčové:** Většina writerů používá S3 staging a Common Interface. Pro tyto writery je změna transparentní — místo CSV z warehouse dostanou CSV/Parquet ze S3. Writerům, které používají SQL dotazy proti warehouse (např. Snowflake writer s custom SQL), tato architektura nevyhovuje — ale to je logicky správné, protože projekt bez warehouse nepotřebuje writer do warehouse.

### 5.4 Orchestrace (Flow Engine)

**Beze změny.** Flow Engine řídí pořadí kroků (extraktor → transformace → writer). Nepracuje přímo s daty — pouze spouští joby. Pro File Backend se mění jen to, které komponenty jsou dostupné a jak Storage API handluje data.

```
Flow definice (beze změny):
  1. Spusť extractor "ex-generic-v2" (config: API endpoint)
  2. Spusť transformation "duckdb" (config: SQL dotazy)
  3. Spusť writer "wr-google-sheets" (config: sheet ID)
```

---

## 6. Data Catalog a metadata

### 6.1 Problém

Warehouse backend dnes poskytuje implicitně:
- **Schema discovery** — `DESCRIBE TABLE`, `INFORMATION_SCHEMA`
- **Data types** — explicitní typy sloupců
- **Statistics** — row counts, min/max, distinct counts
- **Lineage** — (v Keboola řešeno separátně, ne warehouse)
- **Access control** — role-based přístup k tabulkám

Bez warehouse potřebujeme tyto funkce zajistit jinak.

### 6.2 Navrhované řešení: Metadata Catalog

Existují tři realistické přístupy:

#### Varianta A: Vlastní metadata vrstva v Storage API

```
Storage API (rozšíření)
  ├── /v2/storage/tables/{tableId}
  │     → vrací schema, stats, lineage (jako dnes)
  │     → interně čte z metadata DB místo z warehouse
  ├── /v2/storage/tables/{tableId}/data
  │     → vrací Parquet soubory z S3
  └── Metadata DB (PostgreSQL/MySQL)
        ├── schemas (sloupce, typy, primary keys)
        ├── file_index (S3 paths, row counts, sizes)
        ├── snapshots (verzování, time-travel)
        └── statistics (min/max, null counts)
```

**Výhody:** Plná kontrola, integrace se stávajícím Storage API, žádná nová závislost
**Nevýhody:** Nutnost vybudovat a udržovat

#### Varianta B: DuckLake jako metadata layer

[DuckLake](https://motherduck.com/learn-more/ducklake-guide/) je nový open table formát (MIT licence), který ukládá metadata do SQL databáze (PostgreSQL, MySQL, SQLite, DuckDB) a data jako Parquet soubory na object storage.

```
DuckLake architektura:
  ┌─────────────┐     ┌─────────────────┐
  │ DuckDB      │────►│ Metadata DB     │
  │ (compute)   │     │ (PostgreSQL)    │
  │             │     │ - schemas       │
  │             │     │ - file pointers │
  │             │     │ - transactions  │
  │             │────►│ - snapshots     │
  └─────────────┘     └─────────────────┘
         │
         ▼
  ┌─────────────────┐
  │ Object Storage  │
  │ (S3/GCS/ABS)    │
  │ - Parquet files │
  └─────────────────┘
```

**Výhody:**
- ACID transakce
- Time travel / snapshots
- Schema evolution
- 10-100x rychlejší metadata operace oproti file-based formátům (Iceberg, Delta)
- Open source (MIT)
- DuckDB nativní integrace

**Nevýhody:**
- Relativně nový projekt (2025)
- Méně ekosystém než Iceberg/Delta
- Vyžaduje metadata DB (ale Keboola už má MySQL)

#### Varianta C: Apache Iceberg

```
Iceberg:
  - Manifest files na S3
  - REST Catalog API
  - DuckDB má plnou podporu (čtení i zápis od v1.4.0)
  - ACID, time travel, schema evolution
  - Široký ekosystém (Spark, Trino, Flink, ...)
```

**Výhody:** Průmyslový standard, obrovský ekosystém, DuckDB podpora
**Nevýhody:** Komplexnější setup, metadata jako soubory na S3 (pomalejší), potřeba REST Catalog serveru

### 6.3 Doporučení

Pro PoC: **Varianta A** (vlastní metadata v Storage API) — nejjednodušší, nejrychlejší implementace.

Pro produkční verzi: **Varianta B (DuckLake)** je nejslibnější:
- Přirozený fit s DuckDB jako compute engine
- Metadata v SQL DB, kterou Keboola už provozuje
- ACID transakce a time travel "zadarmo"
- Open source, žádný vendor lock-in
- Jednodušší než Iceberg pro tento use-case

---

## 7. Limity a breakpointy vs. warehouse

### 7.1 DuckDB výkonnostní charakteristiky

Na základě dostupných benchmarků a technických specifikací:

| Metrika | DuckDB (single node) | Poznámka |
|---------|---------------------|----------|
| **Max. zpracovatelný dataset** | ~1 TB | S spill-to-disk; 19 min na 1TB Parquet (benchmark 2025) |
| **Sweet spot** | 1-100 GB | Nejlepší poměr výkon/jednoduchost |
| **Paměť** | Streaming execution | Zvládá datasety větší než RAM |
| **Paralelismus** | Multi-thread, single node | Nemá distributed mode |
| **S3 read speed** | ~100M řádků/min | Závisí na šířce tabulky a síti |
| **Concurrent users** | 1 (embedded) | Single-writer, multiple-reader |

### 7.2 Kde je breakpoint vs. warehouse?

```
                    DuckDB (File Backend)              Warehouse
                    ─────────────────────              ─────────
Objem dat:          ◄─── 1 GB ─── 10 GB ─── 100 GB ─── 1 TB ───►
                    ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░
                    ↑ DuckDB jasně lepší   ↑ breakpoint  ↑ warehouse lepší

Komplexita SQL:     Jednoduché JOINy ──────── Komplexní analytika ───►
                    ████████████████████████░░░░░░░░░░░░░░░░░░░░░
                    ↑ DuckDB OK              ↑ warehouse lepší

Concurrency:        1 uživatel ──────── 10+ concurrent queries ───►
                    ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                    ↑ DuckDB OK  ↑ warehouse nutný

Latence dotazů:     Batch (sekundy OK) ──── Real-time (ms) ───►
                    ████████████████████░░░░░░░░░░░░░░░░░░░░░░
                    ↑ DuckDB OK           ↑ warehouse lepší
```

### 7.3 Realistické limity pro File Backend

| Limit | Hodnota | Důvod |
|-------|---------|-------|
| **Maximální velikost tabulky** | ~50 GB (doporučeno), ~200 GB (hard limit) | Nad 200 GB DuckDB začíná být pomalý na S3 |
| **Maximální počet tabulek v projektu** | Neomezeno (prakticky tisíce) | Parquet soubory na S3, metadata v DB |
| **Maximální šířka tabulky** | ~1000 sloupců | DuckDB limit; nad 250 sloupců více HTTP requestů na S3 |
| **Maximální počet souborů na tabulku** | ~10 000 | ListObjectV2 API calls, metadata overhead |
| **Transformace runtime** | Minuty (ne hodiny) | Container timeout, spill-to-disk limity |
| **Concurrent transformace** | 1 per tabulka (write), N per tabulka (read) | DuckDB single-writer model |

### 7.4 Co File Backend NEUMÍ (a nemá umět)

- **Interaktivní SQL konzole** — žádný vždy-běžící SQL engine (ale: DuckDB workspace by šel spustit on-demand)
- **Materialized views** — žádný engine, který by je udržoval
- **Cross-project JOINy** — vyžadovaly by přístup k více S3 bucketům
- **Real-time streaming** — DuckDB je batch-oriented
- **Snowflake/BigQuery specifické featury** — UDFs, stored procedures, ML integrace

---

## 8. Návrh PoC pipeline

### 8.1 Cíl PoC

Demonstrovat end-to-end pipeline bez warehouse backendu:

```
REST API (zdroj dat)
  → Generic Extractor
    → S3 (Parquet)
      → DuckDB transformace
        → S3 (Parquet)
          → Google Sheets Writer (cíl)
```

### 8.2 Konkrétní scénář

**Use case:** Malý e-shop sleduje objednávky z API, transformuje je do denních reportů, a výsledek zapisuje do Google Sheets pro management.

```
┌─────────────────────────────────────────────────────────────┐
│  Krok 1: Extrakce                                           │
│  Komponenta: keboola.ex-generic-v2                          │
│  Vstup: REST API (https://api.example.com/orders)           │
│  Výstup: /data/out/tables/orders.csv                        │
│          /data/out/tables/order_items.csv                    │
│                                                             │
│  → Storage API (File Backend):                              │
│    Konvertuje CSV → Parquet                                 │
│    Nahraje na S3: s3://kbc-fb-123/tables/in.c-api/orders/   │
│    Aktualizuje metadata: 2 tabulky, schema, row count       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Krok 2: DuckDB Transformace                                │
│  Komponenta: keboola.duckdb-transformation (nová/rozšířená) │
│                                                             │
│  SQL:                                                       │
│  CREATE TABLE daily_report AS                               │
│  SELECT                                                     │
│    DATE_TRUNC('day', o.created_at) AS den,                  │
│    COUNT(DISTINCT o.id) AS pocet_objednavek,                │
│    SUM(oi.quantity * oi.unit_price) AS trzby,               │
│    AVG(oi.quantity * oi.unit_price) AS prumerna_objednavka   │
│  FROM read_parquet(                                         │
│    's3://kbc-fb-123/tables/in.c-api/orders/data/*.parquet'  │
│  ) o                                                        │
│  JOIN read_parquet(                                         │
│    's3://kbc-fb-123/tables/in.c-api/order_items/data/*.pq'  │
│  ) oi ON o.id = oi.order_id                                 │
│  GROUP BY 1                                                 │
│  ORDER BY 1 DESC;                                           │
│                                                             │
│  → Výstup: s3://kbc-fb-123/tables/out.c-report/daily/      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Krok 3: Writer                                             │
│  Komponenta: keboola.wr-google-sheets                       │
│  Vstup: Storage API exportuje tabulku z S3 → CSV            │
│  Výstup: Google Sheet "Denní report objednávek"             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Co je potřeba implementovat pro PoC

| Komponenta | Stav | Co je třeba |
|------------|------|-------------|
| **Storage API — File Backend mode** | Nový | Nový backend type; CSV→Parquet konverze; S3 file management; metadata storage |
| **DuckDB Transformation** | Rozšíření existujícího | S3 direct read/write; auto-mounting tabulek jako views; S3 credentials injection |
| **Extraktor** | Beze změny | Používá Common Interface, výstup je CSV |
| **Writer** | Beze změny | Čte přes S3 staging (CSV export) |
| **Metadata Catalog** | Minimální verze | Schema storage, file index, row counts |
| **UI** | Minimální změny | Volba "File Backend" při vytváření projektu |

### 8.4 Technické rozhodnutí pro PoC

| Rozhodnutí | Volba | Důvod |
|------------|-------|-------|
| **Object storage** | AWS S3 | Keboola primárně na AWS; existující infrastruktura |
| **File formát** | Parquet (Snappy komprese) | Optimální pro DuckDB; dobrý kompresní poměr |
| **Metadata storage** | PostgreSQL (nebo existující MySQL) | Jednoduchý, spolehlivý; upgrade na DuckLake později |
| **Partitioning** | Hive-style, volitelný | `year=YYYY/month=MM/` pro časová data |
| **DuckDB verze** | 1.4.x+ (LTS) | Stabilní, S3 podpora, Iceberg podpora |

---

## 9. Srovnání nákladů

### 9.1 Typický malý zákazník (10 GB dat, denní ETL)

#### Dnešní stav: Snowflake backend

| Položka | Náklad/měsíc |
|---------|-------------|
| Snowflake storage (10 GB) | ~$0.23 |
| Snowflake compute (XS warehouse, ~2h/den) | ~$120 ($2/kredit × 1 kredit/h × 2h × 30 dní) |
| S3 File Storage (staging) | ~$0.50 |
| **Celkem warehouse náklady** | **~$121** |

#### Navrhovaný stav: File Backend

| Položka | Náklad/měsíc |
|---------|-------------|
| S3 storage (10 GB Parquet, ~3 GB komprese) | ~$0.07 |
| S3 API requesty (PUT/GET, ~100K/měsíc) | ~$0.50 |
| DuckDB compute (v rámci existujícího kontejneru) | $0 (CPU čas z job queue) |
| Metadata DB (sdílená instance) | ~$5 (amortizováno) |
| **Celkem File Backend náklady** | **~$6** |

#### Úspora: **~$115/měsíc (~95%)**

### 9.2 Střední zákazník (100 GB dat, hodinový ETL)

#### Snowflake

| Položka | Náklad/měsíc |
|---------|-------------|
| Snowflake storage (100 GB) | ~$2.30 |
| Snowflake compute (Small warehouse, ~6h/den) | ~$720 ($2/kredit × 2 kredity/h × 6h × 30 dní) |
| **Celkem** | **~$722** |

#### File Backend

| Položka | Náklad/měsíc |
|---------|-------------|
| S3 storage (100 GB → ~30 GB Parquet) | ~$0.69 |
| S3 API requesty (~1M/měsíc) | ~$5 |
| DuckDB compute (větší kontejner, ~3h/den) | ~$30 (amortizováno) |
| Metadata DB | ~$10 (amortizováno) |
| **Celkem** | **~$46** |

#### Úspora: **~$676/měsíc (~94%)**

### 9.3 Kde se úspora ztrácí

| Objem dat | Snowflake | File Backend | Úspora | Poznámka |
|-----------|-----------|-------------|--------|----------|
| 1 GB | $60 | $3 | 95% | File Backend jasně vítězí |
| 10 GB | $121 | $6 | 95% | File Backend jasně vítězí |
| 100 GB | $722 | $46 | 94% | File Backend stále výrazně levnější |
| 500 GB | $2,000 | $250 | 88% | Stále úspora, ale DuckDB transformace trvají déle |
| 1 TB | $3,500 | $800 | 77% | Breakpoint — DuckDB je pomalý, warehouse má smysl |
| 5 TB | $8,000 | $5,000+ | 38% | Warehouse je lepší volba |

**Breakpoint:** Kolem **500 GB - 1 TB** se úspora zmenšuje a warehouse začíná nabízet lepší výkon za rozumnou cenu.

---

## 10. Rizika a otevřené otázky

### 10.1 Technická rizika

| Riziko | Závažnost | Mitigace |
|--------|-----------|----------|
| **DuckDB S3 performance pro velké soubory** | Střední | Partitioning, column pruning, object cache; limity na velikost tabulky |
| **Concurrent writes** | Vysoká | DuckDB je single-writer; řešení: write lock na úrovni tabulky v metadata DB |
| **DuckDB stabilita pro production** | Nízká | DuckDB 1.4 je LTS; používán v produkci mnoha firmami |
| **S3 consistency** | Nízká | S3 poskytuje strong read-after-write consistency od 2020 |
| **Large HTTP request count** | Střední | DuckDB generuje mnoho malých HTTP requestů pro wide Parquet; mitigace: optimální row-group size (100K-1M řádků) |
| **Spill-to-disk v kontejneru** | Střední | Nutnost dostatečného disk space v job queue kontejnerech |

### 10.2 Produktová rizika

| Riziko | Závažnost | Mitigace |
|--------|-----------|----------|
| **Zákaznické očekávání** | Vysoká | Jasná komunikace limitů; File Backend jako "lite" tier |
| **Feature parity** | Střední | Explicitně definovat, co File Backend (ne)podporuje |
| **Migrace mezi backendy** | Střední | Umožnit upgrade File Backend → Snowflake/BQ |
| **Kompatibilita komponent** | Střední | Některé komponenty mohou předpokládat warehouse; testování |

### 10.3 Otevřené otázky

1. **Jak řešit incremental loading?**
   - Warehouse: `INSERT INTO ... SELECT ... WHERE id NOT IN (...)`
   - File Backend: Append nových Parquet souborů + deduplikace při čtení/kompakci?

2. **Jak řešit DELETE/UPDATE operace?**
   - Parquet je immutable formát
   - Možnosti: Copy-on-write (přepis celé tabulky), soft deletes, DuckLake (ACID)

3. **Workspace / SQL Lab?**
   - Dnes: Snowflake workspace pro ad-hoc SQL
   - File Backend: On-demand DuckDB instance s připojenými S3 daty?

4. **Data sharing mezi projekty?**
   - Dnes: Keboola Data Catalog, Snowflake data sharing
   - File Backend: S3 cross-account access? Shared metadata?

5. **Native datatypes vs. STRING?**
   - Keboola dnes defaultně ukládá vše jako STRING
   - Parquet má nativní typy — využít? Nebo zachovat STRING kompatibilitu?

6. **Billing model?**
   - Dnes: Keboola billing zahrnuje warehouse
   - File Backend: Jak účtovat? Podle S3 storage? Podle DuckDB compute time?

---

## 11. Roadmap a další kroky

### Fáze 0: Validace konceptu (2-4 týdny)

- [ ] Benchmark DuckDB na S3: typické Keboola transformace, různé velikosti dat
- [ ] PoC: Manuální pipeline (skript) — CSV → S3 Parquet → DuckDB SQL → S3 Parquet → CSV
- [ ] Validace: DuckDB procesor rozšířit o S3 direct read/write
- [ ] Rozhodnutí: Metadata storage (vlastní vs. DuckLake vs. Iceberg)

### Fáze 1: Minimální File Backend (1-2 měsíce)

- [ ] Storage API: Nový backend type "file"
- [ ] CSV → Parquet konverze v import pipeline
- [ ] S3 file management (upload, listing, delete)
- [ ] Základní metadata (schema, row count, file index)
- [ ] DuckDB Transformation komponenta s S3 support
- [ ] Jeden e2e test: extraktor → transformace → writer

### Fáze 2: Produkční ready (2-3 měsíce)

- [ ] Incremental loading support
- [ ] Partitioning a compaction
- [ ] DuckLake integrace pro metadata + ACID
- [ ] UI: Volba backendu při vytváření projektu
- [ ] Billing integrace
- [ ] Dokumentace a migrace guide
- [ ] Kompatibilita testing pro top 20 komponent

### Fáze 3: Rozšíření (ongoing)

- [ ] DuckDB Workspace (on-demand SQL konzole)
- [ ] Nativní Parquet output z populárních extraktorů
- [ ] Data sharing mezi File Backend projekty
- [ ] GCS a ABS podpora (multi-cloud)
- [ ] Time travel a snapshots (via DuckLake)

---

## Appendix A: Relevantní technologie

### DuckDB
- **Verze:** 1.5.0 (březen 2026), LTS: 1.4.x
- **Licence:** MIT
- **S3 podpora:** via `httpfs` extension
- **Parquet:** nativní, optimalizovaný
- **Iceberg:** plná podpora (čtení + zápis od v1.4.0)
- **Web:** https://duckdb.org

### DuckLake
- **Popis:** Open table formát s SQL-backed metadata
- **Licence:** MIT
- **Metadata:** PostgreSQL, MySQL, SQLite, DuckDB
- **Data:** Parquet na S3/GCS/ABS
- **Featury:** ACID, time travel, schema evolution
- **Web:** https://ducklake.select

### Keboola DuckDB Procesor
- **Repo:** https://github.com/keboola/processor-duckdb
- **Verze:** 1.4.31 (leden 2026)
- **Režimy:** Simple mode, Advanced mode
- **Vstupy:** Storage tabulky, soubory (Parquet, JSON), URLs
- **DuckDB verze:** 1.4.3

## Appendix B: Srovnání s alternativami

| Přístup | Compute | Storage | Catalog | Cena | Komplexita |
|---------|---------|---------|---------|------|------------|
| **File Backend (tento návrh)** | DuckDB | S3 Parquet | DuckLake/vlastní | Velmi nízká | Nízká |
| **Snowflake** | Snowflake | Snowflake (S3 interně) | Snowflake | Vysoká | Nízká (managed) |
| **BigQuery** | BigQuery | BigQuery (Colossus) | BigQuery | Střední-Vysoká | Nízká (managed) |
| **Iceberg + Spark** | Spark | S3 Parquet | Iceberg REST | Střední | Vysoká |
| **Iceberg + DuckDB** | DuckDB | S3 Parquet | Iceberg REST | Nízká | Střední |
| **Delta Lake + Spark** | Spark/Databricks | S3 Parquet | Delta Log | Střední-Vysoká | Vysoká |
| **MotherDuck** | DuckDB (cloud) | MotherDuck | MotherDuck | Nízká-Střední | Nízká |

## Appendix C: Klíčové metriky pro rozhodování

Při rozhodování o File Backend vs. warehouse doporučujeme sledovat:

```
IF (objem_dat < 100GB
    AND pocet_tabulek < 500
    AND max_transformace_runtime < 10min
    AND concurrent_queries <= 2
    AND nepotrebuje_realtime_sql)
THEN → File Backend
ELSE → Warehouse Backend
```
