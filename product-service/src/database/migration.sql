create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer,
	imgUrl text
)

insert into products (title, description, price, imgUrl)
values (
        'Diavel',
        'Short Product Description',
        21300,
        'https://images.ctfassets.net/x7j9qwvpvr5s/605GXZE7lqLUCPXAy21OMl/3e4377b0a8a557c7fb8f03992e10d29d/Model-Menu-MY21-DVL-1260-Bk-v04.png'
    ),
    (
        'XDiavel',
        'Short Product Description',
        26700,
        'https://images.ctfassets.net/x7j9qwvpvr5s/AU7wqZAkvutJAG3nuahDp/aa9ad19ffec748cf3cafaa5c2c3249cd/Model-Menu-MY21-XDVL-Dk-v02.png'
    ),
    (
        'Hypermotard',
        'Short Product Description',
        15000,
        'https://images.ctfassets.net/x7j9qwvpvr5s/5dQ6xxtW0MXgQ9zAgdonJP/c1e3190015ead714a8715f9350ebfdb3/Model-Menu-MY22-HYM-SP.png'
    ),
    (
        'Monster',
        'Short Product Description',
        16000,
        'https://images.ctfassets.net/x7j9qwvpvr5s/6x3Oc0cYWlCyTQD2DOfjwG/76e89b4aaf11166f772f3ea92ae1d67d/Model-Menu-MY21-MON-937-R-v03.png'
    ),
    (
        'Streetfighter',
        'Short Product Description',
        18500,
        'https://images.ctfassets.net/x7j9qwvpvr5s/55UokjPpsYkMoz2cw23y0X/aa411d03fb9531858f488fdf78ef5d8a/Model-Menu-MY21-SFV4-v02.png'
    ),
    (
        'Multistrada',
        'Short Product Description',
        12900,
        'https://images.ctfassets.net/x7j9qwvpvr5s/6wyoEfQRnp6e9hCze9ttHs/1572982303d8b6456e4fd6cd4fa2ff77/Model-Menu-MY21-MTS-950-R-v02.png'
    ),
		(
        'Panigale',
        'Short Product Description',
        26700,
        'https://images.ctfassets.net/x7j9qwvpvr5s/7AHGO3zch7PVqNRJ4Jl5he/110516d42388c33e433e183ef679e270/Model-Menu-MY22-PV2-Bayliss.png'
    ),
		(
        'Superleggera',
        'Short Product Description',
        21000,
        'https://images.ctfassets.net/x7j9qwvpvr5s/15ePc25M0fGAueihzfVkfx/d4da9fe5b26e0f60f5a9a61af9406984/Model-Menu-MY21-SLV4-v02.png'
    ),
		(
        'SuperSport',
        'Short Product Description',
        12000,
        'https://images.ctfassets.net/x7j9qwvpvr5s/3YWkEs2mbVXlN7nhQXZZlx/344ffcaae91fbc859a45abab22ce0de9/Model-Menu-MY21-SS-950-v02.png'
    ),
		(
        'Scrambler',
        'Short Product Description',
        10800,
        'https://images.ctfassets.net/x7j9qwvpvr5s/4PhIvzGoZf42xImhZBsusz/b2e34e6db33901c97be0b9db264a2632/Model-Menu-MY21-SCR-1100-Sport-Pro-v02.png'
    ),
		(
        'E-bike',
        'Short Product Description',
        1300,
        'https://images.ctfassets.net/x7j9qwvpvr5s/6Q1714j8GJ6SVzFeIYURYL/a791c05e96938f216453f120a3497d33/TK-01RR-780x430.jpg'
    );

create table if not exists stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	product_count integer,
	foreign key ("product_id") references "products" ("id")
)

insert into stocks (product_id, product_count) values
('45dcba46-637c-4a26-abca-0b7c5f4bbc36', 13),
('17e1dd0c-5773-4059-83f1-a114ecf581f0', 42),
('812afa4d-d366-45f8-b4cb-bfe6ccb95e32', 2),
('62b9c3b3-ab40-486a-85cf-5c907b212fdc', 31),
('7b3dda58-56ee-4dfc-bd35-30b19f6abe1d', 81),
('99b5f9a5-5583-4305-bc6a-0af546e29472', 12),
('bdeaf107-76ff-4e26-b9bd-d46b0bceb077', 4),
('1383cb18-0fdb-4908-8806-7ca3e8715c73', 52),
('0fe9786d-67eb-41de-b469-e27bff3e759e', 12);
