# Allo Inventory Reservation System

## Overview

This project implements a concurrency-safe inventory reservation system for multi-warehouse inventory management.

The primary focus is preventing overselling under concurrent reservation requests.

---

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma
- Neon PostgreSQL
- Tailwind CSS
- Zod

---

## Running Locally

```bash
npm install

## Concurrency Verification

To verify race-condition safety, I stress-tested the reservation endpoint using concurrent requests with `autocannon`.

The reservation flow uses PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) inside a transaction to ensure that concurrent requests cannot reserve the same inventory simultaneously.

### Test Setup

- 20 concurrent connections
- 50 total reservation requests
- Limited inventory stock

### Results

Under concurrent load:

- some requests successfully reserved inventory (`200`)
- competing requests correctly returned `409 Conflict`
- no overselling occurred

The observed request latency also demonstrated row-lock contention behaviour, confirming that transactions were being serialized correctly under load.