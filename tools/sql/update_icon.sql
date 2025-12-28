-- Update the icon for 'Efectivo' category to use 'Banknote'
UPDATE Category SET icon = 'Banknote' WHERE name = 'Efectivo';
-- Also update its color to a nice green if it isn't already (usually #10b981)
UPDATE Category SET color = '#10b981' WHERE name = 'Efectivo';
