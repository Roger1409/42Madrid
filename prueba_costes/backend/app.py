from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) # Esto habilitará CORS para permitir las peticiones desde el frontend

# Configuración de la base de datos MySQL
db_config = {
    'host': '127.0.0.1',  # Cambia esto si tu base de datos está en otro host
    'user': 'root',    # Reemplaza con tu nombre de usuario de MySQL
    'password': 'Elbarca123',  # Reemplaza con tu contraseña de MySQL
    'database': 'costes'      # El nombre de tu base de datos
}

def get_db_connection():
    try:
        mydb = mysql.connector.connect(**db_config) # O pymysql.connect(**db_config)
        return mydb
    except mysql.connector.Error as err: # O pymysql.Error as err
        print(f"Error al conectar a la base de datos: {err}")
        return None

@app.route('/')
def hello_world():
    return jsonify({'message': '¡Hola desde el backend de Flask!'})

@app.route('/obras', methods=['GET'])
def get_obras():
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor(dictionary=True)
    query = "SELECT id_obra, nombre, id_promotor, importe_contrato, aval_bancario, fecha_inicio FROM obras"
    try:
        cursor.execute(query)
        obras = cursor.fetchall()
        cursor.close()
        mydb.close()
        return jsonify(obras)
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al obtener las obras: {err}'}), 500
    
@app.route('/obras', methods=['POST'])
def crear_obra():
    data = request.get_json()
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    query = "INSERT INTO obras (id_obra, nombre, id_promotor, importe_contrato, aval_bancario, fecha_inicio) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (data.get('id_obra'), data.get('nombre'), data.get('id_promotor'), data.get('importe_contrato'), data.get('aval_bancario'), data.get('fecha_inicio'))
    try:
        cursor.execute(query, values)
        mydb.commit()
        cursor.close()
        mydb.close()
        return jsonify({'message': 'Obra creada con éxito!', 'id_obra': data.get('id_obra')}), 201
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al crear la obra: {err}'}), 500

@app.route('/obras/<string:id_obra>', methods=['DELETE'])
def eliminar_obra(id_obra):
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    query = "DELETE FROM obras WHERE id_obra = %s"
    values = (id_obra,)
    try:
        cursor.execute(query, values)
        mydb.commit()
        cursor.close()
        mydb.close()
        if cursor.rowcount > 0:
            return jsonify({'message': f'Obra con ID {id_obra} eliminada con éxito!'}), 200
        else:
            return jsonify({'message': f'No se encontró ninguna obra con ID {id_obra}.'}), 404
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al eliminar la obra: {err}'}), 500

@app.route('/obras/<string:id_obra>', methods=['GET'])
def obtener_obra(id_obra):
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor(dictionary=True)
    query = "SELECT id_obra, nombre, id_promotor, importe_contrato, aval_bancario, fecha_inicio FROM obras WHERE id_obra = %s"
    values = (id_obra,)
    try:
        cursor.execute(query, values)
        obra = cursor.fetchone()
        cursor.close()
        mydb.close()
        if obra:
            return jsonify(obra), 200
        else:
            return jsonify({'message': f'No se encontró ninguna obra con ID {id_obra}.'}), 404
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al obtener la obra: {err}'}), 500
    
@app.route('/obras/<string:id_obra>', methods=['PUT'])
def actualizar_obra(id_obra):
    data = request.get_json()
    print("Datos recibidos para actualizar:", data) # Añade esta línea
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    query = "UPDATE obras SET nombre=%s, id_promotor=%s, importe_contrato=%s, aval_bancario=%s, fecha_inicio=%s WHERE id_obra=%s"
    values = (data.get('nombre'), data.get('id_promotor'), data.get('importe_contrato'), data.get('aval_bancario'), data.get('fecha_inicio'), id_obra)
    print("Query a ejecutar:", query) # Añade esta línea
    print("Valores a insertar:", values) # Añade esta línea
    try:
        cursor.execute(query, values)
        mydb.commit()
        cursor.close()
        mydb.close()
        if cursor.rowcount > 0:
            return jsonify({'message': f'Obra con ID {id_obra} actualizada con éxito!'}), 200
        else:
            return jsonify({'message': f'No se encontró ninguna obra con ID {id_obra} para actualizar.'}), 404
    except mysql.connector.Error as err:
        print(f"Error en la base de datos: {err}") # Añade esta línea
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al actualizar la obra: {err}'}), 500
    
@app.route('/promotores', methods=['GET'])
def obtener_promotores():
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    cursor.execute("SELECT id_promotor, nombre FROM promotor")
    promotores = cursor.fetchall()
    cursor.close()
    mydb.close()
    promotores_lista = [{'id_promotor': p[0], 'nombre': p[1]} for p in promotores]
    return jsonify(promotores_lista), 200

@app.route('/promotores', methods=['POST'])
def crear_promotor():
    data = request.get_json()
    nombre = data.get('nombre')
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    try:
        cursor.execute("INSERT INTO promotor (nombre) VALUES (%s)", (nombre,))
        mydb.commit()
        id_promotor = cursor.lastrowid
        cursor.close()
        mydb.close()
        return jsonify({'message': 'Promotor creado con éxito!', 'id_promotor': id_promotor}), 201
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al crear el promotor: {err}'}), 500

@app.route('/promotores/<int:id_promotor>', methods=['GET'])
def obtener_promotor(id_promotor):
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    cursor.execute("SELECT id_promotor, nombre FROM promotor WHERE id_promotor = %s", (id_promotor,))
    promotor = cursor.fetchone()
    cursor.close()
    mydb.close()
    if promotor:
        return jsonify({'id_promotor': promotor[0], 'nombre': promotor[1]}), 200
    else:
        return jsonify({'message': f'Promotor con ID {id_promotor} no encontrado.'}), 404

@app.route('/promotores/<int:id_promotor>', methods=['PUT'])
def actualizar_promotor(id_promotor):
    data = request.get_json()
    nombre = data.get('nombre')
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    try:
        cursor.execute("UPDATE promotor SET nombre=%s WHERE id_promotor=%s", (nombre, id_promotor))
        mydb.commit()
        cursor.close()
        mydb.close()
        if cursor.rowcount > 0:
            return jsonify({'message': f'Promotor con ID {id_promotor} actualizado con éxito!'}), 200
        else:
            return jsonify({'message': f'No se encontró ningún promotor con ID {id_promotor} para actualizar.'}), 404
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al actualizar el promotor: {err}'}), 500

@app.route('/promotores/<int:id_promotor>', methods=['DELETE'])
def eliminar_promotor(id_promotor):
    mydb = get_db_connection()
    if not mydb:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    cursor = mydb.cursor()
    try:
        cursor.execute("DELETE FROM WHERE id_promotor=%s", (id_promotor,))
        mydb.commit()
        cursor.close()
        mydb.close()
        if cursor.rowcount > 0:
            return jsonify({'message': f'Promotor con ID {id_promotor} eliminado con éxito!'}), 200
        else:
            return jsonify({'message': f'No se encontró ningún promotor con ID {id_promotor} para eliminar.'}), 404
    except mysql.connector.Error as err:
        cursor.close()
        mydb.close()
        return jsonify({'error': f'Error al eliminar el promotor: {err}'}), 500

if __name__ == '__main__':
    app.run(debug=True)