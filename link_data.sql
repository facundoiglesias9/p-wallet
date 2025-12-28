-- Link existing data to the default user 'facundo'
UPDATE Expense SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Income SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Person SET userId = 'user_facundo' WHERE userId IS NULL;
UPDATE Saving SET userId = 'user_facundo' WHERE userId IS NULL;
-- CategoryPayment already has userId column but might need update if any exist
UPDATE CategoryPayment SET userId = 'user_facundo' WHERE userId IS NULL;
