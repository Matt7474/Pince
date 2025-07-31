INSERT INTO users (email, last_name, first_name, password)
VALUES ('d.matt7@hotmail.fr', 'Dimier', 'Matthieu', '$argon2id$v=19$m=65536,t=3,p=4$MzITErHOE1UROyPbpNHnxw$WMQqd2hgGP3cKuparBNnc11/CSQ5abHLu0XN+qRaNoo');

INSERT INTO budget (name, warning_amount, spent_amount, allocated_amount, color, icon, position, user_id)
VALUES 
('Courses', 200.00, 150.00, 300.00, '#ffcc00', '🛒', 1, 1),
('Loisirs', 100.00, 80.00, 200.00, '#00ccff', '🎮', 2, 1),
('Transport', 50.00, 70.00, 100.00, '#00ffcc', '🚗', 3, 1);

INSERT INTO expenditure (description, payment_method, amount, date, user_id, budget_id)
VALUES 
('Achat au supermarché', 'CB', 45.50, '2025-07-01', 1, 1),
('Cinéma', 'Espèces', 12.00, '2025-07-03', 1, 2),
('Essence', 'CB', 30.00, '2025-07-04', 1, 3);