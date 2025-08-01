INSERT INTO users (email, last_name, first_name, password)
VALUES ('demo@pince.app', 'Versaire', 'Annie', '$argon2id$v=19$m=65536,t=3,p=4$MzITErHOE1UROyPbpNHnxw$WMQqd2hgGP3cKuparBNnc11/CSQ5abHLu0XN+qRaNoo');

INSERT INTO budget (name, warning_amount, spent_amount, allocated_amount, color, icon, position, user_id)
VALUES 
('Courses', 100.00, 66.80, 300.00, '#ffcc00', '🛒', 1, 1),
('Loisirs', 100.00, 12.00, 200.00, '#00ccff', '🎮', 2, 1),
('Transport', 50.00, 66.00, 100.00, '#00ffcc', '🚗', 3, 1);

INSERT INTO expenditure (description, payment_method, amount, date, user_id, budget_id)
VALUES 
('Achat au supermarché', 'CB', 45.50, '2025-07-01', 1, 1),
('Cinéma', 'Espèces', 12.00, '2025-07-03', 1, 2),
('Essence', 'CB', 30.00, '2025-07-04', 1, 3),
('Gateau anniversaire', 'CB', 21.30, '2025-07-07', 1, 1),
('Vidange', 'CB', 36.00, '2025-07-19', 1, 3);