import Orders from './model.js';

class ordersDao {
  async getAll(query = {}) {
    try {
      return await Orders.find(query);
    } catch (error) {
      console.log(`Error al buscar las ordenes en la base de datos . ${error}`);
    }
  }

  async get(user) {
    try {
      return await Orders.findOne({ userEmail: user.email });
    } catch (error) {
      console.log(`Error al buscar el producto en la base de datos . ${error}`);
    }
  }

  async create(orderData) {
    try {
      return await Orders.create(orderData);
    } catch (error) {
      console.log(`Error al crear el producto en la base de datos ${error}`);
    }
  }

  async update(id, updatedProduct) {
    try {
      return await Orders.findByIdAndUpdate(id, updatedProduct);
    } catch (error) {
      console.log(`Error al actualizar el producto en la base de datos ${error}`);
    }
  }

  async delete(id) {
    try {
      return await Orders.findByIdAndDelete(id);
    } catch (error) {
      console.log(`Error al borrar el producto en la base de datos ${error}`);
    }
  }
}

export default new ordersDao();
