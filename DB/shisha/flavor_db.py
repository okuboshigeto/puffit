import sqlite3
from config import DB_PATH

db = sqlite3.connect(DB_PATH)
cursor = db.cursor()

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS shisha_flavor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flavor_type INTEGER NOT NULL,
        flavor_name TEXT NOT NULL,
        flavor_description TEXT NOT NULL,
        FOREIGN KEY (flavor_type) REFERENCES flavor_type(id)
    )
    """,
)

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS flavor_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_name TEXT
    )
    """,
)

cursor.execute(
    """
CREATE TABLE IF NOT EXISTS user_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flavor_type INTEGER NOT NULL,
    flavor_name INTEGER NOT NULL,
    flavor_rating INTEGER NOT NULL,
    flavor_comment TEXT,
    FOREIGN KEY (flavor_type) REFERENCES flavor_type(id),
    FOREIGN KEY (flavor_name) REFERENCES shisha_flavor(id)
    ) 
    """,
)

type_names = [
    ("Fruits",),
    ("MINT",),
]

cursor.executemany(
    """
    INSERT INTO flavor_type (type_name)
    VALUES (?)
    """,
    type_names
)

flavors = [
    (1, "Apple", "Apple is a fruit that is sweet and crunchy."),
    (1, "Banana", "Banana is a fruit that is sweet and soft."),
    (1, "Cherry", "Cherry is a fruit that is sweet and sour."),
    (1, "Orange", "Orange is a fruit that is sweet and juicy."),
    (1, "Strawberry", "Strawberry is a fruit that is sweet and juicy."),
    (1, "Watermelon", "Watermelon is a fruit that is sweet and juicy."),
    (2, "Mint", "Mint is a herb that is minty and refreshing."),
]

cursor.executemany(
    """
    INSERT INTO shisha_flavor (flavor_type, flavor_name, flavor_description)
    VALUES (?, ?, ?)
    """,
    flavors
)

db.commit()
db.close()
