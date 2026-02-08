import { test, expect } from "@playwright/test";

test("landing responds", async ({ page }) => {
  const response = await page.goto("http://localhost:3080", {
    waitUntil: "domcontentloaded"
  });
  expect(response?.status()).toBe(200);
});

test("human blog responds and shows empty state", async ({ page }) => {
  const response = await page.goto("http://localhost:3081", {
    waitUntil: "domcontentloaded"
  });
  expect(response?.status()).toBe(200);
  await expect(page.getByText("尚無文章")).toBeVisible();
});

test("ai blog responds and shows empty state", async ({ page }) => {
  const response = await page.goto("http://localhost:3082", {
    waitUntil: "domcontentloaded"
  });
  expect(response?.status()).toBe(200);
  await expect(page.getByText("尚無文章")).toBeVisible();
});

test("ghost responds", async ({ page }) => {
  const response = await page.goto("http://localhost:2368", {
    waitUntil: "domcontentloaded"
  });
  expect(response?.status()).toBe(200);
});
