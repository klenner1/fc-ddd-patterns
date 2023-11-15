import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import LogCustomerAddressChangedHandler from "./log-customer-address-changed.handler";
import Address from '../../value-object/address';
import CustomerFactory from "../../factory/customer.factory";

describe("Customer address changed event tests", () => {

    const eventName = CustomerAddressChangedEvent.name;

    it(`should register ${LogCustomerAddressChangedHandler.name}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        // Act
        eventDispatcher.register(eventName, new LogCustomerAddressChangedHandler());
        // Assert
        expect(eventDispatcher.getEventHandlers[eventName]).toBeDefined();
    });

    it(`should unregister ${LogCustomerAddressChangedHandler.name}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        const sendEventHandler = new LogCustomerAddressChangedHandler();
        eventDispatcher.register(eventName, sendEventHandler);
        // Act
        eventDispatcher.unregister(eventName, sendEventHandler);
        // Assert
        expect(eventDispatcher.getEventHandlers[eventName].length).toBe(0);
    });

    it(`should handle ${LogCustomerAddressChangedHandler.name}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        const handler = new LogCustomerAddressChangedHandler();
        const spyEvent = jest.spyOn(handler, "handle");

        eventDispatcher.register(eventName, handler);
        expect(eventDispatcher.getEventHandlers[eventName]).toBeDefined();

        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        const customer = CustomerFactory.createWithAddress("Fulano", address);
        const event = new CustomerAddressChangedEvent(customer);
        // Act
        eventDispatcher.notify(event);

        // Assert
        expect(spyEvent).toHaveBeenCalled();
    });
});