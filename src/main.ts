import { Widget } from './widget/widget';
import { ModelInterface, ParkingInterface } from './interfaces';
import { getData } from './service';

/**
 * This main script is just a middleware between the widget and the final script which will be send to every client to be included in any html page.
 * Others functionality could be added and any parameters could be passed from the client's website to this main script to implement best customizations.
 **/

// Function callback just for example pourpose any kind of callback can be used here which will recive the price infos
function updateCart(chartItem: ParkingInterface) {
  if (chartItem) {
    document.querySelector('#my_cart').innerHTML = chartItem.price;
  }
}

// Widget intialization
const app = async () => {
  let response: ModelInterface;
  try {
    response = await getData<ModelInterface>('http://localhost:3000/model');
    if (response) console.log('response', response);
  } catch (e) {
    console.log('Error', e);
  }
  const v = new Widget(response);
  v.parkingSelection = updateCart;
  v.init();
};

app();
