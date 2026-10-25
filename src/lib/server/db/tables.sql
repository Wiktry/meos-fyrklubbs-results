CREATE TABLE IF NOT EXISTS group (
    id INTEGER PRIMARY KEY,

)

CREATE TABLE IF NOT EXISTS group_class (
    group_id INTEGER,
    class_id INTEGER,
    minimum_cmp INTEGER,
    note TEXT
)

CREATE TABLE IF NOT EXISTS group_organization (
    group_id INTEGER,
    organization_id INTEGER
)

CREATE TABLE IF NOT EXISTS competitor (
    id INTEGER PRIMARY KEY,
    name TEXT,
    organization_id INTEGER,
    class_id INTEGER,
    running_time INTEGER,
    state TEXT
);

CREATE TABLE IF NOT EXISTS organization (
    id INTEGER PRIMARY KEY,
    name TEXT
);

CREATE TABLE IF NOT EXISTS class (
    id INTEGER PRIMARY KEY,
    name TEXT,
    length INTEGER,
    position INTEGER
);
