import { ModelInterface } from '../interfaces';
const model: ModelInterface = {
  vendor: {
    name: 'ParkinGo',
    departureAirport: 'Bergamo Orio al Serio',
    map: 'http://lorempixel.com/370/390',
    features: [
      'Parcheggio ParkinGo della tipologia selezionata',
      'Navetta da/per aeroporto 24h',
      'Vigilanza e custodia del mezzo 24h',
      'Ripristino gratuito del calo di batteria della tua auto',
    ],
  },
  parkings: [
    {
      id: 123,
      indoor: false,
      insurance: false,
      price: '13.56 EUR',
    },
    {
      id: 456,
      indoor: false,
      insurance: true,
      price: '18.99 EUR',
    },
    {
      id: 243,
      indoor: true,
      insurance: true,
      price: '23.56 EUR',
    },
    {
      id: 700,
      indoor: true,
      insurance: false,
      price: '16.49 EUR',
    },
  ],
  dictionary: {
    bookYourParking: 'Prenota il tuo parcheggio a',
    featuresTitle: 'Sono inclusi i seguenti servizi:',
    indoorSpace: 'Posto auto coperto',
    outdoorSpace: 'Posto auto scoperto',
    insuranceIncluded: 'Assicurazione inclusa',
    insuranceExcluded: 'Assicurazione esclusa',
  },
};
import { Widget } from './widget';

describe('Widget class', () => {
  let widgetClass: Widget;

  beforeEach(() => {
    widgetClass = new Widget(model);
    document.body.innerHTML = '';
    widgetClass.templateSlot = document.createElement('div');
    widgetClass.templateSlot.innerHTML = `
                    <section class="vendor">
                        <div class="vendor__toggleable">
                            <p class="vendor__name"></p>
                            <p class="vendor__captureTxt"></p>
                            <button class="vendor__btn">open</button>
                        </div>
                        <div class="vendor__features">
                            <div class="features__detail">
                                <div class="vendor__map-container"><img class="vendor__map" alt="parking-map"></div>
                                <div class="features__list-container">
                                    <p class="features__title"></p>
                                    <ul class="features__list"></ul>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="parking__slots">
                    </section>`;
    widgetClass.parkingSelection = jest.fn();
    document.body.appendChild(widgetClass.templateSlot);
  });

  it('should templateSlot created', () => {
    expect(widgetClass.templateSlot).toBeTruthy();
    expect(widgetClass.templateSlot).toBeDefined();
    // @ts-ignore
    expect(widgetClass.templateSlot).toMatchSnapshot();
  });

  describe('Events works properly', () => {
    it('should toggleOpenClose', () => {
      const button = document.getElementsByClassName(
        'vendor__btn',
      )[0] as HTMLButtonElement;
      const toggleable = document.getElementsByClassName(
        'vendor__features',
      )[0] as HTMLDivElement;
      button.addEventListener(
        'click',
        <EventListener>(
          widgetClass.toggleOpenClose(
            <HTMLButtonElement>button,
            <HTMLDivElement>toggleable,
            'opened',
          )
        ),
      );
      button.dispatchEvent(new Event('click'));
      expect(toggleable.classList.contains('opened')).toBe(true);
      expect(button.textContent).toBe('close');
      // @ts-ignore
      expect(widgetClass.templateSlot).toMatchSnapshot();
    });

    it('should setParking', () => {
      widgetClass.parkingSlots = [] as HTMLElement[];
      widgetClass.createParkingSlots();
      const firstSlot = document.getElementsByClassName(
        'parking__item',
      )[0] as HTMLDivElement;
      firstSlot.dispatchEvent(new Event('click'));
      expect(firstSlot.classList.contains('selected')).toBe(true);
      expect(widgetClass.setParking).toHaveBeenCalled();
      expect(firstSlot.textContent).toEqual('13.56 EUR');
      // @ts-ignore
      expect(widgetClass).toMatchSnapshot();
    });
  });
});
