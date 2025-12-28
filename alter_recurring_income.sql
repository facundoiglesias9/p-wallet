-- Add userId column to RecurringIncome table manually to fix missing column error
ALTER TABLE RecurringIncome ADD COLUMN userId TEXT;
