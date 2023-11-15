import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class LogCustomerAddressChangedHandler
    implements EventHandlerInterface<CustomerAddressChangedEvent>
{
    handle(event: CustomerAddressChangedEvent): void {
        const costumer = event.eventData as Customer;
        const id = costumer.id;
        const name = costumer.name;
        const address = costumer.Address;
        console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`);
    }
}