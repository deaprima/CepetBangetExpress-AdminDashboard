import eel
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['Db-CepetBangetExpress']
collection = db['admin'] 

eel.init('web')

def generate_id_admin():
    last_admin = collection.find_one(sort=[("id_admin", -1)])  
    if last_admin:
        last_id = int(last_admin['id_admin'][1:])  
        new_id = f"U{last_id + 1:03}" 
    else:
        new_id = "U001" 
    return new_id

@eel.expose
def read_data():
    data = list(collection.find({}, {'_id': 0}))
    return data

@eel.expose
def create_data(namaLengkap, username, password, jabatan, no_telepon, email):
    if collection.find_one({"username_admin": username}):
        return "Error: Username sudah digunakan!"
    if collection.find_one({"email_admin": email}):
        return "Error: Email sudah digunakan!"
    if collection.find_one({"no_telepon_admin": no_telepon}):
        return "Error: Nomor telepon sudah digunakan!"
    
    new_data = {
        "id_admin": generate_id_admin(),
        "nama_lengkap": namaLengkap,
        "username_admin": username,
        "password_admin": password,
        "jabatan_admin": jabatan,
        "no_telepon_admin": no_telepon,
        "email_admin": email,
    }
    collection.insert_one(new_data)
    return "Data berhasil ditambahkan"

@eel.expose
def update_data(id_admin, namaLengkap, username, password, jabatan, no_telepon, email):
    query = {"id_admin": id_admin}
    existing_data = collection.find_one(query)

    if existing_data["username_admin"] != username and collection.find_one({"username_admin": username}):
        return "Error: Username sudah digunakan!"
    if existing_data["email_admin"] != email and collection.find_one({"email_admin": email}):
        return "Error: Email sudah digunakan!"
    if existing_data["no_telepon_admin"] != no_telepon and collection.find_one({"no_telepon_admin": no_telepon}):
        return "Error: Nomor telepon sudah digunakan!"

    new_values = {
        "$set": {
            "nama_lengkap": namaLengkap,
            "username_admin": username,
            "password_admin": password,
            "jabatan_admin": jabatan,
            "no_telepon_admin": no_telepon,
            "email_admin": email,
        }
    }
    collection.update_one(query, new_values)
    return "Data berhasil diperbarui"

@eel.expose
def delete_data(id_admin):
    query = {"id_admin": id_admin}
    collection.delete_one(query)
    return "Data berhasil dihapus"

eel.start('index.html', size=(1300, 800))