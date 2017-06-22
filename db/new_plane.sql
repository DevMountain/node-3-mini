insert into airplanes (planetype, passengercount) values ('747', 200),
('717', 10),
('727', 20),
('737', 30),
('757', 500)
returning *;
