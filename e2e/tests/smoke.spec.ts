import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3080";

test("landing portal responds", async ({ page }) => {
  const response = await page.goto(BASE_URL, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(200);
});

test("novis blog responds and shows empty state", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/novis/`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(200);
  await expect(page.getByText("尚無文章")).toBeVisible();
});

test("lilin blog responds and shows empty state", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/lilin/`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(200);
  await expect(page.getByText("尚無文章")).toBeVisible();
});

test("ghost CMS responds via /cms/ proxy", async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/cms/`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(200);
});
