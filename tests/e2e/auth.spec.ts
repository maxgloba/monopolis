import { test, expect } from '@playwright/test'

test.describe('Авторизация', () => {
  test('регистрация нового пользователя', async ({ page }) => {
    await page.goto('/register')
    await page.fill('[data-testid="email"]', 'test@monopolis.ru')
    await page.fill('[data-testid="nickname"]', 'testuser')
    await page.fill('[data-testid="password"]', 'Test1234')
    await page.fill('[data-testid="confirm"]', 'Test1234')
    await page.click('[data-testid="submit"]')
    await expect(page).toHaveURL('/verify-email')
  })

  test('вход с корректными данными', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'user@monopolis.ru')
    await page.fill('[data-testid="password"]', 'Password123')
    await page.click('[data-testid="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('вход с неверным паролем показывает ошибку', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'user@monopolis.ru')
    await page.fill('[data-testid="password"]', 'wrongpassword')
    await page.click('[data-testid="submit"]')
    await expect(page.locator('[data-testid="error"]')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('валидация формы регистрации — слабый пароль', async ({ page }) => {
    await page.goto('/register')
    await page.fill('[data-testid="email"]', 'test@monopolis.ru')
    await page.fill('[data-testid="nickname"]', 'testuser')
    await page.fill('[data-testid="password"]', '12345678')
    await page.fill('[data-testid="confirm"]', '12345678')
    await page.click('[data-testid="submit"]')
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })

  test('восстановление пароля — отправка письма', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.fill('[data-testid="email"]', 'user@monopolis.ru')
    await page.click('[data-testid="submit"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
