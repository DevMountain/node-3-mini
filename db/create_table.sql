CREATE TABLE airplanes
(
    plane_id SERIAL PRIMARY KEY NOT NULL,
    plane_type varchar(40) NOT NULL,
    passenger_count integer NOT NULL
);