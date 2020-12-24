

DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'

);


DROP  TABLE IF EXISTS shopping_list CASCADE;
CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    price decimal NOT NULL,
    date_added TIMESTAMP DEFAULT now() NOT NULL,
    checked BOOLEAN DEFAULT false,
    category grocery NOT NULL
);


