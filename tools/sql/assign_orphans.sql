-- Assign all orphaned data (NULL userId) to the main admin user 'user_facundo'
-- This ensures Facundo sees his historical data, while new users start fresh.

UPDATE RecurringIncome SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE CategoryPayment SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Expense SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Income SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Saving SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Person SET userId = 'user_facundo' WHERE userId IS NULL;
