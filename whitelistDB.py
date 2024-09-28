import sqlite3

# Database configuration
database_name = 'whitelistDB.sqlite'  # The name of the SQLite database file

try:
    # Connect to the SQLite database (it will be created if it doesn't exist)
    conn = sqlite3.connect(database_name)
    cursor = conn.cursor()

    # Create the table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS whitelist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hubID TEXT,
        productID TEXT,
        robloxID INTEGER,
        owned BOOLEAN
    )
    """
    cursor.execute(create_table_query)
    print("Table 'whitelist' created successfully!")

    # Insert data into the table
    insert_query = """
    INSERT INTO whitelist (hubID, productID, robloxID, owned) VALUES (?, ?, ?, ?)
    """
    data = [
        ('66dd90712ffdabb307586249', 'lzksjl62tsgd6xttgwpkor8azb2d', 5719020886, 1),  # 1 for True
        ('66dd90712ffdabb307586249', 'lzksjl62tsgd6xttgwpkor8azb2d', 123456789, 0)   # 0 for False
    ]
    
    cursor.executemany(insert_query, data)
    conn.commit()  # Commit the changes
    print("Data inserted successfully!")

except sqlite3.Error as e:
    print(f"An error occurred: {e}")
finally:
    if cursor:
        cursor.close()  # Close the cursor
    if conn:
        conn.close()    # Close the connection
