import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerFactory from "../../factory/customer.factory";
import CustomerCreatedEvent from "../customer-created.event";
import LogCustomerCreated1Handler from "./log-customer-created-1.handler";
import LogCustomerCreated2Handler from "./log-customer-created-2.handler";

describe("Customer created event tests", () => {

    const eventName = CustomerCreatedEvent.name;

    it(`should register handles off ${eventName}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        // Act
        eventDispatcher.register(eventName, new LogCustomerCreated1Handler());
        eventDispatcher.register(eventName, new LogCustomerCreated2Handler());
        // Assert
        expect(eventDispatcher.getEventHandlers[eventName]).toBeDefined();
        expect(eventDispatcher.getEventHandlers[eventName]).toHaveLength(2);
    });

    it(`should unregister handles off ${eventName}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        const firstHandler = new LogCustomerCreated1Handler();
        const secondHandler = new LogCustomerCreated2Handler();
        eventDispatcher.register(eventName, firstHandler);
        eventDispatcher.register(eventName, secondHandler);
        // Act
        eventDispatcher.unregister(eventName, firstHandler);
        eventDispatcher.unregister(eventName, secondHandler);
        // Assert
        expect(eventDispatcher.getEventHandlers[eventName]).toHaveLength(0);
    });

    it(`should unregister one handle off ${eventName}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        const firstHandler = new LogCustomerCreated1Handler();
        const secondHandler = new LogCustomerCreated2Handler();
        eventDispatcher.register(eventName, firstHandler);
        eventDispatcher.register(eventName, secondHandler);
        // Act
        eventDispatcher.unregister(eventName, firstHandler);
        // Assert
        expect(eventDispatcher.getEventHandlers[eventName]).toHaveLength(1);
    });

    it(`should handle ${eventName}`, () => {
        // Arrange
        const eventDispatcher = new EventDispatcher();
        const firstHandler = new LogCustomerCreated1Handler();
        const secondHandler = new LogCustomerCreated2Handler();
        const spyFirstHandler = jest.spyOn(firstHandler, "handle");
        const spySecondHandler = jest.spyOn(secondHandler, "handle");
        const spyLog = jest.spyOn(console, "log");

        eventDispatcher.register(eventName, firstHandler);
        eventDispatcher.register(eventName, secondHandler);
        expect(eventDispatcher.getEventHandlers[eventName]).toBeDefined();

        const customer = CustomerFactory.create("Fulano");
        const event = new CustomerCreatedEvent(customer);
        // Act
        eventDispatcher.notify(event);

        // Assert
        expect(spyFirstHandler).toHaveBeenCalled();
        expect(spySecondHandler).toHaveBeenCalled();
        expect(spyLog).toHaveBeenCalledTimes(2);
    });
});