import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from '../../../../domain/checkout/entity/order_item';

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const model = {
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id
      })),
    };
    await OrderModel.update(
      model,
      {
        where: {
          id: entity.id,
        },
      }
    );

    await OrderItemModel.destroy({
      where: {
        order_id: entity.id,
      }
    });

    await OrderItemModel.bulkCreate(
      model.items
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: [{ model: OrderItemModel }],
      });
    } catch (error) {
      throw new Error("Order not found");
    }
    return this.orderModelToOrder(orderModel);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });
    return orderModels.map(this.orderModelToOrder);
  }

  private orderModelToOrder(orderModel: OrderModel): Order {
    const itens = orderModel.items.map((item) => {
      return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity);
    });
    return new Order(orderModel.id, orderModel.customer_id, itens);
  }
}
