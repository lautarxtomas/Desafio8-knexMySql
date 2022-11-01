import knexLib from "knex";

class ClienteSql {
    constructor(config) {
        this.knex = knexLib(config)
    }

    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
          .finally(()=>{
            return this.knex.schema.createTable('productos', table => {
                table.increments('id').primary();
                table.string('name', 50).notNullable();
                table.float('price');
                table.integer('stock');
                table.string('code', 10).notNullable();
                table.string('image', 100).notNullable();
                table.string('timestamp', 50).notNullable();
                table.string('description').notNullable();
            })
          })
    }

    crearTablaMessage() {
        return this.knex.schema.dropTableIfExists('mensajes')
          .finally(()=>{
            return this.knex.schema.createTable('mensajes', table => {
                table.increments('id').primary();
                table.string('autor', 50).notNullable();
                table.string('time', 50).notNullable();
                table.string('mensaje').notNullable();
            })
          })
    }

    save(producto) {
        console.log("Se guardó el producto en la base de datos SQL Ecommerce")
        return this.knex('productos').insert(producto);
    }

    saveMessage(mensaje) {
        console.log("Se guardó el mensaje en la base de datos SQLite3 Ecommerce")
        return this.knex('mensajes').insert(mensaje);
    }

    getAllProducts() {
        return this.knex('productos').select('*');
    }

    getAllMessages() {
        return this.knex('mensajes').select('*');
    }

    getProductById(id) {
        return this.knex('productos').where('id', id).select();
    }

    getMessageById(id) {
        return this.knex('mensajes').where('id', id).select();
    }

    deleteProductById(id) {
        return this.knex('productos').where('id', id).del();
    }

    deleteAllProducts() {
        return this.knex('productos').del();
    }

    close() {
        this.knex.destroy();
      }

}

export default ClienteSql

