INSERT INTO users (email, last_name, first_name, password)
VALUES ('d.matt7@hotmail.fr', 'Dimier', 'Matthieu', 'Password1');

INSERT INTO budget (name, warning_amount, spent_amount, allocated_amount, user_id)
VALUES ('alimentation', 100, 0, 700, 1),
       ('Loisirs', 50, 0, 350, 1);