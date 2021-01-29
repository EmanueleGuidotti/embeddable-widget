import html from './widget.component.html';
import './widget.style.css';
import {
  ModelInterface,
  ParkingInterface,
  VendorInterface,
  DictionaryInterface,
} from '../interfaces';

export class Widget {
  // DOM variables
  templateSlot: HTMLDivElement;
  body: HTMLBodyElement;
  parkingSlots = [] as HTMLElement[];

  // Data variables
  readonly vendor: VendorInterface;
  readonly parking: ParkingInterface[];
  readonly dictionary: DictionaryInterface;
  setParking: Function;

  // Initialization and model injection
  constructor(model: ModelInterface) {
    this.vendor = model.vendor;
    this.parking = model.parkings;
    this.dictionary = model.dictionary;
  }

  // A Callback for receiving the price info
  set parkingSelection(fn: any) {
    this.setParking = fn;
  }

  // Main initialization method, inject the widject container inside the dom
  public async init(): Promise<any> {
    // convert plain HTML string into DOM elements
    this.templateSlot = document.createElement('div');
    this.templateSlot.innerHTML = html;
    // append elements to body
    this.body = document.getElementsByTagName('body')[0];
    this.fillTheDom();
  }

  // This method will fill the widget with all the dom elements
  fillTheDom(): void {
    this.body.appendChild(this.templateSlot);
    // Create the rest
    this.createVendor();
    this.createFeatures();
    this.createParkingSlots();
  }

  // Toggle open and close of the vendor map area
  toggleOpenClose(
    button: HTMLButtonElement,
    element: HTMLDivElement,
    className: string,
  ): EventListener {
    return () => {
      element.classList.toggle(className);
      button.textContent === 'open'
        ? (button.textContent = 'close')
        : (button.textContent = 'open');
    };
  }

  // Create the parking slot and attache the click event to it
  createParkingSlot(parking: ParkingInterface): HTMLDivElement {
    let slot = document.createElement('div');
    const { id, indoor, insurance, price } = parking;
    const {
      indoorSpace,
      outdoorSpace,
      insuranceExcluded,
      insuranceIncluded,
    } = this.dictionary;
    slot.classList.add('parking__item');
    slot.setAttribute('data-id', id.toString());
    slot.setAttribute('data-indoor', indoor ? indoorSpace : outdoorSpace);
    slot.setAttribute(
      'data-insurance',
      insurance ? insuranceIncluded : insuranceExcluded,
    );
    slot.setAttribute('data-price', price);
    slot.textContent = price;
    this.attachEventToSlot(slot, parking);
    return slot;
  }

  // Click event for parking slots
  attachEventToSlot(
    parkingSlot: HTMLDivElement,
    parking: ParkingInterface,
  ): void {
    let pid: string = parkingSlot.getAttribute('data-id');
    parkingSlot.addEventListener('click', (e) => {
      parkingSlot.classList.add('selected');
      this.parkingSlots.forEach((el: HTMLDivElement, index: number) => {
        let id: string = el.getAttribute('data-id');
        if (id !== pid) el.classList.remove('selected');
      });
      this.setParking(parking);
    });
  }

  // Create the parking slot container
  createParkingSlots(): void {
    const parkingList = this.templateSlot.getElementsByClassName(
      'parking__slots',
    )[0] as HTMLElement;
    this.parking.forEach((p: ParkingInterface) => {
      let parking = this.createParkingSlot(p);
      this.parkingSlots.push(parking); // create the matrix
      parkingList.appendChild(parking);
    });
  }

  // Create the feature area
  createFeatures(): void {
    const { features } = this.vendor;
    const featuresList = this.templateSlot.getElementsByClassName(
      'features__list',
    )[0] as HTMLElement;
    for (let f of features as string[]) {
      let featureElement = document.createElement('li');
      featureElement.classList.add('features__list-item');
      featureElement.textContent = f;
      featuresList.appendChild(featureElement);
    }
    // Attach toggle to button and container
    const button = this.templateSlot.getElementsByClassName('vendor__btn')[0];
    const toggleable = this.templateSlot.getElementsByClassName(
      'vendor__features',
    )[0];
    button.addEventListener(
      'click',
      <EventListener>(
        this.toggleOpenClose(
          <HTMLButtonElement>button,
          <HTMLDivElement>toggleable,
          'opened',
        )
      ),
    );
  }

  // Create the vendor area
  createVendor(): void {
    const { name, departureAirport, map } = this.vendor;
    const { bookYourParking, featuresTitle } = this.dictionary;
    const vendorMap = this.templateSlot.getElementsByClassName(
      'vendor__map',
    )[0] as HTMLImageElement;
    vendorMap.src = map;
    this.templateSlot.getElementsByClassName(
      'vendor__name',
    )[0].textContent = name;
    this.templateSlot.getElementsByClassName(
      'vendor__captureTxt',
    )[0].textContent = bookYourParking + ' ' + departureAirport;
    this.templateSlot.getElementsByClassName(
      'features__title',
    )[0].textContent = featuresTitle;
  }
}
