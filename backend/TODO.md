# TODO - Fix Laravel Sanctum auth tests (personal_access_tokens missing)

## Step 1: Fix PHPUnit sqlite testing database isolation
- [ ] Update `backend/phpunit.xml` to use a temporary sqlite file instead of `:memory:`.

## Step 2: Ensure migrations always run in tests
- [ ] Re-run `php artisan test` (auth tests) to verify `personal_access_tokens` exists.
- [ ] If still failing, update `backend/tests/TestCase.php` to force migrations for sqlite testing.

## Step 3: Audit Sanctum token generation & middleware
- [ ] Verify `User` model uses `HasApiTokens`.
- [ ] Verify `auth:sanctum` bearer auth flow works in tests.

## Step 4: Validate
- [ ] Run full suite: `php artisan test`
- [ ] Confirm no migration/table issues remain.

